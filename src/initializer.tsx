import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { DependenciesManager } from './DependenciesManager';
import { DxaConfig } from './index';
import { SdkMetaData } from './util/MetaData';
import { DxaLogger, LoggerSdkLevel } from './util/DxaLog';
import type { LiveConfigData } from './live_config/LiveConfigData';
import type { SamplingData } from './Sampling';
import type { SdkBlocker } from './live_config/SdkBlocker';


const LINKING_ERROR =
  `The package 'dxa-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NativeModulesDxa = NativeModules.DxaReactNative
  ? NativeModules.DxaReactNative
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export class Initializer {
    private static instance: Initializer;
    public initialized: boolean = false;
    private dependenciesManager: DependenciesManager;
    private logger: DxaLogger | undefined;
    get dependenciesLoadded(): boolean {return this.dependenciesManager?.dependenciesLoadded ?? false;}
   
    private constructor(dependencies: DependenciesManager) {
        this.dependenciesManager = dependencies;
    }

    public static getInstance(): Initializer {

        if (!Initializer.instance) {
            Initializer.instance = new Initializer(new DependenciesManager());
        }
        return Initializer.instance;
    }

    // Constructor to allow mocking dependenciesManager
    public static createForTesting(dependencies: DependenciesManager): Initializer {

        return Initializer.instance = new  Initializer(dependencies);
    }


    async initialize(dxaConfig: DxaConfig, navigationRef: any): Promise<void> {
        if (this.initialized) {
            this.logger?.log(
                LoggerSdkLevel.public,
                'SDK has already been initialized',
            );
            return;
        }
  
 
        let sdkVersion = SdkMetaData.sdkVersion;

       

        const [liveConfigData, samplingData, sdkBlocker, dxaLogger] =  this.dependenciesManager.initializeModulesNeededForNativeInit(dxaConfig, navigationRef, NativeModulesDxa);
        this.logger = dxaLogger;
        dxaLogger.setEnhancedLogs(dxaConfig.enhancedLogsEnabled);
        this.setUpNativeListeners(sdkBlocker, liveConfigData, samplingData);

        try {
            await new Promise((resolve) => {
                NativeModulesDxa.initialize(
                    dxaConfig.accountId,
                    dxaConfig.propertyId,
                    dxaConfig.consents,
                    sdkVersion,
                    dxaConfig.mobileDataEnabled,
                    dxaConfig.enhancedLogsEnabled,
                    dxaConfig.autoMasking,
                    (callbackResult: any) => {
                        dxaLogger.log(LoggerSdkLevel.public, `MedalliaDXA initialized`);
                        dxaLogger.log(LoggerSdkLevel.customer, `MedalliaDXA initialized with account id: ${dxaConfig.accountId} and property id: ${dxaConfig.propertyId}. Consents: ${dxaConfig.consents}. Mobile data enabled: ${dxaConfig.mobileDataEnabled}. ManualTracking: ${dxaConfig.manualTracking}.`);
                        liveConfigData.fillfromNative(callbackResult);
                        this.initialized = true;
                        resolve(true);
                    }
                );
            });

        } catch (error) {
            this.logger.log(LoggerSdkLevel.public, `MedalliaDXA failed to initialize ${error}`);
            return;
        }

        this.initialized = true;
        if (sdkBlocker.isSdkBlocked) {
          return;
        }
        this.dependenciesManager.initializePostInitializeModules();
    }


    private setUpNativeListeners(sdkBlocker: SdkBlocker, liveConfig: LiveConfigData, sampling: SamplingData): void {

        const eventEmitter = new NativeEventEmitter(NativeModulesDxa);
        eventEmitter.addListener('dxa-event', event => {
            if (sdkBlocker.isSdkBlocked && event.eventType != liveConfig.eventType) {
                return;
            }
            switch (event.eventType) {
                case liveConfig.eventType:
                    liveConfig.fillfromNative(event);
                    break;
                case sampling.eventType:
                    sampling.fillfromNative(event);
                    break;
                default:
                    break;
            }
        });

    }

}