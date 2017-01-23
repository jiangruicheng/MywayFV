package com.cndll.myway.mywayfv.activity;

import android.os.Bundle;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.data.CarStatu;
import com.cndll.myway.mywayfv.fragment.CarStatuFragment;


public class CarStatuActivity extends BaseActivity {
    private CarStatuFragment carStatuFragment;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_car_statu);
        carStatuFragment = new CarStatuFragment(CarStatu.getDefault().getType());
        getSupportFragmentManager().beginTransaction().add(R.id.fragment_frame, carStatuFragment).commit();
    }


}
