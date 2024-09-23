---
title: Kotlin
author: EricYangXD
date: "2024-08-07"
meta:
  - name: keywords
    content: Kotlin
---

## Kotlin 学习笔记

### Notes

1. Java 与 Kotlin 互相调用处理时，要特别注意是否为空的问题。
2. `is`某种意义上是安全的。
3. `as`是一种不安全的强制转换，特别是不使用判断直接转换。`var strAble = text as? String //正确写法，转换失败自动转换为空对象`
4. `lateInit`：延迟初始化。如 Android 中某些属性需要在 `onCreate()` 方法中初始化。因此在使用的时候最好判断是否初始化。同时，`lateinit` 只能修饰 var，不支持修饰基础数据类型，比如 Int。对于基础数据类型，我们可以这样：`private var mNumber: Int by Delegates.notNull<Int>()`
5. ![常用的函数之间的区别](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202408201433871.png)
6. const、val、var 的区别：
   - const：编译期常量，只能修饰 val，不能修饰 var，且只能修饰基本数据类型和 String 类型。
   - val：只读变量，相当于 Java 中的 final 变量，只能赋值一次。
   - var：可读写变量，可以多次赋值。
7. `by lazy`：懒加载，只有在第一次使用的时候才会初始化，之后就不会再初始化了。
8. `Elvis Operator`：也称为安全调用操作符或空安全调用操作符，用于简化处理可能为空（null）的引用的情况。
   - `val length: Int? = str?.length`
   - `val result = str?.toUpperCase()?.substring(0, 5) ?: "default"`
9. `val nullableCar: Car? = (input as? Car)`：Will not throw ClassCastException
10. `val nonNullDepartmentHead: String = person?.department?.head?.name.orEmpty()`
11. 可以使用解构赋值

### 自定义 View 与方法重载

Kotlin 的方法指定默认参数与 Java 的方法重载，并不等价。只能说它们在某些场景下，特性是类似的。

解决方法：

使用方法三，当 Kotlin 使用了默认值的方法，被增加了 `@JvmOverloads` 注解后，它的含义就是在编译时，保持并暴露出该方法的多个重载方法。这样，Java 就可以调用到这些重载方法了。

```kotlin
// 方式一 和Java一样
fun printStr(s: String) {
}

fun printStr(build: StringBuilder) {
}

// 方式二 一种比较写起来舒畅的重载，它会有默认值的存在，且该方法与上面的两个方法一起存在并不会报错
fun printStr(s: String = "", maxLen: Int = 10) {
}

// 方式三 下面这种和上面那两种的一起会报错，提示该方法和第一个只有一个参数的发生重复了
@JvmOverloads
fun printStr(s: String = "", maxLen: Int = 10) {
}
```

#### 对于参数默认值的处理

当在自定义 View 时，通过 AS 生成重载方法时，它对参数默认值的处理规则是这样的。

- 遇到对象，默认值为 null。
- 遇到基础数据类型，默认值为基本数据类型的默认值。例如 Int 就是 0，Boolean 就是 false。

所以对于 EditText 的子类，可以如下方式编写。

```kotlin
class DemoView @JvmOverloads constructor(
        context: Context,
        attrs: AttributeSet? = null,
        defStyleAttr: Int = R.attr.editTextStyle
) : AppCompatEditText(context, attrs, defStyleAttr) {
}
```

### 使用 data class 没有设置无参构造函数

在 Kotlin 中，不需要自己动手去写一个 JavaBean，可以直接使用 DataClass，使用 DataClass 编译器会默默地帮我们生成一些函数。例如：

`data class Person(var name: String, var age: Int) {}`

比如这个 Bean 是用于接收服务器数据，通过 Gson 转化为对象的。例如：

```kotlin
val gson = Gson()
val person = gson.fromJson<Person>("{\"age\":\"12\"}", Person::class.java)
println(person.name)
```

