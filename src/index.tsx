import { NativeModules, Platform } from 'react-native';
import { DxaLog } from '../src/util/DxaLog';
import { MedalliaDxaAutomaticMask } from './DxaMask';
import { Tracking } from './Tracking';
import { ReactNavigation } from './NavigationLibraries';


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
  analyticsAndTracking = 2,
  analytics = 1,
  none = 0,
}

export class DxaConfig {
  accountId!: number;
  propertyId!: number;
  consents: MedalliaDxaCustomerConsentType | undefined = MedalliaDxaCustomerConsentType.analyticsAndTracking;
  manualTracking!: boolean;

  constructor(
    accountId: number,
    propertyId: number,
    consents: MedalliaDxaCustomerConsentType | undefined,
    manualTracking: boolean | undefined
  ) {
    this.accountId = accountId;
    this.propertyId = propertyId;
    this.consents = consents;
    this.manualTracking = manualTracking ?? false;
  }
}

export class DXA {
  initialized: boolean = false;
  accountId: number | undefined = undefined;
  propertyId: number | undefined = undefined;
  consents: MedalliaDxaCustomerConsentType | undefined = undefined;

  private trackingInstance!: Tracking;


  alternativeScreenNames: Map<string, string> = new Map();

  // Initialize SDK for autotracking.
  // @param - propertyId - associated DXA client property id
  // @param - accountId - associated DXA client account id
  async initialize(dxaConfig: DxaConfig, navigationRef: any) {
    this.accountId = dxaConfig.accountId;
    this.propertyId = dxaConfig.propertyId;
    this.consents = dxaConfig.consents;
    if (this.initialized) {
      dxaLog.log(
        'MedalliaDXA ->',
        'SDK has already been initialized',
      );
      return;
    }
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

    if (navigationRef && dxaConfig.manualTracking != true) {
      let reactNavigationLibrary = ReactNavigation.getInstance({ navigationContainerRef: navigationRef });

      this.trackingInstance = Tracking.getInstance({ reactNavigationLibrary: reactNavigationLibrary, manualTracking: dxaConfig.manualTracking });
      return;
    }

    this.trackingInstance = Tracking.getInstance({ manualTracking: dxaConfig.manualTracking });

  }

  // Starts to track a screen. If some screes is being tracked, that track will be stopped
  // and new screen track starts.
  // @param - screenName - Name of current screen.
  startScreen(screenName: string): Promise<boolean> {
    var finalScreenName = this.alternativeScreenNames.get(screenName) ?? screenName;
    return this.trackingInstance.startScreen(finalScreenName);
  }

  stopScreen(): Promise<boolean> {
    return this.trackingInstance.stopScreen();
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

  setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
    this.alternativeScreenNames = alternativeScreenNames;
  }

  setRouteSeparator(newSeparator: String) {
    this.trackingInstance.setRouteSeparator(newSeparator);
  }

}

const MedalliaDXA = new DXA();
const dxaLog = new DxaLog();

/// DXA binder.
export { MedalliaDXA };
export { dxaLog };
export { DxaMask, MedalliaDxaAutomaticMask } from './DxaMask';
export { DxaUnmask } from './DxaUnmask';
export { DxaReactNative }