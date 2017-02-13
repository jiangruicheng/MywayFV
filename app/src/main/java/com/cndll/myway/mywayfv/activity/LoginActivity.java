package com.cndll.myway.mywayfv.activity;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.widget.FrameLayout;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.hbuilder.WebappModeListener;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import io.dcloud.EntryProxy;
import io.dcloud.common.DHInterface.ISysEventListener;
import io.dcloud.common.DHInterface.IWebviewStateListener;
import io.dcloud.feature.internal.sdk.SDK;

public class LoginActivity extends AppCompatActivity {
    private Unbinder unbinder;
    EntryProxy mEntryProxy = null;
    @BindView(R.id.webview)
    FrameLayout webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        unbinder = ButterKnife.bind(this);
        CarStatu.isopenmap = true;
        if (mEntryProxy == null) {
            // 创建5+内核运行事件监听
            // WebviewModeListener wm = new WebviewModeListener(this, webview);

            WebappModeListener wm = new WebappModeListener(this, webview, new WebappModeListener.callback() {

                @Override
                public void hidenag() {

                }

                @Override
                public void shownag() {
                    //startActivity(new Intent(LoginActivity.this, MainActivity.class));
                }
            });

            // 初始化5+内核
            mEntryProxy = EntryProxy.init(this, wm);
            // 启动5+内核
            mEntryProxy.onCreate(this, savedInstanceState, SDK.IntegratedMode.WEBAPP, null);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyDown, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            SDK.stopWebApp(SDK.obtainCurrentApp());
            finish();
        }
        return _ret ? _ret : super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {

        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyUp, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
        return _ret ? _ret : super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyLongPress, new Object[]{keyCode, event});
        return _ret ? _ret : super.onKeyLongPress(keyCode, event);
    }

    public void onConfigurationChanged(Configuration newConfig) {
        try {
            int temp = this.getResources().getConfiguration().orientation;
            if (mEntryProxy != null) {
                mEntryProxy.onConfigurationChanged(this, temp);
            }
            super.onConfigurationChanged(newConfig);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onActivityResult, new Object[]{requestCode, resultCode, data});
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onCreateOptionMenu, menu);
    }

    @Override
    public void onPause() {
        super.onPause();
        mEntryProxy.onPause(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        //SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).addStateListener(webviewStateListener);
    }

    IWebviewStateListener webviewStateListener;

    @Override
    public void onResume() {
        super.onResume();
        //SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).addStateListener(webviewStateListener);
        mEntryProxy.onResume(this);
    }

    @Override
    protected void onDestroy() {
        mEntryProxy.destroy(this);
        super.onDestroy();
        unbinder.unbind();
    }
}
