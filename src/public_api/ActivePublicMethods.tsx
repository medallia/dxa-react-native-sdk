import { MedalliaDxaAutomaticMask } from "../index";
import type { Tracking } from "../Tracking";
import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "../publicEnums";
import { DxaLogger, LoggerSdkLevel } from "../util/DxaLog";
import { injector } from "../util/DependencyInjector";
import type { PublicMethodsInterface } from "./PublicMethodsInterface";
import type { NativeModulesStatic } from "react-native";

export class ActivePublicMethods implements PublicMethodsInterface {
    trackingInstance: Tracking;
    nativeModulesDxa: NativeModulesStatic;
    private get logger(): DxaLogger { return injector.resolve('DxaLogger')}

    constructor(nativeModulesStatic: NativeModulesStatic, trackingInstance: Tracking) {
        this.nativeModulesDxa = nativeModulesStatic;
        this.trackingInstance = trackingInstance;
    }
    
    public startScreen(screenName: string): Promise<boolean> {
        return this.trackingInstance.startScreen(screenName);
    }

    public stopScreen(): Promise<boolean> {
        return this.trackingInstance.stopScreen();
    }

    public sendHttpError(errorCode: number): Promise<boolean> {
       this.logger.log(LoggerSdkLevel.customer, `Save HTTP Error: ${errorCode}`);
        return this.nativeModulesDxa.sendHttpError(errorCode);
    }

    public sendError(error: string): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Save App Error: ${error}`);
        return this.nativeModulesDxa.sendError(error);
    }

    public sendGoal(goalName: string, value?: number): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Save goal -> ${goalName} value -> ${value}`);
        //React native doesn't allow nullable parameters or native modules, so 2
        //methods are needed.
        if (value) {
            return this.nativeModulesDxa.sendGoalWithValue(goalName, value);
        }
        return this.nativeModulesDxa.sendGoal(goalName);
    }

    public setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Save Custom Dimension -> ${dimensionName} value -> ${stringValue}`);
        return this.nativeModulesDxa.setDimensionWithString(dimensionName, stringValue);
    }

    public setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Save Custom Dimension -> ${dimensionName} value -> ${numberValue}`);
        return this.nativeModulesDxa.setDimensionWithNumber(dimensionName, numberValue);
    }

    public setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Save Custom Dimension -> ${dimensionName} value -> ${boolValue}`);
        return this.nativeModulesDxa.setDimensionWithBool(dimensionName, boolValue);
    }

    public getSessionUrl(): Promise<string | null> {
        this.logger.log(LoggerSdkLevel.development, 'getSessionUrl');
        return this.nativeModulesDxa.getSessionUrl();
    }

    public getSessionId(): Promise<string | null> {
        this.logger.log(LoggerSdkLevel.development, 'getSessionId');
        return this.nativeModulesDxa.getSessionId();
    }

    public async getWebViewProperties(): Promise<string | null> {
        let webViewProperties: string | null = await this.nativeModulesDxa.getWebViewProperties();
        this.logger.log(LoggerSdkLevel.qa, `Get webview properties: ${webViewProperties}`);
        return webViewProperties;
    }

    public setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Set consents to ${consents}`);
        return this.nativeModulesDxa.setConsents(consents);
    }

    public enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Automatic masking configuration enable: ${elementsToMask}`);
        return this.nativeModulesDxa.enableAutoMasking(elementsToMask);
    }

    public disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        this.logger.log(LoggerSdkLevel.customer, `Automatic masking configuration disable: ${elementsToUnmask}`);
        return this.nativeModulesDxa.disableAutoMasking(elementsToUnmask);
    }

    public setRetention(enabled: Boolean) {
        this.logger.log(LoggerSdkLevel.development, `setRetention: ${enabled}`);
        return this.nativeModulesDxa.setRetention(enabled);
    }

    public setAlternativeScreenNames(alternativeScreenNames: Map<string, string>) {
        this.logger.log(LoggerSdkLevel.development, `Alternatives screen names have been set`);
        this.trackingInstance.setAlternativeScreenName(alternativeScreenNames);
    }

    public setTrackingDisabledScreens(trackingDisabledScreens: string[]){
        this.logger.log(LoggerSdkLevel.development, `tracking disabled screens have been set`);
        this.trackingInstance.setTrackingDisabledScreens(trackingDisabledScreens);
    }

    public setRouteSeparator(newSeparator: String) {
        this.trackingInstance.setRouteSeparator(newSeparator);
    }

    public setMaskingColor(hexadecimalColor: string) {
        if (!this.isHexColor(hexadecimalColor)) {
            this.logger.log(LoggerSdkLevel.development, `invalid hex color: ${hexadecimalColor} hex color should be in the format #RRGGBB`);
            return;
        }

        this.logger.log(LoggerSdkLevel.customer, `setMaskColor: ${hexadecimalColor}`);
        return this.nativeModulesDxa.setMaskingColor(hexadecimalColor);
    }


    public sendDataOverWifiOnly(onlyWifi: boolean) {
        this.logger.log(LoggerSdkLevel.customer, `Send data over wifi only: ${onlyWifi}`);
        return this.nativeModulesDxa.sendDataOverWifiOnly(onlyWifi);
    }


    //Checks that the hex color is in the format #RRGGBB
    isHexColor(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;
        return hexColorRegex.test(hex);
    }
    public setImageQuality(quality: ImageQualityType) {
        this.logger.log(LoggerSdkLevel.customer, `Set image quality to: ${quality}`);
        return this.nativeModulesDxa.setImageQuality(quality.valueOf());
    }

}