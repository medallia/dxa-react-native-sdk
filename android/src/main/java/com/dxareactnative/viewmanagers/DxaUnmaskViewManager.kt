package com.dxareactnative.viewmanagers

import android.util.Log
import android.view.View
import android.view.View.OnAttachStateChangeListener
import android.view.View.OnLayoutChangeListener
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.medallia.dxa.builder.prod.DXA

class DxaUnmaskViewManager : ViewGroupManager<FrameLayout>() {

  private lateinit var listener: OnAttachStateChangeListener

  override fun getName() = ViewName

  override fun createViewInstance(
    context: ThemedReactContext
  ): FrameLayout {
    val containerView = FrameLayout(context).apply {
      id = View.generateViewId()
    }

    listener = object : OnAttachStateChangeListener {
      override fun onViewAttachedToWindow(v: View) {
        context.currentActivity?.let {
          DXA.getInstance(context).unmask(it, listOf(containerView.getChildAt(0)))
        }
      }

      override fun onViewDetachedFromWindow(v: View) {
        containerView.removeOnAttachStateChangeListener(this)
      }
    }
    containerView.addOnAttachStateChangeListener(listener)

    return containerView
  }

  override fun onDropViewInstance(view: FrameLayout) {
    super.onDropViewInstance(view)
    view.removeOnAttachStateChangeListener(listener)
  }

  companion object {
    const val ViewName = "DxaUnmask"
  }
}
