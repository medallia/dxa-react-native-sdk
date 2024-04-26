import { DxaReactNative, MedalliaDxaAutomaticMask, dxaLog } from "src/index";
import type { Tracking } from "src/Tracking";
import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "src/publicEnums";

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
        dxaLog.log('MedalliaDXA ->', 'send http error -> ', errorCode);
        return DxaReactNative.sendHttpError(errorCode);
    }
    public sendGoal(goalName: string, value?: number): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'sendGoal -> ', goalName, 'value -> ', value);
        //React native doesn't allow nullable parameters or native modules, so 2
        //methods are needed.
        if (value) {
            return DxaReactNative.sendGoalWithValue(goalName, value);
        }
        return DxaReactNative.sendGoal(goalName);
    }
    public setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'setDimensionWithString -> ', dimensionName, 'value -> ', stringValue);
        return DxaReactNative.setDimensionWithString(dimensionName, stringValue);
    }
    public setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'setDimensionWithNumber -> ', dimensionName, 'value -> ', numberValue);
        return DxaReactNative.setDimensionWithNumber(dimensionName, numberValue);
    }
    public setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'setDimensionWithBool -> ', dimensionName, 'value -> ', boolValue);
        return DxaReactNative.setDimensionWithBool(dimensionName, boolValue);
    }
    public getSessionUrl(): Promise<string | null> {
        dxaLog.log('MedalliaDXA ->', 'getSessionUrl');
        return DxaReactNative.getSessionUrl();
    }
    public getSessionId(): Promise<string | null> {
        dxaLog.log('MedalliaDXA ->', 'getSessionId');
        return DxaReactNative.getSessionId();
    }

    public getWebViewProperties(): Promise<string | null> {
        dxaLog.log('MedalliaDXA ->', 'getWebViewProperties');
        return DxaReactNative.getWebViewProperties();
    }

    public setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'setConsents', consents);
        return DxaReactNative.setConsents(consents);
    }

    public enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'setAutomasking', elementsToMask);
        return DxaReactNative.enableAutoMasking(elementsToMask);
    }

    public disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask): Promise<boolean> {
        dxaLog.log('MedalliaDXA ->', 'disableAllAutoMasking');
        return DxaReactNative.disableAutoMasking(elementsToUnmask);
    }

    public setRetention(enabled: Boolean) {
        dxaLog.log('MedalliaDXA ->', 'setRetention: ', enabled);
        return DxaReactNative.setRetention(enabled);
    }

    public setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
        this.trackingInstance.setAlternativeScreenName(alternativeScreenNames);
    }

    public setRouteSeparator(newSeparator: String) {
        this.trackingInstance.setRouteSeparator(newSeparator);
    }

    public setMaskingColor(hexadecimalColor: string) {
        if (!this.isHexColor(hexadecimalColor)) {
            dxaLog.log('MedalliaDXA ->', 'invalid hex color: ', hexadecimalColor, ' hex color should be in the format #RRGGBB');
            return;
        }

        dxaLog.log('MedalliaDXA ->', 'setMaskColor: ', hexadecimalColor);
        return DxaReactNative.setMaskingColor(hexadecimalColor);
    }
    //Checks that the hex color is in the format #RRGGBB
    isHexColor(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
        return hexColorRegex.test(hex);
    }
    public setImageQuality(quality: ImageQualityType) {
        dxaLog.log('MedalliaDXA ->', 'setImageQuality: ', quality);
        return DxaReactNative.setImageQuality(quality.valueOf());
    }

}