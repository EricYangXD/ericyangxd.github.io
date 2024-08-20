---
title: 安卓使用技巧
author: EricYangXD
date: "2022-02-09"
---

## 安卓手机安装谷歌服务

### 手动模式

首先必须了解 Google 套件正常运行是由三个基础构建而成：服务框架，账户管理程序，Play 服务。

一般大家用的都是商店为基础，那就再加个 商店 组成四件套。

安装四个谷歌软件，软件安装的顺序很关键，（顺序出错要么闪退要么卡死）。

软件的顺序错了的话，基本上是怎么折腾也不会有结果的。

1. 安装 Google Service Framework (谷歌服务框架 GSF)。
2. 安装 Google Account Manager (谷歌账户管理程序，貌似已经不需要了？2022-05-20)。
3. 安装 Google Play Service (Google Play 服务又称 GMS）。
4. 安装 商店 Google Play Store。

可以从此处[www.apkmirror.com](https://www.apkmirror.com)下载所需的 APK 及对应版本。

### 自动模式

使用谷歌安装器

1. 点击下载[Go 安装器](https://pan.baidu.com/s/1_MWsGh7tege9WrDr2gngBw?pwd=9h1d)

## 运行安卓项目

Android Studio>sidebar>project 切换找不到 app moudle 和 project moudle

- 1. app moudle

为什么找不到呢，估计是 IDE 抽风 先记录下:

1. 剪切一下 settings.gradle 下的 include ‘:app’，
2. 然后 Sync Project with gradle files，
3. 再然后，粘贴回去 include ‘:app’,
4. 再 build 一下就可以了.

- 2. project moudle

1. 去项目根目录找到.idea 文件夹
2. 找到.idea 后删除
3. 重启 AS 就可以了

- 3. Android Studio > sidebar 控制显示隐藏：通过 view -> tool windows -> 控制

## 红米手机

1. 进入工程模式：`*#*#6484#*#*`，用于调试屏幕等。
2. Google“安全码”在哪里获取？首先在手机中打开科学上网软件，运行 Google Play，依次点击右上角头像-“管理您的 Google 帐号”-“安全性”，点击“安全码（获取一次性验证码以验证您的身份）”。

## debug

1. 查看 APP 的 SHA1、SHA256 和 MD5 值: `keytool -list -v -keystore C:/Users/uia68502/.android/debug.keystore -alias androiddebugkey password: android`

2. APP name 以`app/build.gradle` 中的`applicationId`为准，`AndroidManifest.xml`为辅。
3. `Error running second Activity: The activity must be exported or contain an intent-filter`编译能成功，但是在虚拟机或真机上面调试时，弹出这个错误，后来查了一下，要在 AndroidManifest.xml 中，把每个窗口都加上一句：`android:exported="true"`

比如：

```xml
<activity android:name=".MainActivity"
    android:exported="true">
</activity>
<activity android:name=".TextView_Paomadeng"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

这样就可以调试成功了。

4. MacOSX 修改 Android Studio 使用本地 gradle, `gradle-wrapper.properties: distributionUrl=file:/Users/eric/.gradle/wrapper/dists/gradle-5.6.4-all/ankdp27end7byghfw1q2sw75f/gradle-5.6.4-all.zip`

## ijkplayer 编译 so 库

[ijkplayer 编译 so 库](https://juejin.cn/post/6844903554084241415)

## adb

如何通过 adb 把文件从手机上拉下来？

0. 如果有多个模拟器或者手机连接着电脑，先通过`adb devices -l`查看一下设备号，然后通过`adb -s 设备号 pull /sdcard/AIUI/cfg/aiui.cfg aiui.cfg`，即`adb -s deviceId pull remote/path local/path`

1. `D:\>adb pull /sdcard/AIUI/cfg/aiui.cfg aiui.cfg`

2. 使用 `adb pull` 命令并不能直接使用通配符（如 `**`）来批量复制文件。`adb pull` 命令只支持指定单个文件或整个目录。
3. 复制整个文件夹到指定目录下：`adb -s 4a790be6 pull /storage/emulated/0/DCIM/Camera/ /Users/eric/phone`
4. 如果您只想复制 MP4 文件，可以使用 `adb shell` 和 `find` 命令结合 `pull` 来实现：
   - 使用 find 命令查找 MP4 文件：`adb -s 4a790be6 shell find /storage/emulated/0/DCIM/Camera/ -name "*.mp4"`
   - 使用 pull 命令逐个复制文件：`adb -s 4a790be6 shell find /storage/emulated/0/DCIM/Camera/ -name "*.mp4" > mp4_files.txt`，由于 adb pull 不支持直接批量操作，您可以将所有 MP4 文件路径输出到一个文本文件，然后使用脚本逐个复制。可以使用该命令创建一个文件并将路径保存
   - 在 Mac 上读取该文件并逐个复制：`while read line; do adb -s 4a790be6 pull "$line" /Users/eric/phone; done < mp4_files.txt`

## Mac 连接小米手机真机调试

1. 小米手机开启开发者选项：
   - 打开设置：在您的小米手机上，找到并打开“设置”应用。
   - 找到“我的设备”点击进入，然后滚动到“全部参数与信息”选项并点击进入。
   - 连续点击“OS 版本号”，直到看到提示“您已处于开发者模式，无需进行此操作”。
   - 返回设置：返回到设置主菜单，滚动到最下面，点击“更多设置”，在最下面您会看到“开发者选项”。
2. 开启 USB 调试：
   - 进入开发者选项
   - 开启 USB 调试：在开发者选项中，找到“USB 调试”并开启它。系统可能会弹出警告，点击“确定”以确认。
   - 如果想用无线调试也可以打开，并自行设置。
3. 连接手机和电脑：
   - 使用 USB 数据线：使用 USB 数据线将小米手机连接到 Mac 电脑。
   - 选择 USB 连接模式：在手机上，您可能会看到一个提示，询问您选择 USB 连接模式。选择“传输文件（MTP）”或“USB 调试”模式。
4. 安装 ADB 工具：使用 Homebrew 安装 ADB
5. 验证连接：打开终端运行 ADB 命令 -- `adb devices -l`，查看输出的内容里有无设备号，如果有，则表示连接成功。
6. 在 Android Studio 中运行项目时，选择连接设备即可。

## 安卓开发笔记

### 常用图标绘制库

1. MPAndroidChart

### ViewBinding

#### 原生做法

```xml
android {
    buildFeatures {
        viewBinding true
    }
}
```

```kotlin
// 重点：lateinit延迟初始化/懒加载。ActivityMainBinding即xml的名称倒过来写再加个Binging后缀
private lateinit var binding: ActivityMainBinding

override fun onCreate(savedInstanceState: Bundle?) {
	super.onCreate(savedInstanceState)
  // 重点：inflate
	binding = ActivityMainBinding.inflate(layoutInflater)
  // 重点：binding.root
	setContentView(binding.root)

  // 之后即可直接使用组件id来操作组件
}
```

对于通过 include 方式引入的子布局 xml 中的组件，还要再单独 binding

```kotlin
// 先定义
private var _binding: FragmentWeatherBinding? = null
private val binding get() = _binding!!
private lateinit var rainChancePieChart: ColorfulRingProgressView

// 比如：需重写onCreateView方法，然后在父binding中通过findViewById找到子binding，之后才能使用子binding
override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
): View {
    _binding = FragmentWeatherBinding.inflate(inflater, container, false)

    val weatherInfoChartBinding = LayoutWeatherInfoChartBinding.bind(binding.root.findViewById(R.id.layout_weather_info_chart))
    rainChancePieChart = weatherInfoChartBinding.rainChancePieChart

    return binding.root
}

// 组件销毁时需要手动清空_binding
override fun onDestroyView() {
    super.onDestroyView()
    _binding = null
}
```

#### 第三方库

1. `com.github.kirich1409:viewbindingpropertydelegate-full`
```kotlin
class ProfileFragment : Fragment(R.layout.profile) {

    // reflection API and ViewBinding.bind are used under the hood
    private val viewBinding: ProfileBinding by viewBinding()

    // reflection API and ViewBinding.inflate are used under the hood
    private val viewBinding: ProfileBinding by viewBinding(createMethod = CreateMethod.INFLATE)

    // no reflection API is used under the hood
    private val viewBinding by viewBinding(ProfileBinding::bind)
}
class ProfileActivity : AppCompatActivity(R.layout.profile) {

    // reflection API is used under the hood
    private val viewBinding: ProfileBinding by viewBinding(R.id.container)

    // no reflection API is used under the hood
    private val viewBinding by viewBinding(ProfileBinding::bind, R.id.container)
}
```
2. `com.hi-dhl:binding`
```kotlin
// ViewBinding
val binding: ActivityViewBindBinding by viewbind()

// DataBinding
val binding: ActivityDataBindBinding by databind(R.layout.activity_data_bind)
// or
val binding: ActivityDataBindBinding by databind()

init {
    with(binding) {
        result.setText("Use DataBinding and ViewBinding in Custom ViewGroup")
    }
}
```
3. `com.github.DylanCaiCoding.ViewBindingKTX`
```kotlin
class MainActivity : AppCompatActivity() {

  private val binding: ActivityMainBinding by binding()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding.tvHelloWorld.text = "Hello Android!"
  }
}
class HomeFragment : Fragment(R.layout.fragment_home) {

  private val binding: FragmentHomeBinding by binding()
  private val childBinding: LayoutChildBinding by binding(Method.INFLATE)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    binding.container.addView(childBinding.root)
  }
}
class FooAdapter : BaseQuickAdapter<Foo, BaseViewHolder>(R.layout.item_foo) {