我们传递了一个 json 字符串，但是没有包含 key 为 name 的值的输出结果：`null`，并且注意：**在 Person 中 name 的类型是 String，也就是说是不允许 name=null**。这是因为 Person 在被转 Java 代码时，只会生成一个包含两个参数的构造方法，没有提供默认的构造方法。Gson 在通过反射创建对象时，会优先尝试获取无参构造函数。如果没有找到无参构造函数时，它就直接通过 Unsafe 的方法，绕过了构造方法，直接构建了一个对象。而我们确实没有设置无参构造函数，所以 Gson 无法通过反射创建对象。因此我们在遇到上面类似需求的时候，最好提供一个无参构造方法：

```kotlin
data class Person(var name: String, var age: Int) {
    constructor() : this("", 0)  // 无参构造方法，必须要提供一个默认值实现或间接实现主构造方法
    constructor(address: String) : this("", 0)  // 间接实现主构造方法
}
```

### bean 类继承了父类并在主构造函数中覆盖了父类的属性

使用 Gson 解析 json 时，如果 bean 类继承了父类并在主构造函数中覆盖了父类的属性，那么会报错：declares multiple JSON fields named name（声明多个名为 name 的 JSON 字段） 比如：

```kotlin
open class Person: Serializable{
    open var name: String? = null
}
class SpecialPerson(override var name: String?) : Person() {
    override fun toString(): String {
        return name?: ""
    }
}
```

解决方法是，在子类中用 init 初始化块将构造函数中获取到的属性值赋给继承的属性，即：

```kotlin
class SpecialPerson(var specialName: String?) : Person() {
    init {
        name = specialName
    }
    override fun toString(): String {
        return name?: ""
    }
}
```

### 为什么 Kotlin 中的属性不能直接赋值

Kotlin 中的属性不能直接赋值，必须要在构造方法中赋值。这是因为 Kotlin 中的属性是不能直接赋值的，它只是一个语法糖，编译器会帮我们生成一个私有的属性和公有的 get/set 方法。例如：

```kotlin
class Person(var name: String, var age: Int) {
    var name: String = name
        get() = field
        set(value) {
            field = value
        }
}
```

这是编译器帮我们生成的代码，我们可以看到，编译器帮我们生成了一个私有的属性和公有的 get/set 方法。因此，我们在构造方法中赋值，实际上是给私有的属性赋值。

### 使用@Parcelize 注解实现 Parcelable

Parcelable：序列化/可打包类型

1. 导入 android.os.Parcelable 和 kotlinx.android.parcel.Parcelize：

```kotlin
import android.os.Parcelable
import kotlinx.android.parcel.Parcelize
```

2. 在类声明前使用 @Parcelize 注解：注意，您需要将 Parcelable 接口添加到类声明中。

```kotlin
@Parcelize
class YourClassName(val property1: String, val property2: Int) : Parcelable {
    // 类定义
}
```

3. 在类中，您需要将所有需要序列化的属性声明为主构造函数参数，并确保它们是支持 Parcelable 的类型。
4. 在构造函数中，您可以直接定义属性值：

```kotlin
@Parcelize
class YourClassName(val property1: String = "", val property2: Int = 0) : Parcelable {
    // 类定义
}
```

或者，您也可以在类体内定义构造函数：

```kotlin
@Parcelize
class YourClassName : Parcelable {
    constructor(property1: String, property2: Int) : this() {
        // 构造函数体
    }
}
```

这个类已经实现了 Parcelable 接口，并可以在 Android 中使用 Intent、Bundle 等进行序列化和反序列化操作。

```kotlin
// 例如，在发送对象到另一个 Activity 的 Intent 中使用 Parcelable：
val intent = Intent(this, YourActivity::class.java)
val yourObject = YourClassName("value1", 123)
intent.putExtra("yourKey", yourObject)
startActivity(intent)

// 在接收 Activity 中获取 Parcelable 对象：
val yourObject = intent.getParcelableExtra<YourClassName>("yourKey")
```

请确保在使用 Parcelable 时，类和属性的类型都是 Parcelable 可序列化的类型。

### 泛型

以如下函数为例：这是一个 Kotlin 扩展函数，用于在 Android 的 ComponentActivity 中绑定 ViewBinding。

