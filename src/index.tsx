import { NativeModules, Platform, type NativeEventSubscription, AppState } from 'react-native';
import { DxaLog } from '../src/util/DxaLog';
import { MedalliaDxaAutomaticMask } from './DxaMask';

const LINKING_ERROR =
  `The package 'dxa-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const DxaReactNative = NativeModules.DxaReactNative
  ? NativeModules.DxaReactNative
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export enum MedalliaDxaCustomerConsentType {
  recordingAndTracking = 2,
  tracking = 1,
  none = 0,
}

export class DxaConfig {
  accountId!: number;
  propertyId!: number;
  consents: MedalliaDxaCustomerConsentType | undefined = MedalliaDxaCustomerConsentType.recordingAndTracking;
  manualTracking: boolean | undefined

  constructor(
    accountId: number,
    propertyId: number,
    consents: MedalliaDxaCustomerConsentType | undefined,
    manualTracking: boolean | undefined
  ) {
    this.accountId = accountId;
    this.propertyId = propertyId;
    this.consents = consents;
    this.manualTracking = manualTracking;
  }
}

export class DXA {
  initialized: boolean = false;
  accountId: number | undefined = undefined;
  propertyId: number | undefined = undefined;
  consents: MedalliaDxaCustomerConsentType | undefined = undefined;

  private routeSeparator: String = '.';
  private subscription: NativeEventSubscription | undefined;
  private navigationContainerRef: any | undefined;
  private currentlyTrackingAScreen: boolean = false;
  // Initialize SDK for autotracking.
  // @param - propertyId - associated DXA client property id
  // @param - accountId - associated DXA client account id
  async initialize(dxaConfig: DxaConfig, navigationRef: any) {
    this.accountId = dxaConfig.accountId;
    this.propertyId = dxaConfig.propertyId;
    this.consents = dxaConfig.consents;
    if (!this.initialized) {
      dxaLog.log(
        'MedalliaDXA ->',
        'initializing SDK propertyId:',
        this.accountId,
        'accountId:',
        this.propertyId
      );
      try {
        this.initialized = await DxaReactNative.initialize(this.accountId, this.propertyId, this.consents);
      } catch (error) {
        dxaLog.log('MedalliaDXA ->', 'initialize error:', error);
        return;
      }
    }
    this.startAppStateListener();
    if (navigationRef && dxaConfig.manualTracking != true) {

      this.navigationContainerRef = navigationRef;
      MedalliaDXA.startScreen(
        MedalliaDXA.resolveCurrentRouteName({
          data: { state: this.navigationContainerRef.getRootState() },
        })
      );

      this.navigationContainerRef.addListener('state', (param: any) => {
        const screenName = this.resolveCurrentRouteName(param);
        this.stopScreen();
        this.startScreen(screenName);
      });
    }
  }

  // Starts to track a screen. If some screes is being tracked, that track will be stopped
  // and new screen track starts.
  // @param - screenName - Name of current screen.
  startScreen(screenName: string): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'starting screen -> ', screenName);
    this.currentlyTrackingAScreen = true;
    return DxaReactNative.startScreen(screenName);
  }

  stopScreen(): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'stopping screen.');
    this.currentlyTrackingAScreen = false;
    return DxaReactNative.endScreen();
  }

  sendHttpError(errorCode: number): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'send http error -> ', errorCode);
    return DxaReactNative.sendHttpError(errorCode);
  }

  sendGoal(goalName: string, value?: number): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'sendGoal -> ', goalName, 'value -> ', value);
    //React native doesn't allow nullable parameters or native modules, so 2
    //methods are needed.
    if (value) {
      return DxaReactNative.sendGoalWithValue(goalName, value);
    }
    return DxaReactNative.sendGoal(goalName);
  }

  setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'setDimensionWithString -> ', dimensionName, 'value -> ', stringValue);
    return DxaReactNative.setDimensionWithString(dimensionName, stringValue);
  }
  setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'setDimensionWithNumber -> ', dimensionName, 'value -> ', numberValue);
    return DxaReactNative.setDimensionWithNumber(dimensionName, numberValue);
  }
  setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'setDimensionWithBool -> ', dimensionName, 'value -> ', boolValue);
    return DxaReactNative.setDimensionWithBool(dimensionName, boolValue);
  }

  getSessionUrl(): Promise<string> {
    dxaLog.log('MedalliaDXA ->', 'getSessionUrl');
    return DxaReactNative.getSessionUrl();
  }

  getSessionId(): Promise<string> {
    dxaLog.log('MedalliaDXA ->', 'getSessionId');
    return DxaReactNative.getSessionId();
  }

  getWebViewProperties(): Promise<string> {
    dxaLog.log('MedalliaDXA ->', 'getWebViewProperties');
    return DxaReactNative.getWebViewProperties();
  }

  setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'setConsents', consents);
    return DxaReactNative.setConsents(consents);
  }

  setAutoMasking(elementsToMask: MedalliaDxaAutomaticMask): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'setAutomasking', elementsToMask);
    return DxaReactNative.setAutoMasking(elementsToMask);
  }

  disableAllAutoMasking(): Promise<boolean> {
    dxaLog.log('MedalliaDXA ->', 'disableAllAutoMasking');
    return DxaReactNative.disableAllAutoMasking();
  }

  enableSessionForAnalytics(enabled: Boolean) {
    dxaLog.log('MedalliaDXA ->', 'enableSessionForAnalytics: ', enabled);
    return DxaReactNative.enableSessionForAnalytics(enabled);
  }

  enableSessionForRecording(enabled: Boolean) {
    dxaLog.log('MedalliaDXA ->', 'enableSessionForRecording: ', enabled);
    return DxaReactNative.enableSessionForRecording(enabled);
  }

  setRetention(enabled: Boolean) {
    dxaLog.log('MedalliaDXA ->', 'setRetention: ', enabled);
    return DxaReactNative.setRetention(enabled);
  }

  private resolveCurrentRouteName(param: any) {
    try {
      let currentOnPrint: any = param.data.state;
      let entireRoute = '';
      do {
        dxaLog.log(
          'MedalliaDXA ->',
          ' > detected route level:',
          currentOnPrint
        );
        entireRoute =
          entireRoute +
          this.routeSeparator +
          currentOnPrint.routes[currentOnPrint.index].name;
        currentOnPrint = currentOnPrint.routes[currentOnPrint.index]?.state;
      } while (currentOnPrint && currentOnPrint.routes);
      return entireRoute;
    } catch (ex) {
      return 'unknown';
    }
  }

  setRouteSeparator(newSeparator: String) {
    this.routeSeparator = newSeparator;
  }

  private startAppStateListener(): void {
    if (typeof this.subscription !== 'undefined') {
      return;
    }
    dxaLog.log(
      'MedalliaDXA ->',
      'AppState event listerner(change)',
      this.handleAppStateChange
    );
    this.subscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );
  }

  private removeAppStateListener(): void {
    dxaLog.log(
      'MedalliaDXA ->',
      'Unmounting DxaApp node',
      AppState.currentState
    );
    this.subscription?.remove();
    this.subscription = undefined;
  }

  private handleAppStateChange = (nextAppState: any) => {
    if (nextAppState == 'active') {
      dxaLog.log('MedalliaDXA ->', 'App becomes to active!');
      if (this.currentlyTrackingAScreen) {
        return;
      }
      MedalliaDXA.startScreen(
        MedalliaDXA.resolveCurrentRouteName({
          data: { state: this.navigationContainerRef.getRootState() },
        })
      );
    } else if (nextAppState == 'background') {
      dxaLog.log('MedalliaDXA ->', 'App is going to background!!');
      MedalliaDXA.stopScreen();
    }
  };
}

const MedalliaDXA = new DXA();
const dxaLog = new DxaLog();

/// DXA binder.
export { MedalliaDXA };
export { dxaLog };
export { DxaMask, MedalliaDxaAutomaticMask } from './DxaMask';
