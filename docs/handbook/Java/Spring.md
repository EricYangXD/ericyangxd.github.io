---
title: Spring
author: EricYangXD
date: "2022-10-14"
meta:
  - name: keywords
    content: Spring
---

## Spring

1. 简化开发：Spring 是分层的 JavaSE/EE 应用 full-stack 轻量级开源框架，以 IoC：Inverse of Control（反转控制）和 AOP（Aspect Oriented Programming）面向切面编程为内核。以及由此演化出来的事务处理。
2. 框架整合：MyBatis，Struts，Hibernate 等等
3. 全家桶：Spring Framework、Spring Boot、Spring Cloud 等等

### Spring-Boot 注解类型

1. @SpringBootApplication：来标注一个主程序类，说明这是一个 Spring Boot 应用。
2. @SpringBootConfiguration：Spring Boot 的配置类，标注在某个类上，表示这是一个 Spring Boot 的配置类；
3. @Configuration 配置类上来标注这个注解；配置类 - 配置文件；配置类也是容器中的一个组件；
4. @Component 表示一个类是由 Spring 管理的组件；
5. @EnableAutoConfiguration 开启自动配置功能；以前我们需要配置的东西，Spring Boot 帮我们自动配置；告诉 SpringBoot 开启自动配置功能；这样自动配置才能生效；
6. @Controller：表示一个类是 Spring MVC 控制器。
7. @Autowired：用于 bean 的自动依赖注入
8. @Service：表示一个类是一个 Spring 服务
9. @Repository：用来表示一个类是 Spring 的存储库。
10. @RequestMapping：用于将 URL 请求映射到控制器方法。
11. @PathVariable：用于从 URL 路径中提取一个变量。
12. @RequestParam：用于从查询字符串或表单数据中提取一个变量。
13. @ResponseBody：用来表示一个方法应该直接返回响应体。
14. @ExceptionHandler：用于处理由控制器方法抛出的异常。
15. @Transactional：用来表示一个方法应该在一个事务中被执行。
16. @Bean：用于表示一个方法产生一个由 Spring 管理的 bean。
17. @Value：用于从属性文件或环境变量中注入值。
18. @Profile：用来激活一个特定的 Spring 配置文件。

### 项目结构

这 4 个部分是指 Java Spring MVC 项目的典型结构，它是一种用于构建 Web 应用的架构模式。

- controller：这个 package 包含处理传入的 HTTP 请求的类，并将它们路由到适当的服务方法。
- model/bean/dto：这个 package 包含定义应用程序的数据模型的类。这包括实体、数据传输对象（DTO）和其他特定领域的对象。
- dao/repository(jpa/jdbc)/mapper(mybatis)：这个 package 包含处理应用程序中数据持久性的类。这包括数据库访问、查询和其他与数据相关的操作。
- service：这个 package 包含实现应用程序的业务逻辑的类。这包括处理数据、应用规则和其他特定于应用程序领域的操作。
- eg.

```sh
/src/main/java：放置项目Java源代码
...
|_annotation：放置项目自定义注解
|_aspect：放置切面代码
|_config：放置配置类
|_constant：放置常量、枚举等定义
   |__consist：存放常量定义
   |__enums：存放枚举定义
|_controller：放置控制器代码
|_filter：放置一些过滤、拦截相关的代码
|_mapper：放置数据访问层代码接口
|_model：放置数据模型代码
   |__entity：放置数据库实体对象定义
   |__dto：存放数据传输对象定义
   |__vo：存放显示层对象定义
|_service：放置具体的业务逻辑代码（*接口*和*实现*分离）
   |__intf：存放业务逻辑接口定义
   |__impl：存放业务逻辑实际实现
|_utils：放置工具类和辅助代码
...

/src/main/resources：放置项目静态资源和配置文件
...
|_mapper：存放mybatis的XML映射文件（如果是mybatis项目）
|_static：存放网页静态资源，比如下面的js/css/img
   |__js：
   |__css：
   |__img：
   |__font：
   |__等等
|_template：存放网页模板，比如thymeleaf/freemarker模板等
   |__header
   |__sidebar
   |__bottom
   |__XXX.html等等
|_application.yml       基本配置文件
|_application-dev.yml   开发环境配置文件
|_application-test.yml  测试环境配置文件
|_application-prod.yml  生产环境配置文件
...
```

