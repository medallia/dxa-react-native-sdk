@objc(DxaReactNative)
class DxaReactNative: NSObject {

  @objc(initialize:withProperty:withResolver:withRejecter:)
  func initialize(
    account: Float, 
    property: Float, 
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    let configuration = Configuration(
      account: String(account),
      property: String(property),
      manualScreenTracking: true
    )
    // TODO: Delete in release
    configuration.endpoint = .sigma
    configuration.logLevel = .developer         

    DXA.initialize(configuration)
    resolve(true)
  }

  @objc(startScreen:withResolver:withRejecter:)
  func startScreen(
    screenName: String,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    DXA.startNewScreen(name: screenName)
    resolve(true)
  }

  @objc(stopScreen:withRejecter:)
  func stopScreen(
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    DXA.stopScreen()
    resolve(true)
  }

  @objc(sendHttpError:withResolver:withRejecter:)
  func sendHTTPError(
    errorCode: Float,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    DXA.sendHTTPError(statusCode: Int(errorCode))
    resolve(true)
  }

  @objc(sendGoalWithValue:withValue:withResolver:withRejecter:)
  func sendGoalWithValue(
    goalName: String,
    value: NSNumber,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    DXA.send(goal: goalName, with: value.floatValue)
    resolve(true)
  }
  @objc(sendGoal:withResolver:withRejecter:)
  func sendGoal(
    goalName: String, 
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    DXA.send(goal: goalName)
    resolve(true)
  }
}