```kotlin
public inline fun <A : ComponentActivity, T : ViewBinding> ComponentActivity.viewBinding(
    crossinline vbFactory: (View) -> T,
    crossinline viewProvider: (A) -> View = ::findRootView
): ActivityViewBindings<A, T> {
    return ActivityViewBindings { activity -> vbFactory(viewProvider(activity)) }
}
```

1. 该函数的定义是 public inline fun <A : ComponentActivity, T : ViewBinding> ComponentActivity.viewBinding(...)

   - `<A : ComponentActivity, T : ViewBinding>` 是函数的泛型参数，分别用于指定 ComponentActivity 的类型和 ViewBinding 的类型。
   - `ComponentActivity` 是 Android 提供的基类，可用于创建应用的 Activity。
   - `ViewBinding` 是在 Android 中用于绑定视图和布局的类。

2. 函数的参数如下：

   - `vbFactory: (View) -> T`：一个函数类型的参数，用于创建 ViewBinding 实例。它接受一个 View 参数，并返回一个 T 类型的 ViewBinding 实例。
   - `viewProvider: (A) -> View = ::findRootView`：一个函数类型的参数，用于提供视图。它接受一个 ComponentActivity 参数，并返回一个 View 实例。默认情况下，它使用 `findRootView` 函数来获取视图，该函数是 Kotlin 扩展函数，用于从 ComponentActivity 中查找根视图。

3. 函数的返回类型是 `ActivityViewBindings<A, T>`，它是一个自定义的类，用于封装创建 ViewBinding 的逻辑。

   - `ActivityViewBindings` 是一个接受 activity 参数的构造函数，用于创建 ViewBinding 实例。
   - `activity` 是传递给 viewProvider 函数的 ComponentActivity 实例。

4. `crossinline` 是 Kotlin 中的一个关键字，用于在内联函数中声明不允许跳转（non-local returns）的 lambda 表达式参数。在 Kotlin 中，内联函数会将函数的代码插入到调用它的位置，以提高性能。但是，内联函数无法直接传递非局部控制流（如 return 语句）给 lambda 表达式。这是因为内联函数的实现方式会将函数体作为调用者的一部分，而 lambda 表达式则会在内联函数外部执行。使用 crossinline 关键字修饰的 lambda 参数将不允许在 lambda 表达式中使用 return 语句，以避免非局部控制流的问题。

5. `crossinline viewProvider: (A) -> View = ::findRootView`，这里的`::findRootView`怎么理解？-- `::` 是 Kotlin 中的操作符，用于获取一个函数或属性的引用。在这里，`::findRootView` 获取了函数 `findRootView` 的引用，而不是调用函数。通过将 `::findRootView` 作为参数传递给 `viewProvider`，我们实际上是将函数 `findRootView` 作为参数传递给了 `viewProvider`。这样在调用 `viewProvider` 时，它就可以使用传递的参数 `A` 来调用函数 `findRootView`。换句话说，`viewProvider: (A) -> View = ::findRootView` 表示将函数 `findRootView` 的引用作为默认值赋给了 `viewProvider` 参数。如果没有显式提供 `viewProvider` 的值，它将使用 `::findRootView` 作为默认实现。

### 数组创建时类型的装箱

kotlin 在创建可空和不可空的对象时，如果数据类型是基本类型则会在可空类型变为装箱类型。如下 kt 的数组创建，其中的前者使用 arrayof 来创建的数组，默认都是装箱类型的 Integer、Double 等，而后者 intArrayOf 则是基本数据类型，未装箱，不可为空。

```kotlin
val intOne = arrayOf(1, 2, 3)
val intTwo = intArrayOf(1, 2, 3)

val doubleOne = arrayOf(1.0,2.0,3.0)
val doubleTwo = doubleArrayOf(1.0,2.0,3.0)

val longOne = arrayOf(1L,2L,3L)
val longTwo = longArrayOf(1,2,3)

val charOne = arrayOf('a', 'b', 'c')
val charTwo = charArrayOf('a', 'b', 'c')

val arrayInteger = Array(3) { 1;2;3 }
val arrayInt = IntArray(3) { 1;2;3 }
```

