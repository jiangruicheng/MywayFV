package com.cndll.myway.mywayfv.view;/*
package com.jiangruicheng.myway.view;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.os.Build;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.View;

import com.jiangruicheng.myway.R;

*/
/**
 * Created by jiang_ruicheng on 16/12/16.
 */
/*

public class ArcProgressBar extends View {
    public ArcProgressBar(Context context) {
        super(context);
        init();
    }

    public ArcProgressBar(Context context, AttributeSet attrs) {
        super(context, attrs);
        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.ArcProgressBar);
        title = a.getString(R.styleable.ArcProgressBar_title);
        value = a.getString(R.styleable.ArcProgressBar_value);
        scale = a.getInteger(R.styleable.ArcProgressBar_scale, 0);
        init();
        a.recycle();
    }

    public ArcProgressBar(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.ArcProgressBar);
        title = a.getString(R.styleable.ArcProgressBar_title);
        value = a.getString(R.styleable.ArcProgressBar_value);
        scale = a.getInteger(R.styleable.ArcProgressBar_scale, 0);
        init();
        a.recycle();
    }

    private void init() {
        metrics = getContext().getResources().getDisplayMetrics();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    private Paint mpPaint;
    private Paint linePaint;
    private boolean aBoolean = true;
    private DisplayMetrics metrics;
    private int rota;
    private int scale;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
        invalidate();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        invalidate();
    }

    private String title;
    private String value;

    public int getAllRota() {
        return allRota;
    }

    public void setAllRota(int allRota) {
        this.allRota = allRota;
        invalidate();
    }

    private int allRota = 0;

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onDraw(Canvas canvas) {
        mpPaint = new Paint();
        mpPaint.setAntiAlias(true);
        canvas.rotate(allRota, getWidth() / 2, getHeight() / 2);
        int count = 0;
        //刻度数字
        switch (scale) {
            case 0:
                for (int i = 0; i < 9; i++) {
                    String s = "" + count * 5;
                    count++;
                    mpPaint.setColor(Color.WHITE);
                    mpPaint.setTextSize(getHeight() / 20);
                    canvas.drawText(s, text_value_x((45 + ((float) 270 / (float) 64) * i * 8), s), text_value_y((45 + ((float) 270 / (float) 64) * i * 8), s), mpPaint);
                }
                break;
            case 1:
                for (int i = 0; i < 11; i++) {
                    String s = "" + count * 5;
                    count++;
                    mpPaint.setColor(Color.WHITE);
                    mpPaint.setTextSize(getHeight() / 20);
                    canvas.drawText(s, text_value_x((45 + 27 * i), s), text_value_y((45 + 27 * i), s), mpPaint);
                }
                break;
            case 2:
                for (int i = 0; i < 11; i++) {
                    String s = "" + count * 10;
                    count++;
                    mpPaint.setColor(Color.WHITE);
                    mpPaint.setTextSize(getHeight() / 20);
                    canvas.drawText(s, text_value_x((45 + 27 * i), s), text_value_y((45 + 27 * i), s), mpPaint);
                }
                break;
        }
        mpPaint.setColor(Color.WHITE);
        mpPaint.setTextSize(getHeight() / 10);
        canvas.drawText(title, getWidth() / 2 - mpPaint.measureText(title) / 2, getHeight() / 2 - mpPaint.measureText(title) / 2, mpPaint);
        canvas.drawText(value, getWidth() / 2 - mpPaint.measureText(title) / 4, getHeight() - getHeight() / 5 - mpPaint.measureText(title) / 2, mpPaint);
        if (linePaint == null) {
            linePaint = new Paint();
            linePaint.setAntiAlias(true);
        }

        //刻度
        if (aBoolean) {

            for (int i = 0; i < 65; i++) {
                //canvas.rotate(360 / 270, getWidth() / 2, getHeight() / 2);
                if (i == 0) {
                    canvas.rotate(45, getWidth() / 2, getHeight() / 2);
                } else {
                    canvas.rotate((float) 270 / (float) 64, getWidth() / 2, getHeight() / 2);
                }
                switch (scale) {
                    case 0:
                        mpPaint.setColor(color_sudu((int) (((float) 270 / (float) 64) * i)));
                        break;
                    case 1:
                        mpPaint.setColor(color_dianliang((int) (((float) 270 / (float) 64) * i)));
                        break;
                    case 2:
                        mpPaint.setColor(color_licheng((int) (((float) 270 / (float) 64) * i)));
                        break;
                    default:
                        mpPaint.setColor(color_dianliang((int) (((float) 270 / (float) 64) * i)));
                        break;
                }
                mpPaint.setStrokeWidth(getWidth() / 80);
                canvas.drawLine(getWidth() / 2, getHeight(), getWidth() / 2, getHeight() - getHeight() / 19, mpPaint);
            }

            //canvas.saveLayerAlpha(0, 0, getWidth(), getHeight(), 255);
            //canvas.save();
        }
        //linePaint.setColor(Color.BLUE);
        */
