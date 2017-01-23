package com.cndll.myway.mywayfv.activity;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.data.CarStatu;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.IWebviewStateListener;
import io.dcloud.feature.internal.sdk.SDK;

public class PathActivity extends AppCompatActivity {

    @BindView(R.id.webview)
    FrameLayout webview;
    IWebview              iWebview;
    IWebviewStateListener webviewStateListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_path);
        ButterKnife.bind(this);

        /*iWebview = SDK.createWebview(this, "path", new IWebviewStateListener() {
            @Override
            public Object onCallBack(int i, Object o) {
                switch (i) {
                    case ON_PAGE_STARTED:
                        break;
                    case ON_PAGE_FINISHED:
                        SDK.attach(webview, iWebview);
                        break;
                }
                return null;
            }
        });*/
       /* iWebview.loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl()
                + "view/active.html");*/
        //iWebview.loadUrl("http://www.baidu.com");

    }

    @Override
    protected void onStart() {
        super.onStart();
        if (!CarStatu.isopenmap) {
            View view = SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainApp().obtainWebAppRootView().obtainMainView();
            ((ViewGroup) view.getParent()).removeView(view);
            webview.addView(view);
            CarStatu.isopenmap = true;
        }
        // SDK.attach(webview, SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1));
        webview.setVisibility(View.GONE);
        webviewStateListener = new IWebviewStateListener() {
            @Override
            public Object onCallBack(int i, Object o) {
                switch (i) {
                    case ON_PAGE_FINISHED:
                        webview.setVisibility(View.VISIBLE);
                        break;
                }
                return null;
            }
        };
        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl()
                + "view/today-road.html");
        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).addStateListener(webviewStateListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).removeStateListener(webviewStateListener);

    }
}
