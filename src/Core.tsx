import { Tracking } from "./Tracking";
import { ReactNavigation } from './NavigationLibraries';
import { DxaReactNative } from "./index";
import { LiveConfigData } from "./live_config/LiveConfigData";
import { DxaLogger, LoggerSdkLevel } from "./util/DxaLog";
import { SamplingData } from "./Sampling";
import { SdkBlocker } from "./live_config/SdkBlocker";

class Core {
  public trackingInstance!: Tracking;
  public samplingInstance!: SamplingData;
  public liveConfigDataInstance!: LiveConfigData;
  public dxaLogInstance!: DxaLogger;
  public sdkBlockerIstance!: SdkBlocker;
  public areModulesInitialized: boolean = false;

  public navigationRef: any;
  public manualTracking: boolean = false;

  public initializePreInitializeModules(): void {
    this.sdkBlockerIstance = this.initializeSdkBlockerInstance();
    this.liveConfigDataInstance = this.initializeLiveConfig();
    this.samplingInstance = this.initializeSampling();
    this.dxaLogInstance = this.initializeDxaLog(this.sdkBlockerIstance);
  }

  public initializePostInitializeModules(): void {
    if (this.areModulesInitialized) {
      this.dxaLogInstance.log(LoggerSdkLevel.development, 'SDK modules have already been instantiated');
      return;
    }
   
    this.trackingInstance =this.initializeTracking(this.liveConfigDataInstance!, this.samplingInstance!);
    this.areModulesInitialized = true;
  }


  private initializeLiveConfig(): LiveConfigData{
    return new LiveConfigData();
  }

  private initializeSampling(): SamplingData {
    return new SamplingData();
  }
  private initializeSdkBlockerInstance(): SdkBlocker {
    return new SdkBlocker();
  }
  private initializeDxaLog(sdkBlockerIstance: SdkBlocker): DxaLogger {
    return new DxaLogger(() => sdkBlockerIstance.isSdkBlocked, DxaReactNative);
  }

  private initializeTracking(liveConfigDataInstance: LiveConfigData, samplingInstance: SamplingData): Tracking {
    let trackingInstance: Tracking;
    if (this.navigationRef && this.manualTracking != true) {
      let reactNavigationLibrary = ReactNavigation.getInstance({ navigationContainerRef: this.navigationRef });
      trackingInstance = Tracking.getInstance({ dxaNativeModule: DxaReactNative, 
        reactNavigationLibrary: reactNavigationLibrary, 
        manualTracking: this.manualTracking, 
        disabledScreenTracking: liveConfigDataInstance.disableScreenTracking.bind(liveConfigDataInstance), 
        stopTrackingDueToSampling:samplingInstance.stopTrackingDueToSampling.bind(samplingInstance) });

    } else {
      trackingInstance = Tracking.getInstance({ dxaNativeModule: DxaReactNative, manualTracking: this.manualTracking, disabledScreenTracking: liveConfigDataInstance.disableScreenTracking.bind(liveConfigDataInstance), stopTrackingDueToSampling:samplingInstance.stopTrackingDueToSampling.bind(samplingInstance) });
    }
    
    return trackingInstance;
  }

}

export const core = new Core();