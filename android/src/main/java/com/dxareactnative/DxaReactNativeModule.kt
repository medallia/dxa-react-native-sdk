package com.dxareactnative

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.medallia.dxa.builder.prod.DXA
import com.medallia.dxa.buildercommon.MedalliaDXA
import com.medallia.dxa.common.enums.CustomerConsentType
import com.medallia.dxa.common.enums.DXAConfigurationMask
import com.medallia.dxa.common.internal.models.DXAConfig

class DxaReactNativeModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private lateinit var dxa: MedalliaDXA

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun initialize(
    accountId: Int,
    propertyId: Int,
    promise: Promise
  ) {
    DXA.getInstance(reactContext.applicationContext).run {
      dxa = this
      initialize(
        DXAConfig(
          accountId = accountId.toLong(),
          propertyId = propertyId.toLong(),
          customerConsent = CustomerConsentType.ANALYTICS_AND_RECORDING,
          mobileDataEnabled = true,
          manualTrackingEnabled = true,
        )
      )
      setAutoMasking(listOf(DXAConfigurationMask.NO_MASK))
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun startScreen(name: String, promise: Promise) {
    Log.i("DXA-REACT-METHOD", "starting screen with name: $name")
    if (!::dxa.isInitialized) {
      promise.reject(
        DxaReactNativeException("starting screen with name: $name but DXA is not initialized")
      )
      Log.e("DXA-REACT-METHOD", "starting screen with name: $name but DXA is not initialized")
      return
    }
    dxa.startNewScreen(name)
    promise.resolve(true)
  }

  @ReactMethod
  fun endScreen(promise: Promise) {
    Log.i("DXA-REACT-METHOD", "stopping screen.")
    if (!::dxa.isInitialized) {
      promise.reject(
        DxaReactNativeException("stopping screen but DXA is not initialized")
      )
      Log.e("DXA-REACT-METHOD", "stopping screen but DXA is not initialized")
      return
    }
    dxa.stopScreen()
    promise.resolve(true)
  }

  companion object {
    const val NAME = "DxaReactNative"
  }
}

private class DxaReactNativeException(msg: String?): Throwable(message = msg)
