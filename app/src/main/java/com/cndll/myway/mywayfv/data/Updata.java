package com.cndll.myway.mywayfv.data;

import android.content.Context;
import android.util.Log;

import com.cndll.myway.mywayfv.R;
import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.eventtype.SendCmd;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by kongqing on 17-1-16.
 */
public class Updata {
    private static class getclass {
        private static final Updata UPDATA = new Updata();
    }

    private int     i              = 1;
    private boolean b              = true;
    private boolean next           = false;
    private boolean isupdatafinish = false;
    private boolean isupdata       = false;
    private InputStream inputStream;
    private int cont = -1;
    private Context context;

    private Updata() {

    }

    public static Updata getDefault() {
        return getclass.UPDATA;
    }

    private File file;

    public void setFile(File file) {
        this.file = file;
    }

    public byte[] getSOH() {
        if (file == null) {
            return null;
        }
        byte[] soh = new byte[131];
        soh[0] = 0x01;
        soh[1] = 0x00;
        soh[2] = (byte) 0xff;
        byte[] name = file.getName().getBytes();
        System.arraycopy(name, 0, soh, 3, name.length);
        soh[name.length + 3] = 0x00;
        byte[] size = Long.toHexString(file.getTotalSpace()).getBytes();
        System.arraycopy(size, 0, soh, name.length + 4, size.length);
        return soh;
    }

    public byte[] getUpdata() {
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
                    return null;
                } else if (i == Math.ceil((float) cont / 1024) + 2) {
                    RxBus.getDefault().post(new SendCmd().setCmd(new byte[]{0x04}));
                    i++;
                    return null;
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


        return null;
    }
}
