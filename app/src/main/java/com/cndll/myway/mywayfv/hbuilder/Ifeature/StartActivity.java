package com.cndll.myway.mywayfv.hbuilder.Ifeature;

import android.app.Activity;
import android.content.Intent;

import com.cndll.myway.mywayfv.activity.MainActivity;

import io.dcloud.common.DHInterface.AbsMgr;
import io.dcloud.common.DHInterface.IFeature;
import io.dcloud.common.DHInterface.IWebview;

/**
 * Created by kongqing on 17-2-13.
 */
public class StartActivity implements IFeature {
    @Override
    public String execute(IWebview iWebview, String s, String[] strings) {
        Activity activity = iWebview.getActivity();
        Intent   intent   = new Intent(iWebview.getActivity(), MainActivity.class);
        //   intent.setClassName("com.wenju.widget", "com.wenju.widget.Rtsp2Activity");
        iWebview.getActivity().startActivity(intent);
        // activity.finish();
        return null;
    }

    @Override
    public void init(AbsMgr absMgr, String s) {

    }

    @Override
    public void dispose(String s) {

    }
}
