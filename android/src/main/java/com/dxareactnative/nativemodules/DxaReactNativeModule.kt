package com.dxareactnative.nativemodules

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
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
    consents: Int,
    promise: Promise
  ) {
    DXA.getInstance(reactContext.applicationContext).run {
      dxa = this
      initialize(
        DXAConfig(
          accountId = accountId.toLong(),
          propertyId = propertyId.toLong(),
          customerConsent = translateConsentsToAndroid(consents),
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
      Log.e(
        "DXA-REACT-METHOD",
        "starting screen with name: $name but DXA is not initialized"
      )
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

  @ReactMethod
  fun sendHttpError(errorCode: Int, promise: Promise) {
    dxa.sendHttpError(errorCode)
    promise.resolve(true)
  }

  @ReactMethod
  fun sendGoal(goalName: String, promise: Promise) {
    dxa.sendGoal(goalName)
    promise.resolve(true)
  }

  @ReactMethod
  fun sendGoalWithValue(goalName: String, value: Double, promise: Promise) {
    dxa.sendGoal(goalName, value)
    promise.resolve(true)
  }

  @ReactMethod
  fun setDimensionWithString(dimensionName: String, stringValue: String, promise: Promise) {
    dxa.sendCustomDimension(dimensionName, stringValue)
    promise.resolve(true)
  }

  @ReactMethod
  fun setDimensionWithNumber(dimensionName: String, numberValue: Double, promise: Promise) {
    dxa.sendCustomDimension(dimensionName, numberValue)
    promise.resolve(true)
  }

  @ReactMethod
  fun setDimensionWithBool(dimensionName: String, boolValue: Boolean, promise: Promise) {
    dxa.sendCustomDimension(dimensionName, boolValue)
    promise.resolve(true)
  }

  @ReactMethod
  fun getWebViewProperties(promise: Promise) {
    promise.resolve(dxa.getWebViewParams())
  }

  @ReactMethod
  fun getSessionId(promise: Promise) {
    promise.resolve(dxa.getSessionId())
  }

  @ReactMethod
  fun getSessionUrl(promise: Promise) {
    promise.resolve(dxa.getSessionUrl())
  }

  @ReactMethod
  fun setConsents(consentLevel: Int) {
    dxa.setConsent(
      translateConsentsToAndroid(consentLevel)
    )
  }

  @ReactMethod
  fun setAutoMasking(elementsToMask: Int) {
    dxa.setAutoMasking(
      translateAutomaskingToAndroid(elementsToMask)
    )

  }

  @ReactMethod
  fun disableAllAutoMasking() {
    dxa.setAutoMasking(listOf(DXAConfigurationMask.NO_MASK))
  }

  private fun translateConsentsToAndroid(consents: Int): CustomerConsentType {
    return when (consents) {
      1 -> CustomerConsentType.ANALYTICS
      2 -> CustomerConsentType.ANALYTICS_AND_RECORDING
      else -> CustomerConsentType.NONE
    }
  }

  private fun translateAutomaskingToAndroid(elementsToMask: Int): List<DXAConfigurationMask> {


    return when (elementsToMask) {
      0 -> listOf(DXAConfigurationMask.EDIT_TEXT, DXAConfigurationMask.TEXT_VIEW, DXAConfigurationMask.IMAGE_VIEW, DXAConfigurationMask.WEB_VIEW)
      1 -> listOf(DXAConfigurationMask.EDIT_TEXT)
      2 -> listOf(DXAConfigurationMask.TEXT_VIEW)
      3 -> listOf(DXAConfigurationMask.IMAGE_VIEW)
      4 -> listOf(DXAConfigurationMask.WEB_VIEW)
      else ->
        listOf()
    }

  }

  companion object {
    const val NAME = "DxaReactNative"
  }
}

private class DxaReactNativeException(msg: String?) : Throwable(message = msg)
