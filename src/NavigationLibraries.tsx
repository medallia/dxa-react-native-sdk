import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

import { DxaLog } from "./util/DxaLog";


const dxaLog = new DxaLog();

export abstract class NavigationLibrary extends EventEmitter{
    abstract getScreenName(): string;
    abstract routeSeparator: String;
    startScreenEventEmitter(){
        this.emit('startScreen', this.getScreenName());
    }

}

type ReactNavigationParams = {
    navigationContainerRef: any;
};

///reactnavigation.org
export class ReactNavigation extends NavigationLibrary {
    private navigationContainerRef: any | undefined;
    public routeSeparator: String = '.';
    private constructor({ navigationContainerRef }: ReactNavigationParams) {
        super();
        this.navigationContainerRef = navigationContainerRef;
        this.navigationContainerRef.addListener('state', () => {
            this.startScreenEventEmitter();
        });
    }
    private static instance: ReactNavigation | null = null;

    public static getInstance(params: ReactNavigationParams): ReactNavigation {
        if (!ReactNavigation.instance) {
            ReactNavigation.instance = new ReactNavigation(params);
        }
        return ReactNavigation.instance;
    }


    getScreenName() {
        return this.resolveCurrentRouteName({
            data: { state: this.navigationContainerRef.getRootState() },
        })
    }


    private resolveCurrentRouteName(param: any) {
        try {
            let currentOnPrint: any = param.data.state;
            let entireRoute = '';
            do {
                dxaLog.log(
                    'MedalliaDXA ->',
                    ' > detected route level:',
                    currentOnPrint
                );
                entireRoute =
                    entireRoute +
                    currentOnPrint.routes[currentOnPrint.index].name + this.routeSeparator;
                currentOnPrint = currentOnPrint.routes[currentOnPrint.index]?.state;
            } while (currentOnPrint && currentOnPrint.routes);
            entireRoute = entireRoute.slice(0, -1);
            return entireRoute;
        } catch (ex) {
            return 'unknown';
        }
    }
}