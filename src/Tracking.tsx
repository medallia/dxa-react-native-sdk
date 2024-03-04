import type { EmitterSubscription, NativeEventSubscription } from "react-native";
import { AppState, Dimensions } from 'react-native';
import { DxaLog } from "./util/DxaLog";
import { DxaReactNative } from "dxa-react-native";


const dxaLog = new DxaLog();

type TrackingParams = {
    navigationCurrentScreenCallback: () => string;
};

export class Tracking {
    private static instance: Tracking;
    private dimensionsSubscription: EmitterSubscription | undefined;
    private appStateSubscription: NativeEventSubscription | undefined;

    private lastScreenName: string | undefined;
    private screenSize: ScreenSize | undefined;
    private currentlyTrackingAScreen: boolean = false;

    //create a variable to store a callback that returns a string
    private navigationCurrentScreenCallback: () => string;

    private constructor({ navigationCurrentScreenCallback }: TrackingParams) {
        this.navigationCurrentScreenCallback = navigationCurrentScreenCallback;
        this.startAppStateListener();
        this.startDimensionsListener();
    }

    public static getInstance({ navigationCurrentScreenCallback }: TrackingParams): Tracking {
        if (!Tracking.instance) {
            Tracking.instance = new Tracking({ navigationCurrentScreenCallback: navigationCurrentScreenCallback });
        }
        return Tracking.instance;
    }

    startScreen(screenName: string): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'starting screen -> ', screenName);
        this.currentlyTrackingAScreen = true;
        this.lastScreenName = screenName;
        return DxaReactNative.startScreen(screenName);
    }

    stopScreen(): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'stopping screen.');
        this.currentlyTrackingAScreen = false;
        return DxaReactNative.endScreen();
    }
    private startDimensionsListener(): void {
        this.dimensionsSubscription = Dimensions.addEventListener('change', async ({ window: { width, height } }) => {
            dxaLog.log('MedalliaDXA ->',
                'AppState event listerner(change)',
                'width: ',
                width, 'height: ', height,);
            if (this.screenSize?.width === width && this.screenSize?.height === height) {
                return;
            }
            this.screenSize = { width, height };
            await this.stopScreen();
            this.startScreen(this.lastScreenName ?? "undefined");
        });
    }

    private removeDimensionsListener(): void {
        this.dimensionsSubscription?.remove();
        this.dimensionsSubscription = undefined;
    }

    private startAppStateListener(): void {
        if (typeof this.appStateSubscription !== 'undefined') {
            return;
        }
        dxaLog.log(
            'MedalliaDXA ->',
            'AppState event listerner(change)',
            this.handleAppStateChange
        );
        this.appStateSubscription = AppState.addEventListener(
            'change',
            this.handleAppStateChange
        );
    }

    private removeAppStateListener(): void {
        dxaLog.log(
            'MedalliaDXA ->',
            'Unmounting DxaApp node',
            AppState.currentState
        );
        this.appStateSubscription?.remove();
        this.appStateSubscription = undefined;
    }

    private handleAppStateChange = (nextAppState: any) => {
        if (nextAppState == 'active') {
            dxaLog.log('MedalliaDXA ->', 'App becomes to active!');
            if (this.currentlyTrackingAScreen) {
                return;
            }
            this.startScreen(
                this.navigationCurrentScreenCallback()
            );
        } else if (nextAppState == 'background') {
            dxaLog.log('MedalliaDXA ->', 'App is going to background!!');
            this.stopScreen();
        }
    };
}
interface ScreenSize {
    width: number;
    height: number;
}

//   const TrackingInstance = Tracking.getInstance();
