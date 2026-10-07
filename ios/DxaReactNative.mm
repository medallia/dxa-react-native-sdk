#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(DxaReactNative, RCTEventEmitter)

RCT_EXTERN_METHOD(
  initialize:(NSInteger)account 
  withProperty:(NSInteger)property
  withConsents:(float)consents
  withSdkVersion:(NSString)sdkVersion
  withMobileDataEnabled:(BOOL)mobileDataEnabled
  withEnhancedLogsEnabled:(BOOL)enhancedLogsEnabled
  withAutoMasking:(NSArray<NSNumber *> *)autoMasking
  callback:(RCTResponseSenderBlock)callback
)

RCT_EXTERN_METHOD(
  startScreen:(NSString)screenName
  withStartTime:(NSInteger)startTime
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  endScreen:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  sendHttpError:(float)errorCode
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  sendGoal:(NSString)goalName
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  sendGoalWithValue:(NSString)goalName
  withValue:(nonnull NSNumber *)value
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  sendError:(NSString)error
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  setDimensionWithString:(NSString)dimensionName
  withStringValue:(NSString)stringValue
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  setDimensionWithNumber:(NSString)dimensionName
  withNumberValue:(nonnull NSNumber *)numberValue
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  setDimensionWithBool:(NSString)dimensionName
  withBoolValue:(BOOL)boolValue
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  getSessionUrl:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  getSessionId:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  getWebViewProperties:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  setConsents:(float)consents
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  enableAutoMasking:(NSArray<NSNumber *> *)elementsToMask
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  disableAutoMasking:(NSArray<NSNumber *> *)elementsToUnmask
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  setRetention:(BOOL)enabled
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  setMaskingColor:(NSString)hexadecimalColor
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  setImageQuality:(NSInteger)imageQuality
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sendDataOverWifiOnly:(BOOL)onlyWifi
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  saveLogs:(NSString)log
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
