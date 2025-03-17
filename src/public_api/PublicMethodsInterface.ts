
import type { ImageQualityType, MedalliaDxaCustomerConsentType } from "../publicEnums";
import { MedalliaDxaAutomaticMask } from "../index";

export interface PublicMethodsInterface {
    startScreen(screenName: string): Promise<boolean>;
    stopScreen(): Promise<boolean>;
    sendHttpError(errorCode: number): Promise<boolean>;
    sendError(error: string): Promise<boolean>;
    sendGoal(goalName: string, value?: number): Promise<boolean>;
    setDimensionWithString(dimensionName: string, stringValue: string): Promise<boolean>;
    setDimensionWithNumber(dimensionName: string, numberValue: number): Promise<boolean>;
    setDimensionWithBool(dimensionName: string, boolValue: boolean): Promise<boolean>;
    getSessionUrl(): Promise<string | null>;
    getSessionId(): Promise<string | null>;
    getWebViewProperties(): Promise<string | null>;
    setConsents(consents: MedalliaDxaCustomerConsentType): Promise<boolean>;
    enableAutoMasking(elementsToMask: MedalliaDxaAutomaticMask[]): Promise<boolean>;
    disableAutoMasking(elementsToUnmask: MedalliaDxaAutomaticMask[]): Promise<boolean>;
    setRetention(enabled: boolean): void;
    setAlternativeScreenNames(alternativeScreenNames: Map<string, string>): void;
    setTrackingDisabledScreens(trackingDisabledScreens: string[]): void;
    setRouteSeparator(newSeparator: string): void;
    setMaskingColor(hexadecimalColor: string): void;
    sendDataOverWifiOnly(onlyWifi: boolean): void;
    setImageQuality(quality: ImageQualityType): void;
}