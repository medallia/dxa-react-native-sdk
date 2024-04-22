import { Tracking } from "../Tracking";

interface MockDxaNativeModule {
    startScreen: jest.Mock;
    endScreen: jest.Mock;

}
const mockDxaNativeModule: MockDxaNativeModule = {
    startScreen: jest.fn(() => Promise.resolve(true)),
    endScreen: jest.fn(() => Promise.resolve(true)),
};

var tracking: Tracking;
beforeEach(() => {
    tracking = Tracking.getInstance({ dxaNativeModule: mockDxaNativeModule, manualTracking: true });
});
describe('Tracking test', () => {
    describe('startScreen', () => {
        it(`WHEN Calling start screen with a screenName
        THEN the start screen method from the native module is called with said screenName
        AND a promise is resolved as true`, async () => {

            const tracking = Tracking.getInstance({ dxaNativeModule: mockDxaNativeModule, manualTracking: true });
            const screenName = 'Home';

            const result = await tracking.startScreen(screenName);

            expect(result).toBe(true);
            expect(mockDxaNativeModule.startScreen).toHaveBeenCalledWith(screenName);
        });
        it(`WHEN Calling start screen with a screenName
        AND an alternative screen name is set
        THEN the start screen method from the native module is called with the alternative name
        AND a promise is resolved as true`, async () => {
            const tracking = Tracking.getInstance({ dxaNativeModule: mockDxaNativeModule, manualTracking: true });
            const screenName = 'Home';
            const alternativeScreenName = 'AlternativeHome';
            tracking.setAlternativeScreenName(new Map([[screenName, alternativeScreenName]]));

            const result = await tracking.startScreen(screenName);

            expect(result).toBe(true);
            expect(mockDxaNativeModule.startScreen).toHaveBeenCalledWith(alternativeScreenName);
        });

    });
    describe('stopScreen', () => {
        it(`WHEN tracking stop screen is called
        THEN end screen method of the native module is called `, async () => {

            const tracking = Tracking.getInstance({ dxaNativeModule: mockDxaNativeModule, manualTracking: true });

            const result = await tracking.stopScreen();

            expect(result).toBe(true);
            expect(mockDxaNativeModule.endScreen).toHaveBeenCalled();
        });


    });
});
