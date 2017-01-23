package com.cndll.myway.mywayfv.activity;

import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.ble.ConnBle;
import com.cndll.myway.mywayfv.ble.ScanBle;
import com.cndll.myway.mywayfv.eventtype.BleConn;
import com.cndll.myway.mywayfv.eventtype.BluetoothSearch;
import com.cndll.myway.mywayfv.eventtype.StopBleScan;

import java.util.UUID;

import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;


/**
 * Created by jiang_ruicheng on 16/12/15.
 */
public class BleService extends Service {
    Subscription     ble_start;
    Subscription     ble_conn;
    Subscription     ble_stopscanle;
    ScanBle          scanBle;
    BluetoothAdapter bluetoothAdapter;
    ConnBle          connBle;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i("TAG", "onCreate: bleservice");
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        connBle = new ConnBle();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (ble_conn == null) {
            ble_conn = RxBus.getDefault().toObservable(BleConn.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<BleConn>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(BleConn conn) {
                    BluetoothDevice device         = conn.getBluetoothDevice();
                    UUID            service        = conn.getService();
                    UUID            characteristic = conn.getCharacteristic();

                    connBle.connble(device, BleService.this, service, characteristic, conn.getType());
                }
            });
        }
        if (ble_start == null) {
            ble_start = RxBus.getDefault().toObservable(BluetoothSearch.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<Object>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(Object o) {
                    if (!bluetoothAdapter.isEnabled()) {
                        Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                        startActivity(enableBtIntent);
                    } else {

                        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
                            bluetoothAdapter.startDiscovery();
                        } else {
                            if (scanBle == null) {
                                scanBle = new ScanBle(new Handler());
                            }
                            scanBle.scantble();
                        }
                    }
                }
            });
        }
        if (ble_stopscanle == null) {
            ble_stopscanle = RxBus.getDefault().toObservable(StopBleScan.class).subscribe(new Observer<StopBleScan>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {

                }

                @Override
                public void onNext(StopBleScan stopBleScan) {
                    if (ble_stopscanle != null) {
                        scanBle.stopscantble();
                    }
                }
            });
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        Log.i("TAG", "onDestroy: " + "bleservice");
        super.onDestroy();

        if (ble_conn.isUnsubscribed()) {
            ble_conn.unsubscribe();
        }
        if (ble_start.isUnsubscribed()) {
            ble_start.unsubscribe();
        }
    }
}
