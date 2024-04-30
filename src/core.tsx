import { Tracking } from "./Tracking";
import { sdkBlockerIstance } from "./live_config/SdkBlocker";
import { ReactNavigation } from './NavigationLibraries';
import { DxaReactNative, dxaLog } from "dxa-react-native";
import { liveConfigData } from "./live_config/live_config_data";

class Core {
    public trackingInstance: Tracking | undefined;
    public areModulesInstantiated: boolean = false;

    public navigationRef: any;
    public manualTracking: boolean = false;   

    public instantiateModules(): void {
        if(this.areModulesInstantiated){
          dxaLog.log('MedalliaDXA ->', 'SDK modules have already been instantiated');
          return;
        }
        dxaLog.log('MedalliaDXA ->', 'instantiating SDK modules');
        if (this.navigationRef && this.manualTracking != true) {
          let reactNavigationLibrary = ReactNavigation.getInstance({ navigationContainerRef: this.navigationRef });
    
          this.trackingInstance = Tracking.getInstance({ dxaNativeModule: DxaReactNative, reactNavigationLibrary: reactNavigationLibrary, manualTracking: this.manualTracking, disabledScreenTracking: liveConfigData.disableScreenTracking });
    
        } else {
          this.trackingInstance = Tracking.getInstance({ dxaNativeModule: DxaReactNative, manualTracking: this.manualTracking, disabledScreenTracking: liveConfigData.disableScreenTracking });
        }
        this.areModulesInstantiated = true;
      }
}

export const core = new Core();