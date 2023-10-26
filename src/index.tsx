import { NativeModules, Platform } from 'react-native';
import { type NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { DxaLog } from '../src/util/DxaLog';

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

  private routeSeparator: String = "."

  // Initialize SDK for autotracking.
  // @param - propertyId - associated DXA client property id
  // @param - accountId - associated DXA client account id
  async initialize(
    accountId: number,
    propertyId: number,
    navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
  ) {
    this.accountId = accountId;
    this.propertyId = propertyId;
    if (!this.initialized) {
      dxaLog.log("MedalliaDXA ->", "initializing SDK propertyId:", propertyId, "accountId:", accountId)
      this.initialized = await DxaReactNative.initialize(accountId, propertyId);
    }
    if (navigationRef) {
      navigationRef.addListener('state', (param: any) => {
        const screenName = this.resolveCurrentRouteName(param);
        this.startScreen(screenName);
      });
    }
  }

  // Starts to track a screen. If some screes is being tracked, that track will be stopped
  // and new screen track starts.
  // @param - screenName - Name of current screen.
  startScreen(
    screenName: string
  ): Promise<boolean> {
    dxaLog.log("MedalliaDXA ->", "starting screen -> ", screenName)
    return DxaReactNative.startScreen(screenName);
  }

  stopScreen(): Promise<boolean> {
    dxaLog.log("MedalliaDXA ->", "stopping screen.")
    return DxaReactNative.endScreen();
  }

  resolveCurrentRouteName(param: any) {
    try {
      let currentOnPrint: any = param.data.state;
      let entireRoute = ""
      do {
        dxaLog.log("MedalliaDXA ->", " > detected route level:", currentOnPrint);
        entireRoute = entireRoute + "." + currentOnPrint.routes[currentOnPrint.index].name;
        currentOnPrint = currentOnPrint.routes[currentOnPrint.index]?.state
      } while (currentOnPrint && currentOnPrint.routes);
      return entireRoute;
    } catch (ex) {
      return "unknown";
    }
  }

  setRouteSeparator(newSeparator: String) {
    this.routeSeparator = newSeparator;
  }
}

const MedalliaDXA = new DXA();
const dxaLog = new DxaLog();

/// DXA binder.
export { MedalliaDXA };
export { dxaLog };
export { DxaScreen } from './DxaScreen';
export { DxaApp } from './DxaApp';
