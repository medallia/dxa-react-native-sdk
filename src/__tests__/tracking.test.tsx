import { DxaConfig, MedalliaDxaCustomerConsentType } from "../index";
import { DependenciesManager } from "../DependenciesManager";
import { Initializer } from "../initializer";
import { Tracking } from "../Tracking";
import { injector } from "../util/DependencyInjector";
import { getMockNativeModulesStatic, getMockNavigationRef, getMockReactNavigation, type MockNativeModulesStatic, type MockNavigationRef, type MockReactNavigation } from "../__mocks__/tracking_mocks";
import { getMockSamplingData, type MockSamplingData } from "../__mocks__/sampling_mocks";
import { type MockLiveConfigData, getMockLiveConfigData } from "../__mocks__/liveconfig_mocks";

var tracking: Tracking;

var mockNavigationRef: MockNavigationRef;
var mockNativeModulesStatic: MockNativeModulesStatic;
var mockReactNavigation: MockReactNavigation;
var mockSamplingData: MockSamplingData;
var mockLiveConfigData: MockLiveConfigData;

beforeAll(() => {
    var dependenciesManager = new DependenciesManager();
    Initializer.createForTesting(dependenciesManager);
    var dxaConfig = new DxaConfig(
        10010,
        250441,
        MedalliaDxaCustomerConsentType.analyticsAndRecording,
        false,
        true,
        false,
        [],
    )
    mockNavigationRef = getMockNavigationRef();
    mockNativeModulesStatic = getMockNativeModulesStatic();
    mockReactNavigation = getMockReactNavigation();
    mockSamplingData = getMockSamplingData();
    mockLiveConfigData = getMockLiveConfigData();
    dependenciesManager.initializeModulesNeededForNativeInit(dxaConfig, mockNavigationRef, mockNativeModulesStatic);
    injector.register('ReactNavigation', mockReactNavigation);
    injector.register('SamplingData', mockSamplingData);
    injector.register('LiveConfigData', mockLiveConfigData);
    dependenciesManager.initializePostInitializeModules();
    tracking = injector.resolve('Tracking');
});
beforeEach(() => {
    jest.clearAllMocks();
    mockSamplingData.stopTrackingDueToSampling.mockReturnValue(false);
    mockLiveConfigData.disableScreenTracking.mockReturnValue([]);
});
describe('Tracking test', () => {

    describe('startScreen', () => {

        it(`WHEN Calling start screen with a screenName
        THEN the start screen method from the native module is called with the screen name`, async () => {
            //reset the mock to clear the automatic first start screen call
            mockNativeModulesStatic.startScreen.mockClear();
            const screenName = 'Home';

            const result = await tracking.startScreen(screenName);

            expect(result).toBe(true);
            expect(mockNativeModulesStatic.startScreen).toHaveBeenCalledWith(screenName, expect.anything());
        });
        it(`WHEN Calling start screen with a screenName
        AND an alternative screen name is set
        THEN the start screen method from the native module is called with the alternative name
        AND a promise is resolved as true`, async () => {

            const screenNameToBeReplaced = 'screenNameToBeReplaced';
            const alternativeScreenName = 'AlternativeHome';
            tracking.setAlternativeScreenName(new Map([[screenNameToBeReplaced, alternativeScreenName]]));

            const result = await tracking.startScreen(screenNameToBeReplaced);

            expect(result).toBe(true);
            expect(mockNativeModulesStatic.startScreen).toHaveBeenCalledWith(alternativeScreenName, expect.anything());
        });
        it(`WHEN the consents for tracking are disabled due to sampling
        AND start screen is called
        THEN start screen is never called on the native module`, async () => {

            mockSamplingData.stopTrackingDueToSampling.mockReturnValue(true);
            const screenName = 'Home';


            const result = await tracking.startScreen(screenName);

            expect(result).toBe(false);
            expect(mockNativeModulesStatic.startScreen).toBeCalledTimes(0);
        });
        it(`WHEN the consents for tracking are disabled for a named screen due to live config
        AND start that screen is called
        THEN start screen is never called on the native module`, async () => {

            const screenName = 'Home';
            mockLiveConfigData.disableScreenTracking.mockReturnValue(['Home']);

            const result = await tracking.startScreen(screenName);

            expect(result).toBe(false);
            expect(mockNativeModulesStatic.startScreen).toBeCalledTimes(0);
        });
        it(`WHEN a screen name has been set to be disabled for tracking
        AND start that screen is called
        THEN start screen is never called on the native module`, async () => {

            const screenNameForDisabledTracking = 'screenNameForDisabledTracking';

            tracking.setTrackingDisabledScreens([screenNameForDisabledTracking]);
            const result = await tracking.startScreen(screenNameForDisabledTracking);

            expect(result).toBe(false);
            expect(mockNativeModulesStatic.startScreen).toBeCalledTimes(0);
        });

    });
    describe('stopScreen', () => {
        it(`WHEN tracking stop screen is called
        THEN end screen method of the native module is called `, async () => {

            const result = await tracking.stopScreen();

            expect(result).toBe(true);
            expect(mockNativeModulesStatic.endScreen).toHaveBeenCalled();
        });


    });
});
