package com.cndll.myway.mywayfv.util;

import android.util.Log;

import com.cndll.myway.mywayfv.RXbus.RxBus;
import com.cndll.myway.mywayfv.data.Command;
import com.cndll.myway.mywayfv.eventtype.ReciveCmd;
import com.cndll.myway.mywayfv.eventtype.SendCmd;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;

import rx.Observer;
import rx.Subscription;
import rx.android.schedulers.AndroidSchedulers;


/**
 * Created by kongqing on 16-12-29.
 */
public class Quee {
    public interface callback {
        void callback(byte[] b);
    }

    private QueeThread   queeThread;
    private Subscription recive;

    private Map<String, List<callback>> eventcallbackmap;

    private static class GetQuee {
        private static final Quee QUEE = new Quee();
    }

    public static final Quee getDefault() {
        return GetQuee.QUEE;
    }

    private Quee() {
        if (eventcallbackmap == null) {
            eventcallbackmap = new HashMap<>();
        }
    }

    public synchronized void onstart() {

        if (queeThread == null) {
            queeThread = new QueeThread();
            queeThread.start();
        }

        if (recive == null) {
            recive = RxBus.getDefault().
                    toObservable(ReciveCmd.class).
                    observeOn(AndroidSchedulers.mainThread()).
                    subscribe(new Observer<ReciveCmd>() {
                        @Override
                        public void onCompleted() {

                        }

                        @Override
                        public void onError(Throwable e) {
                            Log.d("error", "onError: " + e.getMessage());
                        }

                        @Override
                        public void onNext(ReciveCmd reciveCmd) {
                            try {

                                if (reciveCmd.getCmd()[0] == Command.HEAD_LOW && reciveCmd.getCmd()[1] == Command.HEAD_HEIGHT && Command.chechsum(reciveCmd.getCmd())) {
                                    byte eventtype = 0;
                                    if (reciveCmd.getCmd() != null) {
                                        eventtype = geteventtype(reciveCmd.getCmd());
                                    }
                                    Log.i("send", "addcomm: GO");
                                    if (reciveCmd.getCmd()[2] == Command.EVENT_ACK) {
                                        Log.i("send", "addcomm: GO");
                                        onnext();
                                    }
                                    Log.d("TAG", "onNext: " + eventcallbackmap.containsKey(String.valueOf(eventtype)));
                                    if (eventcallbackmap != null && eventcallbackmap.containsKey(String.valueOf(eventtype))) {
                                        for (callback c : eventcallbackmap.get(String.valueOf(eventtype))) {
                                            c.callback(reciveCmd.getCmd());
                                        }
                                    }
                                }
                            } catch (Exception e) {
                                Log.d("error", "onNext: " + e.getMessage());
                            }
                        }
                    });
        }
    }

    public void registcallback(int type, callback callback) {
        if (eventcallbackmap != null) {
            if (!eventcallbackmap.containsKey(type)) {
                List<callback> callbacks = new ArrayList<>();
                callbacks.add(callback);
                eventcallbackmap.put(String.valueOf(type), callbacks);
            } else {
                eventcallbackmap.get(String.valueOf(type)).add(callback);
            }
        }
    }

    public void unregistcallback(int type, callback callback) {
        if (eventcallbackmap != null) {
            if (!eventcallbackmap.containsKey(type)) {
                return;
            } else {
                eventcallbackmap.get(type).remove(callback);
            }
        }
    }

    private byte geteventtype(byte[] b) {
        if (b[3] > 20) {
            return (byte) 0xff;
        }
        if (b[2] == 0x05) {
            return b[4];
        }/* else if (b[2] != 0x05) {
            return b[2];
        }*/
        return b[2];
    }

    private void getcallback(int type) {
        if (eventcallbackmap != null && eventcallbackmap.containsKey(type)) {
            for (callback c : eventcallbackmap.get(type)) {
                c.callback(new byte[]{});
            }
        }
    }

    public void sendcomm(byte[] b) {
        if (queeThread != null) {
            queeThread.addcomm(b);

        }
    }

    public void removecomm(byte[] b) {
        if (queeThread != null) {
            queeThread.removecomm(b);
        }
    }

    public void pop() {
        if (queeThread != null) {
            queeThread.pop();
        }
    }

    public void onstop() {
        if (queeThread != null) {
            queeThread.onstop();
            queeThread = null;
        }
        if (eventcallbackmap != null) {
            eventcallbackmap = null;
        }
        if (recive.isUnsubscribed()) {
            recive.unsubscribe();
            recive = null;
        }
    }

    public void onnext() {
        if (queeThread != null) {
            queeThread.next();
        }
    }

    private class QueeThread extends Thread {
        private boolean       isrun;
        private boolean       stop;
        private Queue<byte[]> comm;

        public QueeThread() {
            comm = new ArrayBlockingQueue<byte[]>(20);
            isrun = true;
            stop = false;
        }

        public void addcomm(byte[] b) {
            comm.add(b);
            Log.i("add", "addcomm: " + isrun);
        }

        public void removecomm(byte[] b) {
            comm.remove(b);
        }

        public void pop() {
            comm.poll();
        }

        public void onstop() {
            stop = true;
        }

        public void next() {
            /*comm.remove(comm.size() - 1);*/
            comm.poll();
            isrun = true;

            Log.i("next", "addcomm: " + isrun);
        }

        @Override
        public void run() {
            super.run();
            while (true) {
                try {
                    sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (stop) {
                    break;
                }
                if (!comm.isEmpty() && isrun) {
                    if (comm.size() != 0) {
                        RxBus.getDefault().post(new SendCmd().setCmd(comm.element()));
                        Log.i("send", "addcomm: " + comm.element()[2]);
                        isrun = false;
                    }
                }
            }
        }
    }
}
