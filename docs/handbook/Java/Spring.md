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

1. @SpringBootApplication：来标注一个主程序类，说明这是一个 Spring Boot 应用；
2. @SpringBootConfiguration：Spring Boot 的配置类，标注在某个类上，表示这是一个 Spring Boot 的配置类；
3. @Configuration 配置类上来标注这个注解，创建一个 class 配置文件；配置类 - 配置文件；配置类也是容器中的一个组件；
4. @Component 表示一个类是由 Spring 管理的组件，通用型注解；@Component("idxxx")可以指定 id；
5. @EnableAutoConfiguration 开启自动配置功能；以前我们需要配置的东西，Spring Boot 帮我们自动配置；告诉 Spring Boot 开启自动配置功能；这样自动配置才能生效；
6. @Controller：表示一个类是 Spring MVC 控制器；
7. @Autowired：用于 bean 的自动依赖注入；
8. @Service：表示一个类是一个 Spring 服务；
9. @Repository：用来表示一个类是 Spring 的存储库；被标注在 DAO 层；
10. @RequestMapping：用于将 URL 请求映射到控制器方法；
11. @PathVariable：用于从 URL 路径中提取一个变量；
12. @RequestParam：用于从查询字符串或表单数据中提取一个变量；
13. @ResponseBody：用来表示一个方法应该直接返回响应体；
14. @ExceptionHandler：用于处理由控制器方法抛出的异常；
15. @Transactional：用来表示一个方法应该在一个事务中被执行；
16. @Bean：用于表示一个方法产生一个由 Spring 管理的 Bean；
17. @Value：用于从属性文件或环境变量中注入值；
18. @Profile：用来激活一个特定的 Spring 配置文件；
19. @ComponentScan：开启包扫描，不用再在每个 Bean 上加注解，Bean 即 data class 上需要加@Component 注解；

### 项目结构

这 4 个部分是指 Java Spring MVC 项目的典型结构，它是一种用于构建 Web 应用的架构模式。

- controller：这个 package 包含处理传入的 HTTP 请求的类，并将它们路由到适当的服务方法。
- model/bean/dto：这个 package 包含定义应用程序的数据模型的类。这包括实体、数据传输对象（DTO）和其他特定领域的对象。
- dao/repository(jpa/jdbc)/mapper(mybatis)：这个 package 包含处理应用程序中数据持久性的类。这包括数据库访问、查询和其他与数据相关的操作。
  - dao 的实现一般放在 impl 包下，即 dao 一般是些 interface，而具体的 sql 语句则写在 impl 类中，比如基于 myBatis 实现 DAO。
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
   5. Bean 的别名，生成的是同一个 Bean 实例。
4. ![实例化Bean的几种方法示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131014585.png)
5. ![实例化Bean的几种方法的测试示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131019310.png)
6. 报错从最后几行往前看
7. 生命周期：
   1. 初始化容器：创建对象（内存分配），执行构造方法，执行属性注入（set 操作），执行 bean 初始化方法。init-method、destroy-method 等。
   2. 使用 bean：执行业务操作
   3. 关闭/销毁容器：执行 bean 销毁方法
8. 关闭容器的方式：
   1. 手动关闭：ConfigurableApplicationContext 接口 close()操作
   2. 注册关闭钩子，在虚拟机退出前先关闭容器，再退出虚拟机：ConfigurableApplicationContext 接口 registerShutdownHook()操作

### 依赖注入

往类中传递数据的方式有几种？普通方法（set 方法）、构造方法。

1. setter 注入：
   1. 简单类型：先在 bean 中定义引用类型属性并提供可供访问的 set 方法，然后在 `bean` -> `property` 中设置 value 进行传递
   2. 引用类型：同上
2. 构造器注入：
   1. 简单类型：先在 bean 中定义构造方法，然后在 `bean` -> `constructor-arg` 中设置 name 和 ref/value 进行传递
   2. 引用类型：同上
