import type {
  NavigatorScreenParams,
  PathConfigMap,
} from '@react-navigation/native';


import { MixedStack, mixedStackLinking } from './Screens/MixedStack';
import { ModalStack, modalStackLinking } from './Screens/ModalStack';



export const SCREENS = {
  ModalStack: {
    title: 'Modal Stack',
    component: ModalStack,
    linking: modalStackLinking,
  },
  MixedStack: {
    title: 'Regular + Modal Stack',
    component: MixedStack,
    linking: mixedStackLinking,
  },
 
} as const satisfies {
  [key: string]: {
    title: string;
    component: React.ComponentType<any>;
    linking: object;
  };
};

type ExampleScreensParamList = {
  [Key in keyof typeof SCREENS]: (typeof SCREENS)[Key]['linking'] extends PathConfigMap<
    infer P
  >
    ? NavigatorScreenParams<P> | undefined
    : undefined;
};

export type RootDrawerParamList = {
  Examples: undefined;
};

export type RootStackParamList = ExampleScreensParamList & {
  Home: NavigatorScreenParams<RootDrawerParamList> | undefined;
  NotFound: undefined;
};

// Make the default RootParamList the same as the RootStackParamList
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
