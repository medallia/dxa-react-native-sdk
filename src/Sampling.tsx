import { LoggerSdkLevel, dxaLog } from "./util/DxaLog";

class SamplingData {
    eventType: string = "sampling_data";
    stopTrackingDueToSampling: boolean = false;
    private _stopRecordingDueToSampling: boolean = false;

    fillfromNative(data: any): void {
        dxaLog.log(LoggerSdkLevel.development,`Sampling data from native: ${data.stopTrackingDueToSampling}, ${data.stopRecordingDueToSampling}`);
        this.stopTrackingDueToSampling = data.stopTrackingDueToSampling;
        this._stopRecordingDueToSampling = data.stopRecordingDueToSampling;

        // this.runTasksAfterUpdate();

    }
}

const samplingDataInstance = new SamplingData();
export { samplingDataInstance } 