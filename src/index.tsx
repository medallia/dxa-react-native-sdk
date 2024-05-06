import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { DxaLog } from '../src/util/DxaLog';
import { MedalliaDxaAutomaticMask } from './DxaMask';
import { MedalliaDxaCustomerConsentType, ImageQualityType } from './publicEnums';
import { ActivePublicMethods } from './public_api/ActivePublicMethods';
import { sdkBlockerIstance } from './live_config/SdkBlocker';
import { BlockedPublicMethods } from './public_api/BlockedMethods';
import { liveConfigDataInstance } from './live_config/LiveConfigData';
import { SdkMetaData } from './util/MetaData';
import { core } from './Core';
import { samplingDataInstance } from './Sampling';


const LINKING_ERROR =
  `The package 'dxa-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const DxaReactNative = NativeModules.DxaReactNative
  ? NativeModules.DxaReactNative
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );


export class DxaConfig {
  accountId!: number;
  propertyId!: number;
  consents: MedalliaDxaCustomerConsentType = MedalliaDxaCustomerConsentType.analyticsAndTracking;
  manualTracking: boolean;
  mobileDataEnabled: boolean;

  constructor(
    accountId: number,
    propertyId: number,
    consents: MedalliaDxaCustomerConsentType,
    manualTracking?: boolean,
    mobileDataEnabled?: boolean
  ) {
    this.accountId = accountId;
    this.propertyId = propertyId;
    this.consents = consents;
    this.manualTracking = manualTracking = false;
    this.mobileDataEnabled = mobileDataEnabled = true;
  }
}

class DXA {
  initialized: boolean = false;
  accountId: number | undefined = undefined;
  propertyId: number | undefined = undefined;
  consents: MedalliaDxaCustomerConsentType | undefined = undefined;

  private activePublicMethpodInstance: ActivePublicMethods | undefined;
  private blockedPublicMethods: BlockedPublicMethods = new BlockedPublicMethods();


  // Initialize SDK for autotracking.
  // @param - propertyId - associated DXA client property id
  // @param - accountId - associated DXA client account id
  async initialize(dxaConfig: DxaConfig, navigationRef: any) {
    this.accountId = dxaConfig.accountId;
    this.propertyId = dxaConfig.propertyId;
    this.consents = dxaConfig.consents;
    core.manualTracking = dxaConfig.manualTracking;
    core.navigationRef = navigationRef;
    let sdkVersion = SdkMetaData.sdkVersion;
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


    this.setUpNativeListeners();

    try {
      await new Promise((resolve) => {
        DxaReactNative.initialize(this.accountId, this.propertyId, this.consents, sdkVersion, dxaConfig.mobileDataEnabled, (callbackResult: any) => {
          liveConfigDataInstance.fillfromNative(callbackResult);
          this.initialized = true;
          resolve(true);
        })
      });
    } catch (error) {
      dxaLog.log('MedalliaDXA ->', 'initialize error:', error);
      return;
    }
    this.initialized = true;
    if (sdkBlockerIstance.isSdkBlocked) {
      return;
    }
    core.instantiateModules();

  }



  private get publicMethods(): ActivePublicMethods {
    if (this.initialized === false) {
      throw new Error('MedalliaDXA -> SDK has not been initialized');
    }

    if (sdkBlockerIstance.isSdkBlocked) {
      return this.blockedPublicMethods;
    }

    if (core.areModulesInstantiated == false) {
      throw new Error('MedalliaDXA -> SDK has not been initialized correctly');
    }
    if (this.activePublicMethpodInstance === undefined) {
      this.activePublicMethpodInstance = new ActivePublicMethods(core.trackingInstance!);
    }
    return this.activePublicMethpodInstance;
  }

  // Starts to track a screen. If another screen is being tracked, it will be stopped.
  // @param - screenName - Name of current screen.
  startScreen(screenName: string): Promise<boolean> {
    return this.publicMethods.startScreen(screenName);
  }

  stopScreen(): Promise<boolean> {
    return this.publicMethods.stopScreen();
  }

  sendHttpError(errorCode: number): Promise<boolean> {
    return this.publicMethods.sendHttpError(errorCode);
  }

  sendGoal(goalName: string, value?: number): Promise<boolean> {
    return this.publicMethods.sendGoal(goalName, value);
  }

  setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
    return this.publicMethods.setDimensionWithString(dimensionName, stringValue);
  }
  setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
    return this.publicMethods.setDimensionWithNumber(dimensionName, numberValue);
  }
  setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
    return this.publicMethods.setDimensionWithBool(dimensionName, boolValue);
  }

  getSessionUrl(): Promise<string | null> {
    return this.publicMethods.getSessionUrl();
  }

  getSessionId(): Promise<string | null> {
    return this.publicMethods.getSessionId();
  }

  getWebViewProperties(): Promise<string | null> {
    return this.publicMethods.getWebViewProperties();
  }

  setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
    return this.publicMethods.setConsents(consents);
  }

  enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
    return this.publicMethods.enableAutoMasking(elementsToMask);
  }


  disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
    return this.publicMethods.disableAutoMasking(elementsToUnmask);
  }

  setRetention(enabled: Boolean) {
    return this.publicMethods.setRetention(enabled);
  }

  setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
    dxaLog.log('MedalliaDXA ->', 'publicMethods', this.publicMethods);
    return this.publicMethods.setAlternativeScreenNames(alternativeScreenNames);
  }

  setRouteSeparator(newSeparator: String) {
    return this.publicMethods.setRouteSeparator(newSeparator);
  }

  setMaskingColor(hexadecimalColor: string) {
    return this.publicMethods.setMaskingColor(hexadecimalColor);
  }

  setImageQuality(quality: ImageQualityType) {
    return this.publicMethods.setImageQuality(quality);
  }

  sendDataOverWifiOnly(onlyWifi: boolean) {
    return this.publicMethods.sendDataOverWifiOnly(onlyWifi);
  }

  private setUpNativeListeners() {

    const eventEmitter = new NativeEventEmitter(DxaReactNative);
    eventEmitter.addListener('dxa-event', event => {
      dxaLog.log('MedalliaDXA ->', 'event listener:', event);
      switch (event.eventType) {
        case liveConfigDataInstance.eventType:
          liveConfigDataInstance.fillfromNative(event);
          break;
        case samplingDataInstance.eventType:
          samplingDataInstance.fillfromNative(event);
          break;
        default:
          break;
      }
    });

  }
}

const MedalliaDXA = new DXA();
const dxaLog = new DxaLog();

/// DXA binder.
export { MedalliaDXA };
export { dxaLog };
export { DxaMask, MedalliaDxaAutomaticMask } from './DxaMask';
export { DxaUnmask } from './DxaUnmask';
export { MedalliaDxaCustomerConsentType, ImageQualityType } from './publicEnums';
