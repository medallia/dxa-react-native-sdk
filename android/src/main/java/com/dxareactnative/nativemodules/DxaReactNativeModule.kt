package com.dxareactnative.nativemodules

import SdkConfigInfo
import android.util.Log
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.medallia.dxa.DXA
import com.medallia.dxa.buildercommon.MedalliaDXA
import com.medallia.dxa.common.enums.CustomerConsentType
import com.medallia.dxa.common.enums.DXAConfigurationMask
import com.medallia.dxa.common.enums.PlatformType
import com.medallia.dxa.common.internal.logic.providers.AppVersionProvider
import com.medallia.dxa.common.internal.models.DXAConfig
import com.medallia.dxa.common.internal.models.ImageQualityLevel
import com.medallia.dxa.common.internal.models.Multiplatform
import com.medallia.dxa.common.internal.models.SdkConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class DxaReactNativeModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private lateinit var dxa: MedalliaDXA

  private val binderScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
  private var lastConfig: SdkConfig? = null

  override fun getName(): String {
    return NAME
  }
  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
        reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }


  @ReactMethod
  fun addListener(eventName: String) {

  }

  @ReactMethod
  fun removeListeners(count: Int) {

  }

  @ReactMethod
  fun initialize(
    accountId: Int,
    propertyId: Int,
    consents: Int,
    sdkVersion: String,
    callback: Callback
  ) {

    DXA.getInstance(reactContext.applicationContext).run {
      dxa = this
      binderScope.launch {

        val config: SdkConfig = standaloneInitialize(
          dxaConfig =
          DXAConfig(
            accountId = accountId.toLong(),
            propertyId = propertyId.toLong(),
            customerConsent = translateConsentsToAndroid(consents),
            mobileDataEnabled = true,
            manualTrackingEnabled = true,

            ),
          platform = Multiplatform(
            type = PlatformType.REACT_NATIVE,
            version = sdkVersion
          )
        )
       val configMap = SdkConfigInfo(
          vcBlockedReactNativeSDKVersions = config.vcBlockedReactNativeSDKVersions,
          vcBlockedReactNativeAppVersions = config.vcBlockedReactNativeAppVersions,
          daShowLocalLogs = config.daShowLocalLogs,
          dstDisableScreenTracking = config.dstDisableScreenTracking,
          appVersion = AppVersionProvider.version
        ).toWritableNativeMap()
        callback.invoke(configMap)
        bootstrapperInitialize()
      }
    }
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
  fun enableAutoMasking(elementsToMask: ReadableArray) {
    val intList = mutableListOf<Int>()
    for (i in 0 until elementsToMask.size()) {
      intList.add(elementsToMask.getInt(i))
    }
    dxa.enableAutoMasking(translateAutomaskingToAndroid(intList))
  }

  @ReactMethod
  fun disableAutoMasking(elementsToUnmask: ReadableArray) {
    val intList = mutableListOf<Int>()
    for (i in 0 until elementsToUnmask.size()) {
      intList.add(elementsToUnmask.getInt(i))
    }
    dxa.disableAutoMasking(translateAutomaskingToAndroid(intList))
  }

  @ReactMethod
  fun setRetention(enabled: Boolean) {
    dxa.setRetention(enabled)
  }

  @ReactMethod
  fun setMaskingColor(hexadecimalColor: String) {
    dxa.setMaskingColor(hexadecimalColor)
  }

  @ReactMethod
  fun setImageQuality(imageQuality: Int) {
    val imageQualityLevel = when (imageQuality) {
      0 -> ImageQualityLevel.Poor
      1 -> ImageQualityLevel.Low
      2 -> ImageQualityLevel.Average
      3 -> ImageQualityLevel.High
      4 -> ImageQualityLevel.Ultra
      else -> {
        ImageQualityLevel.Average
      }
    }
    dxa.setImageQuality(imageQualityLevel)
  }

  private fun bootstrapperInitialize() {
    startCollectSdkConfig()

  }
  private fun startCollectSdkConfig() {
    binderScope.launch {
      dxa.getConfigFlow().collect { newConfig: SdkConfig? ->

        lastConfig = newConfig
        if (newConfig == null) {
          return@collect
        }

        val configMap = SdkConfigInfo(
          vcBlockedReactNativeSDKVersions = newConfig.vcBlockedReactNativeSDKVersions,
          vcBlockedReactNativeAppVersions = newConfig.vcBlockedReactNativeAppVersions,
          daShowLocalLogs = newConfig.daShowLocalLogs,
          dstDisableScreenTracking = newConfig.dstDisableScreenTracking,
          appVersion = AppVersionProvider.version
        ).toWritableNativeMap()


        sendEvent(reactContext, "dxa-event", configMap)



      }
    }
  }

  private fun translateConsentsToAndroid(consents: Int): CustomerConsentType {
    return when (consents) {
      1 -> CustomerConsentType.ANALYTICS
      2 -> CustomerConsentType.ANALYTICS_AND_RECORDING
      else -> CustomerConsentType.NONE
    }
  }

  private fun translateAutomaskingToAndroid(elementsToMask: List<Int>): List<DXAConfigurationMask> {

    val translatedElementsToMask: List<DXAConfigurationMask> = elementsToMask.mapNotNull { element ->
      when (element) {
        0 -> DXAConfigurationMask.ALL
        1 -> DXAConfigurationMask.EDIT_TEXT
        2 -> DXAConfigurationMask.TEXT_VIEW
        3 -> DXAConfigurationMask.IMAGE_VIEW
        4 -> DXAConfigurationMask.WEB_VIEW
        else -> {null}
      }
    }
    return translatedElementsToMask
  }

  companion object {
    const val NAME = "DxaReactNative"
  }
}

private class DxaReactNativeException(msg: String?) : Throwable(message = msg)
