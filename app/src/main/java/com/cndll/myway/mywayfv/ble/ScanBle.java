package com.cndll.myway.mywayfv.ble;

import android.annotation.TargetApi;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.os.Build;
import android.os.Handler;
import android.os.ParcelUuid;
import android.util.Log;

import com.cndll.myway.mywayfv.RXbus.RxBus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@TargetApi(Build.VERSION_CODES.LOLLIPOP)
public class ScanBle {
    private UUID serviceUUid_SA = UUID.fromString("0000FFF0-0000-1000-8000-00805F9B34FB");
    private UUID serviceUUid_RA = UUID.fromString("00001000-0000-1000-8000-00805F9B34FB");
    private Handler handler;

    private int ScanTIME = 20000;
    BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
    private BluetoothLeScanner leScanner = adapter.getBluetoothLeScanner();

    public ScanBle(Handler handler) {

        this.handler = handler;

    }

    @TargetApi(Build.VERSION_CODES.M)
    public void scantble() {

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                stopscantble();
            }
        }, ScanTIME);
        //   leScanner.startScan(scanCallback);
        ScanFilter       scanFilter_SA = new ScanFilter.Builder().setServiceUuid(new ParcelUuid(serviceUUid_SA)).build();
        ScanFilter       scanFilter_RA = new ScanFilter.Builder().setServiceUuid(new ParcelUuid(serviceUUid_RA)).build();
        List<ScanFilter> scanFilters   = new ArrayList<>();
        scanFilters.add(scanFilter_RA);
        scanFilters.add(scanFilter_SA);
        ScanSettings.Builder builder = new ScanSettings.Builder();
        builder.setCallbackType(ScanSettings.CALLBACK_TYPE_ALL_MATCHES);
        builder.setScanMode(ScanSettings.SCAN_MODE_BALANCED);
        ScanSettings scanSettings = builder.build();
        leScanner.startScan(scanFilters, scanSettings, scanCallback);
        //leScanner.startScan(scanCallback);
    }

    public void stopscantble() {
        leScanner.stopScan(scanCallback);
/*
        baseAdapter.notifyDataSet(BleAdapter.DataSetObserver.NOT_ZORE);
*/
    }

    private ScanCallback scanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, final ScanResult result) {
            super.onScanResult(callbackType, result);
            String       name = result.getDevice().getName();
            StringBuffer type = new StringBuffer();
            for (int i = 0; i < name.length(); i++) {
                if (name.charAt(i) == '-') {
                    break;
                }
                type.append(name.charAt(i));
            }
            Log.i("typename", "onScanResult: " + type);
            RxBus.getDefault().post(result);
        }
    };
}
