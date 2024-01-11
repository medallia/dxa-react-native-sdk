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

  @objc(setDimensionWithString:withStringValue:withResolver:withRejecter:)      
  func setDimensionWithString(
    dimensionName: String,
    stringValue: String,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
      DXA.send(dimension: dimensionName, value: stringValue)
      resolve(true)
  }
    
  @objc(setDimensionWithNumber:withNumberValue:withResolver:withRejecter:)      
  func setDimensionWithNumber(
    dimensionName: String,
    numberValue: NSNumber,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
      DXA.send(dimension: dimensionName, value: numberValue.doubleValue)
      resolve(true)
  }
    
  @objc(setDimensionWithBool:withBoolValue:withResolver:withRejecter:)      
  func sendDimensionWithBool(
    dimensionName: String,
    boolValue: Bool,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
      DXA.send(dimension: dimensionName, value: boolValue)
      resolve(true)
  }

  @objc(getSessionUrl:withRejecter:)
  func getSessionUrl(
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
      DXA.sessionURL = {sessionUrl in
      if sessionUrl != nil {
        resolve(sessionUrl);
        return
      }
    }
  }

  @objc(getSessionId:withRejecter:)
  func getSessionId(
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    let sessionId = DXA.sessionId
    if sessionId != nil {
        resolve(sessionId);
        return
    }
  }
  
  @objc(getWebViewProperties:withRejecter:)
  func getWebViewProperties(
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    let webViewProperties = DXA.webViewProperties
    if webViewProperties != nil {
        resolve(webViewProperties);
        return
    }
  }
}