### IoC 控制反转

使用对象时，由主动 new 产生对象转换为由外部提供对象，此过程中对象创建控制权由程序转移到外部，此思想称为控制反转。Spring 技术对 IoC 思想进行了实现：

- Spring 提供了一个容器，称为 IoC 容器，用来充当 IoC 思想中的「外部」
- IoC 容器负责对象的创建、初始化等一系列工作，被创建或被管理的对象在 IoC 容器中统称为 Bean
- 依赖注入 DI：在容器中建立 bean 与 bean 之间的依赖关系的整个过程，称为依赖注入

### 使用

1. 在项目`resources -> applicationContext.xml`中配置。

2. 导入 Spring 的坐标 spring-context。
3. 配置 bean：

   1. bean 标签表示配置 bean
   2. id 属性表示给 bean 起名字
   3. class 属性表示给 bean 定义类型

4. 获取 IoC 容器：`ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");`
5. 获取 bean：`BookDao bookDao = (BookDao) ctx.getBean("bookDao");// id`
6. 即可调用`bookDao.save();`
7. 配置 Dao，业务代码中解耦 new 关键字，可以写一个 setter 方法
8. 在`applicationContext.xml`中的 bean 标签中配置 server 与 dao 的关系
   1. property 标签表示配置当前 bean 的属性
   2. name 属性表示配置哪个具体的属性
   3. ref 属性表示参照哪一个 bean

### bean 基础配置

1. name 属性：可以定义多个 bean 的别名用逗号分号空格分隔
2. scope 属性：Spring 默认创建的实例是单例模式，即 scope 属性是 singleton！非单例模式创建方法：设置 scope 为 prototype
3. 实例化：bean 本质是对象，创建 bean 使用构造方法完成，调用的是无参构造方法，可以通过反射访问私有构造方法
   1. 构造方法
   2. 静态工厂方法：用得少，bean 中增加`factory-method`属性告诉 Spring 调哪个方法获得实例，当然也要自己先实现工厂类
   3. 实例工厂方法：先添加 bean 使用实例工厂实例化 bean，然后再在原来的 bean 中移除 class，增加`factory-method`属性设置为新增 bean 的 id，并修改`factory-method`属性为 class 中的实际方法。
   4. 3 的改进型：不需要增加一个 bean。先在工厂方法类中实现`FactoryBean<要返回的实例的类>`接口，重写两个 get 方法，`getObjectType()->UserDao.class`类似这样。
4. 报错从最后几行往前看
5. 生命周期：
   1. 初始化容器：创建对象（内存分配），执行构造方法，执行属性注入（set 操作），执行 bean 初始化方法。init-method、destroy-method 等。
   2. 使用 bean：执行业务操作
   3. 关闭/销毁容器：执行 bean 销毁方法
6. 关闭容器的方式：
   1. 手动关闭：ConfigurableApplicationContext 接口 close()操作
   2. 注册关闭钩子，在虚拟机退出前先关闭容器，再退出虚拟机：ConfigurableApplicationContext 接口 registerShutdownHook()操作

### 依赖注入

往类中传递数据的方式有几种？普通方法（set 方法）、构造方法。

1. setter 注入：
   1. 简单类型：先在 bean 中定义引用类型属性并提供可供访问的 set 方法，然后在 `bean` -> `property` 中设置 value 进行传递
   2. 引用类型：同上
2. 构造器注入：
   1. 简单类型：先在 bean 中定义构造方法，然后在 `bean` -> `constructor-arg` 中设置 name 和 ref/value 进行传递
   2. 引用类型：
