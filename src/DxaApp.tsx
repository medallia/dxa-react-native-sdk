
import { DxaConfig, MedalliaDXA, dxaLog } from './index';

// type DxaAppProps = {
// };

// type DxaAppState = {
//   appState: AppStateStatus | undefined;
// };

export class DxaApp {

  /**
   * AppState event subscription
   */
  /**
   * Initialize MedalliaDXA
   * @param accountId - account id from DXA dashboard
   * @param propertyId - property id from DXA dashboard
   * @param navigationContainerRef - navigation container reference from react-navigation
   * @param manualTracking - track manually with MedalliaDXA.startScreen and MedalliaDXA.stopScreen
   */
  static async initialize(
    dxaConfig: DxaConfig,
    navigationContainerRef: any | undefined,
  ): Promise<void> {
    try {
      await MedalliaDXA.initialize(
        dxaConfig,
        navigationContainerRef
      );
      if (MedalliaDXA.initialized) {
        dxaLog.log('MedalliaDXA ->', 'is running!');
        const navContainerRef = navigationContainerRef;
        if (navContainerRef && dxaConfig.manualTracking != true) {
          dxaLog.log('MedalliaDXA ->', 'navigation on init:', {
            data: { state: navContainerRef.getRootState() },
          });
          ///After init auto-initialize tracking.
          MedalliaDXA.startScreen(
            MedalliaDXA.resolveCurrentRouteName({
              data: { state: navContainerRef.getRootState() },
            })
          );
        } else {
          dxaLog.log('MedalliaDXA ->', 'Running with manual tracking enabled!');
        }
      } else {
        dxaLog.log('MedalliaDXA ->', 'is not running!');
      }
    } catch (error) {
      dxaLog.log('MedalliaDXA ->', 'initialize error:', error);
    }
  }


}
