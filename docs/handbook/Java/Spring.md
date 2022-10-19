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