  override fun convert(holder: BaseViewHolder, item: Foo) {
    holder.getBinding(ItemFooBinding::bind).apply {
      tvFoo.text = item.value
    }
  }
}
```

### Retrofit网络请求

结合Gson对JSON数据进行解析

- `com.squareup.retrofit2:retrofit`
- `com.squareup.retrofit2:converter-gson`

```kotlin
private val retrofit = Retrofit.Builder()
    .baseUrl("https://mock.apipost.net/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

private val weatherApiService: WeatherApiService =
    retrofit.create(WeatherApiService::class.java)

// 在onViewCreated中调用fetchWeatherData()即可

private fun fetchWeatherData() {
    Log.d("WeatherFragment", "fetchWeatherData called")
    weatherApiService.getWeatherData().enqueue(object : Callback<WeatherResponse> {
        override fun onResponse(
            call: Call<WeatherResponse>,
            response: Response<WeatherResponse>
        ) {

            Log.d("fetchWeatherData", response.body().toString())
            if (response.isSuccessful && response.body() != null) {
                val weatherData = response.body()!!
                val rainChance = weatherData.result.additional_info.rain_chance.value.toFloat()

                with(weatherInfoChartBinding) {
                    // update ColorfulRingProgressView 填充数据
                    rainChancePieChart.percent = rainChance
                }
            } else {
                Log.e("fetchWeatherData", "response is not successful!")
            }
        }

        override fun onFailure(call: Call<WeatherResponse>, t: Throwable) {
            Log.e("fetchWeatherData", "Request failed: ${t.message}")
        }
    })
}
```

```kotlin
// WeatherApiService.kt  写个interface就行
interface WeatherApiService {
    @GET("mock/3093cexxxx2404c/weather/mock?apipost_id=3093xxx4e")
    fun getWeatherData(): Call<WeatherResponse>
}
```

```kotlin
// WeatherResponse
data class WeatherResponse(
    val status: Int,
    val result: WeatherResult,
    val message: String
)
// ...
```

### 自定义圆环"Chart"

```xml
<com.example.weather.fragment.weather.ColorfulRingProgressView
    android:id="@+id/rainChancePieChart"
    android:layout_width="70dp"
    android:layout_height="70dp"
    android:layout_gravity="center"
    app:bgColor="@color/ring_bg_color"
    app:fgColorEnd="@color/ring_color"
    app:fgColorStart="@color/ring_color"
    app:percent="15"
    app:startAngle="45"
    app:strokeWidth="4dp" />
```

```kotlin
package com.example.weather.fragment.weather

import android.animation.ObjectAnimator
import android.animation.TimeInterpolator
import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Shader
import android.util.AttributeSet
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import com.example.weather.R

class ColorfulRingProgressView(private val mContext: Context, attrs: AttributeSet?) : View(
    mContext, attrs
) {
    private var mPercent = 75f
    private var mStrokeWidth = 0f
    private var mBgColor = -0x1e1e1f
    private var mStartAngle = 0f
    private var mFgColorStart = -0x1c00
    private var mFgColorEnd = -0xb800

    private var mShader: LinearGradient? = null
    private var mOval: RectF? = null
    private var mBgPaint: Paint? = null // 背景画笔
    private var mFgPaint: Paint? = null // 前景画笔

    private var animator: ObjectAnimator? = null

    init {
        val a =
            mContext.theme.obtainStyledAttributes(attrs, R.styleable.ColorfulRingProgressView, 0, 0)

        try {
            mBgColor = a.getColor(R.styleable.ColorfulRingProgressView_bgColor, -0x1e1e1f)
            mFgColorEnd = a.getColor(R.styleable.ColorfulRingProgressView_fgColorEnd, -0xb800)
            mFgColorStart = a.getColor(R.styleable.ColorfulRingProgressView_fgColorStart, -0x1c00)
            mPercent = a.getFloat(R.styleable.ColorfulRingProgressView_percent, 0f)
            mStartAngle = a.getFloat(R.styleable.ColorfulRingProgressView_startAngle, 0f) + 270
            mStrokeWidth = a.getDimensionPixelSize(
                R.styleable.ColorfulRingProgressView_strokeWidth, dp2px(21f)
            ).toFloat()
        } finally {
            a.recycle()
        }

        init()
    }

    private fun init() {
        // 此处为了展示一粗一细两个圆环的效果
        mBgPaint = Paint() // 初始化背景画笔
        mBgPaint!!.isAntiAlias = true
        mBgPaint!!.style = Paint.Style.STROKE
        mBgPaint!!.strokeWidth = mStrokeWidth // 背景圆环的宽度
        mBgPaint!!.color = mBgColor

        mFgPaint = Paint() // 初始化前景画笔
        mFgPaint!!.isAntiAlias = true
        mFgPaint!!.style = Paint.Style.STROKE
        mFgPaint!!.strokeWidth = mStrokeWidth + dp2px(4f) // 前景圆环的宽度，比背景宽4dp
        mFgPaint!!.strokeCap = Paint.Cap.SQUARE
    }

    private fun dp2px(dp: Float): Int {
        return (mContext.resources.displayMetrics.density * dp + 0.5f).toInt()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        canvas.drawArc(mOval!!, 0f, 360f, false, mBgPaint!!)
        // 绘制前景圆环
        mFgPaint!!.setShader(mShader) // 设置前景画笔的着色器
        canvas.drawArc(mOval!!, mStartAngle, mPercent * 3.6f, false, mFgPaint!!) // 绘制前景圆环
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)

        updateOval()

        mShader = LinearGradient(
            mOval!!.left,
            mOval!!.top,
            mOval!!.left,
            mOval!!.bottom,
            mFgColorStart,
            mFgColorEnd,
            Shader.TileMode.MIRROR
        )
    }

    var percent: Float
        get() = mPercent
        set(mPercent) {
            this.mPercent = mPercent
            refreshTheLayout()
        }

    var strokeWidth: Float
        get() = mStrokeWidth
        set(mStrokeWidth) {
            this.mStrokeWidth = mStrokeWidth
            mBgPaint!!.strokeWidth = mStrokeWidth // 设置背景圆环的宽度
            mFgPaint!!.strokeWidth = mStrokeWidth + dp2px(4f) // 设置前景圆环的宽度，比背景宽4dp
            updateOval()
            refreshTheLayout()
        }

    private fun updateOval() {
        val xp = paddingLeft + paddingRight
        val yp = paddingBottom + paddingTop
        mOval = RectF(
            paddingLeft + mStrokeWidth,
            paddingTop + mStrokeWidth,
            paddingLeft + (width - xp) - mStrokeWidth,
            paddingTop + (height - yp) - mStrokeWidth
        )
    }

    fun setStrokeWidthDp(dp: Float) {
        this.mStrokeWidth = dp2px(dp).toFloat()
        mBgPaint!!.strokeWidth = mStrokeWidth // 设置背景圆环的宽度
        mFgPaint!!.strokeWidth = mStrokeWidth + dp2px(4f) // 设置前景圆环的宽度，比背景宽4dp
        updateOval()
        refreshTheLayout()
    }

    fun refreshTheLayout() {
        invalidate()
        requestLayout()
    }

    var fgColorStart: Int
        get() = mFgColorStart
        set(mFgColorStart) {
            this.mFgColorStart = mFgColorStart
            mShader = LinearGradient(
                mOval!!.left,
                mOval!!.top,
                mOval!!.left,
                mOval!!.bottom,
                mFgColorStart,
                mFgColorEnd,
                Shader.TileMode.MIRROR
            )
            refreshTheLayout()
        }

    var fgColorEnd: Int
        get() = mFgColorEnd
        set(mFgColorEnd) {
            this.mFgColorEnd = mFgColorEnd
            mShader = LinearGradient(
                mOval!!.left,
                mOval!!.top,
                mOval!!.left,
                mOval!!.bottom,
                mFgColorStart,
                mFgColorEnd,
                Shader.TileMode.MIRROR
            )
            refreshTheLayout()
        }


    var startAngle: Float
        get() = mStartAngle
        set(mStartAngle) {
            this.mStartAngle = mStartAngle + 270
            refreshTheLayout()
        }

    @JvmOverloads
    fun animateIndeterminate(
        durationOneCircle: Int = 800,
        interpolator: TimeInterpolator? = AccelerateDecelerateInterpolator()
    ) {
        animator = ObjectAnimator.ofFloat(this, "startAngle", startAngle, startAngle + 360)
        interpolator?.let { animator?.interpolator = it }
        animator?.duration = durationOneCircle.toLong()
        animator?.repeatCount = ValueAnimator.INFINITE
        animator?.repeatMode = ValueAnimator.RESTART
        animator?.start()
    }

    fun stopAnimateIndeterminate() {
        if (animator != null) {
            animator!!.cancel()
            animator = null
        }
    }
}
```