import { core } from "./Core";
import { LoggerSdkLevel } from "./util/DxaLog";

export class SamplingData {
    eventType: string = "sampling_data";
    private _stopTrackingDueToSampling: boolean = false;
    private _stopRecordingDueToSampling: boolean = false;


    stopTrackingDueToSampling(): boolean {
        return this._stopTrackingDueToSampling;
    }

    fillfromNative(data: any): void {
        core.dxaLogInstance.log(LoggerSdkLevel.development,`Sampling data from native: ${data.stopTrackingDueToSampling}, ${data.stopRecordingDueToSampling}`);
        this._stopTrackingDueToSampling = data.stopTrackingDueToSampling;
        this._stopRecordingDueToSampling = data.stopRecordingDueToSampling;
    }
}

