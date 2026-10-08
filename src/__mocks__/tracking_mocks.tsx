export interface MockNativeModulesStatic {
    startScreen: jest.Mock;
    endScreen: jest.Mock;
}

export const getMockNativeModulesStatic = (): MockNativeModulesStatic => ({
    startScreen: jest.fn(() => Promise.resolve(true)),
    endScreen: jest.fn(() => Promise.resolve(true)),
});

export interface MockNavigationRef {
    getRootState: jest.Mock;
    addListener: jest.Mock;
}


export const getMockNavigationRef = (): MockNavigationRef => ({
    getRootState: jest.fn(),
    addListener: jest.fn(),
});

export interface MockReactNavigation {
    getScreenName: jest.Mock;
    startScreenListener: jest.Mock;
}

const firstScreenName = 'FirstScreen';

export const getMockReactNavigation = (): MockReactNavigation => ({
    getScreenName: jest.fn(() => firstScreenName),
    startScreenListener: jest.fn(),
});