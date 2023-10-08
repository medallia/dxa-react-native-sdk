import { NativeModules, Platform } from 'react-native';
import { type NavigationContainerRefWithCurrent } from '@react-navigation/native';

const LINKING_ERROR =
  `The package 'dxa-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const DxaReactNative = NativeModules.DxaReactNative
  ? NativeModules.DxaReactNative
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export class DXA {

  initialized: boolean = false;
  accountId: number | undefined = undefined;
  propertyId: number | undefined = undefined;

  // Initialize SDK for autotracking.
  // @param - propertyId - associated DXA client property id
  // @param - accountId - associated DXA client account id
  async initialize(
    accountId: number,
    propertyId: number,
    navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
  ) {
    if (!this.initialized) {
      this.accountId = accountId;
      this.propertyId = propertyId;
      this.initialized = await DxaReactNative.initialize(accountId, propertyId);
    }
    navigationRef.addListener('state', (param: any) => {
      console.log("Called listener for event STATE: param", param, "current route:", navigationRef.getRootState());
      this.startScreen(navigationRef.getRootState().routeNames[navigationRef.getRootState().index]!)
    });
  }

  // Starts to track a screen. If some screes is being tracked, that track will be stopped
  // and new screen track starts.
  // @param - screenName - Name of current screen.
  startScreen(
    screenName: string
  ): Promise<boolean> {
    console.log("MedalliaDXA", "starting screen -> ", screenName)
    return DxaReactNative.startScreen(screenName);
  }

  stopScreen(): Promise<boolean> {
    console.log("MedalliaDXA", "stopping screen.")
    return DxaReactNative.endScreen();
  }
}

const MedalliaDXA = new DXA();

/// DXA binder.
export { MedalliaDXA };
export { DxaScreen } from './DxaScreen';
export { DxaApp } from './DxaApp';
