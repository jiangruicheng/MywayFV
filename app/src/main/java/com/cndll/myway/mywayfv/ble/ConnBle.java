package com.cndll.myway.mywayfv.ble;

import android.annotation.TargetApi;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.data.Command;
import com.cndll.myway.mywayfv.data.Uuids;
import com.cndll.myway.mywayfv.eventtype.*;
import com.cndll.myway.mywayfv.eventtype.SendCmd;
import com.cndll.myway.mywayfv.util.ByteUtil;
import com.cndll.myway.mywayfv.util.ObjectSaveUtils;
import com.cndll.myway.mywayfv.util.Quee;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;

/**
 * XIU GAI WAN CHENG
 */
@TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
public class ConnBle {
    private UUID                        uuid_service;
    private UUID                        uuid_characteristic;
    private UUID                        uuid_getdata;
    //private BluetoothDevice device;
    // private Context context;
    private BluetoothGattCharacteristic characteristic;
    private BluetoothGattCharacteristic getdata;
    private BluetoothGattService        gattService;
    BluetoothGatt gatt;
    private List<Byte> cmd;
    private ReciveCmd reciveCmd = new ReciveCmd();
    private Subscription SendCmd;
    private Subscription disconn;
    private Context      context;
    private boolean      isRun;

    public ConnBle() {
        /*isRun = true;*/
        cmd = new ArrayList<>(1024);
        new Thread() {
            @Override
            public void run() {
                super.run();
                int count = 0;
                int i     = 0;
                while (true) {
                    try {
                        sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if (isRun)
                        if (cmd.size() != 0) {
                            switch (i) {
                                case 0:
                                    if (cmd.get(0) == Command.HEAD_LOW) {

                                    } else {
                                        cmd.remove(0);
                                        break;
                                    }
                                case 1:
                                    if (cmd.size() < 2) {
                                        break;
                                    }
                                    if (cmd.get(1) == Command.HEAD_HEIGHT) {

                                    } else {
                                        cmd.remove(0);
                                        cmd.remove(0);
                                        break;
                                    }
                                case 2:
                                    if (cmd.size() < 4 || cmd.size() < cmd.get(3) + 6) {
                                        i = 0;
                                        break;
                                    }
                                    byte[] b = new byte[6 + cmd.get(3)];
                                    Log.d("RECIVEQUEE", "run: " + cmd.get(3) + "//" + cmd.size());
                                    for (int k = 0; k < b.length; k++) {
                                        b[k] = cmd.get(k);
                                    }
                                    if (Command.chechsum(b)) {
                                        RxBus.getDefault().post(new ReciveCmd().setCmd(b));
                                        for (int j = 0; j < b.length; j++) {
                                            cmd.remove(0);
                                        }
                                        Log.d("revice", "" + cmd.size());
                                    } else {
                                        cmd.remove(0);
                                        cmd.remove(0);
                                    }
                                    break;
                            }
                        }
                }
            }
        }.start();
        disconn = RxBus.getDefault().toObservable(DisBleConn.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<DisBleConn>() {
            @Override
            public void onCompleted() {

            }

            @Override
            public void onError(Throwable e) {

            }

            @Override
            public void onNext(DisBleConn disBleConn) {
                if (gatt != null) {
                    gatt.disconnect();
                    Quee.getDefault().onstop();
                }
            }
        });
        if (SendCmd == null) {
            SendCmd = RxBus.getDefault().toObservable(com.cndll.myway.mywayfv.eventtype.SendCmd.class).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<SendCmd>() {
                @Override
                public void onCompleted() {

                }

                @Override
                public void onError(Throwable e) {
                    e.printStackTrace();
                }

                @Override
                public void onNext(com.cndll.myway.mywayfv.eventtype.SendCmd sendCmd) {
                    try {
                        /*sendCmd.getCmd();*/
                        write(sendCmd.getCmd());
                        Log.i("send", "onNext: " + sendCmd.getCmd().toString());

                    } catch (Exception e) {
                        RxBus.getDefault().post(new DisConnNotify().setMesg(e.getMessage()));
                        e.printStackTrace();
                        //Log.d("send", "onNext: " + e.getMessage());
                    }
                }
            });
        }
    }

    private String type;

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    public BluetoothGatt connble(BluetoothDevice device, Context context, UUID service, UUID characteristic, String type) {
        uuid_service = service;
        uuid_characteristic = characteristic;
        gatt = device.connectGatt(context, false, gattCallback);
        //getserver(gatt);
        this.context = context;
        this.type = type;
        return gatt;

    }

