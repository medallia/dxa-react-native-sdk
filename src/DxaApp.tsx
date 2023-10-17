import * as React from 'react';
import { AppState, type AppStateStatus } from 'react-native'
import { MedalliaDXA, DXA } from './index';


type DxaAppProps = {
  accountId: number;
  propertyId: number;
  enabled: boolean | undefined;
  navigationContainerRef: any
};

type DxaAppState = {
  instance: DXA;
  appState: AppStateStatus | undefined;
};

export class DxaApp extends React.Component<DxaAppProps, DxaAppState> {

  constructor(props: Readonly<DxaAppProps>) {
    super(props);
    if (props.enabled) {
      MedalliaDXA.initialize(
        props.accountId,
        props.propertyId,
        props.navigationContainerRef
      ).then(() => {
        if (MedalliaDXA.initialized) {
          console.log("Medallia DXA is running");
          AppState.addEventListener("change", this.handleAppStateChange);
          const navContainerRef = props.navigationContainerRef;
          if (navContainerRef) {
            ///After init auto-initialize tracking.
            MedalliaDXA.startScreen(
              navContainerRef.getRootState().routeNames[navContainerRef.getRootState().index]!
            )
          }
        }
      });
    } else {
      console.log("Medallia DXA is disabled.")
    }
  }

  render(): React.ReactNode {
    return this.props.children;
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState == "active") {
      console.log('App is comming from background!')
    } else if (nextAppState == "background") {
      console.log("App is going to background!!")
      MedalliaDXA.stopScreen();
    }
    console.log('AppState:', nextAppState)
    this.setState({ appState: nextAppState });
  }
}