3. ![示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131037749.png)
4. ![简化方法示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131039986.png)
5. 自己开发的模块用 setter 注入
6. 依赖自动装配：
   1. bean 中添加 `autowire="byType/byName"` 字段，配合 setter
   2. 只用于引用类型，不能对简单类型操作
   3. 使用按类型装配时必须保障容器中相同类型的 bean 唯一，推荐使用
   4. 使用按名称装配时必须保障容器中具有指定名称的 bean，因变量名与配置耦合，不推荐
   5. 自动装配优先级低于 setter 注入与构造器注入，同时出现时自动装配失效
7. 集合类型注入：
   1. array/list/set/map 等：在 ApplicationContext.xml 中，新建一个 bean，然后通过 property 标签配合 name 属性通过 value 或者 ref 来配置
   2. ![集合注入示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131041519.png)
   3. ![List和Set](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131047492.png)
   4. ![Map和Property](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131048499.png)
8. 注入 null：![注入null示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131043420.png)
9. 注入的时候创建内部 Bean：![示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131046711.png)

### Bean 的作用域

#### Singleton 作用域

在一个 ApplicationContext 上下文环境中，只创建一个 Bean 实例，`<bean id="xx" ... scope="singleton" ></bean>`。

#### prototype 作用域

创建多个 Bean 实例，`<bean id="xx" ... scope="prototype" ></bean>`。

![示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131347903.png)

有如下场景：
![方法注入](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131355020.png)

此时需要通过方法注入的方式实现：

1. 在 Bean1 中增加抽象方法 createBean2()用于生成 Bean2 的实例，![示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131359648.png)
2. 在 spring.xml 中：通过`<lookup-method name="createBean2" bean="bean2"></lookup-method>`来实现
3. ![示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131358771.png)

#### Web 环境作用域

1. request 作用域
2. session 作用域
3. application 作用域
4. websocket 作用域

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131406410.png)

#### 自定义作用域

SimpleThreadScope 作用域

1. 自定义作用域![自定义作用域](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131518679.png)
2. ![注册自定义scope](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131519393.png)
3. SimpleThreadScope![SimpleThreadScope](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131520184.png)

### Bean 的懒加载

默认的情况下，Singleton 作用域下，Bean 会在 Context 之前就被创建完成。即 Spring 容器会在创建容器时提前初始化 Singleton 作用域下的 Bean。如果想要在使用时才创建 Bean，可以使用懒加载。但是如果 Bean 被标注了`lazy-init="true"`，则该 Bean 只有在其被需要时才会被初始化

1. 如果把`<beans ... default-lazy-init="true"></beans>`，则该标签下的 Bean 都开启懒加载
2. 节省资源，但可能会增加某些资源的的响应时间

### Bean 初始化及销毁逻辑处理

1. 初始化：
   1. `<bean ... init-method="onInit"></bean>`
   2. 实现 InitializingBean 接口，重写 afterPropertiesSet()方法
2. 销毁：
   1. `<bean ... destroy-method="onDestroy"></bean>`
   2. 实现 DisposableBean 接口，重写 destroy()方法
3. 为所有的 Bean 设定默认的初始化方法和销毁方法：`<beans ... default-init-method="onInit" default-destroy-method="onDestroy"></beans>`

### Bean 属性继承

场景一：Child 类继承了 Parent 类：

1. 使用`<bean id="parent" class="com.example.Parent" abstract="true"><property name="attr1" value="val1"/></bean>`定义一个抽象的父类，通过`abstract="true"`告诉 Spring 这个 Bean 不需要实例化。
2. 使用`<bean id="child1" class="com.example.Child1" parent="parent"><property name="attrC1" value="valC1"/></bean>`定义一个子类，继承父类
3. 使用`<bean id="childN" class="com.example.ChildN" parent="parent"><property name="attrCN" value="valCN"/></bean>`定义一个子类，继承父类
4. 子类会继承父类的属性，但不会继承父类的构造方法和初始化方法
5. 子类可以重写父类的属性，但不能重写父类的构造方法和初始化方法

场景二：Child 类没有继承 Parent 类，但是多个 Child 类中有相同的属性和值，此时 Parent 基类 Bean 上删除`class="com.example.Parent"`即可。

