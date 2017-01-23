package com.cndll.myway.mywayfv;/*
package com.cndll.myway.hbuildertest;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.View;
import android.view.Window;
import android.widget.FrameLayout;

import com.ashokvarma.bottomnavigation.BottomNavigationBar;
import com.ashokvarma.bottomnavigation.BottomNavigationItem;
import com.cndll.myway.hbuildertest.hbuilder.WebappModeListener;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.dcloud.EntryProxy;
import io.dcloud.common.DHInterface.ISysEventListener;
import io.dcloud.feature.internal.sdk.SDK;

public class MainActivity extends AppCompatActivity {
    EntryProxy mEntryProxy = null;
    */
/*@BindView(R.id.webview)*//*

    FrameLayout webview;
    @BindView(R.id.frame)
    FrameLayout         frame;
    @BindView(R.id.bottom_navigation)
    BottomNavigationBar bottomNavigation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
        webview = (FrameLayout) findViewById(R.id.webview);
        initnavigation();
        if (mEntryProxy == null) {
            // 创建5+内核运行事件监听
            // WebviewModeListener wm = new WebviewModeListener(this, webview);

            WebappModeListener wm = new WebappModeListener(this, webview, new WebappModeListener.callback() {

                @Override
                public void hidenag() {
                    bottomNavigation.post(new Runnable() {
                        @Override
                        public void run() {
                            bottomNavigation.setVisibility(View.GONE);
                        }
                    });
                }

                @Override
                public void shownag() {
                    bottomNavigation.post(new Runnable() {
                        @Override
                        public void run() {
                            bottomNavigation.setVisibility(View.VISIBLE);
                        }
                    });
                }
            });

            // 初始化5+内核
            mEntryProxy = EntryProxy.init(this, wm);
            // 启动5+内核
            mEntryProxy.onCreate(this, savedInstanceState, SDK.IntegratedMode.WEBAPP, null);
        }
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
    public void onResume() {
        super.onResume();
        mEntryProxy.onResume(this);
    }

    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent.getFlags() != 0x10600000) {// 非点击icon调用activity时才调用newintent事件
            mEntryProxy.onNewIntent(this, intent);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mEntryProxy.onStop(this);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            Log.d("URL", "onKeyDown: " + (SDK.obtainAllIWebview().get(0).obtainFullUrl().equals("file:///android_asset/apps/H50CFBACD/www/view/found.html")));
            if (SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainFullUrl().equals("file:///android_asset/apps/H50CFBACD/www/view/found.html"))
                return true;
        }
        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyDown, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
        return _ret ? _ret : super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainFullUrl().equals("file:///android_asset/apps/H50CFBACD/www/view/found.html"))
                return true;
        }

        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyUp, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
        return _ret ? _ret : super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainFullUrl().equals("file:///android_asset/apps/H50CFBACD/www/view/found.html"))
                return true;
        }
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

    private void initnavigation() {
        bottomNavigation.setMode(BottomNavigationBar.MODE_FIXED);
        bottomNavigation.setActiveColor(android.R.color.holo_blue_light).setBarBackgroundColor(android.R.color.background_light);
        bottomNavigation.addItem(new BottomNavigationItem(R.drawable.dashuju, "动态"))
                .addItem(new BottomNavigationItem(R.drawable.dashuju, "发现"))
                .addItem(new BottomNavigationItem(R.drawable.dashuju, "车辆"))
                .addItem(new BottomNavigationItem(R.drawable.dashuju, "路线"))
                .addItem(new BottomNavigationItem(R.drawable.dashuju, "我的"))
                .setFirstSelectedPosition(2).initialise();
        bottomNavigation.setTabSelectedListener(new BottomNavigationBar.OnTabSelectedListener() {
            @Override
            public void onTabSelected(int position) {
                Log.d("LOAD", "onTabSelected: " + SDK.obtainCurrentApp().obtainWebviewBaseUrl());
                switch (position) {
                    case 0:
                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl() + "view/active.html");
                        break;
                    case 1:
                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl() + "view/found.html");
                        break;
                    case 2:
                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl() + "view/car.html");
                        break;
                    case 3:
                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl() + "view/road.html");
                        break;
                    case 4:
                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl() + "view/my.html");
                        break;
                }
            }

            @Override
            public void onTabUnselected(int position) {

            }

            @Override
            public void onTabReselected(int position) {

            }
        });
    }
}
*/
