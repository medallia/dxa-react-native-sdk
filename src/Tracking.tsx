import type { EmitterSubscription, NativeEventSubscription, NativeModulesStatic } from "react-native";
import { AppState, Dimensions } from 'react-native';
import type { NavigationLibrary } from "./NavigationLibraries";
import { Blockable, SdkBlocker } from "./live_config/SdkBlocker";
import { DxaLogger, LoggerSdkLevel } from "./util/DxaLog";
import { injector } from "./util/DependencyInjector";

type TrackingParams = {
    dxaNativeModule: NativeModulesStatic;
    manualTracking: boolean;
    reactNavigationLibrary?: NavigationLibrary | undefined;
    disabledScreenTrackingFromLiveConfig: () => string[];
    stopTrackingDueToSampling: () => boolean;
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
    private trackingDisabledScreens: string[] = [];
    private disabledScreenTrackingFromLiveConfig: () => string[];
    private stopTrackingDueToSampling: () => boolean;
    private reactNavigationLibrary: NavigationLibrary | undefined;
    private get logger(): DxaLogger { return injector.resolve('DxaLogger')}

    private constructor(params: TrackingParams, sdkBlocker: SdkBlocker) {
        super(sdkBlocker);
        this.dxaNativeModule = params.dxaNativeModule;
        this.disabledScreenTrackingFromLiveConfig = params.disabledScreenTrackingFromLiveConfig;
        this.stopTrackingDueToSampling = params.stopTrackingDueToSampling;
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

    public static getInstance(params: TrackingParams, sdkBlocker: SdkBlocker): Tracking {
        if (!Tracking.instance) {
            Tracking.instance = new Tracking(params,sdkBlocker);
        }
        return Tracking.instance;
    }

    public executeBlock(): void {
        this.removeAppStateListener();
        this.removeDimensionsListener();
        this.removeAutoTrackingSetup();
    }

    public removeBlock(): void {
        this.startAppStateListener();
        this.startDimensionsListener();
        if (this.reactNavigationLibrary) {
            this.autoTrackingSetup(this.navigationLibrary!);
            return;
        }
    }

    startScreen(screenName: string): Promise<boolean> {
        var finalScreenName = this.alternativeScreenNames.get(screenName) ?? screenName;
        const currentMilliseconds = new Date().getTime();
        if(this.stopTrackingDueToSampling()){
            this.logger.log(LoggerSdkLevel.development, `Screen tracking is disabled due to sampling`);
            return Promise.resolve(false);
        }
        if(this.trackingDisabledScreens.includes(finalScreenName)){
            this.logger.log(LoggerSdkLevel.development, `Screen tracking is disabled for screen: ${finalScreenName}`);
            return Promise.resolve(false);
        }
        if (this.disabledScreenTrackingFromLiveConfig().includes(finalScreenName)) {
            this.logger.log(LoggerSdkLevel.development, `Screen tracking is disabled by live config for screen: ${finalScreenName}`);
            return Promise.resolve(false);
        }
        this.logger.log(LoggerSdkLevel.customer, `starting screen ->  ${finalScreenName}`);
        this.currentlyTrackingAScreen = true;
        this.lastScreenName = finalScreenName;
        return this.dxaNativeModule.startScreen(finalScreenName, currentMilliseconds);
    }

    stopScreen(): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, 'stopping screen.');
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

    setTrackingDisabledScreens(trackingDisabledScreens: string[]){
        this.trackingDisabledScreens = trackingDisabledScreens;
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
            this.logger.log(LoggerSdkLevel.development, `AppState event listener(change) width: ${width} height: ${height}`);
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
        this.logger.log(LoggerSdkLevel.development, `MedalliaDXA -> AppState event`);
        this.appStateSubscription = AppState.addEventListener(
            'change',
            this.handleAppStateChange
        );
    }

    private removeAppStateListener(): void {
        this.logger.log(LoggerSdkLevel.development, `MedalliaDXA -> Unmounting DxaApp node`);
        this.appStateSubscription?.remove();
        this.appStateSubscription = undefined;
    }

    private handleAppStateChange = (nextAppState: any) => {
        if (nextAppState == 'active') {
            this.logger.log(LoggerSdkLevel.qa,'App becomes active');
            if (this.currentlyTrackingAScreen) {
                return;
            }
            this.startScreen(
                this.navigationLibrary?.getScreenName() ?? this.lastScreenName ?? "undefined"
            );
        } else if (nextAppState == 'background') {
            this.logger.log(LoggerSdkLevel.qa,'App went to background');
            this.stopScreen();
        }
    };
}