Bean 的别名：只能在@Configuration 中使用，不能在@Component 中使用。![Bean的别名](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131647632.png)

### Bean 的依赖注入

1. 构造器注入：在构造器中注入依赖，使用`<bean id="xx" class="com.example.Xx" constructor-arg ref="yy"></bean>`
2. setter 注入：在 setter 方法中注入依赖，使用`<bean id="xx" class="com.example.Xx"><property name="yy" ref="yy"></property></bean>`
3. 自动装配：使用`<bean id="xx" class="com.example.Xx" autowire="byType"></bean>`，byName、byType、constructor、no
4. 使用`@Autowired`注解，可以自动装配，可以标注在构造器、setter 方法、字段上
5. 使用`@Qualifier`注解，可以指定具体的 bean，可以标注在构造器、setter 方法、字段上
6. ![注入Bean示例1](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131715018.png)
7. ![通过属性注入Bean示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131716175.png)
8. ![实例化和注入时指定Bean的id](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131718520.png)
9. ![List和Set注入示例1](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131721241.png)
10. ![List和Set注入示例2](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131723461.png)，通过 order 指定顺序。
11. ![Map注入示例1](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131725961.png)
12. ![Map注入示例2](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131726824.png)
13. ![简单类型注入示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131726595.png)
14. ![SpringIoC容器内置接口实例注入示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131727344.png)

### Bean 的生命周期

1. 实例化：通过构造器或工厂方法创建 bean 实例
2. 属性赋值：通过 setter 方法或工厂方法设置 bean 属性
3. 初始化：通过 init-method 方法或 InitializingBean 接口的 afterPropertiesSet 方法进行初始化
4. 使用：bean 可以被使用
5. 销毁：通过 destroy-method 方法或 DisposableBean 接口的 destroy 方法进行销毁

### 通过注解设置 Bean 的作用域

1. 通过@Scope 注解设置作用域及名称![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131738557.png)
2. ![自定义作用域](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131739528.png)
3. ![方法注入](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131740488.png)

### 通过注解设置 Bean 的懒加载

@Lazy 注解，通过@Lazy 注解设置懒加载，可以标注在类上，也可以标注在方法上。![对比示例](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411131744600.png)

### 通过注解实现 Bean 的初始化及销毁

1. 使用@PostConstruct 注解，方法在依赖注入完成后执行，可以标注在方法上。
2. 使用@PreDestroy 注解，方法在 bean 销毁前执行，可以标注在方法上。

3. 使用 InitializingBean 接口的 afterPropertiesSet 方法进行初始化，可以实现 InitializingBean 接口。
4. 使用 DisposableBean 接口的 destroy 方法进行销毁，可以实现 DisposableBean 接口。

5. 在 Bean 实例上使用`@Bean(initMethod="onInit", destroyMethod="onDestroy")`注解，可以指定初始化和销毁方法。

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

### Spring 中有哪些方法可以实现异步流式接口防止接口超时？

1. 使用 DeferredResult，异步处理，通过延迟返回结果，避免线程阻塞。当后台任务完成时，通过 DeferredResult 设置结果并返回给客户端。常用于需要等待后台任务完成再返回结果的场景。非阻塞：主线程不需要等待任务完成。超时可控：可以设置超时时间，避免客户端长时间等待。有局限性，处理结果仅返回单个值。

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/async")
public class AsyncController {

