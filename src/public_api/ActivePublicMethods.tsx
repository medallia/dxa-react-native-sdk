import { DxaReactNative, MedalliaDxaAutomaticMask } from "../index";
import type { Tracking } from "src/Tracking";
import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "src/publicEnums";
import { dxaLog } from "src/util/DxaLog";

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
        dxaLog.log('send http error -> ', errorCode);
        return DxaReactNative.sendHttpError(errorCode);
    }
    public sendGoal(goalName: string, value?: number): Promise<boolean> {
        dxaLog.log('sendGoal -> ', goalName, 'value -> ', value);
        //React native doesn't allow nullable parameters or native modules, so 2
        //methods are needed.
        if (value) {
            return DxaReactNative.sendGoalWithValue(goalName, value);
        }
        return DxaReactNative.sendGoal(goalName);
    }
    public setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
        dxaLog.log('setDimensionWithString -> ', dimensionName, 'value -> ', stringValue);
        return DxaReactNative.setDimensionWithString(dimensionName, stringValue);
    }
    public setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
        dxaLog.log('setDimensionWithNumber -> ', dimensionName, 'value -> ', numberValue);
        return DxaReactNative.setDimensionWithNumber(dimensionName, numberValue);
    }
    public setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
        dxaLog.log('setDimensionWithBool -> ', dimensionName, 'value -> ', boolValue);
        return DxaReactNative.setDimensionWithBool(dimensionName, boolValue);
    }
    public getSessionUrl(): Promise<string | null> {
        dxaLog.log('getSessionUrl');
        return DxaReactNative.getSessionUrl();
    }
    public getSessionId(): Promise<string | null> {
        dxaLog.log('getSessionId');
        return DxaReactNative.getSessionId();
    }

    public getWebViewProperties(): Promise<string | null> {
        dxaLog.log('getWebViewProperties');
        return DxaReactNative.getWebViewProperties();
    }

    public setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
        dxaLog.log('setConsents', consents);
        return DxaReactNative.setConsents(consents);
    }

    public enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        dxaLog.log('setAutomasking', elementsToMask);
        return DxaReactNative.enableAutoMasking(elementsToMask);
    }

    public disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        dxaLog.log('disableAllAutoMasking');
        return DxaReactNative.disableAutoMasking(elementsToUnmask);
    }

    public setRetention(enabled: Boolean) {
        dxaLog.log('setRetention: ', enabled);
        return DxaReactNative.setRetention(enabled);
    }

    public setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
        dxaLog.log('setAlternativeScreenNames: ', alternativeScreenNames);
        this.trackingInstance.setAlternativeScreenName(alternativeScreenNames);
    }

    public setRouteSeparator(newSeparator: String) {
        this.trackingInstance.setRouteSeparator(newSeparator);
    }

    public setMaskingColor(hexadecimalColor: string) {
        if (!this.isHexColor(hexadecimalColor)) {
            dxaLog.log('invalid hex color: ', hexadecimalColor, ' hex color should be in the format #RRGGBB');
            return;
        }

        dxaLog.log('setMaskColor: ', hexadecimalColor);
        return DxaReactNative.setMaskingColor(hexadecimalColor);
    }

    public sendDataOverWifiOnly(onlyWifi: boolean) {
        dxaLog.log('sendDataOverWifiOnly: ', onlyWifi);
        return DxaReactNative.sendDataOverWifiOnly(onlyWifi);
    }


    //Checks that the hex color is in the format #RRGGBB
    isHexColor(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
        return hexColorRegex.test(hex);
    }
    public setImageQuality(quality: ImageQualityType) {
        dxaLog.log('setImageQuality: ', quality);
        return DxaReactNative.setImageQuality(quality.valueOf());
    }

}