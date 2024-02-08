// NativeBridge.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NativeBridge, NSObject)

RCT_EXTERN_METHOD(crashApp)
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}
@end