/*canvas.rotate(45 + 180 + rota, getWidth() / 2, getHeight() / 2);*//*

        canvas.rotate(45 + 180 + 180, getWidth() / 2, getHeight() / 2);
        Path path = new Path();
        path.moveTo(getWidth() / 2, getHeight() / 2 - getHeight() / 3);
        path.lineTo(getWidth() / 2 - getWidth() / 60, getHeight() / 2);
        path.lineTo(getWidth() / 2, getHeight() / 2 + getHeight() / 20);
        path.lineTo(getWidth() / 2 + getWidth() / 60, getHeight() / 2);
        path.close();
        Paint sanjiaoxing = new Paint();
        sanjiaoxing.setAntiAlias(true);
        sanjiaoxing.setColor(color_dianliang(rota));
        sanjiaoxing.setStyle(Paint.Style.FILL);
        canvas.drawPath(path, sanjiaoxing);


*/
/*        Path path1 = new Path();
        path1.moveTo(getWidth() / 2 - 7 * metrics.scaledDensity, getHeight() / 2);
        path1.lineTo(getWidth() / 2 + 7 * metrics.scaledDensity, getHeight() / 2);
        path1.lineTo(getWidth() / 2, getHeight() / 2 + getHeight() / 10);
        path1.close();
        canvas.drawPath(path1, sanjiaoxing);*//*

        */
/*canvas.drawLine(getWidth() / 2 - 7 * metrics.scaledDensity, getHeight() / 2, getWidth() / 2 + 7 * metrics.scaledDensity, getHeight() / 2, linePaint);
        canvas.drawLine(getWidth() / 2 - 7 * metrics.scaledDensity, getHeight() / 2, getWidth() / 2, getHeight() / 2 - getHeight() / 5, linePaint);
        canvas.drawLine(getWidth() / 2 + 7 * metrics.scaledDensity, getHeight() / 2, getWidth() / 2, getHeight() / 2 - getHeight() / 5, linePaint);
        canvas.drawLine(getWidth() / 2 - 7 * metrics.scaledDensity, getHeight() / 2, getWidth() / 2, getHeight() / 2 + getHeight() / 10, linePaint);
        canvas.drawLine(getWidth() / 2 + 7 * metrics.scaledDensity, getHeight() / 2, getWidth() / 2, getHeight() / 2 + getHeight() / 10, linePaint);
        canvas.rotate(120, getWidth() / 2, getHeight() / 2);*//*


    }

    public void changecolor(int rota) {
        // aBoolean = false;
        this.rota = rota;
        invalidate();
    }

    private int color_licheng(int rate) {
        if (rate < 270 / 3) {
            return Color.rgb(0xdd, 0x4f, 0x8d);
        } else if (rate > 270 / 3 && rate < 270 / 3 * 2) {
            return Color.rgb(0xf3, 0xcc, 0x8d);
        } else {
            return Color.rgb(0xff, 0x91, 0x6c);
        }
    }

    private int color_dianliang(int rate) {
        if (rate < 270 / 3) {
            return Color.rgb(0xfe, 0x40, 0xa6);
        } else if (rate > 270 / 3 && rate < 270 / 3 * 2) {
            return Color.rgb(0xff, 0x8c, 0x67);
        } else {
            return Color.rgb(0xfd, 0xd1, 0x00);
        }
    }

    private int color_sudu(int rate) {
        if (rate < 270 / 2) {
            return Color.rgb(0x4d, 0xeb, 0xb2);
        } else {
            return Color.rgb(0xf5, 0x88, 0xd5);
        }
    }

    private int text_value_x(float rate, String s) {
        int x = 0;
        if (rate <= 90) {
            //x = (int) (getWidth() / 2 * Math.sin(rate * Math.PI / 180));
            //int x_1 = (int) ((getHeight() / 19) * Math.sin(rate * Math.PI / 180));
            int x_1 = (int) ((getHeight() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.sin(rate * Math.PI / 180));
            // x = getWidth() / 2 - x + x_1;
            x = getWidth() / 2 - x_1;
            //  x = getWidth() / 2 - x;
        } else if (rate > 90 && rate <= 180) {
            //x = (int) (getWidth() / 2 * Math.cos((rate - 90) * Math.PI / 180));
            */
