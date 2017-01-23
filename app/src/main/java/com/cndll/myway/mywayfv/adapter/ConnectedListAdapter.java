package com.cndll.myway.mywayfv.adapter;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.data.CarStatu;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kongqing on 17-1-11.
 */
public class ConnectedListAdapter extends BaseAdapter {
    public List<CarStatu.CarConned> getDevices() {
        return devices;
    }

    public void setDevices(List<CarStatu.CarConned> devices) {
        this.devices = devices;
    }

    List<CarStatu.CarConned> devices = new ArrayList<>();

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

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        View     view = LayoutInflater.from(parent.getContext()).inflate(R.layout.connected_list_item, null);
        TextView type = (TextView) view.findViewById(R.id.type);
        TextView name = (TextView) view.findViewById(R.id.name);
        TextView srii = (TextView) view.findViewById(R.id.srii);
        srii.setWidth(120 * parent.getContext().getResources().getDisplayMetrics().densityDpi);
        srii.setText("修改名称");
        srii.setTextColor(Color.RED);
        srii.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (rename != null) {
                    rename.onRename(devices, position);
                }
            }
        });
        type.setText(devices.get(position).getType());
        name.setText(devices.get(position).getName());
        name.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onclick != null) {
                    onclick.onclick(devices.get(position), v);
                }
            }
        });
        return view;
    }

    private SetOnclick onclick;

    public void setconnectcallback(SetOnclick onclick) {
        this.onclick = onclick;
    }

    private Rename rename;

    public void SetOnRename(Rename rename) {
        this.rename = rename;
    }

    public interface Rename {
        void onRename(List<CarStatu.CarConned> carConneds, int p);
    }

    public interface SetOnclick {
        void onclick(CarStatu.CarConned d, View view);
    }
}
