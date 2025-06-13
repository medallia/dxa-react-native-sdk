import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "../publicEnums";
import type { MedalliaDxaAutomaticMask } from "../DxaMask";
import type { PublicMethodsInterface } from "./PublicMethodsInterface";

export class BlockedPublicMethods implements PublicMethodsInterface {

    public startScreen(_screenName: string): Promise<boolean> {
        return Promise.resolve(false);
    }
    public stopScreen(): Promise<boolean> {
        return Promise.resolve(false);

    }

    public sendHttpError(_errorCode: number): Promise<boolean> {
        return Promise.resolve(false);
    }

    public sendError(_error: string): Promise<boolean>  {
        return Promise.resolve(false);
    }
    public sendGoal(_goalName: string, _value?: number | undefined): Promise<boolean> {
        return Promise.resolve(false);

    }
    public setDimensionWithString(_dimensionName: string, _stringValue: string): Promise<boolean> {
        return Promise.resolve(false);

    }
    public setDimensionWithNumber(_dimensionName: string, _numberValue: number): Promise<boolean> {
        return Promise.resolve(false);

    }
    public setDimensionWithBool(_dimensionName: string, _boolValue: boolean): Promise<boolean> {
        return Promise.resolve(false);

    }
    public getSessionUrl(): Promise<string | null> {
        return Promise.resolve(null);

    }
    public getSessionId(): Promise<string | null> {
        return Promise.resolve(null);
    }
    public getWebViewProperties(): Promise<string | null> {
        return Promise.resolve(null);
    }
    public setConsents(_consents: MedalliaDxaCustomerConsentType): Promise<boolean> {
        return Promise.resolve(false);
    }
    public enableAutoMasking(_elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        return Promise.resolve(false);
    }
    public disableAutoMasking(_elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean> {
        return Promise.resolve(false);
    }
    public setRetention(_enabled: Boolean): void {
        return;
    }
    public setAlternativeScreenNames(_alternativeScreenNames: Map<string, string>): void {
        return;
    }
    public setTrackingDisabledScreens(_trackingDisabledScreens: string[]): void{
        return;
    }
    public setRouteSeparator(_newSeparator: String): void {
        return;
    }
    public setMaskingColor(_hexadecimalColor: string): void {
        return;
    }

    public sendDataOverWifiOnly(_onlyWifi: boolean) {
        return;
    }

    //Checks that the hex color is in the format #RRGGBB
    isHexColor(_hex: string): boolean {
        return false;
    }
    public setImageQuality(_quality: ImageQualityType): void {
        return;
    }

}