/*int x_1 = (int) ((getHeight() / 19) * Math.cos((rate - 90) * Math.PI / 180));*//*

            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.cos((rate - 90) * Math.PI / 180));
            // x = getWidth() / 2 - x + x_1;
            //x = getWidth() / 2 - x;
            x = getWidth() / 2 - x_1;
        } else if (rate > 180 && rate <= 270) {
            // x = (int) (getWidth() / 2 * Math.cos((270 - rate) * Math.PI / 180));
            */
/*int x_1 = (int) ((getHeight() / 19) * Math.cos((270 - rate) * Math.PI / 180));*//*

            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.cos((270 - rate) * Math.PI / 180));
            //x = getWidth() / 2 + x - x_1;
            // x = getWidth() / 2 + x;
            x = getWidth() / 2 + x_1;
        } else if (rate > 270 && rate <= 360) {
            //x = (int) (getWidth() / 2 * Math.sin((360 - rate) * Math.PI / 180));
            //int x_1 = (int) ((getHeight() / 19) * Math.sin((360 - rate) * Math.PI / 180));
            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.sin((360 - rate) * Math.PI / 180));
            //  x = getWidth() / 2 + x - x_1;
            //x = getWidth() / 2 + x;
            x = getWidth() / 2 + x_1;
        }

        return x;
    }

    private int text_value_y(float rate, String s) {
        int x = 0;
        if (rate <= 90) {
            // x = (int) (getWidth() / 2 * Math.cos(rate * Math.PI / 180));
            //  int x_1 = (int) ((getHeight() / 19) * Math.cos(rate * Math.PI / 180));
            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.cos(rate * Math.PI / 180));

            //x = getHeight() / 2 + x - x_1;
            x = getHeight() / 2 + x_1;
        } else if (rate > 90 && rate <= 180) {
            //x = (int) (getWidth() / 2 * Math.sin((rate - 90) * Math.PI / 180));
            */
/*int x_1 = (int) ((getHeight() / 19) * Math.sin((rate - 90) * Math.PI / 180));*//*

            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.sin((rate - 90) * Math.PI / 180));

            // x = getHeight() / 2 - x + x_1;
            x = getHeight() / 2 - x_1;
        } else if (rate > 180 && rate <= 270) {
            // x = (int) (getWidth() / 2 * Math.sin((270 - rate) * Math.PI / 180));
            */
/*int x_1 = (int) (getHeight() / 19 * Math.sin((270 - rate) * Math.PI / 180));*//*

            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.sin((270 - rate) * Math.PI / 180));
            //  x = getHeight() / 2 - x - x_1;
            x = getHeight() / 2 - x_1;
        } else if (rate > 270 && rate <= 360) {
            // x = (int) (getWidth() / 2 * Math.cos((360 - rate) * Math.PI / 180));
            */
/*int x_1 = (int) (getHeight() / 19 * Math.cos((360 - rate) * Math.PI / 180));*//*

            int x_1 = (int) ((getWidth() / 2 - getHeight() / 10 - mpPaint.measureText(s)) * Math.cos((360 - rate) * Math.PI / 180));
            //x = getHeight() / 2 + x - x_1 * 6;
            x = getHeight() / 2 + x_1;
        }

        return x;
    }
}
*/
