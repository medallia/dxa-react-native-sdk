import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

data class SdkConfigInfo(
  val vcBlockedReactNativeSDKVersions: List<String>,
  val vcBlockedReactNativeAppVersions: List<String>,
  val vcBlockedNativeSDKVersions: List<String>,
  val daShowLocalLogs: Boolean,
  val daAllowLocalLogs: Boolean,
  val dstDisableScreenTracking: List<String>,
  val appVersion: String,
  val nativeSDKVersion:String,
) {

  fun toWritableNativeMap(): WritableMap {
   val map = Arguments.createMap()
    map.putArray("vcBlockedReactNativeSDKVersions",Arguments.fromList(vcBlockedReactNativeSDKVersions))
    map.putArray("vcBlockedReactNativeAppVersions",Arguments.fromList(vcBlockedReactNativeAppVersions))
    map.putArray("vcBlockedNativeSDKVersions",Arguments.fromList(vcBlockedNativeSDKVersions))
    map.putBoolean("daShowLocalLogs", daShowLocalLogs)
    map.putBoolean("daAllowLocalLogs", daAllowLocalLogs)
    map.putArray("dstDisableScreenTracking",Arguments.fromList(dstDisableScreenTracking))
    map.putString("appVersion", appVersion)
    map.putString("nativeSDKVersion", nativeSDKVersion)
    map.putString("eventType",  "live_configuration")
    return map
  }
}


data class SamplingInfo(
  val stopTrackingDueToSampling: Boolean,
  val stopRecordingDueToSampling: Boolean,
) {

  fun toWritableNativeMap(): WritableMap {
    val map = Arguments.createMap()

    map.putBoolean("stopTrackingDueToSampling", stopTrackingDueToSampling)
    map.putBoolean("stopRecordingDueToSampling", stopRecordingDueToSampling)

    map.putString("eventType",  "sampling_data")
    return map
  }
}
