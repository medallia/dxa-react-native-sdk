import { Tracking } from "./Tracking";
import { ReactNavigation } from './NavigationLibraries';
import { DxaReactNative } from "dxa-react-native";
import { liveConfigDataInstance } from "./live_config/LiveConfigData";
import { LoggerSdkLevel, dxaLog } from "./util/DxaLog";

class Core {
  public trackingInstance: Tracking | undefined;
  public areModulesInstantiated: boolean = false;

  public navigationRef: any;
  public manualTracking: boolean = false;

  public instantiateModules(): void {
    if (this.areModulesInstantiated) {
      dxaLog.log(LoggerSdkLevel.development, 'SDK modules have already been instantiated');
      return;
    }
    this.instantiateTracking();
    this.areModulesInstantiated = true;
  }

  private instantiateTracking(): void {
    if (this.navigationRef && this.manualTracking != true) {
      let reactNavigationLibrary = ReactNavigation.getInstance({ navigationContainerRef: this.navigationRef });

      this.trackingInstance = Tracking.getInstance({ dxaNativeModule: DxaReactNative, reactNavigationLibrary: reactNavigationLibrary, manualTracking: this.manualTracking, disabledScreenTracking: liveConfigDataInstance.disableScreenTracking });

    } else {
      this.trackingInstance = Tracking.getInstance({ dxaNativeModule: DxaReactNative, manualTracking: this.manualTracking, disabledScreenTracking: liveConfigDataInstance.disableScreenTracking });
    }
    this.areModulesInstantiated = true;
  }

}

export const core = new Core();