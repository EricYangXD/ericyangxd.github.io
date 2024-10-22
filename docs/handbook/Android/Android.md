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

## adb 命令

### 如何通过 adb 把文件从手机上拉下来？

0. 如果有多个模拟器或者手机连接着电脑，先通过`adb devices -l`查看一下设备号，然后通过`adb -s 设备号 pull /sdcard/AIUI/cfg/aiui.cfg aiui.cfg`，即`adb -s deviceId pull remote/path local/path`

1. `D:\>adb pull /sdcard/AIUI/cfg/aiui.cfg aiui.cfg`

2. 使用 `adb pull` 命令并不能直接使用通配符（如 `**`）来批量复制文件。`adb pull` 命令只支持指定单个文件或整个目录。
3. 复制整个文件夹到指定目录下：`adb -s 4a790be6 pull /storage/emulated/0/DCIM/Camera/ /Users/eric/phone`
4. 如果您只想复制 MP4 文件，可以使用 `adb shell` 和 `find` 命令结合 `pull` 来实现：
   - 使用 find 命令查找 MP4 文件：`adb -s 4a790be6 shell find /storage/emulated/0/DCIM/Camera/ -name "*.mp4"`
   - 使用 pull 命令逐个复制文件：`adb -s 4a790be6 shell find /storage/emulated/0/DCIM/Camera/ -name "*.mp4" > mp4_files.txt`，由于 adb pull 不支持直接批量操作，您可以将所有 MP4 文件路径输出到一个文本文件，然后使用脚本逐个复制。可以使用该命令创建一个文件并将路径保存
   - 在 Mac 上读取该文件并逐个复制：`while read line; do adb -s 4a790be6 pull "$line" /Users/eric/phone; done < mp4_files.txt`

### 调试命令

1. 查看连接的设备：`adb devices`
2. 网络连接设备：`adb connect ip地址 // 不用加引号，可加端口号，默认为5555`，`adb disconnect ...`
3. 证书管理页面：`adb shell am start -n com.android.certinstaller/.CertInstallerMain`
4. 安装路径下的证书到系统：`adb shell am start -n com.android.certinstaller/.CertInstallerMain -a android.intent.action.VIEW -t application/x-x509-ca-cert file:///sdcard/cacert.cer`
5. 查看某个设备的根目录：`adb -s 192.168.200.205:5555 shell ls /`，如果是数据线直连的设备，可以把`ip:端口`换为`adb devices`里面对应的设备 id
6. 给当前网络设置代理：`adb -s 192.168.200.205:5555 shell settings put global http_proxy 192.168.200.102:8888`
7. 移除代理：`adb shell settings delete global http_proxy`，增加下面这一句，不然只删除了规则，但是代理没移除：`adb shell settings put global http_proxy :0`
8. 录屏：`adb shell screenrecord /sdcard/aijia_record01.mp4（adb shell命令）`，下载到本地`adb pull /sdcard/aijia_record.mp4 /Users/niuzilin/Desktop(此命令切记不是 adb shell)`
9. 导出日志(包括ANR日志)：`adb bugreport`
10. 键入文本：给当前连接的手机文本输入框通过adb的方式键入文本`adb shell input text 123`
11. 获取系统安装应用列表：`adb shell pm list package`
12. 查看在手机上应用安装到的路径：`adb shell pm path "your app package name"`
13. 发送广播：` adb shell am broadcast -n  com.didi.davinci.conservices/.BootReceiver -a "com.didi.davinci.chaoandhao"`
14. 设置系统时间：`adb shell "su 0 toybox date 123123592016.59"`// 2016年12月31日23点59分59s
15. 杀掉某个进程：`adb shell am force-stop  com.didi.app`后面是包名
16. 杀掉某个进程：`adb shell am kill com.didi.app`后面是包名
17. 杀掉某个进程：`adb shell am kill 37456`后面是进程pid号
18. 杀掉某个进程：`adb shell kill -9 pid`用命令`kill -l`可以查看linux下的所有信号，SIGKILL：9号信号，Kill signal（杀死进程信号，linux规定进程不可以忽略这个信号）。`kill -9`中，9代表的就是9号信号，带有强制执行的意思，它告诉进程：“无论你现在在做什么，立刻停止”。
19. 杀掉某个进程：`killall -9 com.android.simple.demo`，killall （kill processes by name）用于杀死进程，与 kill 不同的是killall 会杀死指定名字的所有进程。kill 命令杀死指定进程 PID，需要配合 ps 使用，而 killall 直接对进程对名字进行操作，更加方便。killall 是进程名敏感类型，所以后面跟着的进程名需要是全部的名称
20. 杀掉某个进程：`pkill simple`，`pkill -u mark,danny`--结束mark,danny用户的所有进程。pkill 命令和 killall 命令的用法相同，都是通过进程名杀死一类进程，除此之外，pkill 还有一个更重要的功能，即按照终端号来踢出用户登录。pkill是进程名不敏感类型，所以可以只输入一部分名称
21. 杀掉某个进程：``
22. ：``
23. ：``
24. ：``
25. ：``
26. ：``
27. ：``
28. ：``

