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
}

class DxaMaskView: UIView {
 
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
 
  required init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
    setupView()
  }
 
  private func setupView() {
  }
 
 }

@objc (DxaMaskManager)
class DxaMaskManager: RCTViewManager {
 
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
 
  override func view() -> UIView! {
    let myCustomView = DxaMaskView()
    myCustomView.dxaMasking = .mask
    return myCustomView
  }
 
}
