#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DxaReactNative, NSObject)

RCT_EXTERN_METHOD(
  initialize:(float)account 
  withProperty:(float)property
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  startScreen:(NSString)screenName
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

RCT_EXTERN_METHOD(
  endScreen:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
) 

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
