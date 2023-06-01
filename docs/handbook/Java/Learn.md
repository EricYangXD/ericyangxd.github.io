---
title: Learn Java
author: EricYangXD
date: "2022-09-30"
meta:
  - name: keywords
    content: JAVA,java
---

## Learn Java - Basic

### 基础语法

1. 定义变量要先声明类型
2. 数组的声明和定义：`int[] arr={1,2,3,5}`或`String[] str=new String[5]`
3. this
4. == : 基本类型比较的是具体数据值，引用类型比较的是引用地址值
   - 字符串拼接时，如果没有变量参与，都是字符串直接相加，编译之后就是拼接之后的结果，会复用串池中的字符串。（可以用==比较）
   - 如果有变量参与，每一行拼接的代码，都会在内存中创建新的字符串，浪费内存。（不可以用==比较）
5. JavaBean: 类名需要见名知意；成员变量使用 private 修饰；提供至少两个构造方法：无参和全参；成员方法：提供每个成员变量对应的 getter/setter 函数，如果还有其他行为也要写上。
6. 整数有四种类型：byte:1 字节，byte:2 字节，int:4 字节（默认），long:8 字节
7. 浮点数 2 种：float:4 字节，double:8 字节（默认）
8. 字符：char:2 字节（单引号&一个字符）
9. 布尔：boolean：1 字节

### Java 开发中的基础概念

1. DTO：Data Transfer Object。在 Java 开发中，DTO（数据传输对象）是一种设计模式，用于在一个应用程序的各层之间传输数据。它是一个包含数据的简单对象，并提供 getter 和 setter 方法来访问和修改数据。DTO 的目的是对数据进行封装，并为应用程序各层之间的传输提供一个标准化的接口，例如，在前端和后端之间，或在不同的服务之间。DTO 经常被用在 Web 应用程序中，在客户端和服务器之间传输数据。例如，客户端的一个 Web 表单可以用来收集用户的数据，然后将其作为一个 DTO 发送到服务器。然后，服务器可以处理这些数据，并以另一个 DTO 的形式返回响应。DTO 也可以用来在一个应用程序的不同部分之间映射数据。例如，如果一个应用程序使用对象关系映射（ORM）框架与数据库进行交互，DTO 可以用来在数据库和应用程序的领域对象之间映射数据。
2. AOP：Aspect-Oriented Programming。一种编程范式，允许你将应用程序中的`交叉问题Cross-cutting concerns`模块化。交叉问题是指那些影响到你的应用程序的多个部分的问题，并且不能被干净地分离到单个模块中。交叉问题的例子包括日志、安全和事务管理。在 AOP 中，你定义了 aspects，它是封装了交叉问题的模块。Aspects 可以应用于你的应用程序的多个部分，允许你将相同的行为应用于多个组件而不需要重复的代码。AOP 的一个常见实现是通过使用拦截器 Interceptors 或 Advice。拦截器是在方法调用之前或之后执行的代码，允许你修改该方法的行为。Advice 与拦截器类似，但可以应用于多个方法或类。AOP 可以在许多编程语言中实现，包括 Java、C#和 Python。在 Java 中，AOP 通常使用 Spring AOP 或 AspectJ 等框架实现。
3. Spring MVC 是一个基于 Servlet 容器的 Web 应用框架，这里的 Servlet 容器通常指 Tomcat 等服务容器。Servlet 容器会负责监听端口消息并映射为 Request/Response 对象，然后交给 Servlet 实例去处理。SpringMVC 框架的作用核心就是 Servlet 实例，这个实例在 Spring 中默认是 DispatcherServlet，DispatcherServlet 中使用众多 Spring 组件来协助处理请求。
4. ![Spring MVC结构图](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/springmvc.jpg)
5. Servlet 容器：Servlet 用于从某个 Socket 接收数据，并处理为标准的 ServletRequest 和 ServletResponse。
6. 核心组件 DispatcherServlet：Spring MVC 的核心组件就是 DispatcherServlet，它是 SpringWeb 请求的调度中心。
7. 请求映射 HandlerMapping：请求映射用于根据请求找到该请求需要调用的所有方法，包含过滤器和处理方法等。
8. 拦截器 HandlerInterceptor：拦截器和 Tomcat 容器中的 Valve 有些类似，Spring 的拦截器可以让用户灵活的在请求处理前、请求处理后和请求完成三个阶段自定义操作，比如用户权限校验等。
9. 处理方法 Handler：处理方法在 DispatcherServlet 定义为 Object 类型，如果我们使用了@RequestMapping 来根据请求查找处理方法，那么查找到的处理方法就是 HandlerMethod 类型，对应于 Controller 中添加了对应 RequestMapping 的方法。
10. 处理方法适配器 HandlerAdapter：DispatcherServlet 从 HandlerMapping 中获取到的处理方法是 Object 类型，意味着不同的处理方法可能返回不同的对象，DispatcherServlet 本身是一个调度器，不应该关注如何调用不同的处理方法，所以 Spring 提供了 HandlerAdapter 列表用户处理不同的调度方法。
11. 异常处理 HandlerExceptionResolver：HandlerExceptionResolver 用于处理请求过程中出现的异常，其实现有很多中类型，不过我们日常开发中使用比较多的是 ExceptionHandlerExceptionResolver，也就是处理我们定义的@ExceptionHandler 注解。
12. DAO：Data Access Object，数据访问对象。它是一种设计模式，将数据持久性逻辑与业务逻辑分开。这种模式背后的想法是创建一个接口，抽象出数据库上的 CRUD（创建、读取、更新、删除）操作，然后为该接口提供一个实现。这使得改变底层数据源而不改变业务逻辑更加容易。DAO 模式常用于 Java 应用程序中，特别是那些使用`对象-关系映射（ORM）框架`的应用程序，如 Hibernate 或 JPA。
13. ![项目结构划分](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/struc.png)

### String/StringBuilder/StringJoiner

1. String：最常用 `String s="string"`直接赋值，放在 StringTable 里（可能会复用，节约内存），通过 new 的形式创建的放在堆内存中不可复用，创建后不可修改，都是 String 类的实例对象，可以接受字符数组和字节数组创建字符串（要经过转换），有 equals、equalsIgnoreCase 等方法。
2. StringBuilder：可以看成是一个容器，创建之后里面的内容是可变的。作用是提高字符串的操作效率，有 append、reverse 等方法。
   - 默认创建一个长度为 16 的字节数组
   - 添加的内容长度小于 16，直接存
   - 添加的内容大于 16 则会扩容（原容量\*2+2）
   - 如果扩容之后还不够，以实际长度为准
