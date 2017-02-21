package com.cndll.myway.mywayfv.util;

import android.app.Activity;
import android.content.Intent;
import android.webkit.JavascriptInterface;

import com.cndll.myway.mywayfv.activity.MainActivity;

/**
 * Created by kongqing on 17-2-13.
 */
public class ActivityJumperHelper {
    public static ActivityJumperHelper getInstance() {
        return INIT.Instance;
    }

    private static class INIT {
        private static final ActivityJumperHelper Instance = new ActivityJumperHelper();
    }

    private ActivityJumperHelper() {

    }

    @JavascriptInterface
    public static void jump(Activity activity) {
        Intent mIntent = new Intent(activity, MainActivity.class);
        activity.startActivity(mIntent);
    }

    @JavascriptInterface
    public static void hideNativeView(Activity activity) {
        Intent mIntent = new Intent(activity, MainActivity.class);
        activity.startActivity(mIntent);
    }

    @JavascriptInterface
    public static void showativeiew(Activity activity) {
        Intent mIntent = new Intent(activity, MainActivity.class);
        activity.startActivity(mIntent);
    }
}
