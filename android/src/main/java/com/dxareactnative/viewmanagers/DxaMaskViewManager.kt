package com.dxareactnative.viewmanagers

import android.graphics.Color
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager

class DxaMaskViewManager : ViewGroupManager<FrameLayout>() {

  override fun getName() = ViewName

  override fun createViewInstance(context: ThemedReactContext): FrameLayout {
    return FrameLayout(context).apply {
      setBackgroundColor(Color.parseColor("#FF0000"))
    }
  }

  companion object {
    const val ViewName = "DxaMask"
  }
}
