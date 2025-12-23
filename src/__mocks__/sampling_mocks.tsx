

export interface MockSamplingData {
    stopTrackingDueToSampling: jest.Mock;
}

export const getMockSamplingData = (): MockSamplingData => ({
    stopTrackingDueToSampling: jest.fn().mockReturnValue(false),
    
});
