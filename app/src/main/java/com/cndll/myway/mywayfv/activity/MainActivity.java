package com.cndll.myway.mywayfv.activity;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.ashokvarma.bottomnavigation.BottomNavigationBar;
import com.ashokvarma.bottomnavigation.BottomNavigationItem;
import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.eventtype.DisBleConn;
import com.cndll.myway.mywayfv.fragment.CarFragment;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import io.dcloud.EntryProxy;
import io.dcloud.common.DHInterface.ISysEventListener;
import io.dcloud.common.DHInterface.IWebviewStateListener;
import io.dcloud.feature.internal.sdk.SDK;

public class MainActivity extends BaseActivity {

    private Unbinder unbinder;
    EntryProxy mEntryProxy = null;
    @BindView(R.id.webview)
    FrameLayout         webview;
    @BindView(R.id.frame)
    FrameLayout         frame;
    @BindView(R.id.bottom_navigation)
    BottomNavigationBar bottomNavigation;
    CarFragment carFragment;
    private List<String> URLs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (mEntryProxy == null) {
            mEntryProxy = EntryProxy.getInstnace();
        }
        setContentView(R.layout.activity_main);
        unbinder = ButterKnife.bind(this);
        final Intent intent = new Intent(this, BleService.class);
        startService(intent);
        //CrashReport.testJavaCrash();
        carFragment = new CarFragment();


        //frame.setVisibility(View.GONE);
        webview.setVisibility(View.GONE);
        URLs = new ArrayList<>();
        URLs.add("file:///android_asset/apps/H50CFBACD/www/view/active.html");
        URLs.add("file:///android_asset/apps/H50CFBACD/www/view/found.html");
        URLs.add("file:///android_asset/apps/H50CFBACD/www/view/road.html");
        URLs.add("file:///android_asset/apps/H50CFBACD/www/view/my.html");
        new Thread() {
            @Override
            public void run() {
                super.run();
                while (true) {
                    try {
                        sleep(200);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if (SDK.obtainAllIWebview().size() > 1) {
                        bottomNavigation.post(new Runnable() {
                            @Override
                            public void run() {
                                bottomNavigation.setVisibility(View.GONE);
                            }
                        });
                    } else if (SDK.obtainAllIWebview().size() == 1) {
                        bottomNavigation.post(new Runnable() {
                            @Override
                            public void run() {
                                bottomNavigation.setVisibility(View.VISIBLE);
                            }
                        });
                    }
                }
            }
        }.start();
        initnavigation();
        getSupportFragmentManager().beginTransaction().replace(R.id.frame, carFragment).commit();

    }

    private void initnavigation() {
        bottomNavigation.setMode(BottomNavigationBar.MODE_FIXED);
        bottomNavigation.setActiveColor(android.R.color.black).setBarBackgroundColor(android.R.color.background_light);
        bottomNavigation.addItem(new BottomNavigationItem(R.mipmap.active, "动态"))
                .addItem(new BottomNavigationItem(R.mipmap.found, "发现"))
                .addItem(new BottomNavigationItem(R.mipmap.car, "车辆"))
                .addItem(new BottomNavigationItem(R.mipmap.road, "路线"))
                .addItem(new BottomNavigationItem(R.mipmap.my, "我的"))
                .setFirstSelectedPosition(2).initialise();
        webviewStateListener = new IWebviewStateListener() {
            @Override
            public Object onCallBack(int i, Object o) {
                switch (i) {
                    case IWebviewStateListener.ON_PAGE_FINISHED:
                        //webview.setVisibility(View.VISIBLE);
                        break;
                }
                return null;
            }
        };
        bottomNavigation.setTabSelectedListener(new BottomNavigationBar.OnTabSelectedListener() {
            @Override
            public void onTabSelected(int position) {
                switch (position) {
                    case 0:

                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl()
                                + "view/active.html");
                        webview.setVisibility(View.VISIBLE);
                        frame.setVisibility(View.GONE);
                        //  displayprog(webview);
                        break;
                    case 1:

                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl()
                                + "view/found.html");
                        webview.setVisibility(View.VISIBLE);
                        frame.setVisibility(View.GONE);
                        break;
                    case 2:

                        getSupportFragmentManager().beginTransaction().replace(R.id.frame, carFragment).commit();
                        webview.setVisibility(View.GONE);
                        frame.setVisibility(View.VISIBLE);
                        break;
                    case 3:

                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl()
                                + "view/road.html");
                        webview.setVisibility(View.VISIBLE);
                        frame.setVisibility(View.GONE);
                        break;
                    case 4:

                        SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).loadUrl(SDK.obtainCurrentApp().obtainWebviewBaseUrl()
                                + "view/my.html");
                        webview.setVisibility(View.VISIBLE);
                        frame.setVisibility(View.GONE);
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

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            Log.d("URL", "onKeyDown: " + (SDK.obtainAllIWebview().get(0).obtainFullUrl().equals("file:///android_asset/apps/H50CFBACD/www/view/found.html")));
            if (URLs.contains(SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainFullUrl()))
                return super.onKeyDown(keyCode, event);
        }
        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyDown, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
        return _ret ? _ret : super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (URLs.contains(SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainFullUrl()))
                return super.onKeyUp(keyCode, event);
        }

        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyUp, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
        return _ret ? _ret : super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (URLs.contains(SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainFullUrl()))
                return super.onKeyLongPress(keyCode, event);
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
        if (CarStatu.isopenmap) {
            View view = SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).obtainApp().obtainWebAppRootView().obtainMainView();
            ((ViewGroup) view.getParent()).removeView(view);
            webview.addView(view);
            //SDK.attach(webview, SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1));
            CarStatu.isopenmap = false;
        }
        //SDK.obtainAllIWebview().get(SDK.obtainAllIWebview().size() - 1).addStateListener(webviewStateListener);
        mEntryProxy.onResume(this);
    }

    @Override
    protected void onDestroy() {
        mEntryProxy.destroy(this);
        super.onDestroy();
        unbinder.unbind();
        SDK.stopWebApp(SDK.obtainCurrentApp());
        RxBus.getDefault().post(new DisBleConn());
        System.exit(0);
    }
}
