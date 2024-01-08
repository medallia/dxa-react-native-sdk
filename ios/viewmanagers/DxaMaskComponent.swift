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
