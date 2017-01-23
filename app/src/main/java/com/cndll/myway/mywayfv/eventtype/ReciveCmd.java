package com.cndll.myway.mywayfv.eventtype;

/**
 * Created by jiang_ruicheng on 16/12/17.
 */
public class ReciveCmd {
    private byte[] cmd;

    public byte[] getCmd() {
        return cmd;
    }

    public ReciveCmd setCmd(byte[] cmd) {
        this.cmd = cmd;
        return this;
    }
}
