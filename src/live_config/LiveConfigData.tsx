import { LoggerSdkLevel } from '../util/DxaLog';
import { SdkMetaData } from "../util/MetaData";
import { core } from '../Core';

export class LiveConfigData {
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

    disableScreenTracking(): string[] {
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

        if(this._showLocalLogs != undefined){
            core.dxaLogInstance.setShowLocalLogs(this.showLocalLogs);
        }

        if(this._allowLocalLogs != undefined){
            core.dxaLogInstance.setAllowLocalLogs(this.allowLocalLogs);
        }

        if (this._blockedRNAppVersions.includes(this._appVersion)) {
            core.dxaLogInstance.log(LoggerSdkLevel.public, "This version of the app has been blocked");
            core.sdkBlockerIstance.blockSdk();
            return;
        }
        if (this._blockedRNSDKVersions.includes(SdkMetaData.sdkVersion)) {
            core.dxaLogInstance.log(LoggerSdkLevel.public, "This version of the SDK has been blocked");
            core.sdkBlockerIstance.blockSdk();
            return;
        }
        if (core.sdkBlockerIstance.isSdkBlocked) {
            core.sdkBlockerIstance.unblockSdk();
        }
    }
}

