import { DxaReactNative } from "dxa-react-native";
import type { NativeModulesStatic } from "react-native";
import { sdkBlockerIstance } from "../live_config/SdkBlocker";
import { SdkMetaData } from "./MetaData";

enum LoggerSdkLevel {
  public,
  customer,
  qa,
  development,
}


interface LoggerSdkLevelLogic {
  getLevel(): LoggerSdkLevel;
  setShowLocalLogs(enable: boolean): void;
  setEnhancedLogs(enable: boolean): void;
}

class LoggerSdkLevelDevelopment implements LoggerSdkLevelLogic {
  getLevel(): LoggerSdkLevel {
    return LoggerSdkLevel.development;
  }

  setEnhancedLogs(_enable: boolean): void {
    // In development mode, we don't need to set enhanced logs
    return;
  }

  setShowLocalLogs(_enable: boolean): void {
    // In development mode, we don't need to set show local logs
    return;
  }
}

class LoggerSdkLevelRelease implements LoggerSdkLevelLogic {
  private _loggerSdkLevel: LoggerSdkLevel = LoggerSdkLevel.public;
  private _enhancedLogs: boolean = false;
  private _showLocalLogs: boolean = false;

  getLevel(): LoggerSdkLevel {
    return this._loggerSdkLevel;
  }

  setEnhancedLogs(enable: boolean): void {
    this._enhancedLogs = enable;
    if (this._showLocalLogs) return;
    if (this._enhancedLogs) {
      this._loggerSdkLevel = LoggerSdkLevel.customer;
    } else {
      this._loggerSdkLevel = LoggerSdkLevel.public;
    }
  }

  setShowLocalLogs(enable: boolean): void {
    this._showLocalLogs = enable;
    if (this._showLocalLogs) {
      this._loggerSdkLevel = LoggerSdkLevel.development;
    } else {
      this.setEnhancedLogs(this._enhancedLogs);
    }
  }
}


class DxaLogger {
  private plainLogger: PlainLogger;
  private enabled: boolean = true;
  private allowLocalLogs: boolean = false;
  private dxaNativeModule: NativeModulesStatic;
  private loggerSdkLevelLogic: LoggerSdkLevelLogic;

  constructor(
    isSdkRunning: () => boolean,
    nativeModule: NativeModulesStatic,
  ) {
    this.dxaNativeModule = nativeModule;
    this.plainLogger = new PlainLogger(() => this.enabled, isSdkRunning, (message: string) => {
      if (this.allowLocalLogs) this.dxaNativeModule.saveLogs(`react-native: ${message}`);
    } 
    );
    this.loggerSdkLevelLogic = SdkMetaData.releaseMode ? new LoggerSdkLevelRelease() : new LoggerSdkLevelDevelopment();
  }
  get _loggerSdkLevel(): LoggerSdkLevel {
    return this.loggerSdkLevelLogic.getLevel();
  }

  setShowLocalLogs(enable: boolean) {
    this.loggerSdkLevelLogic.setShowLocalLogs(enable);
  }
  setEnhancedLogs(enable: boolean) {
    this.loggerSdkLevelLogic.setEnhancedLogs(enable);
  }

  setAllowLocalLogs(enable: boolean) {
    this.allowLocalLogs = enable;
  }

  log(messageLevel: LoggerSdkLevel, message: String, emoji?: String) {
    let finalMessage: String = message;
    if (emoji != undefined && this._loggerSdkLevel >= LoggerSdkLevel.qa) {
      finalMessage = `${emoji} ${finalMessage}`;
    }
    if (messageLevel <= this._loggerSdkLevel) {
      this.plainLogger.log(finalMessage);
    }
  }
}

class PlainLogger {
  //create the constructor
  constructor(enabled: () => boolean, isSdkRunning: () => boolean, loggedMessageCallback: (message: string) => void) {
    this.enabled = enabled;
    this.isSdkRunning = isSdkRunning;
    this.loggedMessageCallback = loggedMessageCallback;
  }
  enabled: () => boolean;
  isSdkRunning: () => boolean;
  loggedMessageCallback: (message: string) => void;

  log(...message: any[]) {
    let isoString = new Date().toISOString();
    let loggedMessage = `<MedalliaDXA - ${isoString}> ${message}`;
    this.loggedMessageCallback(loggedMessage);
    console.log(loggedMessage);
  }
}
const dxaLog = new DxaLogger(() => !sdkBlockerIstance.isSdkBlocked, DxaReactNative);
export { dxaLog, LoggerSdkLevel };