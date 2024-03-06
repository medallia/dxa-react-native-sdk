import MedalliaDXA

@objc(DxaReactNative)
class DxaReactNative: NSObject {

  @objc(initialize:withProperty:withConsents:withResolver:withRejecter:)
  func initialize(
    account: Int, 
    property: Int, 
    consents: Float, 
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) -> Void {
    let nativeConsents: Consent = translateConsentsToIos(flutterConsents: consents)
    let configuration = Configuration(
      account: String(account),
      property: String(property),
      consent: nativeConsents,
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

  @objc(endScreen:withRejecter:)
  func endScreen(
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
    resolve:@escaping RCTPromiseResolveBlock,
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
  @objc(setConsents:withResolver:withRejecter:)
  func setConsents(
    consents: Float,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) {
    var nativeConsents: Consent
   
    nativeConsents = translateConsentsToIos(flutterConsents: consents)
    DXA.setConsent(nativeConsents)
    
  }

  @objc(setAutoMasking:withResolver:withRejecter:)
  func setAutoMasking(
    elementsToMask: Float,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) {
    guard let nativeElementsToMask = translateAutomaskingToIos(elementsToMask: elementsToMask) else { return }
    DXA.setAutomaticMask(nativeElementsToMask)
  }

  @objc(disableAllAutoMasking:withRejecter:)
  func disableAllAutoMasking(
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) {
    DXA.setAutomaticMask(.noMask)
  }

  @objc(setRetention:withResolver:withRejecter:)
  func setRetention(
    enabled: Bool,
    resolve:RCTPromiseResolveBlock,
    reject:RCTPromiseRejectBlock
  ) {
      DXA.setRetention(enabled)
  }

  private func translateConsentsToIos(flutterConsents value: Float) -> Consent{
    var nativeConsent: Consent
        
    switch value {
      case 0:
        nativeConsent = .noConsent
      case 1:
        nativeConsent = .tracking
      case 2:
        nativeConsent = .recordingAndTracking
      default:
        nativeConsent = .noConsent
      }
      return nativeConsent    
    }

  private func translateAutomaskingToIos(elementsToMask value: Float) -> MaskAutomatic?{

      switch value {
      case 0:
        return .all
      case 1:
        return .inputs
      case 2:
        return .labels
      case 3:
        return .images
      case 4:
        return .webViews
      default:
        return nil      
      }


    }
}
