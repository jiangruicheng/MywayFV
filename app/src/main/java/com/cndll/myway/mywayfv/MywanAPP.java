package com.cndll.myway.mywayfv;

import com.tencent.bugly.crashreport.CrashReport;

import io.dcloud.application.DCloudApplication;

/**
 * Created by kongqing on 17-1-13.
 */
public class MywanAPP extends DCloudApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        CrashReport.initCrashReport(getApplicationContext(), "7637940377", true);
    }
}
