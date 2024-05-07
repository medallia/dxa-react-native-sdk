import MedalliaDXAReactNative
import Foundation
import React

@objc(DxaReactNative)
class DxaReactNative: RCTEventEmitter {
    
    private var hasListeners = false
    @objc override func supportedEvents() -> [String]! {
        return ["dxa-event"]
    }

    @objc override func startObserving() {
        hasListeners = true 
    }

    @objc override func stopObserving() {
        hasListeners = false 
    }

    func sendDxaEvent(withData data: [String: Any]) {
        if hasListeners { // Add this line
            sendEvent(withName: "dxa-event", body: data)
        }
    }

    @objc(initialize:withProperty:withConsents:withSdkVersion:callback:)
    func initialize(
        account: Int,
        property: Int,
        consents: Float,
        sdkVersion: String,
        callback:RCTResponseSenderBlock
    ) -> Void {
        let nativeConsents: Consent = translateConsentsToIos(flutterConsents: consents)
        let configuration = Configuration(
            account: String(account),
            property: String(property),
            consent: nativeConsents,
            manualScreenTracking: true
        )
        
      let liveConfig = DXA.initialize(configuration: configuration, multiplatform: Platform(type: .reactNative, version: String(describing: sdkVersion), language: "TypeScript"), dxaDelegate: self)
        var dictData = [String: Any]()
        
        dictData["dstDisableScreenTracking"] = liveConfig.disableScreenTracking
        dictData["daShowLocalLogs"] = liveConfig.showLocalLogs
        dictData["vcBlockedReactNativeSDKVersions"] = liveConfig.blockedRNSDKVersions
        dictData["vcBlockedReactNativeAppVersions"] = liveConfig.blockedRNAppVersions
        dictData["appVersion"] = DXA.appVersion
        callback([dictData])
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
    
    @objc(sendError:withResolver:withRejecter:)
    func sendError(
        error: String,
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) -> Void {
        DXA.sendError(error)
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
            resolve(sessionUrl);
            return
        }
    }
    
    @objc(getSessionId:withRejecter:)
    func getSessionId(
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) -> Void {
        let sessionId = DXA.sessionId
            resolve(sessionId);
            return
    }
    
    @objc(getWebViewProperties:withRejecter:)
    func getWebViewProperties(
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) -> Void {
        let webViewProperties = DXA.webViewProperties
            resolve(webViewProperties);
            return
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
    
    @objc(enableAutoMasking:withResolver:withRejecter:)
    func enableAutoMasking(
        elementsToMask: [Float],
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) {
        let transformedElements = elementsToMask.compactMap { element in
            return translateAutomaskingToIos(elementToMask: element)
        }
                
        DXA.enableAutoMasking(transformedElements)
    }
    
    @objc(disableAutoMasking:withResolver:withRejecter:)
    func disableAutoMasking(
        elementsToUnmask: [Float],
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) {
        let transformedElements = elementsToUnmask.compactMap { element in
            return translateAutomaskingToIos(elementToMask: element)
        }
        DXA.disableAutoMasking(transformedElements)
    }
    
    @objc(setRetention:withResolver:withRejecter:)
    func setRetention(
        enabled: Bool,
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) {
        DXA.setRetention(enabled)
    }
    
    @objc(setMaskingColor:withResolver:withRejecter:)
    func setMaskingColor(
        hexadecimalColor: String,
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) -> Void {
        let UIC = hexStringToUIColor(hex:hexadecimalColor)
        DXA.setMaskingColor(UIC)
        resolve(true)
    }
    
    @objc(setImageQuality:withResolver:withRejecter:)
    func setMaskingColor(
        imageQuality: Int,
        resolve:RCTPromiseResolveBlock,
        reject:RCTPromiseRejectBlock
    ) -> Void {
        DXA.setImageQuality(ImageQualityType(rawValue: imageQuality) ?? .average)
        resolve(true)
    }
    
    private func translateConsentsToIos(flutterConsents value: Float) -> Consent{
        var nativeConsent: Consent
        
        switch value {
        case 0:
            nativeConsent = .none
        case 1:
            nativeConsent = .analytics
        case 2:
            nativeConsent = .analyticsAndRecording
        default:
            nativeConsent = .none
        }
        return nativeConsent
    }
    
    private func translateAutomaskingToIos(elementToMask value: Float) -> MaskAutomatic?{
        
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
    
    func hexStringToUIColor (hex:String) -> UIColor {
        var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        if (cString.hasPrefix("#")) {
            cString.remove(at: cString.startIndex)
        }
        
        if ((cString.count) != 6) {
            return UIColor.gray
        }
        
        var rgbValue:UInt64 = 0
        Scanner(string: cString).scanHexInt64(&rgbValue)
        
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }
    
}

extension DxaReactNative : DXADelegate {
    func performance(_ data: MedalliaDXAReactNative.PerformanceMultiplatform) {
        
    }
    
    public func sampling(_ sampling: MedalliaDXAReactNative.SamplingMultiplatform) {

        do {
            var dictData = [String: Any]()
            dictData["stopTrackingDueToSampling"] = !sampling.stopTrackingDueToSampling
            dictData["stopRecordingDueToSampling"] = !sampling.stopRecordingDueToSampling
            dictData["eventType"] = "sampling_data"
            // let dictId: [String: Any] = ["sampling_data": dictData]
            // let jsonData = try JSONSerialization.data(withJSONObject: dictId, options: [.prettyPrinted, .sortedKeys])
            // let jsonString = String(data: jsonData, encoding: .utf8)!
            
            DispatchQueue.main.async {
                self.sendEvent(withName: "dxa-event", body: dictData)
            }
        } catch {
            print("Sampling data JSON serialization error: \(error)")
        }
    }
    
    public func liveConfig(_ configuration: MedalliaDXAReactNative.LiveConfigurationMultiplatform) {
        
        do {
            var dictData = [String: Any]()
            dictData["disableScreenTracking"] = configuration.disableScreenTracking
            dictData["showLocalLogs"] = configuration.showLocalLogs
            dictData["vcBlockedReactNativeSDKVersions"] = configuration.blockedRNSDKVersions
            dictData["vcBlockedReactNativeAppVersions"] = configuration.blockedRNAppVersions
            dictData["appVersion"] = DXA.appVersion
            dictData["eventType"] = "live_configuration"

            // let dictId: [String: Any] = ["live_configuration": dictData]
            // let jsonData = try JSONSerialization.data(withJSONObject: dictId, options: [.prettyPrinted, .sortedKeys])
            // let jsonString = String(data: jsonData, encoding: .utf8)!
            DispatchQueue.main.async {
                self.sendEvent(withName: "dxa-event", body: dictData)
            }
        
        } catch {
            print("Live Config JSON serialization error: \(error)")
        }
    }
}