    @GetMapping("/deferred")
    public DeferredResult<String> deferredResponse() {
        // 创建 DeferredResult，设置超时时间为10秒
        DeferredResult<String> deferredResult = new DeferredResult<>(10000L, "请求超时，返回默认值");

        // 模拟异步任务
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(3000); // 模拟处理耗时任务
                deferredResult.setResult("异步处理完成，返回成功结果！"); // 设置最终结果
            } catch (InterruptedException e) {
                deferredResult.setErrorResult("处理异常");
            }
        });

        return deferredResult;
    }
}
```

2. 使用 ResponseBodyEmitter，适用于要动态生成内容并逐步发送给客户端的场景，可以在任务执行过程中逐步向客户端发送更新，而不是等待整个接口执行完成后一次性返回。适合需要分批返回数据的场景，比如文件上传进度、实时日志或大数据集的返回。数据分块响应，减小单次数据传输的压力。实时性好：可以逐步将数据发送给客户端，而非一次性返回。减少内存消耗：适合大数据集的场景。

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/async")
public class AsyncStreamController {

    @GetMapping("/stream")
    public ResponseBodyEmitter streamResponse() {
      // 创建一个ResponseBodyEmitter，-1/0：代表不超时，如果不设置，到达默认的超时时间后连接会自动断开。
        ResponseBodyEmitter emitter = new ResponseBodyEmitter();

        // 模拟异步任务不断推送数据
        CompletableFuture.runAsync(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    emitter.send("数据块 " + i + "\n"); // 推送数据块
                    Thread.sleep(1000); // 模拟延迟
                }
                emitter.complete(); // 完成数据发送
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e); // 发送错误
            }
        });

        return emitter;
    }
}
```

3. 使用 SseEmitter (Server-Sent Events)，是 ResponseBodyEmitter 的一个子类，它同样能够实现动态内容生成，不过主要将它用在服务器向客户端推送实时数据，如实时消息推送、状态更新等场景。基于 HTTP 的单向事件流（Server-Sent Events 协议）。适用于实时数据推送场景，比如通知系统、日志流或进度更新。SSE 有一点比较好，客户端与服务端一旦建立连接，即便服务端发生重启，也可以做到自动重连。轻量级协议：基于 HTTP 协议的简单实现，无需使用 WebSocket。适合前端支持 SSE 的场景。

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/async")
public class SseController {

    private static final Map<String, SseEmitter> EMITTER_MAP = new ConcurrentHashMap<>();

    @GetMapping("/subSseEmitter/{userId}")
    public SseEmitter sseEmitter(@PathVariable String userId) {
        log.info("sseEmitter: {}", userId);
        SseEmitter emitterTmp = new SseEmitter(-1L);
        EMITTER_MAP.put(userId, emitterTmp);
        CompletableFuture.runAsync(() -> {
            try {
                SseEmitter.SseEventBuilder event = SseEmitter.event()
                        .data("sseEmitter" + userId + " @ " + LocalTime.now())
                        .id(String.valueOf(userId))
                        .name("sseEmitter");
                emitterTmp.send(event);
            } catch (Exception ex) {
                emitterTmp.completeWithError(ex);
            }
        });
        return emitterTmp;
    }

    @GetMapping("/sendSseMsg/{userId}")
    public void sseEmitter(@PathVariable String userId, String msg) throws IOException {
        SseEmitter sseEmitter = EMITTER_MAP.get(userId);
        if (sseEmitter == null) {
            return;
        }
        sseEmitter.send(msg);
    }
}
```

前端代码示例：

```html
<body>
  <div id="content" style="text-align: center;">
        
    <h1>SSE 接收服务端事件消息数据</h1>
        
    <div id="message">等待连接...</div>
  </div>
  <script>
    let source = null;
    let userId = 7777;

    function setMessageInnerHTML(message) {
      const messageDiv = document.getElementById("message");
      const newParagraph = document.createElement("p");
      newParagraph.textContent = message;
      messageDiv.appendChild(newParagraph);
    }

    if (window.EventSource) {
      // 建立连接
      source = new EventSource("http://127.0.0.1:9033/subSseEmitter/" + userId);
      setMessageInnerHTML("连接用户=" + userId);
      /**
       * 连接一旦建立，就会触发open事件
       * 另一种写法：source.onopen = function (event) {}
       */
      source.addEventListener(
        "open",
        function (e) {
          setMessageInnerHTML("建立连接。。。");
        },
        false
      );
      /**
       * 客户端收到服务器发来的数据
       * 另一种写法：source.onmessage = function (event) {}
       */
      source.addEventListener("message", function (e) {
        setMessageInnerHTML(e.data);
      });
      // onerror
      source.onerror = (err) => {
        console.error("连接出错:", err);
      };
    } else {
      setMessageInnerHTML("你的浏览器不支持SSE");
    }
  </script>
