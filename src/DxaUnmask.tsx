import { requireNativeComponent } from 'react-native';
import React from 'react';

const NativeDxaUnmask = requireNativeComponent('DxaUnmask');


interface MyComponentProps {
  children: React.ReactNode;
}

export const DxaUnmask: React.FC<MyComponentProps> = ({ children }) => {
  const childCount = React.Children.count(children);

  if (childCount > 1) {
    throw new Error('DxaUnmask can only have a single child');
  }

  return <NativeDxaUnmask>{children}</NativeDxaUnmask>;
};