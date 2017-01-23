package com.cndll.myway.mywayfv.view;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.widget.TextView;

import com.cndll.myway.mywayfv.R;


/**
 * Created by kongqing on 17-1-11.
 */
public class SriiView extends TextView {
    public SriiView(Context context) {
        super(context);
    }

    public boolean isriss() {
        return isriss;
    }

    public void setIsriss(boolean isriss) {
        this.isriss = isriss;
    }

    private boolean isriss;

    public SriiView(Context context, AttributeSet attrs) {
        super(context, attrs);
        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.SriiView);
        isriss = a.getBoolean(R.styleable.SriiView_srii, false);

    }

    public SriiView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
        invalidate();
    }

    private int rssi = -1;

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (isriss) {
            int   mwidth  = (getWidth() - getWidth() / 6) / 6;
            int   mmwidth = getWidth() / 36;
            int   mheight = getHeight() / 5;
            Paint paint   = new Paint();
            paint.setColor(Color.BLACK);
            paint.setStyle(Paint.Style.FILL);
            paint.setAntiAlias(true);
            paint.setStrokeWidth(mwidth);
            for (int i = 0; i < rssi; i++) {
                canvas.drawLine(i * (mwidth + mmwidth), getHeight(), i * (mwidth + mmwidth), getHeight() - (i + 1) * mheight, paint);
            }
        }

    }
}
