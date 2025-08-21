import { DxaLogger, LoggerSdkLevel } from '../util/DxaLog';
import { SdkMetaData } from "../util/MetaData";
import { injector } from '../util/DependencyInjector';
import type { SdkBlocker } from './SdkBlocker';

export class LiveConfigData {
    eventType: string = "live_configuration"
    private _blockedRNSDKVersions: string[] = [];
    private _blockedRNAppVersions: string[] = [];
    private _blockedNativeSDKVersions: string[] = [];
    private _showLocalLogs: boolean = false;
    private _allowLocalLogs: boolean = false;
    private _disableScreenTracking: string[] = [];
    private _appVersion: string = "";
    private _nativeSdkVersion: string = "";
    private get sdkBlocker(): SdkBlocker { return injector.resolve('SdkBlocker') };
    private get logger(): DxaLogger { return injector.resolve('DxaLogger') }

    get blockedRNSDKVersions(): string[] {
        return this._blockedRNSDKVersions;
    }

    get blockedRNAppVersions(): string[] {
        return this._blockedRNAppVersions;
    }

    get blockedNativeSDKVersions(): string[] {
        return this._blockedNativeSDKVersions;
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

    get nativeSdkVersion(): string {
        return this._nativeSdkVersion;
    }

    fillfromNative(data: any): void {
        this._blockedRNSDKVersions = data.vcBlockedReactNativeSDKVersions ?? this._blockedRNSDKVersions;
        this._blockedRNAppVersions = data.vcBlockedReactNativeAppVersions ?? this._blockedRNAppVersions;
        this._blockedNativeSDKVersions = data.vcBlockedNativeSDKVersions ?? this._blockedNativeSDKVersions;
        this._showLocalLogs = data.daShowLocalLogs ?? this._showLocalLogs;
        this._allowLocalLogs = data.daAllowLocalLogs ?? this._allowLocalLogs;
        this._disableScreenTracking = data.dstDisableScreenTracking ?? this._disableScreenTracking;
        this._appVersion = data.appVersion ?? this._appVersion;
        this._nativeSdkVersion = data.nativeSDKVersion ?? this._nativeSdkVersion;
        this.runTasksAfterUpdate();

    }

    private isVersionBlocked(version: string, blockedVersions: string[], logMessage: string): boolean {
        if (blockedVersions.includes(version)) {
            this.logger.log(LoggerSdkLevel.public, logMessage);
            return true;
        }
        return false;
    }

    private runTasksAfterUpdate(): void {

        if (this._showLocalLogs != undefined) {
            this.logger.setShowLocalLogs(this.showLocalLogs);
        }

        if (this._allowLocalLogs != undefined) {
            this.logger.setAllowLocalLogs(this.allowLocalLogs);
        }

        const isAppVersionBlocked = this.isVersionBlocked(this._appVersion, this._blockedRNAppVersions, "This version of the app has been blocked");
        const isRNSdkVersionBlocked = this.isVersionBlocked(SdkMetaData.sdkVersion, this._blockedRNSDKVersions, "This version of the SDK has been blocked");
        const isNativeSdkVersionBlocked = this.isVersionBlocked(this._nativeSdkVersion, this._blockedNativeSDKVersions, "This version of the native SDK has been blocked");

        if (isAppVersionBlocked || isRNSdkVersionBlocked || isNativeSdkVersionBlocked) {
            this.sdkBlocker.blockSdk();
            return;
        }

        if (this.sdkBlocker.isSdkBlocked) {
            this.sdkBlocker.unblockSdk();
        }
    }
}