3. 自己开发的模块用 setter 注入
4. 依赖自动装配：
   1. bean 中添加 `autowire="byType/byName"` 字段，配合 setter
   2. 只用于引用类型，不能对简单类型操作
   3. 使用按类型装配时必须保障容器中相同类型的 bean 唯一，推荐使用
   4. 使用按名称装配时必须保障容器中具有指定名称的 bean，因变量名与配置耦合，不推荐
   5. 自动装配优先级低于 setter 注入与构造器注入，同时出现时自动装配失效
5. 集合注入：
   1. array/list/set/map 等：在 ApplicationContext.xml 中，新建一个 bean，然后通过 property 标签配合 name 属性通过 value 或者 ref 来配置

### 加载 properties 配置文件

一些数据库用户名密码啥的不应该写在 pom.xml 里，应该单独管理 jdbc.properties

1. 把配置写入 jdbc.properties 文件，比如：`jdbc.username=xxx jdbc.password=xxx`
2. 开 context 命名空间

   1. jdbc.properties 中，beans 里面增加一行`xmlns:context="http://www.springframework.org/schema/context"`，再增加 2 行`http:.../context`，`http:.../context/spring-context.xsd`。大部分是这么操作
   2. 使用 context 空间加载 properties 配置文件：`<context:property-placeholder location="jdbc.properties"/>`，通过`system-properties-mode="NEVER"`设置不去加载系统属性，通过 location 属性配置使用不同的 jdbc.properties 文件。
   3. 在 bean 中使用属性占位符`${}`读取 properties 配置文件中的属性。

3. 不加载系统属性：`<context:property-placeholder location="jdbc.properties" system-properties-mode="NEVER" />`
4. 加载多个：`<context:property-placeholder location="jdbc.properties,jdbc2.properties" />`
5. 加载所有：`<context:property-placeholder location="*.properties" />`
6. 加载 properties 文件**标准格式**：`<context:property-placeholder location="classpath:*.properties" />`
7. 从类路径或加载系统属性：`<context:property-placeholder location="classpath*:*.properties" />`

### IOC 容器

1. 容器初始化方式一：加载类路径下的配置文件：`ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");`
2. 容器初始化方式二：从文件系统下加载配置文件：`ApplicationContext ctx = new FileSystemXmlApplicationContext("D:\\applicationContext.xml");`
3. 容器初始化加载多个配置文件：`ApplicationContext ctx = new ClassPathXmlApplicationContext("bean1.xml","bean2.xml");`
4. 获取 bean 方式一：使用 bean 名称获取`BookDao bookDao = (BookDao) ctx.getBean("bookDao");`
5. 获取 bean 方式二：使用 bean 名称获取并指定类型`BookDao bookDao = ctx.getBean("bookDao"，BookDao.class);`
6. 获取 bean 方式三：使用 bean 类型获取`BookDao bookDao = ctx.getBean(BookDao.class);`，此时系统中该类只能有一个。
7. 上古方法：BeanFactory 接口是 IoC 容器的顶层接口，初始化 BeanFactory 对象时，延迟加载 Bean。
8. ApplicationContext 是 Spring 容器的核心接口，初始化时立即加载 Bean。该接口提供基础的 bean 操作相关方法，通过其它接口扩展器功能。
9. bean 相关:

```java


```

### 注解模式开发

1. 定义 bean

   - @Component

     - @Controller
     - @Service
     - @Repository

   - `<context:component-scan/>`

2. 纯注解开发

   - @Configuration
   - @ComponentScan，多个值用数组
   - @AnnotationConfigApplicationContext

3. bean 生命周期
   - 作用范围@Scope
   - 使用@PostConstruct、@PreDestroy 定义 bean 生命周期

```java
@Repository
@Scope("singleton") // 单例模式，prototype:非单例
public class BookDaoImpl implements BookDao{
   public BookDaoImpl(){...}
   @PostConstruct
   public void init(){...}
   @PreDestroy
   public void destroy(){...}
}
```

