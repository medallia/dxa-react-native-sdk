import { dxaLog } from "dxa-react-native";
import { sdkBlockerIstance } from "./SdkBlocker";
import { SdkMetaData } from "../util/MetaData";
import { core } from "../Core";

class LiveConfigData {
    eventType: string = "live_configuration"
    private _blockedRNSDKVersions: string[] = [];
    private _blockedRNAppVersions: string[] = [];
    private _showLocalLogs: boolean = false;
    private _disableScreenTracking: string[] = [];
    private _appVersion: string = "";

    get blockedRNSDKVersions(): string[] {
        return this._blockedRNSDKVersions;
    }

    get blockedRNAppVersions(): string[] {
        return this._blockedRNAppVersions;
    }

    get showLocalLogs(): boolean {
        return this._showLocalLogs;
    }

    get disableScreenTracking(): string[] {
        return this._disableScreenTracking;
    }

    get appVersion(): string {
        return this._appVersion;
    }

    fillfromNative(data: any): void{
        dxaLog.log("Live config data received from native: ", data);
        this._blockedRNSDKVersions = data.vcBlockedReactNativeSDKVersions ?? this._blockedRNSDKVersions;
        this._blockedRNAppVersions = data.vcBlockedReactNativeAppVersions ?? this._blockedRNAppVersions;
        this._showLocalLogs = data.daShowLocalLogs ?? this._showLocalLogs; 
        this._disableScreenTracking = data.dstDisableScreenTracking ?? this._disableScreenTracking; 
        this._appVersion = data.appVersion ?? this._appVersion; 
        this.runTasksAfterUpdate();

    }

    private runTasksAfterUpdate(): void {
        core.trackingInstance?.updateDisabledScreenTracking(this._disableScreenTracking);
        if(this._blockedRNAppVersions.includes(this._appVersion)){
            dxaLog.log("App version is blocked");
            sdkBlockerIstance.blockSdk();
            return;
        }
        if(this._blockedRNSDKVersions.includes(SdkMetaData.sdkVersion)){
            dxaLog.log("SDK version is blocked");
            sdkBlockerIstance.blockSdk();
            return;
        }
        if(sdkBlockerIstance.isSdkBlocked){
            sdkBlockerIstance.unblockSdk();
        }
    }
}

const liveConfigDataInstance = new LiveConfigData();
export { liveConfigDataInstance }