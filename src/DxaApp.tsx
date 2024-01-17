import * as React from 'react';
import {
  AppState,
  type AppStateStatus,
  type NativeEventSubscription,
} from 'react-native';
import { DxaConfig, MedalliaDXA, dxaLog } from './index';

type DxaAppProps = {
};

type DxaAppState = {
  appState: AppStateStatus | undefined;
};

export class DxaApp extends React.Component<DxaAppProps, DxaAppState> {

  /**
   * AppState event subscription
   */
  private subscription: NativeEventSubscription | undefined;

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

  constructor(props: Readonly<DxaAppProps>) {
    super(props);
  }

  render(): React.ReactNode {
    return this.props.children;
  }

  componentDidMount(): void {
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

  componentWillUnmount(): void {
    dxaLog.log(
      'MedalliaDXA ->',
      'Unmounting DxaApp node',
      AppState.currentState
    );
    this.subscription?.remove();
  }

  private handleAppStateChange = (nextAppState: any) => {
    if (nextAppState == 'active') {
      dxaLog.log('MedalliaDXA ->', 'App becomes to active!');
    } else if (nextAppState == 'background') {
      dxaLog.log('MedalliaDXA ->', 'App is going to background!!');
      MedalliaDXA.stopScreen();
    }
    this.setState({ appState: nextAppState });
  };
}
