package com.dxareactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
//import com.decibel.builder.dev.Decibel
//import com.decibel.common.internal.models.Customer
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

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a - b)
  }

  @ReactMethod
  fun initialize(
    accountId: Int,
    propertyId: Int,
    mobileDataEnabled: Boolean,
    manualTrackingEnabled: Boolean,
    promise: Promise
  ) {
    DXA.getInstance(reactContext.getApplicationContext()).run {
      initialize(
        DXAConfig(
          accountId = accountId.toLong(),
          propertyId = propertyId.toLong(),
          customerConsent = CustomerConsentType.ANALYTICS_AND_RECORDING,
          mobileDataEnabled = mobileDataEnabled,
          manualTrackingEnabled = manualTrackingEnabled,
        )
      )
      setAutoMasking(listOf(DXAConfigurationMask.TEXT_VIEW))
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun startScreen(name: String, promise: Promise) {
    if (!::dxa.isInitialized) {
      promise.resolve(false)
      return
    }
    dxa.startNewScreen(name)
    promise.resolve(true)
  }

  @ReactMethod
  fun endScreen(promise: Promise) {
    if (!::dxa.isInitialized) {
      promise.resolve(false)
      return
    }
    dxa.stopScreen()
    promise.resolve(true)
  }

  companion object {
    const val NAME = "DxaReactNative"
  }
}
