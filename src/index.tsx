import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { LoggerSdkLevel } from './util/DxaLog';
import { MedalliaDxaAutomaticMask } from './DxaMask';
import { MedalliaDxaCustomerConsentType, ImageQualityType } from './publicEnums';
import { ActivePublicMethods } from './public_api/ActivePublicMethods';
import { BlockedPublicMethods } from './public_api/BlockedMethods';
import { SdkMetaData } from './util/MetaData';
import { core } from './Core';


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
  consents: MedalliaDxaCustomerConsentType = MedalliaDxaCustomerConsentType.analyticsAndRecording;
  manualTracking: boolean;
  mobileDataEnabled: boolean;
  enhancedLogsEnabled: boolean;
  autoMasking: MedalliaDxaAutomaticMask[];

  constructor(
    accountId: number,
    propertyId: number,
    consents: MedalliaDxaCustomerConsentType,
    manualTracking?: boolean,
    mobileDataEnabled?: boolean,
    enhancedLogsEnabled?: boolean,
    autoMasking?: MedalliaDxaAutomaticMask[],
  ) {
    this.accountId = accountId;
    this.propertyId = propertyId;
    this.consents = consents;
    this.manualTracking = manualTracking = false;
    this.mobileDataEnabled = mobileDataEnabled = true;
    this.enhancedLogsEnabled = enhancedLogsEnabled = false;
    this.autoMasking = autoMasking = [];
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
      core.dxaLogInstance.log(
        LoggerSdkLevel.public,
        'SDK has already been initialized',
      );
      return;
    }
    core.initializePreInitializeModules();
    core.dxaLogInstance.setEnhancedLogs(dxaConfig.enhancedLogsEnabled);
    this.setUpNativeListeners();

    try {
      await new Promise((resolve) => {
        DxaReactNative.initialize(this.accountId, this.propertyId, this.consents, sdkVersion, dxaConfig.mobileDataEnabled, dxaConfig.enhancedLogsEnabled, dxaConfig.autoMasking, (callbackResult: any) => {
          core.dxaLogInstance.log(LoggerSdkLevel.public, `MedalliaDXA initalized`);
          core.dxaLogInstance.log(LoggerSdkLevel.customer, `MedalliaDXA initalized with account id: ${this.accountId} and property id: ${this.propertyId}. Consents: ${this.consents}. Mobile data enabled: ${dxaConfig.mobileDataEnabled}. ManualTracking: ${dxaConfig.manualTracking}.`);
          core.liveConfigDataInstance.fillfromNative(callbackResult);
          this.initialized = true;
          resolve(true);
        })
      });

    } catch (error) {
      core.dxaLogInstance.log(LoggerSdkLevel.public, `MedalliaDXA failed to initialize ${error}`);
      return;
    }
    this.initialized = true;
    if (core.sdkBlockerIstance.isSdkBlocked) {
      return;
    }
    core.initializePostInitializeModules();

  }



  private get publicMethods(): ActivePublicMethods {
    if (this.initialized === false) {
      throw new Error('MedalliaDXA -> SDK has not been initialized');
    }

    if (core.sdkBlockerIstance.isSdkBlocked) {
      return this.blockedPublicMethods;
    }

    if (core.areModulesInitialized == false) {
      throw new Error('MedalliaDXA -> SDK has not been initialized correctly');
    }
    if (this.activePublicMethpodInstance === undefined) {
      this.activePublicMethpodInstance = new ActivePublicMethods(core.trackingInstance!);
    }
    return this.activePublicMethpodInstance;
  }

  // Starts to track a screen. If another screen is being tracked, it will be stopped.
  // @param - screenName - Name of current screen.
  startNewScreen(screenName: string): Promise<boolean> {
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

  sendError(error: string): Promise<boolean> {
    return this.publicMethods.sendError(error);
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

  disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
    return this.publicMethods.disableAutoMasking(elementsToUnmask);
  }

  setRetention(enabled: Boolean) {
    return this.publicMethods.setRetention(enabled);
  }

  setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
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
      if (core.sdkBlockerIstance.isSdkBlocked && event.eventType != core.liveConfigDataInstance.eventType) {
        return;
      }
      switch (event.eventType) {
        case core.liveConfigDataInstance.eventType:
          core.liveConfigDataInstance.fillfromNative(event);
          break;
        case core.samplingInstance.eventType:
          core.samplingInstance.fillfromNative(event);
          break;
        default:
          break;
      }
    });

  }
}

const MedalliaDXA = new DXA();

/// DXA binder.
export { MedalliaDXA };
export { DxaMask, MedalliaDxaAutomaticMask } from './DxaMask';
export { DxaUnmask } from './DxaUnmask';
export { MedalliaDxaCustomerConsentType, ImageQualityType } from './publicEnums';