4. 自动装配：无同名 bean 时直接使用@AutoWired，按类型装配，使用反射里面的暴力反射简化代码书写。有同名 bean 时，1 可以通过按名称装配，在 bean 中使用@Repository("xx")注解的形式区分；2 是使用@Qualifier("beanName")注解的形式开启指定名称装配 bean，直接使用。
   - 注意：自动装配基于反射设计创建对象并暴力反射对应属性为私有属性初始化数据，因此无需提供 setter 方法
   - 注意：自动装配建议使用无参构造方法创建对象（默认），如果不提供对应的构造方法，请提供唯一的构造方法
   - 注意：@Qualifier 注解无法单独使用，必须配合@AutoWired 注解使用
   - 使用@Value 实现简单类型/值类型的注入
5. 加载外部 properties 文件
   - 使用@PropertySource 注解加载 properties 文件，不支持`*`文件名
   - 注意：路径仅支持单一文件配置，多文件请使用数组格式配置，不允许使用通配符`*`
6. 第三方 bean 管理

   - 使用@Bean 定义一个返回这 bean 实例的方法
   - 将独立的配置类加入核心配置
     - 方式一：导入式，使用@Import 注解手动加入配置类到核心配置，此注解只能添加一次，多个数据使用数组格式。推荐
     - 方式二：扫描式，使用@ComponentScan({"xx.config"})注解扫描配置类所在的包，加载对应的配置类信息。不推荐

7. 第三方 bean 的依赖注入
   1. 简单类型：直接使用@Value 注解，相当于变量的形式
   2. 引用类型：在@Bean 下定义的方法中定义形参，然后就能直接使用，会自动按类型检测。容器会根据类型自动装配对象。

### AOP

- 基础：

1. 面向切面编程，一种编程范式，指导开发者如何组织程序结构。作用是在不惊动原始设计的基础上为其进行功能增强。
2. Spring 倡导无侵入式编程
3. ![AOP核心概念](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20221020143540.png)
4. 连接点：程序执行过程中的任意位置，粒度为执行方法、抛出异常、设置变量等
   1. 在 SpringAOP 中，理解为方法的执行
5. 切入点：匹配连接点的式子。在 SpringAOP 中，一个切入点可以只描述一个具体方法，也可以匹配多个方法
   1. 一个具体方法：某个包下某个接口中的无形参无返回值的某个方法
   2. 匹配多个方法：所有的 save 方法，所有的 get 开头的方法，所有的以 Dao 结尾的接口中的任意方法。。
6. 通知：在切入点处执行的操作，也就是共性功能
   1. 在 SpringAOP 中，功能最终以方法的形式呈现
7. 通知类：定义通知的类
8. 切面：描述通知与切入点的对应关系

- 实战：

1. 导包：`org.springframework.spring-context`，`org.aspectj.aspectjweaver`
2. 保持原来的接口和实现类不变
3. Spring 的执行程序（main 方法）也不变
4. SpringConfig 中，增加`@EnableAspectJAutoProxy`注解，告诉程序我们要用注解开发 AOP
5. AOP 通知类（自己创建）上，增加`@Component`注解，告诉 Spring 来加载。增加`@Aspect`注解，进行关联通知。
6. 在通知类中，新增一个私有的空方法`pt()`做通知，名字任意，无参无返回值无实际逻辑，使用`@Pointcut`注解，并传入：`"execution(void com.xxx.BookDao.xx())"`
7. 把切入点（抽出来的函数）与通知绑定，通过`@Before("pt()")`的形式
8. SpringAOP 的核心模式就是代理模式
9. 切入点：要进行增强的方法
10. 切入点表达式：要进行增强的方法的描述方式，有两种描述方式：
    1. 执行 com.xxx.dao 包下的 BookDao 接口中的无参数 update 方法
    2. 执行 com.xxx.dao.impl 包下的 BookDaoImpl 类中的无参数 update 方法
11. 切入点表达式标准格式：`动作关键字(访问修饰符 返回值 包名.类/接口名.方法名(参数)异常名)`
    1. 动作关键字：描述切入点的行为动作。例如 execution 表示执行到指定切入点
    2. 访问修饰符：public，private 等可以省略
    3. 返回值
    4. 包名
    5. 类/接口名
    6. 方法名
    7. 参数
    8. 异常名：方法定义中抛出指定异常，可以省略