</body>
```

4. 使用 CompletableFuture + @Async，Spring 提供的 @Async 注解可以让方法异步执行，返回 CompletableFuture 以提高处理性能。简单易用，基于线程池实现异步任务。适合后台异步处理任务，接口快速返回结果。简单直观，易于集成。配合线程池提高异步执行效率。有局限性，处理结果仅返回单个值。

```java
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/async")
@EnableAsync
public class AsyncServiceController {

    private final AsyncService asyncService;

    public AsyncServiceController(AsyncService asyncService) {
        this.asyncService = asyncService;
    }

    @GetMapping("/future")
    public CompletableFuture<String> futureResponse() {
        return asyncService.processAsyncTask();
    }
}

@Service
class AsyncService {

    @Async
    public CompletableFuture<String> processAsyncTask() {
        try {
            Thread.sleep(3000); // 模拟耗时任务
            return CompletableFuture.completedFuture("异步任务完成！");
        } catch (InterruptedException e) {
            return CompletableFuture.completedFuture("任务失败！");
        }
    }
}
```

5. 基于 WebFlux 的响应式流式接口，如果服务使用的是 Spring WebFlux（基于 Reactor 的响应式框架），可以直接返回 Flux 或 Mono 类型的数据流。完全异步非阻塞。适合高并发场景，充分利用 Reactor 框架的响应式特性。完全异步非阻塞，性能高效。支持响应式编程，流式处理数据。

```java
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

@RestController
@RequestMapping("/async")
public class WebFluxController {

    @GetMapping("/flux")
    public Flux<String> fluxResponse() {
        // 每隔1秒，发送一个数据块，持续5次
        return Flux.interval(Duration.ofSeconds(1))
                   .map(i -> "数据块 " + i)
                   .take(5); // 限制发送5个数据块
    }
}
```

6. StreamingResponseBody 与其他响应处理方式略有不同，主要用于处理大数据量或持续数据流的传输，支持将数据直接写入 OutputStream。例如，当我们需要下载一个超大文件时，使用 StreamingResponseBody 可以避免将文件数据一次性加载到内存中，而是持续不断的把文件流发送给客户端，从而解决下载大文件时常见的内存溢出问题。接口实现直接返回 StreamingResponseBody 对象，将数据写入输出流并刷新，调用一次 flush 就会向客户端写入一次数据。

```java
// ...