###

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

使用到了 Kotlin 委托，`ActivityViewBindings`就是一个 Kotlin 委托类，当获取 binding 的时候，去触发`fun getValue(thisRef: A, property: KProperty<*>): T`，而`vbFactory: (View) -> T`是我们从`MainActivity`传入的，实际就是在调用`ActivityMainBinding::bind`。

看似炫酷的被施了魔法的`private val binding :ActivityMainBinding by viewbind()`实现`ViewBinding`，其实就是用到了`Kotlin`委托，并在委托类的`get()`方法中，通过`不反射` / `反射` 的方式 调用`ActivityMainBinding.java`的 i`nflate`或`bind`方法，然后，可以将`setContentView()`也在此处进行调用，这样，就不用再去写`ViewBinding`常规的那些代码了。

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

1. `com.github.kirich1409:viewbindingpropertydelegate-full`：采用不反射的方式，性能上会比较好

```kotlin
// 重点：Fragment这里要传入布局ID
class ProfileFragment : Fragment(R.layout.profile) {

    // reflection API and ViewBinding.bind are used under the hood
    private val viewBinding: ProfileBinding by viewBinding()

    // reflection API and ViewBinding.inflate are used under the hood
    private val viewBinding: ProfileBinding by viewBinding(createMethod = CreateMethod.INFLATE)

    // no reflection API is used under the hood，在viewBinding()需要传参
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

### Retrofit 网络请求

结合 Gson 对 JSON 数据进行解析

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

### ORM 框架

ORM（Object-Relational Mapping，对象关系映射）是一种软件技术，用于在关系型数据库和面向对象编程语言之间建立映射关系。它的目标是将对象模型和关系数据库之间的数据转换和操作自动化。

ORM 框架的作用是简化开发人员处理数据库的过程。它将数据库表和记录映射到编程语言中的对象和属性上，提供了一种更直观、面向对象的方式来操作和访问数据。通过使用 ORM，开发人员可以使用面向对象的编程语言来进行数据库操作，而无需编写原始的 SQL 查询。

使用 ORM 框架可以简化数据库操作的编写和维护工作，提高开发效率和代码可读性。

- 几种常用的 ORM 框架

  - Room：可以视作官方推荐的方案代表，也是 google 推出的方案，用的软件多，支持数据驱动，google 官方支持，支持 sql 语句，基于 sqlite
  - GreenDao：第三方封装的基于 sqlite 的 orm 框架，大量的使用者，较为中庸，没有特别明显的短板与长处，缺少对于数据变化的动态监听，不支持数据驱动式 coding，缺少一些新特性。部分功能不支持 kotlin：在使用 kotlin 文件编写 entity 时无法构建成功，必须使用 Java 代码写 entity。
  - Realm：可以支持跨平台，基于 MongoDB 非关系型数据库
  - ObjectBox：操作速度更快，greenDao 同家出品的数据库框架，支持 liveData，也支持 Flow、协程，支持懒加载，基于 nosql，非关系型数据库
  - SQLite：跨平台的原生数据库能力

- 读写速度
  ● Realm，相比于其他插入大批量新数据慢一点，小批量插入差异不明显，大批量差异和 sqlite 类的慢 10%-20%左右；数据更新速度比 sqlite、greendao、room 等快一倍左右；删除和读取数据的操作速度快到无法比较，可能存在测试用例/缓存等问题导致数据不可信；
  ● ObjectBox，除了删除操作外，其他的耗时都优于基于 sqlite 的 orm 框架，读取操作慢于 realm；
  ● Room，在删除操作上优于其他 sqlite 框架，其他操作和 sqlite 的速度持平/稍慢于 sqlite；
  ● GreenDao，读取操作上优于其他 sqlite 框架（30%-60%），其他操作持平；
  ● Sqlite，更新操作稍快（10%-30%），其他持平

## 常用控件

要使用app这个命名空间，需要在最外层父节点设置`xmlns:app="http://schemas.android.com/apk/res-auto"`

### Button

SDK >= 28，使用MaterialButton，先引入依赖`com.google.android.material:material:1.3.0`，然后修改App的主题为`android:theme="@style/Theme.MaterialComponents.**Light.NoActionBar"`

```xml
<com.google.android.material.button.MaterialButton
    android:id="@+id/btnHelloWorld"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:cornerRadius="20dp"
    android:text="Hello World!"
    android:textColor="@color/white"
    app:strokeColor="@color/white"  // 描边
    app:strokeWidth="4dp"  // 描边
    app:icon="icon图片src"  // 图标
    app:iconTint="@color/red"  // 图标着色
    app:iconPadding="10dp"  // 图标和文本之间的间距
    app:iconGravity="end"  // 图标在文本的位置：textStart/start/end/textEnd/textTop/top
    android:textSize="24sp"
    android:layout_margin="16dp"
    app:backgroundTint="@color/colorAccent"  // 按钮背景色，不能使用android:background设置！
    android:onClick="onBtnClick()" // 点击事件
    style="@style/Widget.MaterialComponents.Button.UnelevatedButton" // 去掉按钮自带的阴影
    android:insetBottom="0dp"  // 删除按钮默认样式中的空隙间距，否则会导致按钮的长度宽度并不是我们自己设置的值
    android:insetTop="0dp"
