import { DxaReactNative, MedalliaDxaAutomaticMask } from "../index";
import type { Tracking } from "../Tracking";
import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "../publicEnums";
import { LoggerSdkLevel } from "../util/DxaLog";
import { core } from "../Core";

export class ActivePublicMethods {
    trackingInstance: Tracking;

    constructor(trackingInstance: Tracking) {
        this.trackingInstance = trackingInstance;
    }
    
    public startScreen(screenName: string): Promise<boolean> {
        return this.trackingInstance.startScreen(screenName);
    }

    public stopScreen(): Promise<boolean> {
        return this.trackingInstance.stopScreen();
    }

    public sendHttpError(errorCode: number): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Save HTTP Error: ${errorCode}`);
        return DxaReactNative.sendHttpError(errorCode);
    }

    public sendError(error: string): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Save App Error: ${error}`);
        return DxaReactNative.sendError(error);
    }

    public sendGoal(goalName: string, value?: number): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Save goal -> ${goalName} value -> ${value}`);
        //React native doesn't allow nullable parameters or native modules, so 2
        //methods are needed.
        if (value) {
            return DxaReactNative.sendGoalWithValue(goalName, value);
        }
        return DxaReactNative.sendGoal(goalName);
    }

    public setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Save Custom Dimension -> ${dimensionName} value -> ${stringValue}`);
        return DxaReactNative.setDimensionWithString(dimensionName, stringValue);
    }

    public setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Save Custom Dimension -> ${dimensionName} value -> ${numberValue}`);
        return DxaReactNative.setDimensionWithNumber(dimensionName, numberValue);
    }

    public setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Save Custom Dimension -> ${dimensionName} value -> ${boolValue}`);
        return DxaReactNative.setDimensionWithBool(dimensionName, boolValue);
    }

    public getSessionUrl(): Promise<string | null> {
        core.dxaLogInstance.log(LoggerSdkLevel.development, 'getSessionUrl');
        return DxaReactNative.getSessionUrl();
    }

    public getSessionId(): Promise<string | null> {
        core.dxaLogInstance.log(LoggerSdkLevel.development, 'getSessionId');
        return DxaReactNative.getSessionId();
    }

    public async getWebViewProperties(): Promise<string | null> {
        let webViewProperties: string | null = await DxaReactNative.getWebViewProperties();
        core.dxaLogInstance.log(LoggerSdkLevel.qa, `Get webview properties: ${webViewProperties}`);
        return webViewProperties;
    }

    public setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Set consents to ${consents}`);
        return DxaReactNative.setConsents(consents);
    }

    public enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Automatic masking configuration enable: ${elementsToMask}`);
        return DxaReactNative.enableAutoMasking(elementsToMask);
    }

    public disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Automatic masking configuration disable: ${elementsToUnmask}`);
        return DxaReactNative.disableAutoMasking(elementsToUnmask);
    }

    public setRetention(enabled: Boolean) {
        core.dxaLogInstance.log(LoggerSdkLevel.development, `setRetention: ${enabled}`);
        return DxaReactNative.setRetention(enabled);
    }

    public setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
        core.dxaLogInstance.log(LoggerSdkLevel.development, `Alternatives screen names have been set`);
        this.trackingInstance.setAlternativeScreenName(alternativeScreenNames);
    }

    public setRouteSeparator(newSeparator: String) {
        this.trackingInstance.setRouteSeparator(newSeparator);
    }

    public setMaskingColor(hexadecimalColor: string) {
        if (!this.isHexColor(hexadecimalColor)) {
            core.dxaLogInstance.log(LoggerSdkLevel.development, `invalid hex color: ${hexadecimalColor} hex color should be in the format #RRGGBB`);
            return;
        }

        core.dxaLogInstance.log(LoggerSdkLevel.customer, `setMaskColor: ${hexadecimalColor}`);
        return DxaReactNative.setMaskingColor(hexadecimalColor);
    }


    public sendDataOverWifiOnly(onlyWifi: boolean) {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Send data over wifi only: ${onlyWifi}`);
        return DxaReactNative.sendDataOverWifiOnly(onlyWifi);
    }


    //Checks that the hex color is in the format #RRGGBB
    isHexColor(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
        return hexColorRegex.test(hex);
    }
    public setImageQuality(quality: ImageQualityType) {
        core.dxaLogInstance.log(LoggerSdkLevel.customer, `Set image quality to: ${quality}`);
        return DxaReactNative.setImageQuality(quality.valueOf());
    }

}