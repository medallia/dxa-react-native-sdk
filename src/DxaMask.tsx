import { requireNativeComponent } from 'react-native';

export const DxaMask = requireNativeComponent('DxaMask');

export enum MedalliaDxaAutomaticMask {
    all = 0,
    inputs = 1,
    text = 2,
    images = 3,
    webViews = 4,
  }