`Array<Int>` 相当于引用类型数组 `Integer[]`，`IntArray` 相当于数值类型数组 `int[]`。

### interface 的问题

1. 在 java 中，1.8 之前不允许 interface 里的方法有默认实现
2. 比较好的一种方式是在 kotlin 里通过抽象类 E 来实现接口 A，这样来避免默认实现不生效的问题。

3. 函数式（SAM）接口关键字： `fun interface`，只有一个抽象方法的接口称为函数式接口或 SAM（单一抽象方法）接口。函数式接口可以有多个非抽象成员，但只能有一个抽象成员。

### Thread 线程

在创建后就已经启动了，可以查看相关源码，默认的是创建后就 start，在参数中还有 name，守护线程等可配置。

### 类成员的初始化顺序

1. 按照父类->子类的顺序执行初始化（同 Java）
2. 构造函数在成员变量初始化之后执行（同 Java）
3. init 与成员变量初始化按照代码位置顺序执行 （重点！）
   - 这儿要留意，如果 init 中用到了在下面初始化的变量，会发生空指针的异常。

### 常见高阶函数

- map：将 List 中每个元素转换成新的元素，并添加到一个新的 List 中，最后将新 List 返回。
- flatMap：将 list 中全部元素遍历，按顺序将每个元素按照 flatMap 参数里的高阶函数执行后形成的新的 list 进行组成一个 list。
- fold：将集合中的元素依次冒泡组合，最终得到一个结果。
- reduce：与 fold 类似，区别是 reduce 没有初始值。
- joinToString：为集合元素添加分隔符，组成一个新的字符串并返回。
- filter：将 list 中的元素遍历，把符合要求的元素添加到新的 list 中，并将新 list 返回。
- takeWhile：遍历 list 中的元素，将符合要求的元素添加到新集合中。一旦遇到不符合要求的，直接终止。

### 预置注解

1. `@JvmField`：用于在 Kotlin 中声明一个字段，使其在 Java 中成为 `public static final` 字段。用在 kotlin 类的成员变量中，作用为“指示 Kotlin 编译器不要为此属性生成 getter/setter，而是将其公开为字段。”。
2. `@JvmStatic`：用于在 Kotlin 中声明一个静态方法，使其在 Java 中成为静态方法。用在 kotlin 类的方法中，作用为“指示 Kotlin 编译器生成静态方法，而不是实例方法”。在伴生类中使用，修饰伴生类里的变量或者方法，指定需要从此元素生成其他静态方法（如果该元素是函数）。如果此元素是属性，则应生成其他静态 getter/setter 方法。
3. `@JvmOverloads`：使用于方法，指示 Kotlin 编译器为此函数生成替换默认参数值的重载。如果没有默认值，则也不会有重载方法生成。
4. `@JvmDefault`：指定应为非抽象 Kotlin 接口成员生成 JVM 默认方法。

### 数组集合

主要是 Array、List、Set、Map、Sequence、Collection、Iterable、MutableList、MutableSet、MutableMap、MutableCollection、MutableIterable 等。

![Collection](<https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/image%20(1).png>)

### 静态字段&方法

```kotlin
class Person(name: String) {
    companion object {
        val NAME_KEY = "name_key"

        fun newInstance(name: String): Person {
            return Person(name)
        }
    }
}

val key = Person.NAME_KEY
val xiaoming = Person.newInstance("xiaoming")
// or
val xiaoming = Person("xiaoming")
```

### 函数

#### 高阶函数

高阶函数是将函数用作参数或返回值的函数。

#### 函数类型

Kotlin 使用类似 `(Int) -> String` 的函数类型来处理函数的声明： `val onClick: () -> Unit = ……`。

