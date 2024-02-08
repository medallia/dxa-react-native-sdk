import Foundation
import React

@objc(NativeBridge)
class NativeBridge: NSObject {

  @objc
  func crashApp() {
    [][1]
  }
}