3. StringJoiner：可以看成是一个容器，创建之后里面的内容是可变的。字符串拼接，可指定字符串拼接时的间隔符、起始符和结束符。

### HSDB 调试工具

1. 在 idea 的 terminal 输入：`jps`即可显示当前运行的类的 id
2. 在 idea 的 terminal 输入：`jhsdb hsdb`即可显示 HSDB 面板，然后点击 file，选择 attach，输入对应的 id 查看

### 继承

#### 子类到底能继承父类中的哪些内容？

| 内容     | 情况一            | 情况二                                         |
| -------- | ----------------- | ---------------------------------------------- |
| 构造方法 | 非私有 不能       | private 不能                                   |
| 成员变量 | 非私有 能         | private 能（但是要通过 getter、setter 来调用） |
| 成员方法 | 在虚方法表中的 能 | 其他的 不能                                    |

#### 代码块

1. 有`{}`局部代码块，已淘汰
2. 构造代码块：
   1. 写在成员位置的代码块
   2. 作用：可以把多个构造方法中重复的代码抽取出来
   3. 执行时机：在创建本类对象的时候会先执行构造代码块再执行构造方法
3. 构造代码块的形式不够灵活，可以用如下方式替代：
   1. 通过 this 调用其他构造方法
   2. 提取公共代码当做一个函数，按需调用这个函数
4. 静态代码块`static {}`，随着类的加载而加载，且只执行一次，比如做一些初始化操作

#### 总结

1. 继承中成员方法的访问特点：
   - this 调用：就近原则
   - super 调用：直接找父类
2. 方法重写：子类中出现和父类中一模一样的方法声明，@Override
3. @Override 注解可以校验重写是否正确，可读性好
4. 方法重写的本质：覆盖虚方法表中的方法
5. 父类中的构造方法不会被子类继承，子类中所有的构造方法默认先访问父类中的无参构造函数，再执行自己。因为子类在初始化的时候可能会用到父类中的数据，如果父类没有初始化，那么子类将无法使用父类的数据。子类构造方法的第一行默认语句都是`super()`，不写也存在。若要调用父类的有参构造，那么必须手动 super 来调用。

### 访问权限