12. 可以使用通配符描述切入点，快速描述
    1. `*`：单个独立的任意符号，可以独立出现，也可以作为前缀或者后缀的匹配符出现，`@Pointcut("execution(public * com.xxx.*.BookDao.find* (*))")`
    2. `..`：多个连续的任意符号，可以独立出现，常用于简化包名与参数的书写，`execution(public User com..BookDao.findById (..))`
    3. `+`：专用于匹配子类类型，`execution(* *..*Service+.*(..))`
    4. 终极写法：`execution(* *..*(..))`，不常用
13. ![20221020220453](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/20221020220453.png)
14. ![20221020221605](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/20221020221605.png)
    1. 关键步骤如下：
    2. `@Around()`
    3. `Object`
    4. `Throwable`
    5. `ProceedingJoinPoint pjp`
    6. `pjp.proceed()`
    7. `return ret`
    8. 然后填充要做的操作逻辑
15. ![20221020221529](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/20221020221529.png)
16. ![20221020221629](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/20221020221629.png)
17. `Signature sig = pjp.getSignature(); String xx = sig.getDeclaringTypeName()/getName();`获取具体执行的切入点的信息
18. AOP 通知获取参数数据：
    1. JoinPoint 对象描述了连接点方法的运行状态。可以获取到原始方法的调用参数，用于除了`@Around`以外的
    2. ProceedJointPoint 是 JointPoint 的子类：用于`@Around`
19. AOP 通知获取返回值数据：
    1. 抛出异常后通知可以获取切入点方法中出现的异常信息，使用形参可以接受对应的异常对象。`@AfterReturning(value="pt()",returning="ret")`
    2. 环绕通知中可以手工书写对原始方法的调用，得到的结果即为原始方法的返回值。
20. AOP 通知获取异常数据（了解）
    1. 抛出异常：`@AfterThrowing(value="pt()",throwing="t")`，通过形参`Throwable t`接收并使用对应的异常对象
    2. 抛出异常后通知可以获取切入点方法运行的异常信息，使用形参可以接受运行时抛出的的异常对象，使用`try{}catch(Throwable t){...}`接受并使用
21. 大量的相同的有共性的可以提取出来的方法，可以用 AOP，可以简化大量操作。

### Spring 事务

1. 事务的作用：在数据层保障一系列的数据库操作同成功同失败。
2. Spring 事务作用：在数据层或业务层保障一系列的数据库操作同成功同失败。
3. `interface PlatformTransactionManager`、`class DataSourceTransactionManager`
4. 使用步骤 3 步：
   1. 在业务层接口上添加 Spring 事务管理：`@Transactional`，通常添加在业务层接口而不是业务层实现类中，降低耦合，注解式事务可以添加到业务方法上表示当前方法开启事务，也可以添加到接口上表示当前接口所有方法开启事务
   2. 设置事务管理器：通过 `PlatformTransactionManager` 新建一个 bean，bean 中返回 `DataSourceTransactionManager` 的实例对象。事务管理器要根据实现技术进行选择，MyBatis 框架使用的是 JDBC 事务。
   3. 开启注解式事务驱动：`@EnableTransactionManagement`
5. Spring 事务角色：
   1. 事务管理员：发起事务方，在 Spring 中通常指代业务层开启事务的方法
   2. 事务协调员：加入事务方，在 Spring 中通常指代数据层方法，也可以是业务层方法
6. 事务相关配置：一般只在 Error 错误或运行时异常时才会导致事务回滚。有些异常是不会导致事务回滚的，比如 IOException。
   1. 如果要加上这种异常，需在`@Transactional(rollbackFor={IOException.class})`这样配置
   2. ![事务相关配置](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20221021154844.png)
7. 事务传播行为：事务协调员对事务管理员所携带事务的处理态度。。。
   1. 如果某个接口或方法需要单独开启事务，需在`@Transactional(propagation=Propagation.REQUIRE_NEW)`这样配置
   2. ![事务传播行为](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20221021155835.png)

## SpringMVC