/>
```


- 如果闪退，修改主题为：`android:theme="@style/Theme.MaterialComponents.**Light.NoActionBar"`之类的
- `MaterialButtonToggleGroup`：可以把多个Button聚合成一个组，实现单选多选等功能
    - `app:checkedButton`：默认选中
    - `app:singleSelection`：是否单选
    - `app:selectionRequired`：设置为true后，强制至少选中一个

```xml


```

### TextView

```xml
<TextView
    android:id="@+id/tvHelloWorld"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Hello World!"
    android:textSize="24sp"
    android:textColor="@color/black"
    android:layout_margin="16dp"
    android:gravity="center"
    android:background="@color/white"
    android:padding="8dp"
    android:textIsSelectable="true" // 复制其中的内容
    android:descendantFocusability="blocksDescendants"  // 拦截事件的消费，使得textView无法消费触摸的事件
    android:clickable="true" // 默认TextView不可点击，该属性设置为true后可以点击，获取焦点
    android:ellipsize="marquee" // 设置文字末尾截断省略号和位置，start、middle等
    android:marqueeRepeatLimit="marquee_forever"  // 不停循环
    android:focusable="true"  // 可获取焦点
    android:focusableInTouchMode="true"  // 可获取焦点
    android:singleLine="true" // 单行
    android:drawableLeft="icon图片src" // 在TextView左侧显示图片icon，同理：drawableRight、drawableTop、drawableDown
    android:drawableTint="#ffffff" // 设置icon的颜色
/>

```

- 输入框与输入法遮挡：在`AndroidManifest.xml`对应的 Activity 里添加 `android:windowSoftInputMode="adjustPan"`或是`android:windowSoftInputMode="adjustResize"`属性
- `adjustPan`：整个界面向上平移，使输入框露出，它不会改变界面的布局；界面整体可用高度还是屏幕高度
- `adjustResize`：需要界面的高度是可变的，或者说 Activity 主窗口的尺寸是可以调整的，如果不能调整，则不会起作用。
- `ellipsize+marqueeRepeatLimit+focusable+focusableInTouchMode+singleLine`：设置文字跑马灯效果
- `drawableRight`：通过这种设置的icon会紧贴TextView的边框显示，如果想贴近text显示，则需要使用`MaterialButton`控件

### EditText

EditText 输入时被输入法挤压滚动到顶部：

```xml
// AndManifest.xml
android:windowSoftInputMode="adjustResize|stateHidden"
// xml layout viewGroup
android:fitsSystemWindows="true"
```

### RecyclerView

一直展示滚动条

```xml
android:scrollbarAlwaysDrawVerticalTrack="true"
android:scrollbars="vertical"
android:overScrollMode="always"
android:fadeScrollbars="false"
android:scrollbarFadeDuration="0"
```

## 布局

### ConstrainLayout 约束布局

通过辅助线来控制具体的位置，当然也可以设置边距啥的。
