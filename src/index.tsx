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

///Example function to remove!!!!!!!!!!
export function multiply(a: number, b: number): Promise<number> {
  return DxaReactNative.multiply(a, b);
}

export function initialize(
  propertyId: number,
  accountId: number,
  mobileDataEnabled: boolean,
  manualTrackingEnabled: boolean,
): Promise<boolean> {
  return DxaReactNative.initialize(
    propertyId,
    accountId,
    mobileDataEnabled,
    manualTrackingEnabled
  );
}

export function startScreen(
  screenName: string
): Promise<boolean> {
  return DxaReactNative.startScreen(screenName);
}

export function stoptScreen(): Promise<boolean> {
  return DxaReactNative.endScreen();
}
