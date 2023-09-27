import { NativeModules, Platform } from 'react-native';

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

class DXA {

  initialize(
    propertyId: number,
    accountId: number
  ): Promise<boolean> {
    return DxaReactNative.initialize(
      propertyId,
      accountId
    );
  }

  startScreen(
    screenName: string
  ): Promise<boolean> {
     return DxaReactNative.startScreen(screenName);
  }

  stopScreen(): Promise<boolean> {
    return DxaReactNative.endScreen();
  }
}

const dxa = new DXA();

/// DXA binder.
export { dxa };
export { DxaApp } from './DxaApp';
export { DxaScreen } from './DxaScreen';
