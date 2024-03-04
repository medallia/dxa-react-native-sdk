import type { EmitterSubscription, NativeEventSubscription } from "react-native";
import { AppState, Dimensions } from 'react-native';
import { DxaLog } from "./util/DxaLog";
import { DxaReactNative } from "dxa-react-native";
import type { NavigationLibrary } from "./NavigationLibraries";


const dxaLog = new DxaLog();

type TrackingParams = {
    manualTracking: boolean;
    reactNavigationLibrary?: NavigationLibrary | undefined;
};

export class Tracking {
    private static instance: Tracking;
    private navigationLibrary: NavigationLibrary | undefined;
    private dimensionsSubscription: EmitterSubscription | undefined;
    private appStateSubscription: NativeEventSubscription | undefined;

    private lastScreenName: string | undefined;
    private screenSize: ScreenSize | undefined;
    private currentlyTrackingAScreen: boolean = false;

    //create a variable to store a callback that returns a string
    // private navigationCurrentScreenCallback: (screenName: string) => void;

    private constructor(params: TrackingParams) {
        // this.navigationCurrentScreenCallback = reactNavigationLibrary.startScreenCallback;


        this.startAppStateListener();
        this.startDimensionsListener();
        if (params.manualTracking) {
            return;
        }
        if (params.reactNavigationLibrary) {
            this.startScreen(params.reactNavigationLibrary.getScreenName());
            this.autoTrackingSetup(params.reactNavigationLibrary);
            return;
        }
        throw new Error('Tracking setup failed, please provide a valid setup');

    }

    public static getInstance(params: TrackingParams): Tracking {
        if (!Tracking.instance) {
            Tracking.instance = new Tracking(params);
        }
        return Tracking.instance;
    }



    private autoTrackingSetup(reactNavigationLibrary: NavigationLibrary) {
        this.navigationLibrary = reactNavigationLibrary;
        this.navigationLibrary.addListener('startScreen', async (screenName: string) => {
            if(this.currentlyTrackingAScreen){
                await this.stopScreen();
            }
            await this.startScreen(screenName);

        });
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

    setRouteSeparator(newSeparator: String) {
        if (this.navigationLibrary) {
            this.navigationLibrary.routeSeparator = newSeparator;
        }
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
            await this.startScreen(this.lastScreenName ?? "undefined");
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
                this.navigationLibrary?.getScreenName() ?? this.lastScreenName ?? "undefined"
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
