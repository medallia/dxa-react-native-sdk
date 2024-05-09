import type { EmitterSubscription, NativeEventSubscription, NativeModulesStatic } from "react-native";
import { AppState, Dimensions } from 'react-native';
import type { NavigationLibrary } from "./NavigationLibraries";
import { Blockable } from "./live_config/SdkBlocker";
import { dxaLog } from "./util/DxaLog";

type TrackingParams = {
    dxaNativeModule: NativeModulesStatic;
    manualTracking: boolean;
    reactNavigationLibrary?: NavigationLibrary | undefined;
    disabledScreenTracking: string[];
};

interface ScreenSize {
    width: number;
    height: number;
}

export class Tracking extends Blockable {

    private static instance: Tracking;
    private dxaNativeModule: NativeModulesStatic;
    private navigationLibrary: NavigationLibrary | undefined;
    private dimensionsSubscription: EmitterSubscription | undefined;
    private appStateSubscription: NativeEventSubscription | undefined;
    private lastScreenName: string | undefined;
    private screenSize: ScreenSize | undefined;
    private currentlyTrackingAScreen: boolean = false;
    private alternativeScreenNames: Map<string, string> = new Map();
    private disabledScreenTracking: string[] = [];
    private reactNavigationLibrary: NavigationLibrary | undefined;

    private constructor(params: TrackingParams) {
        super();
        this.dxaNativeModule = params.dxaNativeModule;
        this.disabledScreenTracking = params.disabledScreenTracking;
        this.reactNavigationLibrary = params.reactNavigationLibrary;
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

    public executeBlock(): void {
        dxaLog.log('execute block on Tracking module');
        this.removeAppStateListener();
        this.removeDimensionsListener();
        this.removeAutoTrackingSetup();
    }

    public removeBlock(): void {
        dxaLog.log('remove block on Tracking module');
        this.startAppStateListener();
        this.startDimensionsListener();
        if (this.reactNavigationLibrary) {
            this.autoTrackingSetup(this.navigationLibrary!);
            return;
        }
    }

    startScreen(screenName: string): Promise<boolean> {
        var finalScreenName = this.alternativeScreenNames.get(screenName) ?? screenName;
        if (this.disabledScreenTracking.includes(finalScreenName)) {
            dxaLog.log('Screen tracking is disabled for screen:', finalScreenName);
            return Promise.resolve(false);
        }
        dxaLog.log('starting screen -> ', finalScreenName);
        this.currentlyTrackingAScreen = true;
        this.lastScreenName = finalScreenName;
        return this.dxaNativeModule.startScreen(finalScreenName);
    }

    stopScreen(): Promise<boolean> {
        dxaLog.log('stopping screen.');
        this.currentlyTrackingAScreen = false;
        return this.dxaNativeModule.endScreen();
    }

    setRouteSeparator(newSeparator: String) {
        if (this.navigationLibrary) {
            this.navigationLibrary.routeSeparator = newSeparator;
        }
    }

    setAlternativeScreenName(alternativeScreenNames: Map<string, string>
    ) {
        this.alternativeScreenNames = alternativeScreenNames;
    }

    private autoTrackingSetup(reactNavigationLibrary: NavigationLibrary) {
        this.navigationLibrary = reactNavigationLibrary;
        this.navigationLibrary.startScreenListener(async (screenName: string) => {
            if (this.currentlyTrackingAScreen) {
                await this.stopScreen();
            }
            await this.startScreen(screenName);

        });
    }

    private removeAutoTrackingSetup() {
        this.navigationLibrary?.removeListeners();
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
            dxaLog.log('App becomes to active!');
            if (this.currentlyTrackingAScreen) {
                return;
            }
            this.startScreen(
                this.navigationLibrary?.getScreenName() ?? this.lastScreenName ?? "undefined"
            );
        } else if (nextAppState == 'background') {
            dxaLog.log('App is going to background!!');
            this.stopScreen();
        }
    };
}
