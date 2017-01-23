package com.cndll.myway.mywayfv.fragment;


import android.content.Context;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.PopupWindow;

import com.cndll.myway.mywayfv.R;


/**
 * Created by kongqing on 17-1-13.
 */
public class BaseFragment extends Fragment {
    /*Subscription disconn;

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
    }*/

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       /* if (disconncallbacks == null) {
            disconncallbacks = new ArrayList<>();
        }
        if (disconn == null) {
            disconn = RxBus.getDefault().toObservable(DisConnNotify.class).subscribe(new Observer<DisConnNotify>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(DisConnNotify disConnNotify) {
                    Toast.makeText(getActivity(), "蓝牙已断开", Toast.LENGTH_SHORT).show();
                    if (disconncallbacks != null) {
                        for (disconncallback c : disconncallbacks) {
                            c.callback();
                        }
                    }
                }
            });
        }*/
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
       /* if (disconn.isUnsubscribed())
            disconn.unsubscribe();*/
    }

    PopupWindow popupWindow;

    protected void displayprog(View v) {
        View          view          = LayoutInflater.from(getActivity()).inflate(R.layout.popview_prog, null, false);
        WindowManager windowManager = (WindowManager) getActivity().getSystemService(Context.WINDOW_SERVICE);
        popupWindow = new PopupWindow(view, windowManager.getDefaultDisplay().getWidth() / 6 * 5,
                windowManager.getDefaultDisplay().getHeight() / 10 * 3, false);
        popupWindow.setFocusable(true);
        popupWindow.setOutsideTouchable(false);

        popupWindow.setBackgroundDrawable(new BitmapDrawable());
        popupWindow.showAtLocation(v, Gravity.CENTER_VERTICAL, 0, 0);

    }

    protected void dismissprog() {
        if (popupWindow != null) {
            popupWindow.dismiss();
            popupWindow = null;
        }
    }
}
