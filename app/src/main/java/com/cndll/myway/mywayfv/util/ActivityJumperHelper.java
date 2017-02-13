package com.cndll.myway.mywayfv.util;

import android.app.Activity;
import android.content.Intent;
import android.webkit.JavascriptInterface;

import com.cndll.myway.mywayfv.activity.MainActivity;

/**
 * Created by kongqing on 17-2-13.
 */
public class ActivityJumperHelper {
    @JavascriptInterface
    public static void jump(Activity activity) {
        Intent mIntent = new Intent(activity, MainActivity.class);
        activity.startActivity(mIntent);
    }
}
