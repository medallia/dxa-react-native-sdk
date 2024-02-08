import type { NavigatorScreenParams } from '@react-navigation/native';

import AuthFlow from './Screens/NavigationScreens/AuthFlow';
import BottomTabs from './Screens/NavigationScreens/BottomTabs';
import DynamicTabs from './Screens/NavigationScreens/DynamicTabs';
import LinkComponent from './Screens/NavigationScreens/LinkComponent';
import MasterDetail from './Screens/NavigationScreens/MasterDetail';
import MixedHeaderMode from './Screens/NavigationScreens/MixedHeaderMode';
import MixedStack from './Screens/NavigationScreens/MixedStack';
import ModalStack from './Screens/NavigationScreens/ModalStack';
import NativeStack from './Screens/NavigationScreens/NativeStack';
import NativeStackHeaderCustomization from './Screens/NavigationScreens/NativeStackHeaderCustomization';
import NativeStackPreventRemove from './Screens/NavigationScreens/NativeStackPreventRemove';
import SimpleStack from './Screens/NavigationScreens/SimpleStack';
import StackHeaderCustomization from './Screens/NavigationScreens/StackHeaderCustomization';
import StackPreventRemove from './Screens/NavigationScreens/StackPreventRemove';
import StackTransparent from './Screens/NavigationScreens/StackTransparent';
import TabView from './Screens/NavigationScreens/TabView';

export type RootDrawerParamList = {
  Examples: undefined;
};

export type LinkComponentDemoParamList = {
  Article: { author: string };
  Albums: undefined;
};

export const SCREENS = {
  NativeStack: {
    title: 'Native Stack',
    component: NativeStack,
  },
  SimpleStack: {
    title: 'Simple Stack',
    component: SimpleStack,
  },
  ModalStack: {
    title: 'Modal Stack',
    component: ModalStack,
  },
  MixedStack: {
    title: 'Regular + Modal Stack',
    component: MixedStack,
  },
  MixedHeaderMode: {
    title: 'Float + Screen Header Stack',
    component: MixedHeaderMode,
  },
  StackTransparent: {
    title: 'Transparent Stack',
    component: StackTransparent,
  },
  StackHeaderCustomization: {
    title: 'Header Customization in Stack',
    component: StackHeaderCustomization,
  },
  NativeStackHeaderCustomization: {
    title: 'Header Customization in Native Stack',
    component: NativeStackHeaderCustomization,
  },
  BottomTabs: {
    title: 'Bottom Tabs',
    component: BottomTabs,
  },
  DynamicTabs: {
    title: 'Dynamic Tabs',
    component: DynamicTabs,
  },
  MasterDetail: {
    title: 'Master Detail',
    component: MasterDetail,
  },
  AuthFlow: {
    title: 'Auth Flow',
    component: AuthFlow,
  },
  StackPreventRemove: {
    title: 'Prevent removing screen in Stack',
    component: StackPreventRemove,
  },
  NativeStackPreventRemove: {
    title: 'Prevent removing screen in Native Stack',
    component: NativeStackPreventRemove,
  },
  LinkComponent: {
    title: '<Link />',
    component: LinkComponent,
  },
  TabView: {
    title: 'TabView',
    component: TabView,
  },
};

type ParamListTypes = {
  Home: undefined;
  NotFound: undefined;
  LinkComponent: NavigatorScreenParams<LinkComponentDemoParamList> | undefined;
};

export type RootStackParamList = {
  [P in Exclude<keyof typeof SCREENS, keyof ParamListTypes>]: undefined;
} & ParamListTypes;

// Make the default RootParamList the same as the RootStackParamList
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}