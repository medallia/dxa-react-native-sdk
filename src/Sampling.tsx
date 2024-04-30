import { dxaLog } from "dxa-react-native";

class SamplingData {
    eventType: string = "sampling_data";
    private _stopTrackingDueToSampling: boolean = false;
    private _stopRecordingDueToSampling: boolean = false;

    fillfromNative(data: any): void {
        dxaLog.log("Sampling data from native: ", data);
        this._stopTrackingDueToSampling = data.stopTrackingDueToSampling;
        this._stopRecordingDueToSampling = data.stopRecordingDueToSampling;

        // this.runTasksAfterUpdate();

    }
}

const samplingDataInstance = new SamplingData();
export { samplingDataInstance } 