@RestController
@RequestMapping("/async")
public class StreamingResponseBodyController {
  @GetMapping("/streamingResponse")
  public ResponseEntity<StreamingResponseBody> handleRbe() {

      StreamingResponseBody stream = out -> {
          String message = "streamingResponse";
          for (int i = 0; i < 1000; i++) {
              try {
                  out.write(((message + i) + "\r\n").getBytes());
                  out.write("\r\n".getBytes());
                  //调用一次flush就会像前端写入一次数据
                  out.flush();
                  TimeUnit.SECONDS.sleep(1);
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
      };
      return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(stream);
  }
}
```

7. 总结：
   - DeferredResult：适合异步处理任务后一次性返回结果。
   - ResponseBodyEmitter：适合分批或流式返回数据。
   - SseEmitter：适合实时推送消息（支持 SSE 协议的场景）。
   - Flux（WebFlux）：高性能响应式流式接口，适合高并发场景。
   - @Async + CompletableFuture：适合后台异步任务执行，快速返回结果。
   - StreamingResponseBody：适合大数据量或持续数据流传输，避免内存溢出。

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
2. `source "$HOME/.sdkman/bin/sdkman-init.sh"`: 刷新环境变量，可以直接加到你的 shell 配置文件（比如 ~/.bash_profile、~/.zshrc 等）中，以便每次打开新终端时自动初始化 sdkman。
3. `sdk version`
4. `sdk list java`: 获取当前操作系统可用的 JDK 信息
5. `sdk install java 11.0.18`: 安装特定版本 JDK
6. `sdk install java 14.0.1 /Library/Java/JavaVirtualMachines/jdk-14.0.1.jdk/Contents/Home`: 关联本地已安装 JDK
7. `sdk default java 11.0.18`: 设置默认版本（感觉并不管用，还得去改.zshrc 才会生效）
8. `sdk use java 11.0.18`: 使用某个 jdk 版本
9. `sdk uninstall java 8.0.252-open`: 移除 SDKMAN 中的某个特定版本
10. `sudo rm -rf /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk`: 移除本地 jdk 版本
11. `ls /Library/Java/JavaVirtualMachines/`: Mac 上通过 .dmg 文件安装的 JDK 一般会在这个目录下
12. `sudo rm -rf /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk`: 使用 rm 命令来删除对应的 JDK 目录
13. `sdk install maven`: 安装 Maven，安装前要确保已正确安装 JDK
14. Maven 镜像仓库，阿里云：`https://maven.aliyun.com/`，按使用指南修改 Maven 安装目录下的`conf/settings.xml`文件；也可以在用户目录的`.m2`子目录中创建`settings.xml`文件，并设置相应配置内容。
15. `/Users/eric/.sdkman/candidates/maven/3.9.1/conf/settings.xml`: 配置举例
16. `brew cask install intellij-idea-ce`: 安装 idea 社区版或直接去官网下载
17. `IDEA->Help->Edit Custom VW Options`，在打开的 idea.vmoptions 文件中调整-Xms 和-Xmx 等 JVM 相关参数，让 ide 流畅运行
18. 通过[Spring Initializr](https://start.spring.io)创建工程，打开网页，填写项目信息，点击生成，下载 helloworld.zip 压缩包
19. Maven 设置 sdkman 的 settings.xml 为全局公用配置：
    1. 在`.zshrc`中设置环境变量：一般来说 sdkman 默认安装的位置都是一样的
    ```sh
    export SDKMAN_DIR=$HOME/.sdkman
    export M2_HOME=$SDKMAN_DIR/candidates/maven/current
    ```
    2. `mkdir -p $M2_HOME/conf`，如果没有权限则`sudo chown -R $USER $M2_HOME`
    3. `cp /path/to/your/settings.xml $M2_HOME/conf/`
    4. 这样当你切换 Maven 版本之后，也依然会使用公用的 settings

### 快速新建一个 SpringBoot 项目

0. 一个 web 开发框架
1. 在这个[网站](https://start.spring.io/)选择配置，作用可以理解为前端的 vue-cli、create-react-app 等脚手架，选好配置依赖之后下载；
2. idea 中打开刚才下载的项目
3. 项目结构：
   1. `src/main/java/com/example/demo/DemoApplication.java`：主类，启动类
   2. `src/main/java/com/example/demo/controller/HelloController.java`：控制器类
   3. `src/main/resources/application.properties`：配置文件
   4. `src/main/resources/static`：静态资源目录
   5. `src/main/resources/templates`：模板目录
4. `DemoApplication.java`：

   ```java
   package com.example.demo;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   @SpringBootApplication
   public class DemoApplication {
       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }
   }
   ```

5. `HelloController.java`：

   ```java
   package com.example.demo.controller;

   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;

   @RestController
   @RequestMapping("/hello")
   public class HelloController {
       @GetMapping
       public String sayHello() {
           return "Hello, World!";
       }
   }
   ```

6. `application.properties`：
   ```properties
   server.port=8080
   ```
7. 运行项目，访问`http://localhost:8080/hello`，会看到`Hello, World!`

### SpringBoot 常用注解

1. `@SpringBootApplication`：启动类注解，包含`@Configuration`、`@EnableAutoConfiguration`、`@ComponentScan`
2. `@Configuration`：配置类注解，用于定义配置类
3. `@EnableAutoConfiguration`：自动配置类注解，用于启用自动配置
4. `@ComponentScan`：组件扫描类注解，用于指定扫描组件的包路径
5. `@RestController`：组合注解，用于定义控制器类，包含`@Controller`和`@ResponseBody`
6. `@RequestMapping`：请求映射注解，用于定义请求路径和请求方法
7. `@GetMapping`：组合注解，用于定义 GET 请求路径
8. `@PostMapping`：组合注解，用于定义 POST 请求路径
9. `@PutMapping`：组合注解，用于定义 PUT 请求路径
10. `@DeleteMapping`：组合注解，用于定义 DELETE 请求路径
11. `@PathVariable`：路径变量注解，用于获取路径变量值

### 依赖管理

1. 在`pom.xml`中添加依赖：
   ```xml
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
   </dependencies>
   ```
2. 在`pom.xml`中添加插件：
   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
           </plugin>
       </plugins>
   </build>
   ```
3. 在`pom.xml`中添加仓库：
   ```xml
   <repositories>
       <repository>
           <id>aliyun</id>
           <url>https://maven.aliyun.com/repository/public</url>
       </repository>
   </repositories>
   ```
4. 在`pom.xml`中添加属性：
   ```xml
   <properties>
       <java.version>11</java.version>
   </properties>
   ```

### SpringBoot 配置文件

1. `application.properties`：用于配置 SpringBoot 应用程序的属性
2. `application.yml`：用于配置 SpringBoot 应用程序的属性，使用 YAML 格式
3. 配置文件的优先级：`application.properties` > `application.yml` > `application-{profile}.properties` > `application-{profile}.yml`
4. application.yml 示例：

```yml
spring:
  profiles:
    # 默认激活 dev 环境
    active: dev
  #  jackson:
  #    # 设置后台返参，若字段值为 null, 则不返回
  #    default-property-inclusion: non_null
  #    # 设置日期字段格式
  #    date-format: yyyy-MM-dd HH:mm:ss
  datasource: # 配置数据库连接
  #    p6spy组件的数据库驱动
  driver-class-name: com.p6spy.engine.spy.P6SpyDriver
  url: jdbc:p6spy:mysql://127.0.0.1:3306/weblog?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull
  #    JDBC的数据库驱动
  #    driver-class-name: com.mysql.cj.jdbc.Driver
  #    url: jdbc:mysql://127.0.0.1:3306/weblog?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull
  username: root
  password: xxx
  hikari:
    minimum-idle: 5
    maximum-pool-size: 20
    auto-commit: true
    idle-timeout: 30000
    pool-name: Weblog-HikariCP
    max-lifetime: 1800000
    connection-timeout: 30000
    connection-test-query: SELECT 1
security:
  # 自定义登录用户名、密码
  user:
    name: admin # 登录用户名
    password: xxx # 登录密码
jwt:
  # 过期时间
  expiration: 86400
  # 签名算法
  algorithm: HS512
  # 签发人 瞎写的
  issuer: ericyang
  # 秘钥
  secret: xxx
logging:
  level:
    root: info
    com.example.demo: debug # trace级别更低，比debug输出的信息更多？
  pattern:
    console: "%p%m%n"
# springboot默认使用Tomcat，配置最大连接数等可以控制程序同时处理的请求数：max-connections + accept-count
server:
  tomcat:
    threads:
      # 最少线程数
      min-spare: 10
      max: 20
    # 最大连接数
    max-connections: 8192 # 默认8192
    # 最大等待数
    accept-count: 100 # 默认100
```

### SpringBoot 自动配置

1. SpringBoot 会根据类路径中的依赖自动配置应用程序
2. 自动配置类位于`spring-boot-autoconfigure`模块中
3. 自动配置类使用`@Conditional`注解来决定是否应用配置

### SpringBoot 测试

1. 在`pom.xml`中添加测试依赖：
   ```xml
   <dependencies>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-test</artifactId>
           <scope>test</scope>
       </dependency>
   </dependencies>
   ```
2. 使用`@SpringBootTest`注解来启动测试应用程序
3. 使用`@Autowired`注解来注入测试所需的依赖
4. 使用`@Test`注解来定义测试方法

### SpringBoot 部署

1. 使用`mvn clean package`命令打包 SpringBoot 应用程序
2. 构建：`mvn install`
3. 构建跳过测试类 `mvn install -Dmaven.test.skip=true`
4. 生成的 JAR 文件位于`target`目录下
5. 使用`java -jar your-application.jar`命令启动应用程序
6. 使用`nohup java -jar your-application.jar &`命令在后台启动应用程序
7. 使用`systemd`或`init.d`脚本来管理应用程序的启动和停止

### SpringBoot 安全

1. 使用`spring-boot-starter-security`依赖来添加安全功能
2. 配置安全规则，例如使用`@EnableWebSecurity`注解来启用安全配置
3. 使用`@Override`方法来重写安全配置，例如配置登录页面、权限等
4. 使用`@PreAuthorize`、`@PostAuthorize`、`@Secured`等注解来控制方法的访问权限

### SpringBoot 日志

1. 使用`spring-boot-starter-logging`依赖来添加日志功能
2. 配置日志级别，例如使用`logging.level.root=INFO`来设置根日志级别
3. 配置日志文件，例如使用`logging.file.name=app.log`来设置日志文件名
4. 使用`@Slf4j`注解来简化日志记录

### SpringBoot 配置中心

1. 使用`spring-cloud-config`依赖来添加配置中心功能
2. 配置配置中心的地址，例如使用`spring.cloud.config.uri=http://localhost:8888`来设置配置中心地址
3. 使用`@Value`注解来注入配置中心的配置
4. 使用`@ConfigurationProperties`注解来注入配置中心的配置到配置类中

### SpringBoot 微服务

1. 使用`spring-cloud-starter-netflix-eureka-client`依赖来添加 Eureka 客户端功能
2. 配置 Eureka 客户端的地址，例如使用`eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/`来设置 Eureka 客户端地址
3. 使用`@EnableEurekaClient`注解来启用 Eureka 客户端
4. 使用`@EnableDiscoveryClient`注解来启用服务发现功能

### SpringBoot 任务调度

1. 使用`spring-boot-starter-quartz`依赖来添加 Quartz 任务调度功能
2. 配置 Quartz
3. 任务调度类使用`@Component`注解来定义
4. 任务调度方法使用`@Scheduled`注解来定义

### SpringBoot 数据库

1. 使用`spring-boot-starter-data-jpa`依赖来添加 JPA 数据库访问功能
2. 配置数据库连接信息，例如使用`spring.datasource.url=jdbc:mysql://localhost:3306/your_database`来设置数据库连接信息
3. 使用`@Entity`注解来定义实体类
4. 使用`@Repository`注解来定义数据访问层

### SpringBoot 消息队列

1. 使用`spring-boot-starter-activemq`依赖来添加 ActiveMQ 消息队列功能
2. 配置 ActiveMQ 连接信息，例如使用`spring.activemq.broker-url=tcp://localhost:61616`来设置 ActiveMQ 连接信息
3. 使用`@JmsListener`注解来监听消息队列中的消息
4. 使用`JmsTemplate`来发送消息

### SpringBoot 文件上传

1. 使用`spring-boot-starter-web`依赖来添加 Web 功能
2. 配置文件上传大小限制，例如使用`spring.servlet.multipart.max-file-size=10MB`来设置文件上传大小限制
3. 使用`MultipartFile`来接收文件上传
4. 使用`File`来保存上传的文件

### SpringBoot 文件下载

1. 使用`spring-boot-starter-web`依赖来添加 Web 功能
2. 使用`ResponseEntity`来设置响应头和响应体
3. 使用`InputStreamResource`来设置响应体
4. 使用`HttpServletResponse`来设置响应头和响应体

### SpringBoot 文件压缩

1. 使用`spring-boot-starter-web`依赖来添加 Web 功能
2. 使用`ZipOutputStream`来压缩文件
3. 使用`ZipInputStream`来解压缩文件

### SpringBoot 文件解压缩

1. 使用`spring-boot-starter-web`依赖来添加 Web 功能
2. 使用`ZipOutputStream`来压缩文件
3. 使用`ZipInputStream`来解压缩文件

### SpringBoot 文件加密

1. 使用`spring-boot-starter-web`依赖来添加 Web 功能
2. 使用`Cipher`类来加密和解密文件
