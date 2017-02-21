package com.cndll.myway.mywayfv.hbuilder.Ifeature;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.activity.MainActivity;
import com.cndll.myway.mywayfv.eventtype.JSEvent;

import io.dcloud.common.DHInterface.AbsMgr;
import io.dcloud.common.DHInterface.IFeature;
import io.dcloud.common.DHInterface.IWebview;

/**
 * Created by kongqing on 17-2-13.
 */
public class StartActivity implements IFeature {
    @Override
    public String execute(IWebview iWebview, String s, String[] strings) {
        switch (s) {
            case "execute":
                Activity activity = iWebview.getActivity();
                Intent intent = new Intent(iWebview.getActivity(), MainActivity.class);
                //   intent.setClassName("com.wenju.widget", "com.wenju.widget.Rtsp2Activity");
                iWebview.getActivity().startActivity(intent);
                // activity.finish();
                break;
            case "hideNativeView":
                RxBus.getDefault().post(new JSEvent().setEventType("hideNativeView"));
                Log.d("MYWAY", "hideNativeView: ");
                break;
            case "showNativeView":
                RxBus.getDefault().post(new JSEvent().setEventType("showNativeView"));

                Log.d("MYWAY", "showativeiew: ");
                break;
        }
        return null;
    }

    @Override
    public void init(AbsMgr absMgr, String s) {

    }

    @Override
    public void dispose(String s) {

    }


}
