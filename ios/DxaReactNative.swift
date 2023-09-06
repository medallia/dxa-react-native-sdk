@objc(DxaReactNative)
class DxaReactNative: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }

  @objc(initialize:withProperty:withResolver:withRejecter:)
  func initialize(account: Float, property: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    // let configuration = Configuration(
    //             account: "10010",
    //             property: "250441",
    //             consent: userConsent?.consent ?? .recordingAndTracking
    //         )
            
    //         configuration.endpoint = .sigma
    //         configuration.logLevel = .developer
            
    //         DXA.initialize(configuration)
    resolve(true)
  }
}
