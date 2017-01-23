package com.cndll.myway.mywayfv.activity;

import android.annotation.TargetApi;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.adapter.ConnectedListAdapter;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.data.Uuids;
import com.cndll.myway.mywayfv.eventtype.BleConn;
import com.cndll.myway.mywayfv.eventtype.BluetoothSearch;
import com.cndll.myway.mywayfv.eventtype.ConnSucc;
import com.cndll.myway.mywayfv.eventtype.StopBleScan;
import com.cndll.myway.mywayfv.util.ObjectSaveUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;

public class CarManagerActivity extends BaseActivity {

    @BindView(R.id.back)
    TextView back;
    @BindView(R.id.device_list)
    ListView deviceList;

    @OnClick(R.id.back)
    void onback() {
        finish();
    }

    @BindView(R.id.search_device)
    TextView searchDevice;

    @OnClick(R.id.search_device)
    void onsearch() {
        Intent intent = new Intent(this, ConnectBleActivity.class);
        startActivity(intent);
    }

    @BindView(R.id.title)
    RelativeLayout title;
    private List<BluetoothDevice> devices;
    private Subscription          search;
    private ConnectedListAdapter  adapter;
    private Subscription          connsucc;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_car_manager);
        ButterKnife.bind(this);
        if (!BluetoothAdapter.getDefaultAdapter().isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivity(enableBtIntent);
        } else {
            RxBus.getDefault().post(new BluetoothSearch());
        }

        adapter = new ConnectedListAdapter();
        devices = new ArrayList<BluetoothDevice>();
        deviceList.setAdapter(adapter);
        setsub();
        getconnlist();
        adapter.setconnectcallback(new ConnectedListAdapter.SetOnclick() {
            @Override
            public void onclick(CarStatu.CarConned d, View view) {
                boolean         iscontan = false;
                BluetoothDevice mdevice  = null;
                UUID            service  = null;
                UUID            chart    = null;
                for (BluetoothDevice device : devices) {
                    if (d.getAddress().equals(device.getAddress())) {
                        iscontan = true;
                        mdevice = device;
                        switch (d.getType()) {
                            case "RA":
                                service = Uuids.uuid_service_RA;
                                chart = Uuids.uuid_characteristic_RA;
                                break;
                            case "SA":
                                service = Uuids.uuid_service_SA;
                                chart = Uuids.uuid_characteristic_SA;
                                break;
                        }
                    }
                }
                if (iscontan) {
                    RxBus.getDefault().post(new BleConn().setBluetoothDevice(mdevice).setService(service).setCharacteristic(chart).setType(d.getType()));
                    displayprog(back);
                } else {
                    Toast.makeText(CarManagerActivity.this, "蓝牙未找到", Toast.LENGTH_SHORT).show();
                    RxBus.getDefault().post(new BluetoothSearch());
                }
            }
        });
        adapter.SetOnRename(new ConnectedListAdapter.Rename() {
            @Override
            public void onRename(final List<CarStatu.CarConned> carConneds, final int p) {
                View           view     = LayoutInflater.from(CarManagerActivity.this).inflate(R.layout.pupview, null, true);
                final EditText rename   = (EditText) view.findViewById(R.id.editname);
                Button         cancel   = (Button) view.findViewById(R.id.cancel);
                Button         makesure = (Button) view.findViewById(R.id.makesure);
                WindowManager  wg       = (WindowManager) CarManagerActivity.this.getSystemService(Context.WINDOW_SERVICE);
                final PopupWindow popupWindow = new PopupWindow(view,
                        wg.getDefaultDisplay().getWidth() / 6 * 5,
                        wg.getDefaultDisplay().getHeight() / 10 * 3, false);
                popupWindow.setFocusable(true);
                popupWindow.setOutsideTouchable(true);
                popupWindow.setBackgroundDrawable(new BitmapDrawable());
                makesure.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String name = rename.getText().toString();
                        if (name != null && !name.replace(" ", "").isEmpty()) {
                            carConneds.get(p).setName(name);
                            ObjectSaveUtils.saveObject(CarManagerActivity.this, CarStatu.CONNLIST, carConneds);
                            popupWindow.dismiss();
                            adapter.setDevices(carConneds);
                            adapter.notifyDataSetChanged();
                        }
                    }
                });
                popupWindow.setOnDismissListener(new PopupWindow.OnDismissListener() {
                    @Override
                    public void onDismiss() {
                        backgroundAlpha(1f);
                    }
                });
                cancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        popupWindow.dismiss();
                    }
                });
                popupWindow.showAtLocation(title, Gravity.CENTER_VERTICAL, 0, 0);
                if (popupWindow.isShowing()) {
                    backgroundAlpha(0.6f);
                }
            }
        });

    }

    private void backgroundAlpha(float bgAlpha)
    {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.alpha = bgAlpha; //0.0-1.0
        getWindow().setAttributes(lp);
    }

    private void setsub() {
        connsucc = RxBus.getDefault().toObservable(ConnSucc.class)
                .observeOn(AndroidSchedulers
                        .mainThread())
                .subscribe(new Observer<ConnSucc>() {
                    @Override
                    public void onCompleted() {

                    }

                    @Override
                    public void onError(Throwable e) {

                    }

                    @Override
                    public void onNext(ConnSucc connSucc) {
                        dismissprog();
                        //Toast.makeText(CarManagerActivity.this, "succ", Toast.LENGTH_SHORT).show();
                        Intent intent1 = new Intent(CarManagerActivity.this, MainActivity.class);
                        startActivity(intent1);
                    }
                });
        search = RxBus.getDefault().toObservable(ScanResult.class).subscribe(new Observer<ScanResult>() {
            @Override
            public void onCompleted() {

            }

            @Override
            public void onError(Throwable e) {

            }

            @TargetApi(Build.VERSION_CODES.LOLLIPOP)
            @Override
            public void onNext(ScanResult scanResult) {
                if (devices == null) {
                    devices = new ArrayList<BluetoothDevice>();
                }
                if (!devices.contains(scanResult.getDevice())) {
                    devices.add(scanResult.getDevice());
                }
            }
        });
    }

    private void getconnlist() {
        List<CarStatu.CarConned> list = null;
        try {
            list = (List<CarStatu.CarConned>) ObjectSaveUtils.getObject(this, CarStatu.CONNLIST);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (list != null) {
            CarStatu.getDefault().setCarConneds(list);
            adapter.setDevices(list);
        }
        if (CarStatu.getDefault().getCarConneds() != null) {
            for (CarStatu.CarConned conned : CarStatu.getDefault().getCarConneds()) {
                Log.d("CONNLIST", conned.getType() + "_" + conned.getName() + "\n" + conned.getAddress());
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        RxBus.getDefault().post(new StopBleScan());
    }
}
