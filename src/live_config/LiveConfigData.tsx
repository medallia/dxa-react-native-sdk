import { dxaLog } from "dxa-react-native";
import { sdkBlockerIstance } from "./SdkBlocker";
import { SdkMetaData } from "../util/MetaData";

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
        this._blockedRNSDKVersions = data.vcBlockedReactNativeSDKVersions as string[];
        this._blockedRNAppVersions = data.vcBlockedReactNativeAppVersions as string[];
        this._showLocalLogs = data.daShowLocalLogs as boolean; 
        this._disableScreenTracking = data.dstDisableScreenTracking as string[]; 
        this._appVersion = data.appVersion as string; 
        this.runTasksAfterUpdate();

    }

    private runTasksAfterUpdate(): void {
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