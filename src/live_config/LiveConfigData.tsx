import { LoggerSdkLevel, dxaLog } from '../util/DxaLog';
import { sdkBlockerIstance } from "./SdkBlocker";
import { SdkMetaData } from "../util/MetaData";
import { core } from "../Core";

class LiveConfigData {
    eventType: string = "live_configuration"
    private _blockedRNSDKVersions: string[] = [];
    private _blockedRNAppVersions: string[] = [];
    private _showLocalLogs: boolean = false;
    private _allowLocalLogs: boolean = false;
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

    get allowLocalLogs(): boolean {
        return this._allowLocalLogs;
    }

    get disableScreenTracking(): string[] {
        return this._disableScreenTracking;
    }

    get appVersion(): string {
        return this._appVersion;
    }

    fillfromNative(data: any): void {
        this._blockedRNSDKVersions = data.vcBlockedReactNativeSDKVersions ?? this._blockedRNSDKVersions;
        this._blockedRNAppVersions = data.vcBlockedReactNativeAppVersions ?? this._blockedRNAppVersions;
        this._showLocalLogs = data.daShowLocalLogs ?? this._showLocalLogs;
        this._allowLocalLogs = data.daAllowLocalLogs ?? this._allowLocalLogs;
        this._disableScreenTracking = data.dstDisableScreenTracking ?? this._disableScreenTracking;
        this._appVersion = data.appVersion ?? this._appVersion;
        this.runTasksAfterUpdate();

    }

    private runTasksAfterUpdate(): void {
        core.trackingInstance?.updateDisabledScreenTracking(this._disableScreenTracking);

        if(this._showLocalLogs != undefined){
            dxaLog.setShowLocalLogs(this.showLocalLogs);
        }

        if(this._allowLocalLogs != undefined){
            dxaLog.setAllowLocalLogs(this.allowLocalLogs);
        }

        if (this._blockedRNAppVersions.includes(this._appVersion)) {
            dxaLog.log(LoggerSdkLevel.public, "This version of the app has been blocked");
            sdkBlockerIstance.blockSdk();
            return;
        }
        if (this._blockedRNSDKVersions.includes(SdkMetaData.sdkVersion)) {
            dxaLog.log(LoggerSdkLevel.public, "This version of the SDK has been blocked");
            sdkBlockerIstance.blockSdk();
            return;
        }
        if (sdkBlockerIstance.isSdkBlocked) {
            sdkBlockerIstance.unblockSdk();
        }
    }
}

const liveConfigDataInstance = new LiveConfigData();
export { liveConfigDataInstance }