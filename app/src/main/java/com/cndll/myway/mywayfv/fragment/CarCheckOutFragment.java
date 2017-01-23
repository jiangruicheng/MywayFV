package com.cndll.myway.mywayfv.fragment;


import android.annotation.TargetApi;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.data.Command;
import com.cndll.myway.mywayfv.eventtype.SendCmd;
import com.cndll.myway.mywayfv.util.ByteUtil;
import com.cndll.myway.mywayfv.util.Quee;
import com.cndll.myway.mywayfv.view.ArcCheckOut;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;

/**
 * A simple {@link Fragment} subclass.
 */
public class CarCheckOutFragment extends Fragment {

    Handler handler = new Handler() {
        @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (isrun) {
                arcprog.setProg(msg.what);
                if (msg.what == 0) {
                    arcprog.setEnabled(false);
                }
                if (msg.what == 100) {
                    arcprog.setEnabled(true);
                }
                switch (msg.what) {
                    case 100 / 6:
                        screen.setBackgroundResource(R.mipmap.ischeck);
                        break;
                    case 100 / 6 * 2:
                        if (!CarStatu.getDefault().getStatue().is_drive_wrong()) {
                            qudong.setBackgroundResource(R.mipmap.ischeck);
                        } else {
                            qudong.setBackgroundResource(R.mipmap.mistake);
                        }
                        break;
                    case 100 / 6 * 3:
                        if (!CarStatu.getDefault().getStatue().is_power_wrong()) {
                            power.setBackgroundResource(R.mipmap.ischeck);
                        } else {
                            power.setBackgroundResource(R.mipmap.mistake);
                        }
                        break;
                    case 100 / 6 * 4:
                        if (!CarStatu.getDefault().getStatue().is_esp_wrong()) {
                            dianji.setBackgroundResource(R.mipmap.ischeck);
                        } else {
                            dianji.setBackgroundResource(R.mipmap.mistake);
                        }
                        break;
                    case 100 / 6 * 5:
                        msocket.setBackgroundResource(R.mipmap.ischeck);
                        break;
                    case 100 / 6 * 6:
                        monmistake.setBackgroundResource(R.mipmap.ischeck);
                        break;
                }
            }
        }
    };
    @BindView(R.id.back)
    ImageView back;

    @OnClick(R.id.back)
    void onback() {
        getActivity().getSupportFragmentManager().popBackStack();
    }

    private boolean isrun = true;
    @BindView(R.id.title)
    RelativeLayout title;
    @BindView(R.id.arcprog)
    ArcCheckOut    arcprog;

    @OnClick(R.id.arcprog)
    void onarcprog() {
        RxBus.getDefault().post(new SendCmd().setCmd(Command.getCommand(Command.setData(Command.COM_QUERY, new byte[]{0x01}))));
    }

    @BindView(R.id.path)
    LinearLayout path;
    @BindView(R.id.mesg)
    TextView     mesg;
    @BindView(R.id.checkout_wrong)
    LinearLayout checkoutWrong;
    @BindView(R.id.screen)
    TextView     screen;
    @BindView(R.id.qudong)
    TextView     qudong;
    @BindView(R.id.power)
    TextView     power;
    @BindView(R.id.dianji)
    TextView     dianji;
    @BindView(R.id.msocket)
    TextView     msocket;
    @BindView(R.id.monmistake)
    TextView     monmistake;

    public CarCheckOutFragment() {
        // Required empty public constructor
    }

    private Unbinder unbinder;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_car_check_out, container, false);
        unbinder = ButterKnife.bind(this, view);
        setcallback();
        return view;
    }

    private Quee.callback CHECKEOUT;

    private void setcallback() {
        CHECKEOUT = new Quee.callback() {
            @Override
            public void callback(byte[] b) {
                byte[] type   = new byte[4];
                byte[] vision = new byte[8];
                byte[] sn     = new byte[32];
                byte[] speed  = new byte[1];
                System.arraycopy(b, 4, type, 0, 4);
                System.arraycopy(b, 8, vision, 0, 8);
                System.arraycopy(b, 16, sn, 0, 32);
                System.arraycopy(b, 50, speed, 0, 1);
                String stype   = ByteUtil.getString(type);
                String svision = ByteUtil.getString(vision);
                String ssn     = ByteUtil.getString(sn);
                CarStatu.getDefault().getStatue().setType(stype);
                CarStatu.getDefault().getStatue().setVison(svision);
                CarStatu.getDefault().getStatue().setSn(ssn);
                byte[] statu = new byte[4];
                System.arraycopy(b, b.length - 7, statu, 0, 4);
                byte[] carstatues_1 = ByteUtil.getBitArray(statu[0]);
                byte[] carstatues_2 = ByteUtil.getBitArray(statu[1]);
                CarStatu.getDefault().getStatue().setIs_carlock(Is(carstatues_1[0]));
                CarStatu.getDefault().getStatue().setIs_slide(Is(carstatues_1[1]));
                if (Is(carstatues_1[2])) {
                    CarStatu.getDefault().getStatue().setCarstartmode(CarStatu.Statue.SOFT_MODE);
                }
                if (Is(carstatues_1[3])) {
                    CarStatu.getDefault().getStatue().setCarstartmode(CarStatu.Statue.HARD_MODE);
                }
                CarStatu.getDefault().getStatue().setIs_esp_wrong(Is(carstatues_1[4]));
                CarStatu.getDefault().getStatue().setIs_power_wrong(Is(carstatues_1[5]));
                CarStatu.getDefault().getStatue().setIs_drive_wrong(Is(carstatues_1[6]));
                CarStatu.getDefault().getStatue().setIs_tran_wrong(Is(carstatues_1[7]));
                CarStatu.getDefault().getStatue().setIs_befor_light_ON(Is(carstatues_2[0]));
                CarStatu.getDefault().getStatue().setIs_after_light_ON(Is(carstatues_2[1]));
                Toast.makeText(getActivity(), "" + "lock  " + CarStatu.getDefault().getStatue().is_carlock() + "type: " + stype + "vison: " + svision + "sn: " + ssn, Toast.LENGTH_SHORT).show();
                Log.i("carstatue", "lock " + CarStatu.getDefault().getStatue().is_carlock() + "type:" + stype + "vison:" + svision);
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        if (isrun) {
                            for (int i = 0; i < 101; i++) {
                                handler.sendEmptyMessage(i);
                                try {
                                    Thread.sleep(20);
                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }
                }).start();
            }
        };
        Quee.getDefault().registcallback((byte) 0xff, CHECKEOUT);
    }

    private boolean Is(byte b) {
        if (b == 1) {
            return true;
        } else {
            return false;
        }
    }

    public void onStop() {
        super.onStop();
        isrun = false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unbinder.unbind();
        Quee.getDefault().unregistcallback((byte) 0xff, CHECKEOUT);
    }
}
