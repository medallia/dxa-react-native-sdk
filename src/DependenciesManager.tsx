import { Tracking } from "./Tracking";
import { ReactNavigation } from './NavigationLibraries';
import { DxaConfig } from "./index";
import { LiveConfigData } from "./live_config/LiveConfigData";
import { DxaLogger } from "./util/DxaLog";
import { SamplingData } from "./Sampling";
import { SdkBlocker } from "./live_config/SdkBlocker";
import { injector } from './util/DependencyInjector';
import type { NativeModulesStatic } from "react-native";

export class DependenciesManager {

  public dependenciesLoadded: boolean = false;
  private dxaConfig: DxaConfig | undefined;

  public initializeModulesNeededForNativeInit(dxaConfig: DxaConfig, navigationRef: any, nativeModulesDxa: NativeModulesStatic): [LiveConfigData, SamplingData, SdkBlocker, DxaLogger] {
    const liveConfigData = new LiveConfigData();
    const samplingData = new SamplingData();
    const sdkBlocker = new SdkBlocker(this);
    const dxaLogger = new DxaLogger(nativeModulesDxa, sdkBlocker);
    this.dxaConfig = dxaConfig;

    if(navigationRef){
     const reactNavigation = ReactNavigation.getInstance({ navigationContainerRef: navigationRef });
     injector.register('ReactNavigation', reactNavigation);
    }
    injector.register('NativeModulesDxa', nativeModulesDxa);
    injector.register('LiveConfigData', liveConfigData);
    injector.register('SamplingData', samplingData);
    injector.register('SdkBlocker', sdkBlocker);
    injector.register('DxaLogger', dxaLogger);

    return [liveConfigData, samplingData, sdkBlocker, dxaLogger];

  }

  public initializePostInitializeModules(): void {
    
    this.dependenciesLoadded = true;
    if (this.dxaConfig == undefined) { throw new Error('MedalliaDXA -> SDK has not been initialized correctly'); }
    var reactNavigation: ReactNavigation | undefined;
    if(injector.exists('ReactNavigation')){
      reactNavigation = injector.resolve('ReactNavigation');
    }
    let trackingInstance: Tracking = this.initializeTracking(this.dxaConfig, reactNavigation, injector.resolve('LiveConfigData'), injector.resolve('SamplingData'), injector.resolve('NativeModulesDxa'));
    injector.register('Tracking', trackingInstance);
  }

  private initializeTracking(dxaConfig: DxaConfig, reactNavigation: ReactNavigation | undefined, liveConfigDataInstance: LiveConfigData, samplingInstance: SamplingData, nativeModulesDxa: NativeModulesStatic): Tracking {
    let trackingInstance: Tracking;
    const sdkBlocker: SdkBlocker = injector.resolve('SdkBlocker');
    if (reactNavigation && dxaConfig.manualTracking != true) {

      let reactNavigationLibrary = reactNavigation;
      trackingInstance = Tracking.getInstance({
        dxaNativeModule: nativeModulesDxa,
        reactNavigationLibrary: reactNavigationLibrary,
        manualTracking: dxaConfig.manualTracking,
        disabledScreenTrackingFromLiveConfig: liveConfigDataInstance.disableScreenTracking.bind(liveConfigDataInstance),
        stopTrackingDueToSampling: samplingInstance.stopTrackingDueToSampling.bind(samplingInstance),
      }, sdkBlocker);

    } else {
      trackingInstance = Tracking.getInstance({
        dxaNativeModule: nativeModulesDxa,
        manualTracking: dxaConfig.manualTracking,
        disabledScreenTrackingFromLiveConfig: liveConfigDataInstance.disableScreenTracking.bind(liveConfigDataInstance),
        stopTrackingDueToSampling: samplingInstance.stopTrackingDueToSampling.bind(samplingInstance)
      }, sdkBlocker);
    }

    return trackingInstance;
  }

}