1. 所有函数类型都有一个圆括号括起来的参数类型列表以及一个返回类型：`(A, B) -> C` 表示接受类型分别为 A 与 B 两个参数并返回一个 C 类型值的函数类型。 参数类型列表可以为空，如 `() -> A`。Unit 返回类型不可省略。
2. 函数类型可以有一个额外的接收者类型，它在表示法中的点之前指定： 类型 `A.(B) -> C` 表示可以在 A 的接收者对象上以一个 B 类型参数来调用并返回一个 C 类型值的函数。 带有接收者的函数字面值通常与这些类型一起使用。

```kotlin
// 带有接收者类型的函数类型的定义：表示一个在 String 类型的接收者对象上调用，并以一个 Int 类型参数返回一个 String 类型值的函数。
typealias StringTransformation = String.(Int) -> String

// 定义一个带有接收者类型的函数：this 引用的是接收者对象 String，times 是函数参数。
val repeatString: StringTransformation = { times ->
    this.repeat(times)
}

// 使用这个函数：
fun main() {
    val originalString = "Hello"
    val transformedString = originalString.repeatString(3)
    println(transformedString)  // 输出：HelloHelloHello
}

// 另一个例子，展示了如何在函数中使用带有接收者类型的函数类型：
fun String.applyTransformation(transformation: StringTransformation, times: Int): String {
    return this.transformation(times)
}

fun main() {
    val originalString = "Hello"
    val result = originalString.applyTransformation(repeatString, 2)
    println(result)  // 输出：HelloHello
}
```

3. 挂起函数属于函数类型的特殊种类，它的表示法中有一个 suspend 修饰符 ，例如 `suspend () -> Unit` 或者 `suspend A.(B) -> C`。
4. 函数类型表示法可以选择性地包含函数的参数名：`(x: Int, y: Int) -> Point`。 这些名称可用于表明参数的含义。

#### 函数扩展

可以在已有的函数上增加自定义方法，比如：

```kotlin
fun Int.timesTwo(): Int {
    return this * 2
}

val four = 2.timesTwo()
```

### Lambda 表达式

以集合的函数式风格的 fold 为例：它接受一个初始累积值与一个接合函数，并通过将当前累积值与每个集合元素连续接合起来代入累积值来构建返回值

```kotlin
val items = listOf(1, 2, 3, 4, 5)
items.fold(0, {
    // 如果一个 lambda 表达式有参数，前面是参数，后跟“->”
    acc: Int, i: Int ->
    print("acc = $acc, i = $i, ")
    val result = acc + i
    println("result = $result")
    // lambda 表达式中的最后一个表达式是返回值：
    result
})

println(items.joinToString(","))

val product = items.fold(1, Int::times)// ::相当于直接传了这个times函数的引用
println("joinedToString = $joinedToString")
println("product = $product")

// acc = 0, i = 1, result = 1
// acc = 1, i = 2, result = 3
// acc = 3, i = 3, result = 6
// acc = 6, i = 4, result = 10
// acc = 10, i = 5, result = 15
// 1,2,3,4,5
// product = 120
```

### 闭包

### 扩展函数

- `apply`: 在对象初始化时执行一些操作，并返回这个对象。
- `also`: 在对象上执行一些操作，并返回这个对象，常用于日志记录或调试。
- `let`: 在对象上执行代码块，并返回代码块结果，常用于避免空指针异常。
- `run`: 在对象上下文中执行代码块，或作为无接收者的代码块执行，并返回代码块结果。
- `with`: 在对象上下文中执行代码块，并返回代码块结果，适用于对同一个对象执行多个操作的场景。

#### apply

apply 函数通常用于配置或初始化一个对象。它接受一个 lambda 表达式，并在 lambda 中提供该对象的上下文作为 this。在 lambda 表达式中，可以访问对象的成员变量和函数。这种方式非常适合在对象初始化时使用。它的接收者对象为 this，因此可以直接访问该对象的成员。

```kotlin
data class Person(var name: String, var age: Int)
// 使用 apply 初始化对象
val person = Person().apply {
    name = "John"
    age = 30
}
println(person) // 输出：Person(name=Jane, age=30)
```

#### also

