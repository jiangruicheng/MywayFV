package com.cndll.myway.mywayfv.activity;

import android.content.Context;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.PopupWindow;
import android.widget.Toast;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.eventtype.DisConnNotify;

import java.util.ArrayList;
import java.util.List;

import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;


/**
 * Created by kongqing on 17-1-9.
 */
public class BaseActivity extends AppCompatActivity {
    Subscription disconn;

    public interface disconncallback {
        void callback();
    }

    private List<disconncallback> disconncallbacks;

    public void registerdisconn(disconncallback disconncallback) {
        if (disconncallbacks != null) {
            disconncallbacks.add(disconncallback);
        }
    }

    public void unregisterdisconn(disconncallback disconncallback) {
        if (disconncallbacks != null) {
            disconncallbacks.remove(disconncallback);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (disconncallbacks == null) {
            disconncallbacks = new ArrayList<>();
        }
        if (disconn == null) {
            disconn = RxBus.getDefault().toObservable(DisConnNotify.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<DisConnNotify>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(DisConnNotify disConnNotify) {
                    try {
                        dismissprog();
                        Toast.makeText(BaseActivity.this, "蓝牙已断开", Toast.LENGTH_SHORT).show();
                        if (disconncallbacks != null) {
                            for (disconncallback c : disconncallbacks) {
                                c.callback();
                            }
                        }
                    } catch (Exception e) {

                    }
                }
            });
        }
    }

    PopupWindow popupWindow;

    protected void displayprog(View v) {
        View          view          = LayoutInflater.from(BaseActivity.this).inflate(R.layout.popview_prog, null, false);
        WindowManager windowManager = (WindowManager) BaseActivity.this.getSystemService(Context.WINDOW_SERVICE);
        popupWindow = new PopupWindow(view, windowManager.getDefaultDisplay().getWidth() / 6 * 5,
                windowManager.getDefaultDisplay().getHeight() / 10 * 3, false);
        popupWindow.setFocusable(true);
        // popupWindow.setOutsideTouchable(true);
        // popupWindow.setBackgroundDrawable(new BitmapDrawable());
        popupWindow.showAtLocation(v, Gravity.CENTER_VERTICAL, 0, 0);

    }

    protected void dismissprog() {
        if (popupWindow != null) {
            popupWindow.dismiss();
            popupWindow = null;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (disconn.isUnsubscribed())
            disconn.unsubscribe();
    }
}
