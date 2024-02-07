import { NativeModules } from 'react-native';


const DxaReactNativeExample = NativeModules.DxaReactNativeExample
  ? NativeModules.DxaReactNativeExample
  : new Proxy(
    {},
    {
      get() {
        throw new Error('Error: DXA native module is not available');
      },
    }
  );

export {DxaReactNativeExample};