1. 权限修饰符：private (只能自己用）< 缺省/默认/空着不写 (只能在本包中用) < protected (外面包里的子类也可以用) < public （都可以用）
2. 只有被添加到虚方法表中的方法才能重写，建议重写的方法尽量和父类保持一致

### 多态

1. 加载字节码文件时，永远是先加载父类，再加载子类
2. 调用成员变量的特点：编译看左边，运行也看左边
3. 调用成员方法的特点：编译看左边，运行看右边。编译的时候会先检查左边的父类中有没有这个方法，如果没有就直接报错。
4. 多态的优势：
   1. 在多态形式下，右边对象可以实现解耦合，便于扩展和维护
   2. 定义方法的时候，使用父类型作为参数，可以接收所有子类对象，体现多态的扩展性与便利
5. 弊端：不能使用子类特有的功能，需要手动进行类型转换
6. 引用数据类型的类型转换有两种方式：自动类型转换（子到父），强制类型转换（父到子）
7. 强制类型转换可以转换成真正的子类类型，从而调用子类独有的功能，但是，转换类型与真实类型不一致时会报错！所以可以用 instanceof 关键字进行判断先。

### 包

1. 包就是文件夹，用来管理各种不同功能的 Java 类，方便后期代码维护。`package com.hema.domain;`
2. 命名规则：公司的域名反写+包的作用，需要全部小写字母，见名知意。
3. 使用其他类的规则：
   1. 使用同一个包中的类时，不需要导包
   2. 使用 java.lang 包中的类时，不需要导包
   3. 其他情况都需要导包，例`import com.hema.domain.Student;`，idea 会自动导入或者让你自己选择导入哪个，`alt + Enter`
   4. 如果同时使用两个包中的同名类，需要使用全类名，例`com.hema.domain.Student;`

### final

1. 修饰方法时，表明该方法是最终方法，不能被重写
2. 修饰类，表明该类是最终类，不能被继承
3. 修饰变量，叫做常量，只能被赋值一次，类似 const

### 抽象类抽象方法

关键字 abstract，例：`public abstract void add();`

1. 抽象方法：将共性的行为（方法）抽取到父类之后，由于每一个子类执行的内容是不一样的，所以在父类中不能确定具体的方法体。该方法就可以定义为抽象方法。
2. 抽象类：如果一个类中存在抽象方法，那么该类就必须声明为抽象类。
   1. 不能实例化，
   2. 抽象类中不一定有抽象方法，但有抽象方法的类一定是抽象类
   3. 可以有构造方法，作用是：当创建子类对象时，给属性进行赋值的。
   4. 抽象类的子类：
      1. 要么重写抽象类中的所有抽象方法
      2. 要么是抽象类
3. 抽象方法，可以强制子类按统一的格式书写方法名之类的。

### 接口

0. 接口 interface，侧重于对行为的抽象，不能实例化，通过 implements 实现一个或多个接口。例`public interface Swim{}`，可以定一些抽象方法。

接口中成员的特点：通过内存分析工具 jps 可以看出来。

1. 成员变量只能是常量，默认修饰符：`public static final`
2. 没有构造方法
3. 成员方法只能是抽象方法，默认修饰符：`public abstract`
4. JDK7 以前：接口中只能定义抽象方法
5. JDK8：可以定义有方法体的方法（默认、静态），用于**接口升级**时起兼容的作用
   1. `public default void show(){}`
   2. 默认方法不是抽象方法，不强制重写。若要重写，则重写时需去掉 default 关键字
   3. public 可以省略，default 不能省略
   4. 如果实现了多个接口，多个接口中存在相同名字的默认方法，子类就必须对该方法进行重写
6. JDK9：可以定义私有方法
   1. `private void show(){}`，普通私有方法对应默认
   2. `private static void show(){}`，静态私有方法对应静态
7. 接口和类之间的关系：
   1. 类和类之间：继承关系，只能单继承，不能多继承，但可以多层继承
   2. 类和接口之间：实现关系，可以单实现也可以多实现，还可以在继承一个类的同时实现多个接口，需要重写所有抽象方法
   3. 接口和接口之间：继承关系，可以单继承，也可以多继承，需要重写所有抽象方法
8. 当一个方法的参数是接口时，可以传递接口所有实现类的对象，这种方式称之为接口多态。
9. 适配器模式：定义一个抽象类 xxxAdapter（一般不需要实例化），对一个接口的所有抽象方法进行空实现，然后在我们要用到的地方继承这个类，重写用到的某个方法即可，不需要在业务代码中实现接口中的所有抽象方法。相当于在接口和实现类之间添加的一层中间件。这个中间抽象类还可以继承其他类，让实现类进行间接继承。
10. 如果一个接口里面没有抽象方法，则表示当前的接口是个标记型接口。

### 内部类

1. 类的五大成员：属性、方法、构造函数、代码块、内部类。
2. 内部类：在一个类的里面，再定义一个类。
3. 内部类表示的事物是外部类的一部分，单独出现没有任何意义
4. 内部类的访问特点：
   1. 内部类可以直接访问外部类的成员，包括私有
   2. 外部类要访问内部类的成员，必须创建对象
5. 4 种：
   1. 成员内部类:可以被 private、默认、protected、public、static 等；JDK16 之前不能定义静态变量，16 开始才可以。
   2. 静态内部类:只能访问外部类中的静态变量和静态方法，如果想访问非静态的，需创建外部类的实例对象再调用。
   3. 局部内部类:定义在方法里面，类似方法里面的局部变量。外界无法直接使用，需要在方法内部创建对象并使用。该类可以直接访问外部类的成员和方法内的局部变量。
   4. 匿名内部类:隐藏了名字的内部类。可以写在成员位置或者局部位置。格式：`new 类名/接口名(){ 重写方法 }`。整体就是一个类的子类对象或者接口的实现类对象。
6. 获取成员内部类对象的两种方式：
   1. 外部类编写方法，对外提供内部类对象
   2. 直接创建：`Outer.Inner oi = new Outer().new Inner();`
7. 外部类成员变量和内部类成员变量重名时，在内部类通过这种形式访问外部变量：`Outer.this.xxx`
8. `javap xxx.class`：反编译 class 文件，Java 自带功能。
9. 匿名内部类使用场景：
   1. 当调用一个方法的时候，方法的形参是一个接口或者类时，以接口为例，可以传递这个接口的实现类对象，如果实现类只要使用一次，就可以用匿名内部类简化代码。例：
   ```java
   Arrays.sort(arr, new Comparator<Integer>(){
      @Override
      public int compare(Integer o1, Integer o2){
         return o1 - o2;// 升序
      }
   })
   ```
10. 在调用方法时，如果方法出现了重载现象，优先调用实参跟形参类型一致的那个方法。

## 常用 Api

### Math

1. abs
2. round
3. ceil：向数轴右侧取整
4. floor：向数轴左侧取整
5. sqrt：开方
6. cbrt：开立方
7. max/min
8. absExact：防止溢出

### System

1. exit
2. currentTimeMillis
3. arraycopy(source,start,target,start,length)

### Runtime

1. Runtime.getRuntime()
2. Runtime.getRuntime().exit()
3. Runtime.getRuntime().totalMemory()

### Object

最高父类

1. toString()
2. equals()
3. clone()
4. Objects：工具类
   - equals：先做非空判断再调用第一个入参的 equals 方法比较
   - isNull
   - nonNull

### BigInteger & BigDecimal

#### BigInteger

1. 对象一旦创建，内部记录的值就不能再变。
2. `new BigInteger("13412")`：常用，字符串中必须是整数
3. `BigInteger.valueOf(1232L)`：常用，参考 6，有优化。
4. `new BigInteger("13453",2 进制)`
5. `new BigInteger(int num, Random rnd)`:获取指定范围的随机大整数 2^num
6. 对`-16~16`的数字做了优化，多次创建都是同一个对象。
7. BigInteger 方法：`add, subtract, multiply, divide, divideAndRemainder, equals, pow, max, min, intValue, doubleValue`

8. 存储上限：

   - 数组中最多能存储的元素个数：21 亿多
   - 数组中每一位能表示的数字：42 亿多
   - BigInteger 能表示的最大数字为：42 亿的 21 亿次方

9. 存储形式：先转换成二进制补码，一位符号位，其余 bit 按 32 位一组，存到数组中。

#### BigDecimal

用于表示位数较多的小数，以及解决小数精度失真的问题，是计算结果更精确。

1. `BigDecimal.valueOf(number/string)`：常用（没有超出 int 表示范围）
2. `new BigDecimal(string)`：常用
3. 对 0~10 之间的整数，会返回已经创建好的对象，不会重新 new
4. 舍入模式，四舍五入。一般使用 `RoundingMode.HALF_UP`
5. 存储方式：遍历每个字符，转换为对应的 ASCII 码，然后存储到数组中`byte[]`，负数还会存储一个负号。
6. `add, subtract, multiply, divide`

### 正则表达式

1. 正则表达式-字符类

语法示例：

- `[abc]`：代表 a 或者 b，或者 c 字符中的一个。
- `[^abc]`：代表除 a,b,c 以外的任何字符。
- `[a-z]`：代表 a-z 的所有小写字符中的一个。
- `[A-Z]`：代表 A-Z 的所有大写字符中的一个。
- `[0-9]`：代表 0-9 之间的某一个数字字符。
- `[a-zA-Z0-9]`：代表 a-z 或者 A-Z 或者 0-9 之间的任意一个字符。
- `[a-dm-p]`：a 到 d 或 m 到 p 之间的任意一个字符。

2. 正则表达式-逻辑运算符

语法示例：

- `&&`：并且、交集
- `|` ：或者、并集
- `\` ：转义字符
- `[]` : 里面内容只出现一次
- `()` : 分组，以左括号为准
- `^` : 取反
- `!` : 去除后面的
- `?` : 0 次或 1 次
- `*` : 0 次或 多次
- `+` : 1 次或 多次
- `{}` : 具体次数
- `(?i)` : 忽略后面字符的大小写
- `a((?i)b)c` : 只忽略 a 后面字符 b 的大小写

3. 正则表达式-预定义字符

语法示例：

- `"."`：匹配任意字符。
- `"\d"`：任何数字`[0-9]`的简写；
- `"\D"`：任何非数字`[^0-9]`的简写；
- `"\s"`：空白字符：`[ \t\n\x0B\f\r]` 的简写
- `"\S"`：非空白字符：`[^\s]` 的简写
- `"\w"`：单词字符：`[a-zA-Z_0-9]`的简写
- `"\W"`：非单词字符：`[^\w]`

4. 正则表达式-数量词

语法示例：

- `X?` : 0 次或 1 次
- `X*` : 0 次到多次
- `X+` : 1 次或多次
- `X{n}` : 恰好 n 次
- `X{n,}` : 至少 n 次
- `X{n,m}`: n 到 m 次(n 和 m 都是包含的)

5. Pattern：表示正则表达式，`Pattern p=Pattern.compile("xxx); Matcher m=p.matcher(str);`
6. Matcher：文本匹配器，按照正则表达式的规则去读取字符串，从头开始读取，`m.find(); m.group();`
7. 方法：
   - matches
   - replaceAll
   - split
8. 用法：
   - `\\1`: 用在正则语句中，表示第一个()分组的内容再次出现一遍（分组从 1 开始）
   - `$1`: 表示把正则中第一组的内容再拿出来用，不是用在正则语句中

### Arrays

数组的工具类

1. `Arrays.toString()`:
2. `Arrays.copyOf()`:
3. `Arrays.copyOfRange()`: 拷贝指定范围（包头不包尾，包左不包右，前闭后开）
4. `Arrays.fill()`: 填充
5. `Arrays.sort()`: 底层使用的是快排
6. `Arrays.binarySearch()`: 二分查找，数组需要是升序的

### lambda 表达式

1. lambda 表达式可以用来简化匿名内部类的书写
2. lambda 表达式只能用来简化函数式接口的匿名内部类的写法
3. 函数式接口：有且只有一个抽象方法的接口叫做函数式接口，接口上方可以加`@FunctionalInterface`注解
4. 可推导出来的都可以省略
   - 参数类型可以省略
   - 若只有一个参数，参数类型和括号都可以省略
   - 若 lambda 表达式的方法体只有一行，大括号、分号、return 都可以同时省略

例：

```java
Arrays.sort(arr, (o1, o2) ->  o1 - o2);
```

### 集合

分为两大类：Collection 单列集合和 Map 双列集合。

#### Collection 接口

Collection 是单列集合的顶层接口，它的功能是全部单列集合都可以继承使用的。不能直接创建它的实例对象。

- `add`:
- `clear`:
- `remove`:
- `contains`: 依赖 equals 方法进行判断，如果是自定义引用类型，那么需要在 javabean 中自己重写 equals 方法
- `isEmpty`:
- `size`:

1. List 接口：添加的元素是有序（添加的顺序）、可重复、有索引
   - ArrayList 实现类
   - LinkedList 实现类
   - Vector 实现类：已彻底淘汰
2. Set 接口：添加的元素是无序（添加的顺序）、不重复、无索引
   1. HashSet 实现类: 无序（添加的顺序）、不重复、无索引，底层使用哈希表存储数据，增删改查性能都较好。JDK8 之前：数组+链表==哈希表，新元素存入数组，老元素挂在新元素下面。JDK8 开始：数组+链表+红黑树==哈希表，新元素直接挂在老元素下面。加载因子会影响数组的扩容时机。JDK8 以后，当链表长度超过 8，而且数组长度大于等于 64 时，自动转换为红黑树。如果集合中存储的是自定义对象，那么必须要重写 hashCode 和 equals 方法。
      - LinkedHashSet 实现类: 有序（添加的顺序）、不重复、无索引，底层是哈希表，但是每个元素额外多了一个双链表的机制记录存储的顺序。
   2. TreeSet 实现类: 可排序、不重复、无索引。默认规则：对于数值类型：Integer、Double，默认按照从小到大的顺序进行排列。对于字符、字符串类型：按照字符在 ASCII 码表中的数字升序进行排列。基于红黑树实现的。自定义排序规则有两种：一是 JavaBean 类实现 Comparable 接口，制定比较规则；二是创建集合时，自定义 Comparable 比较器对象，指定比较规则。

List 和 Set 有相同的遍历方式 3 种：

1. 迭代器对象：`Iterator<String> it = set/list.iterator();`

   1. `it.next();`:
   2. `it.hasNext();`:
   3. 迭代器遍历完毕指针不会复位；再调用 next 会报错。因为他迭代的时候不依赖索引。如果要再次遍历则需再生成一个迭代器
   4. 每次 hasNext 循环中只能用一次 next，否则会出问题。
   5. 迭代器遍历时，不能用集合的方法进行增加或者删除，但是可以用迭代器的方法去修改

2. 增强 for 遍历：底层还是迭代器。`for( String str : arr){ ... }`，类似 for...of，只是不需要 of
3. forEach(): `arr.forEach(...){...}`
4. List 独有的列表迭代器遍历：`ListIterator<String> it = list.listIterator();`，其余跟普通迭代器一样
5. List 中的常见方法：
   1. add：插入到指定索引处
   2. remove：删除元素并返回这个被删除的元素，可以直接删除，可以通过索引删
6. 使用场景分类：
   1. 迭代器遍历：在遍历的过程中需要删除元素
   2. 列表迭代器：在遍历的过程中需要添加元素
   3. 增强 for 遍历：仅仅需要遍历
   4. Lambda 表达式遍历：仅仅需要遍历
   5. 普通 for 遍历：遍历的时候想操作索引，可以用普通 for
7. LinkedList：底层是双向链表，查询慢，增删快。特有的操作首尾元素的方法：addFirst、addLast、getFirst、getLast、removeFirst、removeLast···
8. 使用场景总结：
   1. 如果想要集合中的元素可重复：用 ArrayList 集合，基于数组的
   2. 如果想要集合中的元素可重复，而且当前的增删操作明显多于查询：用 LinkedList 集合，基于链表的
   3. 如果想对集合中的元素去重：用 HashSet 集合，基于哈希表的
   4. 如果想对集合中的元素去重，而且要保证存取顺序：用 LinkedHashSet 集合，基于哈希表和双链表，效率低于 HashSet
   5. 如果想对集合中的元素进行排序：用 TreeSet 集合，基于红黑树，后续也可用 List 集合实现排序

#### Map

1. API：put/remove/clear/containsKey/containsValue/isEmpty/size;
2. `Map<String,String> map=new HashMap<>();`
3. put: 1.添加 map 中不存在；2.如果已有 key 则覆盖已有的元素，并把被覆盖的 value 返回。
4. remove: 删除并返回 value
5. keys/values/entrySet: 对于 entrySet，用`Set<Entry<String,String>>`或`Set<Map.Entry<String,String>>`，前者需要导包，然后 getKey/getValue
6. lambda 表达式遍历：
   1. BiConsumer 匿名内部类
   2. 箭头函数
7. HashMap: 是 Map 的一个实现类，由键决定的：无序、不重复、无索引。和 HashSet 底层一样，都是哈系表结构。依赖 hashCode 方法和 equals 方法保证键的唯一。若键存储的是自定义对象，需要重写 hashCode 方法和 equals 方法，若值存储自定义对象，则无需重新 hashCode 方法和 equals 方法
8. LinkedHashMap: 是 HashMap 的子类，只是每个键值对元素又额外的多了一个双链表的机制记录存储的顺序，也就是有序的
9. TreeSet/TreeMap: 底层原理都是红黑树，由键决定特性：不重复、无索引、可排序，对键进行排序，默认按键从小到大排序
   1. 自定义对象排序时，需要实现 Comparable 接口，重写 compareTo 方法，指定比较规则：`TreeMap<Integer,String> tm=new TreeMap<>();`，在 compareTo 方法中，this 表示当前要添加的元素，o 表示已经在红黑树中存在的元素，返回值是负数，表示当前要添加的元素是小的，存左边，正数表示是大的存右边，0 表示当前要添加的元素已经存在，要舍弃。
   2. 创建集合时传递 Comparator 比较器对象，指定比较规则`TreeMap<Integer,String> tm=new TreeMap<>(new Comparator<Integer>(){...});`重写 compare 方法
10. 对应 Set，普通 Map，用 HashMap；存取有序，用 LinkedHashMap；要排序，用 TreeMap。
11. Integer/Double 默认是按升序排列；String 默认是按 ASCII 码表中对应的数字升序进行排列。

#### 不可变集合

1. 在 List、Set、Map 接口中，都存在静态的 of 方法，可以获取一个不可变的集合--不能添加、删除和修改。
2. 例：`List<String> list=List.of("1","2","3");`，`Set<String> set=Set.of("1","2","3");`，`Map<String,String> map=Map.of("k1","v1","k2","v2","k3","v3");// 两两成键值对`
3. List 直接用，Set 元素不能重复，Map 元素不能重复、键值对数量最多是 10 个，超过 10 个用 ofEntries 方法

```java
HashMap<String,String> hm = new HashMap<>();
hm.put("1","1");
// ...
// 利用上面的数据获取一个不可变集合
// 1. 先获取所有的键值对对象
Set<Map.Entry<String,String>> entries = hm.entrySet();
// 2. 把entries变成一个数组
Map.Entry[] arr = new Map.Entry[0];
// toArray方法在底层会比较集合的长度跟数组的长度两者之间的大小关系
// 如果集合长度大于数组长度：数据在数组中放不下，此时会根据实际数据的个数，重新创建数组
// 如果集合长度小于等于数组长度：数据在数组中放的下，此时不会重新创建数组，直接用现有的数组
Map.Entry[] newArr1 = entries.toArray(arr);
// 3. 转成不可变
Map map1 = Map.ofEntries(arr);

// 简写版
Map<Object,Object> map2 = Map.ofEntries(hm.entrySet().toArray(new Map.Entry[0]));

// 最终版 JDK>=10
Map<String,String> map3 = Map.copyOf(hm);
```

#### Stream 流

1. 链式调用，结合 Lambda 表达式，简化集合、数组的操作。
2. 有 filter 过滤、limit 获取前几个元素、skip 跳过前几个元素、distinct 元素去重（依赖 hashCode 和 equals 方法）、concat 合并 ab 两个流为一个流、map 遍历、forEach 遍历、count 统计元素个数、toArray 收集流中的数据放到数组中、collect 收集流中的数据放到集合中等
   1. 中间方法，返回新的 Stream 流，原来的 Stream 流只能使用一次，因此最好用链式编程
   2. 修改 Stream 流中的数据，不会影响原来集合或数组中的数据
3. 中间方法：过滤、转换等：`filter、limit、skip、distinct、concat、map`
4. 终结方法：统计、打印等：`forEach、count、toArray`
5. 双列集合无法直接使用 stream 流，`hashMap.ketSet/entrySet.stream()...`
6. 单列集合使用 Collection 中的默认方法，`list.stream()...`
7. 数组使用 Arrays 工具类中的静态方法，`Arrays.stream(arr)...`
8. 零散数据(需要是同类数据类型)使用 Stream 接口中的静态方法，`Stream.of(1,2,3,4)...`
9. 注意：Stream 接口中静态方法 of 的细节：方法的形参是一个可变参数，可以传递一堆零散的数据，也可以传递数组，但是数组必须是引用数据类型的，如果传递基本数据类型，则会把整个数组当成一个元素放到 Stream 当中。
10. toArray 方法的参数：`new IntFunction<>(){@Override public T apply(){...return T;}}`
11. collect 方法可以收集到 Set、List、Map 等：
    1. `Collectors.toList()`不去重
    2. `Collectors.toSet()`去重
    3. `Collectors.toMap("key 的规则","value 的规则")`，如果要收集到 Map 中，那么键名不能重复，否则报错。
    4. 如下：Function 泛型一：表示流里面的每一个数据的类型，泛型二表示 Map 集合中值的数据类型。方法 apply 形参：依次表示流里面的每一个数据，方法体：生成键/值的代码，返回值是已经生成的键/值。

```java
list.stream().filter(...).collect(Collectors.toMap(
   new Function<String, String>(){
      @Override
      public String apply(String s){
         return s.xxx;
      }
   },
   new Function<String, Integer>(){
      @Override
      public Integer apply(String s){
         return s.xxx;
      }
   })
);
```

#### 方法引用

引用处需要是函数式接口`@FunctionalInterface`；被引用的方法必须已经存在；被引用方法的形参和返回值需要跟抽象方法保持一致；被引用方法的功能要满足当前需求。

1. 类名::方法名
2. 引用静态方法：类名::静态方法名 -- Integer::parseInt
3. 引用成员方法：
   1. 引用其他类的成员方法：
   2. 引用本类的成员方法：
   3. 引用父类的成员方法：
4. 引用构造方法：构造方法::new
5. 其他调用方式：
   1. 使用类名引用成员方法
   2. 引用数组的构造方法
6. this::方法名
7. super::方法名
8. static 方法中不能直接用 1，要用 2

### 异常

程序出现的问题。

1. Java.lang.Throwable:
   - Error：严重的错误，开发不用管
   - Exception：异常，需要处理
     - RuntimeException: 编译时不会提示，运行时会提示
     - 其他异常：编译时异常：在编译阶段必须手动处理，否则代码报错，红色波浪线
2. 异常的作用：
   - 是用来查询 bug 的重要参考信息
   - 可以作为方法内部的一种特殊返回值，以便通知调用者底层的执行情况
3. 异常的处理方式：
   1. JVM 默认的处理方式：把异常的名称原因及出现的位置等信息输出在控制台；程序停止执行
   2. 自己处理（捕获异常）：`try..catch`，对于多种异常，可以通过写多个 catch 来分别捕获（JDK7 中可以把多个写在一个语句里`|`），注意，如果多个异常之间存在父子关系，那么要把父类写在子类后面。没有捕获到的就交个 JVM 默认处理。
   3. 抛出异常：
      1. throws: 写在方法定义处，表示声明一个异常，告诉调用者，使用本方法可能会有哪些异常
      2. throw: 写在方法内，结束方法，手动抛出异常对象，交给调用者，方法中下面的代码不再执行了
4. `e.printStackTrace();e.toString();e.getMessage();`
5. 常见的几种运行时异常：NullPointerException, ArrayIndexOutOfBoundsException, NumberFormatException, IOException, ...
6. 自定义异常：`extends RuntimeException`/`extends Exception`，定义异常类，写继承关系，空参构造，带参构造

### File

1. File 对象表示路径，可以是文件也可以是文件夹，这个路径可以存在也可以是不存在的
2. 3 个函数方法

```java
public File(String pathname)// 根据文件路径创建文件对象
public File(String parent, String child)// 根据父路径名字符串和子路径名字符串创建文件对象
public File(File parent, String child)// 根据父路径对应文件对象和子路径名字符串创建文件对象
```

2. 路径分隔符：Windows 用反斜线`\\`，MacOS/Linux 用斜线`/`
3. 对路径的拼接一般用构造方法更稳妥
4. File 中的常见的方法：
   1. `public static File[] listRoots()`: 列出可用的文件系统根
   2. `public String[] list()`: 获取当前该路径下所有内容
   3. `public String[] list(FilenameFilter filter)`: 利用文件名过滤器获取当前该路径下所有内容
   4. `public File[] listFiles()`: 获取当前该路径下所有内容
   5. `public File[] listFiles(FileFilter filter)`: 利用文件名过滤器获取当前该路径下所有内容
   6. `public File[] listFiles(FilenameFilter filter)`: 利用文件名过滤器获取当前该路径下所有内容
   7. isDirectory(), isFile(), exists(), length(), getAbsolutePath(), getPath(), getName(), lastModified()
   8. createNewFile(), mkdir(), mkdirs(), delete()

### IO

存储和读取数据的解决方案。

1. 按流的方向划分：IO 流分为输入流（读取）和输出流（写出）
2. 按操作文件类型划分：IO 流可以分为字节流（可以操作所有类型文件）和字符流（智能操作纯文件文本--可以被记事本直接打开并且没有乱码的，比如 txt、md）
3. 字节流：
   - InputStream -> FileInputStream
   - OutputStream -> FileOutputStream
4. 字符流：
   - Reader -> FileReader
   - Writer -> FileWriter

#### FileOutputStream

1. 创建字节输出流对象：参数是字符串表示的路径或者 File 对象都是可以的；如果文件不存在会创建新的文件，但是要保证父级路径是存在的；如果文件已经存在，则会清空文件。
2. 写数据：write 方法的参数是整数，但是实际上写到本地文件中的是整数在 ASCII 上对应的字符。
3. 释放资源：每次使用完流之后都要释放资源。
4. `void write(int b)`: 一次写一个字节数据
5. `void write(byte[] b)`: 一次写一个字节数组数据
6. `void write(byte[] b, int off, int len)`: 一次写一个字节数组的部分数据

```java
FileOutputStream fos = new FileOutputStream("workspace\\a.txt");
// byte[] bs = str.getBytes();
fos.write(97);// 'a'
fos.close();
```

7. 换行：`\r\n`(windows)/`\n`(linux)/`\r`(macos)，Java 会默认自动补全
8. 续写：`FileOutputStream fos = new FileOutputStream("workspace\\a.txt", true);`：true 表示开启 append，默认 false 不会续写

#### FileInputStream

1. 如果文件不存在就直接报错；一次读一个字节，读出来的是数据在 ASCII 上对应的数字；读到文件末尾，read 方法返回-1；每次使用完流必须要释放资源
2. 循环读取：

```java
FileInputStream fis = new FileInputStream("workspace\\a.txt");
// byte[] bs = str.getBytes();
int b1 = fis.read();
// System.out.println(char(b1));// 转成字符串
// 循环读取
int str;
while((str = fis.read()) != -1){
   System.out.print(char(str));
}

fis.close();
```

#### 文件拷贝

- read 方法不传参默认一次读一个字节
- read 方法传参数：表示一次读取多个字节

```java
// 1. 创建对象
FileInputStream fis = new FileInputStream("workspace\\a.txt");
FileOutputStream fos = new FileOutputStream("workspace\\b.txt");
// read方法不传参默认一次读一个字节
// 2. 拷贝，边读边写
int b;
while((b=fis.read())!=-1){
   fos.write(b);
}
long start = System.currentTimeMillis();
// read方法传参数：表示一次读取多个字节
byte[] bytes = new byte[2];
int len=fis.read(bytes);// 返回本次读取了几个字节，读到的字节放在bytes中
Stirng str=new String(bytes,0,len);// 防止读到最后出现问题
System.out.print(str);
long end = System.currentTimeMillis();
// 3. 释放资源：先开的最后关闭
fos.close();
// 先开的流，后关闭
fis.close();
```

1. FileInputStream 一次读一个字节：`public int read()`
2. FileInputStream 一次读多个字节：`public int read(byte[] buffer)`，每次读取会尽可能把数组装满，一般用 1024 的整数倍，比如：`1024*1024*10`每次 10MB。
3. AutoCloseable 接口：实现之后在特定情况下可以自动关闭流
4. 异常捕获：finally
5. 字符集：
   - ASCII 基本一个字符一个字节即可
   - GB2312-80
   - GBK 包含 GB13000-1 中的全部中日韩汉字和 BIG5 中的所有汉字，Windows 默认显示 ANSI
   - BIG5
   - Unicode
   - UTF-8:不是字符集，是一种编码格式。Unicode Transfer Format，使用 1~4 个字节可变长度编码，省空间（相对于 UTF-16 和 UTF-32），ASCII1 个字节，中日韩 3 个字节...
6. 乱码：
   - 读取数据是未读完整个汉字
   - 编解码方式不统一
7. 避免乱码：
   - 不要用字节流读取文本文件
   - 编码解码时使用同一个码表，同一个编码方式
8. 编码方式：
   - `getBytes()/getBytes(String charsetName)`: 前者使用默认方式编码（IDEA-UTF-8,Eclipse-GBK），后者使用指定的编码方式编码
9. 解码方式：
   - `String(byte[] bytes)/String(byte[] bytes, String charsetName)`: 前者使用默认方式解码，后者使用指定方式解码
10. AutoCloseable 接口：实现之后在特定情况下可以自动关闭流
11. 异常捕获：finally
12. 字符集：
    - ASCII 基本一个字符一个字节即可
    - GB2312-80
    - GBK 包含 GB13000-1 中的全部中日韩汉字和 BIG5 中的所有汉字，Windows 默认显示 ANSI
    - BIG5
    - Unicode
    - UTF-8:不是字符集，是一种编码格式。Unicode Transfer Format，使用 1~4 个字节可变长度编码，省空间（相对于 UTF-16 和 UTF-32），ASCII1 个字节，中日韩 3 个字节...
13. 乱码：
    - 读取数据是未读完整个汉字
    - 编解码方式不统一
14. 避免乱码：
    - 不要用字节流读取文本文件
    - 编码解码时使用同一个码表，同一个编码方式
15. 编码方式：
    - `getBytes()/getBytes(String charsetName)`: 前者使用默认方式编码（IDEA-UTF-8,Eclipse-GBK），后者使用指定的编码方式编码
16. 解码方式：
    - `String(byte[] bytes)/String(byte[] bytes, String charsetName)`: 前者使用默认方式解码，后者使用指定方式解码

#### 字符流

底层还是字节流。

1. FileReader:操作本地文件的输入流
   - 按字节进行读取，一次读一个字节，遇到中文时，一次读多个字节，读取后解码，返回一个整数
   - 读到文件末尾了，read 方法返回-1
   - `read()`默认一次读一个字节，读取之后还会转成十进制，最终返回这个十进制的值
   - `read(char[] buffer)` 把读取数据，解码，强转三步合并了，会把强转后的字符放到数组当中
2. FileWriter:操作本地文件的输出流
   - 基本同字节输出流
   - 如果 write 方法的参数是整数，但是实际上写到本地文件中的是整数在字符集上对应的字符
3. 字符流原理：
   - 创建字符流输入对象：底层：关联文件并创建缓冲区（长度为 8192 的字节数组）
   - 读取数据：底层：
     - 判断缓冲区中是否有数据可以读取
     - 缓冲区没有数据：就从文件中获取数据，装到缓冲区中，每次尽可能装满缓冲区，如果文件中也没有数据了，返回-1
     - 缓冲区有数据：就从缓冲区读取
4. close 之后不能继续写出数据，flush 之后如果缓冲区还有数据，那么仍然可以写出。

#### 字节缓冲流

1.

```java


```

### 泛型

- 什么是泛型：JDK5 引入的特性，可以在编译阶段约束操作的数据类型，并进行检查。好处如下：
  1.  统一数据类型
  2.  把运行时期的问题提前到了编译期间，避免了强制类型转换可能出现的异常，因为在编译阶段类型就能确定下来。

1. 泛型中**不能写基本数据类型**
2. 指定泛型的具体类型之后，传递数据时，可以传入该类类型或者其子类类型
3. 如果不写泛型，默认是 Object
4. 泛型类、泛型方法、泛型接口
5. 泛型不具备继承性，但是数据具备继承性
6. 泛型的通配符：`?`: 表示不确定的类型

   1. `? extend E`: 表示可以传递 E 或者 E 所有的子类类型
   2. `? super E`: 表示可以传递 E 或者 E 所有的父类类型

7. 使用场景：
   1. 定义类、方法、接口的时候，如果类型不确定，就可以定义泛型
   2. 如果类型不确定，但是能知道是哪个继承体系中的，可以使用泛型的通配符

## xml

### schemaLocation

`XML Schema`提供了两个在实例文档中使用的特殊属性，用于指出模式文档的位置。这两个属性是：`xsi:schemaLocation`和`xsi:noNamespaceSchemaLocation`，前者用于声明了目标名称空间的模式文档，后者用于没有目标名称空间的模式文档，它们通常在实例文档中使用。

1. `xsi:schemaLocation`属性的值由一个 URI 引用对组成，两个 URI 之间以空白符分隔。第一个 URI 是名称空间的名字，第二个 URI 给出模式文档的位置，模式处理器将从这个位置读取模式文档，该模式文档的目标名称空间必须与第一个 URI 相匹配。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project
   // 声明默认的名称空间
   xmlns="http://maven.apache.org/POM/4.0.0"
   // 声明 `XML Schema`实例名称空间`http://www.w3.org/2001/XMLSchema-instance`，并将xsi前缀与该名称空间绑定，这样模式处理器就可以识别
   // `xsi:schemaLocation`属性。`XML Schema`实例名称空间的前缀通常使用xsi。
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   // 使用`xsi:schemaLocation`属性指定名称空间`http://maven.apache.org/POM/4.0.0`和模式位置`https://maven.apache.org/xsd/maven-4.0.0.xsd`相关
   xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
   <!-- 。。。。 -->
</project>
```

2. `XML Schema`推荐标准中指出，`xsi:schemaLocation`属性可以在实例中的任何元素上使用，而不一定是根元素，不过，`xsi:schemaLocation`属性必须出现在它要验证的任何元素和属性之前。
3. 此外，要注意的是，`XML Schema`推荐标准并没有要求模式处理器必须要使用`xsi:schemaLocation`属性，某些模式处理器可以通过其他的方式来得到模式文档的位置，而忽略`xsi:schemaLocation`属性。
4. `xsi:noNamespaceSchemaLocation`属性用于引用没有目标名称空间的模式文档。与`xsi:schemaLocation`属性不同的是，`xsi:noNamespaceSchemaLocation`属性的值是单一的值，只是用于指定模式文档的位置。
5. 与`xsi:schemaLocation`属性一样，`xsi:noNamespaceSchemaLocation`属性也可以在实例中的任何元素上使用，而不一定是根元素，不过，`xsi:noNamespaceSchemaLocation`属性必须出现在它要验证的任何元素和属性之前。
6. 此外，要注意的是，`XML Schema`推荐标准并没有要求模式处理器必须要使用`xsi:noNamespaceSchemaLocation`属性，某些模式处理器可以通过其他的方式来得到模式文档的位置，而忽略`xsi:noNamespaceSchemaLocation`属性。

## Errors

### 导包或切版本错误

> 报错场景：导入一个新的项目，导包异常。

- 报错原因：可能是导入的过程中非正常关闭 idea 或者网络异常或者其他原因导致包下载不全。
  解决方法：

1. 找到你现在这个版本对应的包需要是 x.x.x 的，通过 idea 帮你重下包或者手动删掉自己添加然后更新
2. 找到报错提示的路径，删掉对应的包，然后 `build -> rebuild project`，或者右键项目，`maven -> reimport`。

### 查看有效依赖

在 pom.xml 上右键，找到最下面的 `Maven` > `显示有效的POM`

### 添加依赖和插件

以`dependency-check-maven`为例，它可以检测依赖漏洞，生成一个`dependency-check-report.html`：

```xml
<!-- ... -->
<dependencies>
   <!--        代码依赖包安全漏洞检测-->
   <!-- https://mvnrepository.com/artifact/org.owasp/dependency-check-maven -->
   <dependency>
      <groupId>org.owasp</groupId>
      <artifactId>dependency-check-maven</artifactId>
      <version>6.5.2</version>
   </dependency>
   <!-- ... -->
</dependencies>

<build>
   <!-- ... -->
   <plugins>
      <!--        代码依赖包安全漏洞检测-->
      <plugin>
         <groupId>org.owasp</groupId>
         <artifactId>dependency-check-maven</artifactId>
         <configuration>
            <autoUpdate>true</autoUpdate>
         </configuration>
         <executions>
            <execution>
               <goals>
                     <goal>check</goal>
               </goals>
            </execution>
         </executions>
      </plugin>
   </plugins>
   <!-- ... -->
</build>
<!-- ... -->
```

### HttpUtil 工具类

参考自 okhttp，OkHttpUtil 针对 OKHttp 做了一层封装，使 Http 请求变得无比简单。

#### OKHttpUtil 功能

- 根据 URL 自动判断是请求 HTTP 还是 HTTPS，不需要单独写多余的代码。
- 默认情况下 Cookie 自动记录，比如可以实现模拟登录，即第一次访问登录 URL 后后续请求就是登录状态。
- 自动识别 304 跳转并二次请求
- 支持代理配置
- 支持 referer 配置
- 支持 User-Agent 配置
- 自动识别并解压 Gzip 格式返回内容
- 支持 springboot 配置文件
- 极简的封装调用

#### 引入

```xml
<dependency>
    <groupId>io.github.admin4j</groupId>
    <artifactId>http</artifactId>
    <version>0.4.4</version>
</dependency>
```

#### get

```java
Response response = HttpUtil.get("https://github.com/search", Pair.of("q", "okhttp"));
System.out.println("response = " + response);
```

#### post

```java
// JSON 格式的body
Response post = HttpUtil.post("https://oapi.dingtalk.com/robot/send?access_token=27f5954ab60ea8b2e431ae9101b1289c138e85aa6eb6e3940c35ee13ff8b6335", "{\"msgtype\": \"text\",\"text\": {\"content\":\"【反馈提醒】我就是我, 是不一样的烟火\"}}");
System.out.println("post = " + post);

// form 请求
Map<String, Object> formParams = new HashMap<>(16);
formParams.put("username", "admin");
formParams.put("password", "admin123");
Response response = HttpUtil.postForm("http://192.168.1.13:9100/auth/login", formParams);
System.out.println("response = " + response);
```

#### HttpJsonUtil

返回格式为 JSON 的 可以使用 HttpJsonUtil 自动返回 JsonObject。

```java
JSONObject object = HttpJsonUtil.get("https://github.com/search",
                     Pair.of("q","http"),
                     Pair.of("username","agonie201218")
                  );
System.out.println("object = " + object);
```

#### 文件上传

```java
File file=new File("C:\\Users\\andanyang\\Downloads\\Sql.txt");
Map<String, Object> formParams = new HashMap<>();
formParams.put("key","test");
formParams.put("file",file);
formParams.put("token","WXyUseb-D4sCum-EvTIDYL-mEehwDtrSBg-Zca7t:qgOcR2gUoKmxt-VnsNb657Oatzo=:eyJzY29wZSI6InpoYW56aGkiLCJkZWFkbGluZSI6MTY2NTMwNzUxNH0=");
Response response = HttpUtil.upload("https://upload.qiniup.com/", formParams);
System.out.println(response);
```

#### 文件下载

```java
HttpUtil.down("https://gitee.com/admin4j/common-http", "path/");
```

#### HttpRequest 链式请求

```java
// get
Response response = HttpRequest.get("https://search.gitee.com/?skin=rec&type=repository")
      .queryMap("q","admin4j")
      .header(HttpHeaderKey.USER_AGENT,"admin4j")
      .execute();
      System.out.println("response = " + response);

// post form
Response response = HttpRequest.get("http://192.168.1.13:9100/auth/login")
      .queryMap("q","admin4j")
      .header(HttpHeaderKey.USER_AGENT,"admin4j")
      .form("username","admin")
      .form("password","admin123")
      .execute();
      System.out.println("response = " + response);
```
