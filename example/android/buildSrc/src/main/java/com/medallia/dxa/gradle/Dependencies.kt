package com.medallia.dxa.gradle

object Projects {
    const val builderCommon = ":dxa-android-builder-common"
    const val builderDev = ":dxa-android-builder-dev"
    const val builderProd = ":dxa-android-builder-prod"
    const val core = ":dxa-android-core"
    const val common = ":dxa-android-common"
    const val test = ":dxa-android-test"
}

object Versions {
    // Build
    const val minSdk = 23
    const val targetSdk = 31
    const val compileSdk = 31
    const val versionCode = 1
    const val versionName = "1.0"
}