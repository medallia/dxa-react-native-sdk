import { MedalliaDxaAutomaticMask } from './DxaMask';
import { MedalliaDxaCustomerConsentType, ImageQualityType } from './publicEnums';
import { ActivePublicMethods } from './public_api/ActivePublicMethods';
import { BlockedPublicMethods } from './public_api/BlockedMethods';
import { Initializer } from './initializer';
import { injector } from './util/DependencyInjector';
import type { SdkBlocker } from './live_config/SdkBlocker';
import type { Tracking } from './Tracking';
import type { PublicMethodsInterface } from './public_api/PublicMethodsInterface';
import type { NativeModulesStatic } from 'react-native';

class DXA {
  accountId: number | undefined = undefined;
  propertyId: number | undefined = undefined;
  consents: MedalliaDxaCustomerConsentType | undefined = undefined;

  private activePublicMethodInstance: ActivePublicMethods | undefined;
  private blockedPublicMethods: BlockedPublicMethods = new BlockedPublicMethods();


  private get publicMethods(): PublicMethodsInterface {
    const initializer = Initializer.getInstance();
    if (initializer.initialized === false) {
      throw new Error('MedalliaDXA -> SDK has not been initialized');
    }
    const sdkBlocker: SdkBlocker = injector.resolve('SdkBlocker');
    if (sdkBlocker.isSdkBlocked) {
      return this.blockedPublicMethods;
    }
    if (this.activePublicMethodInstance !== undefined) {
      return this.activePublicMethodInstance;
    }
    if (initializer.dependenciesLoadded == false) {
      throw new Error('MedalliaDXA -> SDK has not been initialized correctly');
    }

    const nativeModulesDxa: NativeModulesStatic = injector.resolve('NativeModulesDxa');
    const tracking: Tracking = injector.resolve('Tracking');

    return new ActivePublicMethods(nativeModulesDxa, tracking);

  }

  initialize(dxaConfig: DxaConfig, navigationRef: any): Promise<void> {
    const initializer = Initializer.getInstance();
    return initializer.initialize(dxaConfig, navigationRef);
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

  setRetention(enabled: boolean) {
    return this.publicMethods.setRetention(enabled);
  }

  setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
    return this.publicMethods.setAlternativeScreenNames(alternativeScreenNames);
  }

  setTrackingDisabledScreens(trackingDisabledScreens: string[]) {
    return this.publicMethods.setTrackingDisabledScreens(trackingDisabledScreens);
  }

  setRouteSeparator(newSeparator: string) {
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

}

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
    this.manualTracking = manualTracking ?? false;
    this.mobileDataEnabled = mobileDataEnabled ?? true;
    this.enhancedLogsEnabled = enhancedLogsEnabled ?? false;
    this.autoMasking = autoMasking ?? [];
  }
}

const MedalliaDXA = new DXA();

/// DXA binder.
export { MedalliaDXA };
export { DxaMask, MedalliaDxaAutomaticMask } from './DxaMask';
export { DxaUnmask } from './DxaUnmask';
export { MedalliaDxaCustomerConsentType, ImageQualityType } from './publicEnums';
