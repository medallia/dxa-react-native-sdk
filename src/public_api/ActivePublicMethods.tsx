import { DxaReactNative, MedalliaDxaAutomaticMask } from "../index";
import type { Tracking } from "src/Tracking";
import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "src/publicEnums";
import { LoggerSdkLevel, dxaLog } from "src/util/DxaLog";

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
        dxaLog.log(LoggerSdkLevel.development, `send http error -> ${errorCode}`);
        return DxaReactNative.sendHttpError(errorCode);
    }
    public sendGoal(goalName: string, value?: number): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, `sendGoal -> ${goalName} value -> ${value}`);
        //React native doesn't allow nullable parameters or native modules, so 2
        //methods are needed.
        if (value) {
            return DxaReactNative.sendGoalWithValue(goalName, value);
        }
        return DxaReactNative.sendGoal(goalName);
    }
    public setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, `setDimensionWithString -> ${dimensionName} value -> ${stringValue}`);
        return DxaReactNative.setDimensionWithString(dimensionName, stringValue);
    }
    public setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, `setDimensionWithNumber -> ${dimensionName} value -> ${numberValue}`);
        return DxaReactNative.setDimensionWithNumber(dimensionName, numberValue);
    }
    public setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, `setDimensionWithBool -> ${dimensionName} value -> ${boolValue}`);
        return DxaReactNative.setDimensionWithBool(dimensionName, boolValue);
    }
    public getSessionUrl(): Promise<string | null> {
        dxaLog.log(LoggerSdkLevel.development, 'getSessionUrl');
        return DxaReactNative.getSessionUrl();
    }
    public getSessionId(): Promise<string | null> {
        dxaLog.log(LoggerSdkLevel.development, 'getSessionId');
        return DxaReactNative.getSessionId();
    }

    public getWebViewProperties(): Promise<string | null> {
        dxaLog.log(LoggerSdkLevel.development, 'getWebViewProperties');
        return DxaReactNative.getWebViewProperties();
    }

    public setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, `setConsents ${consents}`);
        return DxaReactNative.setConsents(consents);
    }

    public enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, `setAutomasking ${elementsToMask}`);
        return DxaReactNative.enableAutoMasking(elementsToMask);
    }

    public disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        dxaLog.log(LoggerSdkLevel.development, 'disableAllAutoMasking');
        return DxaReactNative.disableAutoMasking(elementsToUnmask);
    }

    public setRetention(enabled: Boolean) {
        dxaLog.log(LoggerSdkLevel.development, `setRetention: ${enabled}`);
        return DxaReactNative.setRetention(enabled);
    }

    public setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
        dxaLog.log(LoggerSdkLevel.development, `setAlternativeScreenNames: ${alternativeScreenNames}`);
        this.trackingInstance.setAlternativeScreenName(alternativeScreenNames);
    }

    public setRouteSeparator(newSeparator: String) {
        this.trackingInstance.setRouteSeparator(newSeparator);
    }

    public setMaskingColor(hexadecimalColor: string) {
        if (!this.isHexColor(hexadecimalColor)) {
            dxaLog.log(LoggerSdkLevel.development, `invalid hex color: ${hexadecimalColor} hex color should be in the format #RRGGBB`);
            return;
        }

        dxaLog.log(LoggerSdkLevel.development, `setMaskColor: ${hexadecimalColor}`);
        return DxaReactNative.setMaskingColor(hexadecimalColor);
    }


    public sendDataOverWifiOnly(onlyWifi: boolean) {
        dxaLog.log(LoggerSdkLevel.development, `sendDataOverWifiOnly: ${onlyWifi}`);
        return DxaReactNative.sendDataOverWifiOnly(onlyWifi);
    }


    //Checks that the hex color is in the format #RRGGBB
    isHexColor(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
        return hexColorRegex.test(hex);
    }
    public setImageQuality(quality: ImageQualityType) {
        dxaLog.log(LoggerSdkLevel.development, `setImageQuality: ${quality}`);
        return DxaReactNative.setImageQuality(quality.valueOf());
    }

}