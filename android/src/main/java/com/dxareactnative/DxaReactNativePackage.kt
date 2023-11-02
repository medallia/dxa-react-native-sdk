package com.dxareactnative

import com.dxareactnative.nativemodules.DxaReactNativeModule
import com.dxareactnative.viewmanagers.DxaMaskViewManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class DxaReactNativePackage : ReactPackage {

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(
      DxaReactNativeModule(reactContext)
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(
      DxaMaskViewManager()
    )
  }
}