SpringMVC 技术与 Servlet 技术功能等同，均属于 web 层开发技术。SpringMVC 是一种基于 Java 实现 MVC 模型的轻量级 Web 框架。使用简单，开发便捷（相较于 Servlet）。灵活性强。

### 使用步骤

1. 先导入 `SpringMVC（spring-webmvc）`与`Servlet（javax.servlet-api）`的坐标（依赖）
2. 创建 SpringMVC 控制器类（等同于 Servlet 功能）
   1. 定义访问路径：`@RequestMapping("/xxx")`
   2. 定义返回：`@ResponseBody`
3. 初始化 SpringMVC 环境（同 Spring 环境）设定 SpringMVC 加载对应的 bean
4. 启动 Tomcat 服务器的时候要保证能加载到服务器的配置，初始化 Servlet 容器。加载 SpringMVC 环境，并设置 SpringMVC 技术处理的请求。
   1. 创建一个类，继承`AbstractDispatcherServletInitializer`并实现它的几个抽象方法。
   2. 初始化一个`AnnotationConfigWebApplicationContext`并注册 SpringMvcConfig.class
   3. 在 getServletMappings 方法中设置把所有进入 Tomcat 的请求都交由 SpringMVC 来处理。固定格式`return new String[]{"/"};`
5. ![入门案例总结](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20221021164054.png)
6. ![入门案例工作流程分析](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20221021164522.png)
7. ![Controller加载控制与业务bean加载控制](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/20221021171118.png)
8. 乱码处理：重写 `getServletFilters()`，`return new Filter[]{new CharacterEncodingFilter().setEncoding("UTF-8")};`
9. get 请求：在@Controller 中
   1. 注解`@RequestMapping("函数名，也是请求的 path")`
   2. 注解`@ResponseBody`
   3. 编写响应函数体，通过形参接收参数，通过`(@RequestParam("name") String username, ... )`设置参数别名，return 返回响应字符串
10. post 请求：
    1. 通过`x-www-form-urlencoded`发送时，Java 代码和 get 请求一样
11. 参数传递：
    1. 普通参数如上
    2. POJO 参数：通过实体类来接收，使用时直接以形参注入
    3. 嵌套 POJO 参数一样，请求时嵌套属性以 AA.bb 的形式请求
    4. 数组参数：多个相同的属性会自动组成数组
    5. 集合参数：通过`@RequestParam List<String> lists`来接收
    6. 各种 JSON 数据（包括 POJO，POJO 集合）对象数组等：
       1. 添加依赖`jackson-databind`
       2. SpringMvcConfig 中添加`@EnableWebMvc`注解
       3. 通过`@RequestBody List<String> lists`来接收
12. `@RequestBody`与`@RequestParam`的区别：
    1. `@RequestParam`用于接收 url 地址传参，表单传参`application/x-www-form-urlencoded`
    2. `@RequestBody`用于接收 json 数据`application/json`
    3. `@PathVariable`用于接收路径参数，使用{参数名称}描述路径参数
    4. 开发中，发送 json 格式数据为主，`@RequestBody`应用较广
    5. 如果发送非 json 数据，选用`@RequestParam`接收请求参数
    6. 采用 restful 进行开发，当参数数量较少时，例如 1 个，可以采用`@PathVariable`接收请求路径变量，通常用于传递 id 值
13. 日期型参数接收：提前使用`@DateFormat(pattern="yyyy-MM-dd") Date date`进行格式约定，否则默认只能接收`yyyy/MM/dd`格式。底层是通过 Converter 接口重写的 convert 方法实现的转化。
14. 响应：
    1. 页面：直接在处理函数中返回页面的相对路径即可，不需要`@ResponseBody`
    2. 数据：
       1. 字符串：需要`@ResponseBody`
       2. JSON：需要`@ResponseBody`--设置当前控制器返回值作为响应体，返回一个 POJO 对应的对象即可，是 jackson 实现的。是 HttpMessageConverter 接口转的。

### RESTful 风格

