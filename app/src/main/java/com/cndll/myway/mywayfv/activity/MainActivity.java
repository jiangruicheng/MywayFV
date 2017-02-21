package com.cndll.myway.mywayfv.activity;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.View;
import android.widget.FrameLayout;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.eventtype.DisBleConn;
import com.cndll.myway.mywayfv.eventtype.JSEvent;
import com.cndll.myway.mywayfv.fragment.CarFragment;
import com.cndll.myway.mywayfv.hbuilder.WebappModeListener;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import io.dcloud.EntryProxy;
import io.dcloud.common.DHInterface.ISysEventListener;
import io.dcloud.common.DHInterface.IWebviewStateListener;
import io.dcloud.feature.internal.sdk.SDK;
import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;

public class MainActivity extends BaseActivity {

    private Unbinder unbinder;
    EntryProxy mEntryProxy = null;
    @BindView(R.id.webview)
    FrameLayout webview;
    @BindView(R.id.frame)
    FrameLayout frame;

    CarFragment carFragment;
    private Subscription jsevent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        unbinder = ButterKnife.bind(this);
        if (mEntryProxy == null) {
            //  mEntryProxy = EntryProxy.getInstnace();
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
        if (jsevent == null) {
            jsevent = RxBus.getDefault().toObservable(JSEvent.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<JSEvent>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(JSEvent jsEvent) {
                    try {
                        switch (jsEvent.getEventType()) {
                            case "hideNativeView":
                                frame.setVisibility(View.GONE);
                                break;
                            case "showNativeView":
                                frame.setVisibility(View.VISIBLE);
                                break;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
        final Intent intent = new Intent(this, BleService.class);
        startService(intent);
        carFragment = new CarFragment();
        getSupportFragmentManager().beginTransaction().replace(R.id.frame, carFragment).commit();
        frame.setVisibility(View.GONE);
    }


    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        boolean _ret = mEntryProxy.onActivityExecute(this, ISysEventListener.SysEventType.onKeyDown, new Object[]{keyCode, event});
        Log.d("ret", "onKeyDown: " + _ret);
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
