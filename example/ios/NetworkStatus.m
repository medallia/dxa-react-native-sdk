// NetworkStatus.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NetworkStatus, NSObject)

RCT_EXTERN_METHOD(startMonitoring)
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}
@end

