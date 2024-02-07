// NativeBridge.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeBridge, NSObject)

RCT_EXTERN_METHOD(startMonitoring)
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}
@end

