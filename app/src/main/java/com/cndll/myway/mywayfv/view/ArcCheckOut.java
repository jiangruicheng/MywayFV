package com.cndll.myway.mywayfv.view;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.media.ThumbnailUtils;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

import com.cndll.myway.mywayfv.R;


/**
 * Created by jiang_ruicheng on 17/1/2.
 */
public class ArcCheckOut extends View {
    public ArcCheckOut(Context context) {
        super(context);
    }

    public ArcCheckOut(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public ArcCheckOut(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    private Paint paint;
    private boolean ISstart = false;

    public void setProg(int prog) {
        this.prog = prog;
        ISstart = true;
        invalidate();
    }

    private int    prog           = 60;
    private String start_checkout = "开始检测";
    private String stop_checkout  = "终止检测";
    private String progtext;

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        paint = new Paint();

        paint.setColor(Color.rgb(0xbb, 0xb2, 0xb2));
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(getWidth() / 30);

        canvas.drawCircle(getWidth() / 2, getHeight() / 2, getWidth() / 2 - getWidth() / 30, paint);

        if (!ISstart) {
            Bitmap bp = BitmapFactory.decodeResource(getResources(), R.mipmap.guzhang);
            bp = ThumbnailUtils.extractThumbnail(bp, getWidth() / 4, getHeight() / 4);
            canvas.drawBitmap(bp, getWidth() / 2 - bp.getWidth() / 2, getHeight() / 4, paint);
            bp.recycle();
        }

        canvas.rotate(270, getWidth() / 2, getHeight() / 2);
        RectF rectF = new RectF(getWidth() / 30, getWidth() / 30, getWidth() - getWidth() / 30, getHeight() - getWidth() / 30);
        paint.setColor(Color.GREEN);
        if (ISstart) {
            canvas.drawArc(rectF, 0, (float) 360 / (float) 100 * prog, false, paint);
        }
        canvas.rotate(90, getWidth() / 2, getHeight() / 2);
        paint.setStrokeWidth(1);
        paint.setStyle(Paint.Style.FILL);
        if (ISstart) {
            progtext = prog + "";
            paint.setTextSize(getWidth() / 5);
            canvas.drawText(progtext, getWidth() / 2 - paint.measureText(progtext) / 2, getHeight() / 8 * 3, paint);
            paint.setTextSize(getWidth() / 10);
            canvas.drawText("%", getWidth() / 2 + paint.measureText(progtext) + paint.measureText("%") / 2, getHeight() / 8 * 3, paint);
        }

        paint.setTextSize(getWidth() / 8);
        paint.setColor(Color.GRAY);
        String s;
        if (ISstart) {
            s = stop_checkout;
        } else {
            s = start_checkout;
        }
        canvas.drawText(s, getWidth() / 2 - paint.measureText(s) / 2, getHeight() - getHeight() / 4, paint);


    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (isEnabled()) {
            return super.onTouchEvent(event);
        } else {
            return true;
        }
    }

    public void reset() {
        ISstart = false;
    }
}
