package com.deepwork;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactPackage;
import com.google.firebase.database.FirebaseDatabase;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;
import com.wix.interactable.Interactable;

import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;

public class MainApplication extends NavigationApplication {

  @Override
  public void onCreate() {
    super.onCreate();
    FirebaseDatabase.getInstance().setPersistenceEnabled(true);
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new Interactable(),
            new RNFirebasePackage(),
            new RNFirebaseDatabasePackage()
    );
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
}