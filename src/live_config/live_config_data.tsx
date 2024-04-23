class LiveConfigData {

    private _overrideUserConfig: boolean = false;
    private _blockedRNSDKVersions: string[] = [];
    private _blockedRNAppVersions: string[] = [];
    private _showLocalLogs: boolean = false;
    private _disableScreenTracking: string[] = [];
    private _appVersion: string | undefined;

    get overrideUserConfig(): boolean {
        return this._overrideUserConfig;
    }

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

    get appVersion(): string | undefined {
        return this._appVersion;
    }
}

const liveConfigData = new LiveConfigData();
export { liveConfigData }