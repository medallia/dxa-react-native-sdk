import * as React from 'react';
import {
  AppState,
  type AppStateStatus,
  type NativeEventSubscription,
} from 'react-native';
import { MedalliaDXA, DXA, dxaLog, DxaConfig, MedalliaDxaCustomerConsentType } from './index';

type DxaAppProps = {
  accountId: number;
  propertyId: number;
  consents: MedalliaDxaCustomerConsentType | undefined;
  enabled: boolean | undefined;
  manualTracking: boolean;
  navigationContainerRef: any | undefined;
};

type DxaAppState = {
  instance: DXA;
  appState: AppStateStatus | undefined;
};

export class DxaApp extends React.Component<DxaAppProps, DxaAppState> {
  private subscription: NativeEventSubscription | undefined;

  constructor(props: Readonly<DxaAppProps>) {
    super(props);
    if (props.enabled) {
      MedalliaDXA.initialize(
        new DxaConfig(props.accountId, props.propertyId, props.consents),
        props.navigationContainerRef
      ).then(() => {
        if (MedalliaDXA.initialized) {
          dxaLog.log('MedalliaDXA ->', 'is running!');
          const navContainerRef = props.navigationContainerRef;
          if (navContainerRef && props.manualTracking != true) {
            dxaLog.log('MedalliaDXA ->', 'navigation on init:', {
              data: { state: navContainerRef.getRootState() },
            });
            ///After init auto-initialize tracking.
            MedalliaDXA.startScreen(
              MedalliaDXA.resolveCurrentRouteName({
                data: { state: navContainerRef.getRootState() },
              })
            );
          }
        }
      });
    } else {
      dxaLog.log('MedalliaDXA ->', 'is disabled.');
    }
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
