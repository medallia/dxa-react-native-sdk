package com.dxareactnativeexample;

import android.os.Looper;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class NativeBridge extends ReactContextBaseJavaModule {
   NativeBridge(ReactApplicationContext context) {
       super(context);
   }

  @ReactMethod
public void crashApp() {
    new Thread(new Runnable() {
      public void run() {
       throw new RuntimeException("This is a Java exception");
      }
    }).start();
}

   @Override
public String getName() {
   return "NativeBridge";
}
}
