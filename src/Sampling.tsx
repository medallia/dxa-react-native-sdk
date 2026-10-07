import { injector } from "./util/DependencyInjector";
import { DxaLogger, LoggerSdkLevel } from "./util/DxaLog";

export class SamplingData {
    eventType: string = "sampling_data";
    private _stopTrackingDueToSampling: boolean = false;
    private get logger(): DxaLogger { return injector.resolve('DxaLogger')}


    stopTrackingDueToSampling(): boolean {
        return this._stopTrackingDueToSampling;
    }

    fillfromNative(data: any): void {
        this.logger.log(LoggerSdkLevel.development,`Sampling data from native: ${data.stopTrackingDueToSampling}, ${data.stopRecordingDueToSampling}`);
        this._stopTrackingDueToSampling = data.stopTrackingDueToSampling;
    }
}