also 函数通常用于对一个对象执行某些附加操作，例如日志记录或其他副作用操作。它接受一个 lambda 表达式，并在 lambda 中提供该对象的上下文作为 it。also 更适用于那些不需要在对象内直接修改其属性，而是对对象本身进行某些操作的场景。它的接收者对象为 it，因此通常用于日志记录或调试。

```kotlin
// 使用 also 进行附加操作
val person = Person().also {
    it.name = "John"
    it.age = 30
    it.address = "123 Main St"
    println("Creating a person named ${it.name}")
}
val numbers = mutableListOf(1, 2, 3)
numbers.also {
    println("The list contains: $it")
}.add(4)
println(numbers) // 输出：[1, 2, 3, 4]
```

#### let

let 函数用于在对象上执行代码块，并返回代码块的执行结果。它的接收者对象为 it，常用于避免空指针异常。

```kotlin
val name: String? = "Kotlin"
val length = name?.let {
    println("The name is $it")
    it.length
} ?: 0
println(length) // 输出：6
```

#### with

with 函数用于在对象上执行代码块，并返回代码块的执行结果。它不是扩展函数，而是一个顶层函数。它的接收者对象为 this。

```kotlin
data class Person(var name: String, var age: Int)

val person = Person("John", 25)
val details = with(person) {
    "Name: $name, Age: $age"
}
println(details) // 输出：Name: John, Age: 25
```

#### run

run 函数用于在对象上执行代码块，并返回代码块的执行结果。它的接收者对象为 this，因此可以直接访问该对象的成员。它也可以作为无接收者的代码块来执行。

```kotlin
// 对象上下文：
data class Person(var name: String, var age: Int)

val person = Person("John", 25)
val details = person.run {
    "Name: $name, Age: $age"
}
println(details) // 输出：Name: John, Age: 25

// 无接收者：
val result = run {
    val a = 5
    val b = 10
    a + b
}
println(result) // 输出：15
```

### 协程

Coroutine：以同步方式编写异步代码，解决回调（Callback）嵌套地狱问题。类似 async/await 的作用。

1. 协程是一种轻量级的线程，可以在任何地方挂起并恢复。

#### CoroutineScope 作用域 & Job

1. CoroutineScope 是所有协程开始运行的“容器”， 它的主要作用是控制着协程运行的生命周期，包括协程的创建、启动协程、取消、销毁。CoroutineScope 的取消也表示着在此作用域内开启的协程将会被全部取消. CoroutineScope 内还可以创建子 CoroutineScope ， 不同类型的作用域作用域代表着在此作用域内协程最大运行的时间不同。 例如 GlobalScope 表示协程的最大可运行时间为整个 APP 的运行生命周期，`Activity CoroutineScope（lifecycleScope）` 表示协程的最大可运行时间为 Activity 的生命周期，协程伴随着 CoroutineScope 销毁而取消停止运行。 Android 中常用的 CoroutineScope 类型和作用域：`GlobalScope > ViewModelScope > Activity LifecycleScope > Fragment LifecycleScope > View LifecycleScope`。
2. Job 表示在一个 CoroutineScope 内开启的一个协程任务， Job 内可以开启多个子 Job ， 通常每开启一个协程任务后会返回一个 Job 对象，可以通过执行 `Job.cancel()` 方法取消协程运行。
3. CoroutineScope 可以开启多个 Job ， Job 内也可以存在多个 CoroutineScope。不推荐这样使用。
4. coroutineScope vs supervisorScope (推荐使用)，假设有一个 coroutineScope 和一个 supervisorScope，它们各有两个 job：job1 和 job2。
   - 如果 job2 发生异常：coroutineScope 的 job1 和 job2 都会被取消，supervisorScope 的 job2 会被取消，但 job1 不受影响，正常执行。
   - 在 coroutineScope 内执行 cancel()方法取消协程，它的 job1 和 job2 都会被取消
   - 在 supervisorScope 内执行 cancel()方法取消协程，它的 job1 和 job2 都会被取消
