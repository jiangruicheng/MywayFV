package com.cndll.myway.mywayfv.eventtype;

/**
 * Created by kongqing on 17-1-18.
 */
public class UpdataProg {
    public int getTotal() {
        return total;
    }

    public UpdataProg setTotal(int total) {
        this.total = total;
        return this;
    }

    private int total;

    public int getNow() {
        return now;
    }

    public UpdataProg setNow(int now) {
        this.now = now;
        return this;
    }

    private int now;
}
