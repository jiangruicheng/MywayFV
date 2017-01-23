package com.cndll.myway.mywayfv.eventtype;

/**
 * Created by kongqing on 17-1-9.
 */
public class DisConnNotify {
    public String getMesg() {
        return mesg;
    }

    public DisConnNotify setMesg(String mesg) {
        this.mesg = mesg;
        return this;
    }

    String mesg;
}