5. SupervisorJob vs Job，SupervisorJob 、 Job 可以在开启一个协程时设置任务类型，默认开启一个协程方式为 `launch(){....}` 内部实现为 J`ob(coroutineContext[Job])`，也可以通过 `launch(SupervisorJob(coroutineContext[Job])) { }` ， `async(SupervisorJob(coroutineContext[Job])) { }` 方式指定 Job 类型：
   - Job：默认情况下，一个协程失败会导致其父协程和所有兄弟协程都被取消。Job 内的子 Job 发生异常时，会取消兄弟协程，异常会继续向上传递，直到向上传递的对应层级协程 Job 类型为 null 或 SupervisorJob 为止， 并取消对应层级的协程和子协程。
   - SupervisorJob：内的子 Job 发生异常时，不会影响到其父协程和兄弟协程，允许更细粒度地控制异常处理和任务取消。
6. 只有在开启的协程任务在发生异常时不希望影响到父协程和兄弟协程时，可以使用 在 launch() 或者 async() 指定 job 类型为 SupervisorJob ， 通常情况下无需单独设置 SupervisorJob。

#### 自定义 CoroutineScope

```kotlin
// 自定义一个 GlobalCoroutineScope
object MyGlobalScope : CoroutineScope {
    override val coroutineContext: CoroutineContext
    get() = EmptyCoroutineContext
}

fun MyGlobalScope() {
    MyGlobalScope.launch {
        // xxxxxx
    }
}
```

```kotlin
// 自定义一个 ViewCoroutineScope
class ViewCoroutineScope(override val coroutineContext: CoroutineContext = SupervisorJob() + Dispatchers.Main) : CoroutineScope


class MyView @JvmOverloads constructor(
context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr), CoroutineScope by ViewCoroutineScope() {

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        this.cancel()
    }

    fun test() {
        launch {
            // 在自定义作用域内开启协程.
        }
    }
}
```

### Collections 集合

常用的集合种类有：List, Set, Map, Sequence, Collection, Iterable, MutableList, MutableSet, MutableMap, MutableCollection, MutableIterable。

#### Creation

```kotlin
val numArray = arrayOf(1, 2, 3)
val numList = listOf(1, 2, 3)
val mutableNumList = mutableListOf(1, 2, 3)
```

#### Accessing

```kotlin
val firstItem = numList[0]
val firstItem = numList.first()
val firstItem = numList.firstOrNull()
```

#### Maps

```kotlin
val faceCards = mutableMapOf("Jack" to 11, "Queen" to 12, "King" to 13)
val jackValue = faceCards["Jack"] // 11
faceCards["Ace"] = 1
```

#### Mutability

```kotlin
val immutableList = listOf(1, 2, 3)
val mutableList = immutableList.toMutableList()

val immutableMap = mapOf("Jack" to 11, "Queen" to 12, "King" to 13)
val mutableMap = immutableMap.toMutableMap()
```

#### Iterating

```kotlin
for (item in myList) {
    print(item)
}

myList.forEach {
    print(it)
}

myList.forEachIndexed { index, item ->
    print("Item at $index is: $item")
}
```

#### Filtering & Searching

```kotlin
val evenNumbers = numList.filter { it % 2 == 0 }
val containsEven = numList.any { it % 2 == 0 }
val containsNoEvens = numList.none { it % 2 == 0 }
// 判断numList的每个值是否都满足同一个条件，返回Boolean
val containsNoEvens = numList.all { it % 2 == 1 }
val firstEvenNumber: Int = numList.first { it % 2 == 0 }
val firstEvenOrNull: Int? = numList.firstOrNull { it % 2 == 0 }
val fullMenu = objList.map { "${it.name} - $${it.detail}" }
```

### Destructuring Declarations 解构赋值

#### ComponentN Functions

```kotlin
class Person(val name: String, val age: Int) {
	operator fun component1(): String {
		return name
	}

	operator fun component2(): Int {
		return age
	}
}

val person = Person("Alice", 29)
val (name, age) = person
```

#### Objects & Lists

```kotlin
val person = Person("Adam", 100)
val (name, age) = person

val pair = Pair(1, 2)
val (first, second) = pair

val coordinates = arrayOf(1, 2, 3)
val (x, y, z) = coordinates
```