    private void savestatue() {
        new Thread() {
            @Override
            public void run() {
                super.run();
                Quee.getDefault().onstart();
                try {
                    if (type.equals("SA")) {
                        CarStatu.getDefault().setType("SA");
                    } else {
                        CarStatu.getDefault().setType("RA");
                        //    CarStatu.getDefault().getCarconnceting().setType("RA");
                    }

                    String  address  = gatt.getDevice().getAddress();
                    boolean iscontan = false;
                    for (int i = 0; i < CarStatu.getDefault().getCarConneds().size(); i++) {
                        if (address.equals(CarStatu.getDefault().getCarConneds().get(i).getAddress())) {
                            iscontan = true;
                        }
                    }
                    if (!iscontan) {
                        CarStatu.getDefault().addconnected(new CarStatu.CarConned().setType(CarStatu.getDefault().getType()).setName(gatt.getDevice().getName().substring(gatt.getDevice().getName().indexOf("-") + 1)).setAddress(gatt.getDevice().getAddress()));
                        ObjectSaveUtils.saveObject(context, CarStatu.CONNLIST, CarStatu.getDefault().getCarConneds());
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                       /* CarStatu.getDefault().addconnected(new CarStatu.CarConned().setType(CarStatu.getDefault().getType()).setName(gatt.getDevice().getName().substring(gatt.getDevice().getName().indexOf("-") + 1)).setAddress(gatt.getDevice().getAddress()));
                        ObjectSaveUtils.saveObject(context, CarStatu.CONNLIST, CarStatu.getDefault().getCarConneds());
*/

                // context = null;

            }
        }.start();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    private void getserver(final BluetoothGatt gatt) {
        List<BluetoothGattService> list;
        list = gatt.getServices();
        if (uuid_service == null || uuid_characteristic == null) {
            return;
        }
        switch (type) {
            case "SA":
                for (BluetoothGattService gattService : list) {
                    if (gattService.getUuid().equals(Uuids.uuid_service_SA_read)) {
                        gatt.setCharacteristicNotification(gattService.
                                        getCharacteristic(Uuids.uuid_characteristic_SA_read),
                                true);
                    }
                    if (gattService.getUuid().equals(Uuids.uuid_service_SA_write)) {
                        this.gattService = gattService;
                        characteristic = gattService.getCharacteristic(Uuids.uuid_characteristic_SA_write);
                        new Thread() {
                            @Override
                            public void run() {
                                super.run();
                                try {
                                    sleep(2000);
                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                                write(Command.getCommand(Command.setData(Command.COM_QUERY, new byte[]{0x01})));
                                setConnectingMesg(gatt);
                                RxBus.getDefault().post(new ConnSucc());
                                isRun = true;
                            }
                        }.start();
                        Log.d("ble", "getserver: success");
                    }

                }
                break;
            case "RA":
                for (BluetoothGattService gattService : list) {
                    if (gattService.getUuid().equals(Uuids.uuid_service_RA)) {
                        this.gattService = gattService;
                        characteristic = gattService.getCharacteristic(Uuids.uuid_characteristic_RA);
                        for (BluetoothGattCharacteristic characteristic : gattService.getCharacteristics()) {
                            gatt.setCharacteristicNotification(characteristic, true);
                        }
                        isRun = true;
                        setConnectingMesg(gatt);
                        RxBus.getDefault().post(new ConnSucc());
                        Log.d("ble", "getserver: success");
                    }
                }
                break;
        }

        savestatue();
    }

    private void setConnectingMesg(BluetoothGatt gatt) {
        CarStatu.getDefault().setCarconnceting(new CarStatu.CarConned());
        CarStatu.getDefault().getCarconnceting().setType(type);
        CarStatu.getDefault().getCarconnceting().setAddress(gatt.getDevice().getAddress());
        CarStatu.getDefault().getCarconnceting().setName(gatt.getDevice().getName());
    }

    public boolean write(byte[] cmd) {
        if (gatt.connect()) {
            characteristic.setValue(cmd);//41 54 02 17 00 52
            gatt.writeCharacteristic(characteristic);
            int i = 0;
            for (byte b : cmd) {
                String a = Integer.toHexString(b);
                Log.d("cmd" + i, "cmd: " + Integer.toHexString(b));
                i++;
            }
            return true;
        } else {
            Log.d("cmd", "write: disconect");
            return false;
        }
    }

    private BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicRead(gatt, characteristic, status);
            Log.i("notify_read", status + "" + characteristic.getValue());
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicWrite(gatt, characteristic, status);

            Log.i("notify_write", status + " " + characteristic.getValue());
        }

        byte[] by = new byte[54];

        int i = 1;
        boolean b = true;
        boolean next = false;
        boolean isupdatafinish = false;
        boolean isupdata = false;
        InputStream inputStream;
        int cont = -1;

        @Override
        public synchronized void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            super.onCharacteristicChanged(gatt, characteristic);
            String s = "ACK";
            if (characteristic.getValue()[0] != 0x4d && isupdata) {
                for (byte b : characteristic.getValue()) {
                    Log.d("ACK", "ACK：" + b);
                    if (b == 0x15 && isupdatafinish) {
                        next = true;
                    }
                    if (b == 6) {
                        next = true;
                        Log.d("CCC", "C：" + b);
                    }
                }

            }

            Log.d("ReciveString", ByteUtil.getString(characteristic.getValue()));
            if (next && !b) {
                Log.d("updata", "setupdata");
                b = false;
                next = false;
                if (inputStream == null) {
                    inputStream = context.getResources().openRawResource(R.raw.led);
                    try {
                        cont = inputStream.available();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                byte[] updata = new byte[1027];
                updata[0] = 0x02;
                updata[1] = (byte) i;
                updata[2] = (byte) (255 - i);

                try {
                    int now = inputStream.available();
                    RxBus.getDefault().post(new UpdataProg().setNow(now).setTotal(cont));
                    Log.d("INPUTSIZE", "SIZE " + i + ":" + inputStream.available());
                    if (i < Math.ceil((float) cont / 1024)) {
                        inputStream.read(updata, 3, 1024);
                    } else if (i == Math.ceil((float) cont / 1024)) {
                        inputStream.read(updata, 3, cont % 1024);
                        for (int a = 0; a < updata.length - cont % 1024 - 3; a++) {
                            updata[cont % 1024 + 3 + a] = 0x1a;
                        }
                        isupdatafinish = true;
                    } else if (i == Math.ceil((float) cont / 1024) + 1) {
                        RxBus.getDefault().post(new SendCmd().setCmd(new byte[]{0x04}));
                        i++;
                        return;
                    } else if (i == Math.ceil((float) cont / 1024) + 2) {
                        RxBus.getDefault().post(new SendCmd().setCmd(new byte[]{0x04}));
                        i++;
                        return;
                    } else if (i == Math.ceil((float) cont / 1024) + 3) {
                        updata = new byte[131];
                        updata[0] = 0x01;
                        updata[1] = 0x00;
                        updata[2] = (byte) 255;
                    }
                    updata = Command.getCommand(updata);
                    final byte[] finalUpdata = updata;
                    new Thread() {
                        @Override
                        public void run() {
                            super.run();
                            for (int i = 0; i < Math.ceil((float) finalUpdata.length / 20); i++) {
                                byte[] a = new byte[20];
                                Log.d("conut", "onCharacteristicChanged: " + i);
                                if (i == Math.ceil((float) finalUpdata.length / 20) - 1) {
                                    a = new byte[finalUpdata.length % 20];
                                    System.arraycopy(finalUpdata, i * 20, a, 0, finalUpdata.length % 20);
                                } else {
                                    System.arraycopy(finalUpdata, i * 20, a, 0, 20);
                                }

                                RxBus.getDefault().post(new SendCmd().setCmd(a));
                                try {
                                    sleep(50);
                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }.start();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                /*if (i == 255) {
                    i = 0;
                }*/
                i++;
            }
            if (ByteUtil.getString(characteristic.getValue()).equals("C") && b) {
                b = false;
                isupdata = true;
                byte[] updata = new byte[131];
                // AssetFileDescriptor file   = context.getResources().openRawResourceFd(R.raw.led);
                updata[0] = 0x01;
                updata[1] = 0x00;
                updata[2] = (byte) 255;
                updata[3] = 0x6c;
                updata[4] = 0x65;
                updata[5] = 0x64;
                updata[6] = 0x2e;
                updata[7] = 0x62;
                updata[8] = 0x69;
                updata[9] = 0x6e;
                updata[10] = 0x00;
                updata[11] = 0x35;
                updata[12] = 0x39;
                updata[13] = 0x34;
                updata[14] = 0x38;
                //RxBus.getDefault().post(new SendCmd().setCmd(updata));
                updata = Command.getCommand(updata);
                for (int i = 0; i < Math.ceil((float) updata.length / 20); i++) {
                    byte[] a = new byte[20];
                    Log.d("conut", "onCharacteristicChanged: " + i);
                    if (i == Math.ceil((float) updata.length / 20) - 1) {
                        a = new byte[updata.length % 20];
                        System.arraycopy(updata, i * 20, a, 0, updata.length % 20);
                    } else {
                        System.arraycopy(updata, i * 20, a, 0, 20);
                    }
                    RxBus.getDefault().post(new SendCmd().setCmd(a));

                }

            } else {
                for (int i = 0; i < characteristic.getValue().length; i++) {
                    cmd.add(characteristic.getValue()[i]);
                    Log.d("recive", i + "：" + Integer.toHexString(characteristic.getValue()[i]));
                }
            }
/*
            handlerCmd.handler(characteristic.getValue());
*/
           /* if (characteristic.getValue()[3] < 20 && characteristic.getValue()[0] == Command.HEAD_LOW && characteristic.getValue()[1] == Command.HEAD_HEIGHT) {
                reciveCmd.setCmd(characteristic.getValue());
                RxBus.getDefault().post(reciveCmd);
            }
            for (int i = 0; i < characteristic.getValue().length; i++) {
                Log.d("data" + i, Integer.toHexString(characteristic.getValue()[i]));
            }
            //reciveCmd.setCmd(characteristic.getValue());
            if (characteristic.getValue()[3] > 20 && characteristic.getValue()[0] == Command.HEAD_LOW && characteristic.getValue()[1] == Command.HEAD_HEIGHT) {
                System.arraycopy(characteristic.getValue(), 0, by, 0, 20);
            }

            if (characteristic.getValue().length < 20 && characteristic.getValue()[0] != Command.HEAD_LOW && characteristic.getValue()[1] != Command.HEAD_HEIGHT) {
                System.arraycopy(characteristic.getValue(), 0, by, 40, characteristic.getValue().length);
                reciveCmd.setCmd(by);
                RxBus.getDefault().post(reciveCmd);
                *//*byte[] type = new byte[4];
                System.arraycopy(by, 4, type, 0, 4);
                String s = new String(type);
                Log.d("chartype", "onCharacteristicChanged: " + new String(type));
                byte[] classic = new byte[8];
                String a       = new String(type);
                Log.d("classic", "onCharacteristicChanged: " + new String(classic));
                System.arraycopy(by, 7, classic, 0, 8);*//*
            } else if (characteristic.getValue().length == 20 && characteristic.getValue()[0] != Command.HEAD_LOW && characteristic.getValue()[1] != Command.HEAD_HEIGHT) {
                System.arraycopy(characteristic.getValue(), 0, by, 20, 20);
            }*/


        }

        @Override
        public void onDescriptorRead(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            super.onDescriptorRead(gatt, descriptor, status);
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            super.onDescriptorWrite(gatt, descriptor, status);
        }

        @Override
        public void onReliableWriteCompleted(BluetoothGatt gatt, int status) {
            super.onReliableWriteCompleted(gatt, status);
        }

        @Override
        public void onReadRemoteRssi(BluetoothGatt gatt, int rssi, int status) {
            super.onReadRemoteRssi(gatt, rssi, status);
        }

        @Override
        public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
            super.onMtuChanged(gatt, mtu, status);
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            super.onServicesDiscovered(gatt, status);
            getserver(gatt);
        }

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);
            if (newState == BluetoothGatt.STATE_CONNECTED) {
                Log.d("BLE", "CONNECT");
                gatt.discoverServices();

                //RxBus.getDefault().post(new ConnSucc());
            } else if (newState == BluetoothGatt.STATE_DISCONNECTED) {
                Log.d("BLE", "DISCONNECT");
                RxBus.getDefault().post(new DisConnNotify());
                ConnBle.this.gatt.disconnect();
                CarStatu.getDefault().setCarconnceting(null);
                ConnBle.this.gatt = null;
                if (SendCmd.isUnsubscribed()) {
                    SendCmd.unsubscribe();
                    SendCmd = null;
                    isRun = false;
                }
                if (disconn.isUnsubscribed()) {
                    disconn.unsubscribe();
                    disconn = null;
                }
            }
        }
    };
}
