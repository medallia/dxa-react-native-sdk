class DxaUnmaskView: UIView {
    
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
    
    override func didMoveToWindow() {
        super.didMoveToWindow()
        recursiveUnmasking(view: self)
    }
    
    func recursiveUnmasking(view: UIView) {
        view.subviews.forEach { (view) in
            view.dxaMasking = .unmask
            recursiveUnmasking(view: view)
        }
    }
}

@objc (DxaUnmaskManager)
class DxaUnmaskManager: RCTViewManager {
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView {
        let myCustomView = DxaUnmaskView()
        return myCustomView
    }
}
