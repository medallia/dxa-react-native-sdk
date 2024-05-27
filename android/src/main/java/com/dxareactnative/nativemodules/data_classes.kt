import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

data class SdkConfigInfo(
  val vcBlockedReactNativeSDKVersions: List<String>,
  val vcBlockedReactNativeAppVersions: List<String>,
  val daShowLocalLogs: Boolean,
  val daAllowLocalLogs: Boolean,
  val dstDisableScreenTracking: List<String>,
  val appVersion: String
) {

  fun toWritableNativeMap(): WritableMap {
   val map = Arguments.createMap()
    map.putArray("vcBlockedReactNativeSDKVersions",Arguments.fromList(vcBlockedReactNativeSDKVersions))
    map.putArray("vcBlockedReactNativeAppVersions",Arguments.fromList(vcBlockedReactNativeAppVersions))
    map.putBoolean("daShowLocalLogs", daShowLocalLogs)
    map.putBoolean("daAllowLocalLogs", daAllowLocalLogs)
    map.putArray("dstDisableScreenTracking",Arguments.fromList(dstDisableScreenTracking))
    map.putString("appVersion", appVersion)
    map.putString("eventType",  "live_configuration")
    return map
  }
}
