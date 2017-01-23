package com.cndll.myway.mywayfv.fragment;


import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.activity.CarManagerActivity;
import com.cndll.myway.mywayfv.activity.CarStatuActivity;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.data.Command;
import com.cndll.myway.mywayfv.eventtype.ConnSucc;
import com.cndll.myway.mywayfv.eventtype.DisConnNotify;
import com.cndll.myway.mywayfv.eventtype.SendCmd;
import com.cndll.myway.mywayfv.util.ByteUtil;
import com.cndll.myway.mywayfv.util.Quee;
import com.cndll.myway.mywayfv.view.ArcProgBar;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;

/**
 * A simple {@link Fragment} subclass.
 */
public class CarFragment extends BaseFragment {


    @BindView(R.id.car_id)
    TextView       carId;
    @BindView(R.id.licheng)
    ArcProgBar     licheng;
    @BindView(R.id.dianliang)
    ArcProgBar     dianliang;
    @BindView(R.id.biaopan)
    RelativeLayout biaopan;
    @BindView(R.id.search_ble)
    TextView       searchBle;
    @BindView(R.id.title)
    RelativeLayout title;
    @BindView(R.id.sudu)
    ArcProgBar     sudu;
    @BindView(R.id.conn)
    LinearLayout   conn;
    @BindView(R.id.statue)
    LinearLayout   statue;
    @BindView(R.id.conn_text)
    TextView       connText;
    @BindView(R.id.lock_text)
    TextView       lockText;
    @BindView(R.id.mode_text)
    TextView       modeText;

    @OnClick(R.id.statue)
    void onstatue() {
        Intent intent = new Intent(getActivity(), CarStatuActivity.class);
        getActivity().startActivity(intent);
    }

    @BindView(R.id.sock)
    LinearLayout sock;
    private boolean isLock = false;

    @OnClick(R.id.sock)
    void onsock() {
        if (isLock) {
            RxBus.getDefault().post(new SendCmd().
                    setCmd(Command.getCommand
                            (Command.setData(Command.COM_LOCK,
                                    new byte[]{0x00}))));
        } else {
            RxBus.getDefault().post(new SendCmd().
                    setCmd(Command.getCommand
                            (Command.setData(Command.COM_LOCK,
                                    new byte[]{0x01}))));
        }
    }

    @BindView(R.id.mode)
    LinearLayout mode;
    private byte bmode = 1;

    @OnClick(R.id.mode)
    void onmode() {
        if (bmode == 1) {
            RxBus.getDefault().post(new SendCmd().
                    setCmd(Command.getCommand
                            (Command.setData(Command.COM_MODE,
                                    new byte[]{0x00}))));
            bmode = 0;
        } else {
            RxBus.getDefault().post(new SendCmd().
                    setCmd(Command.getCommand
                            (Command.setData(Command.COM_MODE,
                                    new byte[]{0x01}))));
            bmode = 1;
        }
    }

    @OnClick(R.id.search_ble)
    void onsearch_ble() {
        Intent intent = new Intent(getActivity(), CarManagerActivity.class);
        getActivity().startActivity(intent);
    }


    public CarFragment() {
        // Required empty public constructor
    }

