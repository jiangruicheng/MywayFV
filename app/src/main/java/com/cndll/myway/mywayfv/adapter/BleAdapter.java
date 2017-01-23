package com.cndll.myway.mywayfv.adapter;

import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.database.DataSetObserver;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.view.SriiView;

import java.util.ArrayList;
import java.util.List;


public class BleAdapter extends BaseAdapter {
    List<BluetoothDevice> devices = new ArrayList<>();
    Handler               handler = new Handler();

    public List<DeviceMesg> getDeviceMesgs() {
        return deviceMesgs;
    }

    List<DeviceMesg> deviceMesgs = new ArrayList<>();
    LayoutInflater  layoutInflater;
    Context         context;
    DataSetObserver observer;

    /*public interface DataSetObserver {
        public static final int ADD = 0;
        public static final int SUB = 1;
        public static final int ZORE = 2;
        public static final int NOT_ZORE = 0;
        public static final boolean is_status = true;

        public void datachange(int statue);
    }*/

/*
    public void registerDataSetObserver(DataSetObserver observer) {
        this.observer = observer;
    }
*/

/*    public void notifyDataSet(int statue) {
        if (observer != null) {
            observer.datachange(statue);
        }
    }*/

    public BleAdapter(Context context) {
        this.context = context;
        layoutInflater = LayoutInflater.from(context);
        //metrics = context.getResources().getDisplayMetrics();
    }

    public void addDevice(final BluetoothDevice device) {
        if (!devices.contains(device)) {
            devices.add(device);
            new Thread() {
                @Override
                public void run() {
                    super.run();
                    parsername(device.getName(), deviceMesgs);
                }
            }.start();
        }
    }

    @Override
    public int getCount() {
        return devices.size();
    }

    @Override
    public Object getItem(int position) {
        return devices.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    //private DisplayMetrics metrics;

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {


        convertView = LayoutInflater.from(context).inflate(R.layout.devicelist_item, null);
        if (devices.size() == 0) {
            /*observer.datachange(DataSetObserver.ZORE);*/
        }
        if (devices.size() != 0 && !deviceMesgs.isEmpty()) {
            /*observer.datachange(DataSetObserver.NOT_ZORE);*/
            TextView type = (TextView) convertView.findViewById(R.id.type);
            TextView name = (TextView) convertView.findViewById(R.id.name);
            SriiView srii = (SriiView) convertView.findViewById(R.id.srii);

            //srii.setWidth(6 * metrics.densityDpi);
            //textView.setText(devices.get(position).getAddress());
            /*BluetoothDevice bluetoothDevice = devices.get(position);*/
            type.setText(deviceMesgs.get(position).getType());
            name.setText(deviceMesgs.get(position).getName());
            srii.setIsriss(true);
            srii.setRssi(5);
            //textView.setText("   " + deviceMesgs.get(position).getType() + " \n" + "    " + deviceMesgs.get(position).getName());
        }
        return convertView;
    }

    public List<BluetoothDevice> getDevices() {
        return devices;
    }

    private synchronized void parsername(String name, List<DeviceMesg> deviceMesgList) {
        int          i          = 0;
        int          a          = 0;
        StringBuffer devicename = new StringBuffer();
        StringBuffer devicetype = new StringBuffer();
        DeviceMesg   mesg       = new DeviceMesg();
        boolean      isrun      = true;
        while (isrun) {
            if (a == name.length()) {
                mesg.setName(devicename.toString());
                deviceMesgList.add(mesg);
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        notifyDataSetChanged();
                    }
                });
                break;
            }
            if (name.charAt(a) == '-') {
                i = 1;
                a = a + 1;
                mesg.setType(devicetype.toString());
            }
            switch (i) {
                case 0:
                    devicetype.append(name.charAt(a));
                    break;
                case 1:
                    devicename.append(name.charAt(a));
                    break;
                case 2:
                    break;
            }
            a++;
        }
    }

    public static class DeviceMesg {
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        String name;
        String type;

    }
}
