package com.cndll.myway.mywayfv.view;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Shader;
import android.os.Build;
import android.text.TextPaint;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.View;

import com.cndll.myway.mywayfv.R;


/**
 * Created by kongqing on 16-12-24.
 */
public class ArcProgBar extends View {
    public ArcProgBar(Context context) {
        super(context);
        init();
    }

    public ArcProgBar(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.ArcProgBar);
        title = a.getString(R.styleable.ArcProgBar_title);
        value = a.getString(R.styleable.ArcProgBar_value);
        description = a.getString(R.styleable.ArcProgBar_description);
        guide_nub = a.getInteger(R.styleable.ArcProgBar_guide_nub, 0);
        guide_scale = a.getInteger(R.styleable.ArcProgBar_guide_scale, 0);
        scale = a.getInteger(R.styleable.ArcProgBar_scale, 0);
        a.recycle();
    }

    public ArcProgBar(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    private int[] colors_licheng = new int[]{Color.rgb(0xdd, 0x48, 0xff), Color.rgb(0xf3, 0xcc, 0x8d), Color.rgb(0xff, 0x91, 0x6c)};
    private int[] colors_sudu = new int[]{Color.rgb(0x4d, 0xeb, 0xb2), Color.rgb(0xf5, 0x88, 0xd5)};
    private int[] colors_dianliang = new int[]{Color.rgb(0xfe, 0x40, 0xa6), Color.rgb(0xff, 0x8c, 0x67), Color.rgb(0xfd, 0xd1, 0x00)};
    private int[][] colors = new int[3][];
    private String title = "";

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    private String value = "";
    private String description;
    private TextPaint title_paint;
    private TextPaint value_paint;
    private DisplayMetrics metrics;
    private Paint guide_text;
    private int guide_scale;
    private int guide_nub;


    private void init() {
        metrics = getResources().getDisplayMetrics();
        colors[0] = colors_sudu;
        colors[1] = colors_licheng;
        colors[2] = colors_dianliang;
        title_paint = new TextPaint();
        value_paint = new TextPaint();
        paint = new Paint();
        guide_text = new Paint();


    }

    public float getScreen_rate() {
        return screen_rate;
    }

    public void setScreen_rate(float screen_rate) {
        this.screen_rate = screen_rate;
    }

    private float screen_rate;

    public float getGuide_rate() {
        return guide_rate;
    }

    public void setGuide_rate(float guide_rate) {
        this.guide_rate = guide_rate;
    }

    private float guide_rate;

    public int getScale() {
        return scale;
    }

    public void setScale(int scale) {
        this.scale = scale;
    }

    private int scale;
    private LinearGradient linearGradient;
    private Paint paint;

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        linearGradient = new LinearGradient(0, 0, getWidth(), 0, colors[scale], null, Shader.TileMode.MIRROR);
        paint.setShader(linearGradient);
        paint.setAntiAlias(true);
        title_paint.setAntiAlias(true);
        value_paint.setAntiAlias(true);
        guide_text.setAntiAlias(true);
        paint.setStrokeWidth(getWidth() / 80);
        guide_text.setColor(Color.WHITE);
        guide_text.setTextSize(getWidth() / 15);
        title_paint.setColor(Color.rgb(0xb6, 0xb6, 0xb6));
        value_paint.setColor(Color.WHITE);
        title_paint.setTextSize(13 * metrics.scaledDensity);
        value_paint.setTextSize(getWidth() / 22 * metrics.scaledDensity);
        //layout= new StaticLayout(title,title_paint,5,StaticLayout.Alignment.ALIGN_NORMAL,getWidth() / 2 - title_paint.getTextSize() / 2, getHeight() / 4, true);
        //layout.draw(canvas);
        canvas.rotate(screen_rate, getWidth() / 2, getHeight() / 2);
        if (title != null && !title.intern().isEmpty()) {
            canvas.drawText(title, getWidth() / 2 - title_paint.measureText(title) / 2, getHeight() / 3, title_paint);
        }
        if (value != null && !value.intern().isEmpty()) {
            canvas.drawText(value, getWidth() / 2 - value_paint.measureText(value) / 2, getHeight() - getHeight() / 5, value_paint);
        }
        if (description != null) {
            canvas.drawText(description, getWidth() / 2 - title_paint.measureText(description) / 2, getHeight() / 3 + title_paint.getTextSize(), title_paint);
        }
        drawGuide_text(canvas, guide_text, guide_nub, guide_scale);
        drawScale(canvas, paint, 64);
        drawGuide(canvas, paint, guide_rate);
    }

    private void drawGuide_text(Canvas canvas, Paint paint, int guide_nub, int guide_scale) {
        String text = "SB";

        for (int i = 0; i < guide_scale + 1; i++) {
            text = "" + guide_nub * i;
            canvas.drawText(text,
                    getLineX(getWidth() / 2, (getWidth() / 2 - getWidth() / 16 - paint.getTextSize()), 45 + ((float) 270 / (float) guide_scale) * i),
                    getLineY(getWidth() / 2, (getWidth() / 2 - getWidth() / 16 - paint.getTextSize()), 45 + ((float) 270 / (float) guide_scale) * i),
                    paint);
        }
    }

    private void drawScale(Canvas canvas, Paint paint, int scalenub) {
        for (int i = 0; i < scalenub + 1; i++) {
            drawLine(canvas,
                    getWidth() / 2,
                    getHeight() / 2,
                    getWidth() / 2,
                    getWidth() / 25,
                    45 + ((float) 270 / (float) scalenub) * i,
                    paint);
        }
    }

    private void drawGuide(Canvas canvas, Paint paint, float rate) {
        Path path = new Path();
        path.moveTo(getLineX(getWidth() / 2,
                getWidth() / 2 - getWidth() / 8, rate),
                getLineY(getHeight() / 2,
                        getWidth() / 2 - getWidth() / 8,
                        rate));
        path.lineTo(getLineX(getWidth() / 2, getWidth() / 60, rate + 90),
                getLineY(getHeight() / 2,
                        getWidth() / 60,
                        rate + 90));
        path.lineTo(getLineX(getWidth() / 2,
                getWidth() / 18, rate + 180),
                getLineY(getHeight() / 2,
                        getWidth() / 18,
                        rate + 180));
        path.lineTo(getLineX(getWidth() / 2,
                getWidth() / 60, rate + 90 + 180),
                getLineY(getHeight() / 2,
                        getWidth() / 60,
                        rate + 90 + 180));
        path.close();
        canvas.drawPath(path, paint);
    }

    private void drawLine(Canvas canvas, int x, int y, int R, int length, float rate, Paint p) {
        canvas.drawLine(getLineX(x, R, rate),
                getLineY(y, R, rate),
                getLineX(x, R - length, rate),
                getLineY(y, R - length, rate),
                p);
    }

    private float getLineX(int x, float R, float rate) {
        float x1 = 0;
        if (rate >= 0 && rate <= 180) {
            if (rate <= 90) {
                double a = Math.sin((rate) * Math.PI / 180);
               // Log.d("sin", "" + a);
                x1 = x - (float) (R * Math.sin((rate) * Math.PI / 180));
            } else {
                x1 = x - (float) (R * Math.cos((rate - 90) * Math.PI / 180));
            }
        } else {
            if (rate <= 270) {
                x1 = x + (float) (R * Math.sin((rate - 180) * Math.PI / 180));
            } else {
                x1 = x + (float) (R * Math.cos((rate - 270) * Math.PI / 180));
            }
        }
      //  Log.d("x", x1 + "");
        return x1;
    }

    private float getLineY(int x, float R, float rate) {
        float x1 = 0;
        if (rate >= 90 && rate <= 270) {
            if (rate >= 90 && rate < 180) {
                x1 = x - (float) (R * Math.sin((rate - 90) * Math.PI / 180));
            } else {
                x1 = x - (float) (R * Math.cos((rate - 180) * Math.PI / 180));
            }
        } else {
            if (rate < 90) {
                x1 = x + (float) (R * Math.cos((rate) * Math.PI / 180));
            } else {
                x1 = x + (float) (R * Math.sin((rate - 270) * Math.PI / 180));
            }
        }
    //    Log.d("y", x1 + "");
        return x1;
    }


}