    private Unbinder unbinder;
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            sudu.setGuide_rate(msg.what);
            licheng.setGuide_rate(msg.what);
            dianliang.setGuide_rate(msg.what);
        }
    };
    private Subscription connsucc;
    /*private disconncallback disconncallback;*/

    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (connsucc == null) {
            connsucc = RxBus.getDefault().toObservable(ConnSucc.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<ConnSucc>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(ConnSucc connSucc) {
                    connText.setText("已连接");
                }
            });
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_car, container, false);
        unbinder = ButterKnife.bind(this, view);
        // displayprog(licheng);
        dianliang.setScreen_rate(30);
        licheng.setScreen_rate(330);
        dianliang.setScale(1);
        licheng.setScale(2);
        setcallback();

       /* new Thread() {
            @Override
            public void run() {
                super.run();
                int i = 0;
                while (true) {
                    handler.sendEmptyMessage(45 + i * 45);
                    i++;
                    try {
                        sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }.start();*/
        return view;
    }

    private void setCarId() {
        boolean iscontan = false;
        String  name     = "";
        if (CarStatu.getDefault().getCarconnceting() != null) {
            for (CarStatu.CarConned c : CarStatu.getDefault().getCarConneds()) {
                if (CarStatu.getDefault().getCarconnceting().getAddress().equals(c.getAddress())) {
                    iscontan = true;
                    name = c.getName();
                }
            }
            if (iscontan) {
                carId.setText(name);
            } else {
                carId.setText(CarStatu.getDefault().getCarconnceting().getName());
            }
        }

    }

    private Quee.callback powerandspeed;
    private Quee.callback MILEAGE;
    private Quee.callback LOCK;
    private Subscription  disconn;

    @Override
    public void onResume() {
        super.onResume();
        setCarId();
    }

    private void setcallback() {
        /*disconncallback = new disconncallback() {
            @Override
            public void callback() {
                connText.setText("未连接");
            }
        };
        registerdisconn(disconncallback);*/
        if (disconn == null) {
            disconn = RxBus.getDefault().toObservable(DisConnNotify.class).observeOn(AndroidSchedulers.mainThread()).
                    subscribe(new Observer<DisConnNotify>() {
                        @Override
                        public void onCompleted() {

                        }

                        @Override
                        public void onError(Throwable e) {
                            e.printStackTrace();
                        }

                        @Override
                        public void onNext(DisConnNotify disConnNotify) {
                            try {
                                // Toast.makeText(getActivity(), "蓝牙已断开", Toast.LENGTH_SHORT).show();
                                connText.setText("未连接");
                                //  Toast.makeText(getActivity(), "蓝牙已断开", Toast.LENGTH_LONG).show();

                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                    /*if (disconncallbacks != null) {
                        for (disconncallback c : disconncallbacks) {
                            c.callback();
                        }
                    }*/
                        }
                    });
        }
        powerandspeed = new Quee.callback() {
            @Override
            public void callback(byte[] b) {
                byte[] b_speed = new byte[4];
                /*System.arraycopy(b, 4, b_speed, 2, 2);*/
                b_speed[0] = b[5];
                b_speed[1] = b[4];
                float speed = ByteUtil.getInt(b_speed);
                sudu.setValue((speed / 100) + "");
                sudu.setGuide_rate((speed / 100) * ((float) 270 / (float) 40) + 45);
                byte[] b_power = new byte[4];
                /*System.arraycopy(b, 6, b_power, 2, 2);*/
                b_power[0] = b[7];
                b_power[1] = b[6];
                float power = ByteUtil.getInt(b_power);
                dianliang.setValue((int) (power) + "");
                dianliang.setGuide_rate((float) (power) * ((float) 270 / (float) 100) + 45);
                sudu.invalidate();
                dianliang.invalidate();
            }
        };
        MILEAGE = new Quee.callback() {
            @Override
            public void callback(byte[] b) {
                byte[] b_now = new byte[4];
                /*System.arraycopy(b, 4, b_now, 0, 2);*/
                b_now[0] = b[5];
                b_now[1] = b[4];
                float now = ByteUtil.getInt(b_now);

                byte[] b_total = new byte[4];
                /*System.arraycopy(b, 6, b_total, 0, 2);*/
                b_total[0] = b[7];
                b_total[1] = b[6];
                float total = ByteUtil.getInt(b_total);
                licheng.setValue((total / (float) 10) + "");
                licheng.setGuide_rate((now / (float) 10) * ((float) 270 / (float) 100) + 45);
                licheng.invalidate();
            }
        };
        LOCK = new Quee.callback() {
            @Override
            public void callback(byte[] b) {
                if (b[5] == 1) {
                    if (isLock) {
                        lockText.setText("锁车");
                        isLock = false;
                    } else {
                        lockText.setText("解锁");
                        isLock = true;
                    }
                }
                Toast.makeText(getActivity(), "" + b[5], Toast.LENGTH_SHORT).show();
            }
        };
        Quee.getDefault().registcallback(Command.EVENT_POWERANDSPEED, powerandspeed);
        Quee.getDefault().registcallback(Command.EVENT_MILEAGE, MILEAGE);
        Quee.getDefault().registcallback(Command.COM_LOCK, LOCK);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
            /*unregisterdisconn(disconncallback);*/
        if (disconn.isUnsubscribed()) {
            disconn.unsubscribe();
        }
        Quee.getDefault().unregistcallback(Command.EVENT_POWERANDSPEED, powerandspeed);
        Quee.getDefault().unregistcallback(Command.EVENT_MILEAGE, MILEAGE);
        Quee.getDefault().unregistcallback(Command.COM_LOCK, LOCK);
        unbinder.unbind();
    }
}
