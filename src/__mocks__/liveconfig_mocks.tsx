export interface MockLiveConfigData {
    disableScreenTracking: jest.Mock;
}

export const getMockLiveConfigData = (): MockLiveConfigData => ({
    disableScreenTracking: jest.fn().mockReturnValue([]),
});