1. 首先要遵循 restful 风格定义接口
2. 然后借助注解`@RequestMapping("函数名，也是请求的 path", method=RequestMethod.DELETE)`的第二个参数，定义接口行为
3. 对于路由参数，使用注解`@PathVariable`接收，同时要做`@RequestMapping(value="/xxx/{id}")`配置，跟前端路由参数一样。
4. 公共路径前缀通过在函数上添加注解`@RequestMapping("/commonPath")`实现简化。
5. 同上`@ResponseBody`注解也可以提取到函数外面，前提是所有响应方法都需要这个注解。
6. 在上面 4+5 中，可以用`@RestController`代替`@Controller`和`@ResponseBody`。
7. `@RequestMapping(value="", method=RequestMethod.POST)`===`@PostMapping(...)`，其他几种都有类似简化书写方式。
8. 设置对静态资源的访问放行：

```java
@Configuration
public class SpringMvcSupport extends WebMvcConfigurationSupport{
   @Override
   protected void addResourceHandlers(ResourceHandlerRegistry registry){
      // 当访问/pages/???的时候，走/pages目录下的内容
      registry.addResourceHandler("/pages/**").addResourceLocations("/pages/");
      registry.addResourceHandler("/js/**").addResourceLocations("/js/");
      registry.addResourceHandler("/css/**").addResourceLocations("/css/");
      registry.addResourceHandler("/plugins/**").addResourceLocations("/plugins/");
   }
}
```

## SSM 整合

## 学透 Spring

### sdkman

管理 Java 版本，类似 nvm？也可以管理 Maven、groovy 等。

1. `curl -s "https://get.sdkman.io" | bash`: 安装 sdkman
2. `source "$HOME/.sdkman/bin/sdkman-init.sh"`: 刷新环境变量
3. `sdk version`
4. `sdk list java`: 获取当前操作系统可用的 JDK 信息
5. `sdk install java 11.0.18`: 安装特定版本 JDK
6. `sdk install java 14.0.1 /Library/Java/JavaVirtualMachines/jdk-14.0.1.jdk/Contents/Home`: 关联本地已安装 JDK
7. `sdk default java 11.0.18`: 设置默认版本（感觉并不管用，还得去改.zshrc 才会生效）
8. `sdk use java 11.0.18`: 使用某个 jdk 版本
9. `sdk install maven`: 安装 Maven，安装前要确保以正确安装 JDK
10. Maven 镜像仓库，阿里云：`https://maven.aliyun.com/`，按使用指南修改 Maven 安装目录下的`conf/settings.xml`文件；也可以在用户目录的`.m2`子目录中创建`settings.xml`文件，并设置相应配置内容。
11. `/Users/eric/.sdkman/candidates/maven/3.9.1/conf/settings.xml`: 配置举例
12. `brew cask install intellij-idea-ce`: 安装 idea 社区版或直接去官网下载
13. `IDEA->Help->Edit Custom VW Options`，在打开的 idea.vmoptions 文件中调整-Xms 和-Xmx 等 JVM 相关参数，让 ide 流畅运行
14. 通过[Spring Initializr](https://start.spring.io)创建工程，打开网页，填写项目信息，点击生成，下载 helloworld.zip 压缩包
15. Maven 设置 sdkman 的 settings.xml 为全局公用配置：
    1. 在`.zshrc`中设置环境变量：一般来说 sdkman 默认安装的位置都是一样的
    ```sh
    export SDKMAN_DIR=$HOME/.sdkman
    export M2_HOME=$SDKMAN_DIR/candidates/maven/current
    ```
    2. `mkdir -p $M2_HOME/conf`，如果没有权限则`sudo chown -R $USER $M2_HOME`
    3. `cp /path/to/your/settings.xml $M2_HOME/conf/`
    4. 这样当你切换 Maven 版本之后，也依然会使用公用的 settings

### 快速新建一个 spring-boot 项目

1. 在这个[网站](https://start.spring.io/)选择配置，作用可以理解为前端的 vue-cli、create-react-app 等脚手架，选好配置依赖之后下载；
2. idea 中打开刚才下载的项目
3.
