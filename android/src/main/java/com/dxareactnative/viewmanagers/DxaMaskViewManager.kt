package com.dxareactnative.viewmanagers

import android.graphics.Color
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.medallia.dxa.builder.prod.DXA

class DxaMaskViewManager : ViewGroupManager<FrameLayout>() {

  override fun getName() = ViewName

  override fun createViewInstance(
    context: ThemedReactContext
  ): FrameLayout {
    val containerView = FrameLayout(context).apply {
      id = View.generateViewId()
    }
    context.currentActivity?.let {
      DXA.getInstance(context).mask(it, listOf(containerView))
    }
    return containerView
  }

  override fun onDropViewInstance(view: FrameLayout) {
    super.onDropViewInstance(view)
    (view.context as? ThemedReactContext)?.currentActivity?.let {
      DXA.getInstance(view.context).unmask(it, listOf(view))
    }
  }

  companion object {
    const val ViewName = "DxaMask"
  }
}
