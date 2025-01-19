---
title: Work Tips
author: EricYangXD
date: "2022-10-11"
meta:
  - name: keywords
    content: Tips
---

## Tips & Skills

### JDK 设置

1. 包含关系 JDK > JRE > JVM

#### Mac

1. 全局安装 JDK 配置`.zshrc` or`.bash_profile`

```bash
#maven
export MAVEN_HOME=/Users/eric/backend/maven
export PATH=${MAVEN_HOME}/bin:/$PATH:.

#java
export JAVA_8_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_341.jdk/Contents/Home
export JAVA_11_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.16.1.jdk/Contents/Home
export JAVA_17_HOME=/Library/Java/JavaVirtualMachines/jdk-17.0.4.1.jdk/Contents/Home

export JAVA_HOME=$JAVA_8_HOME
export PATH=${JAVA_HOME}/bin:$PATH:.
export CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar

#alias jdk8="export JAVA_HOME=$JAVA_8_HOME"
#alias jdk11="export JAVA_HOME=$JAVA_11_HOME"
#alias jdk17="export JAVA_HOME=$JAVA_17_HOME"
```

#### Windows

配置环境变量：

1. 配置 path：`新建->变量名JAVA_HOME`，变量值：`C:\Program Files\xxx\Java\jdk1.4.1`（这里是你的 JDK 的安装路径）
2. `编辑->变量名Path`，在原变量值的最后面加上：`;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin`
3. `新建->变量名CLASSPATH`,变量值：`.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar`

- 配置 JAVA_HOME 的作用： 指定 java 安装目录
- 配置 PATH 的作用：指定 java 命令搜索路径。本来只有在 jdk 的 bin 目录才可以运行 javac java 命令，但如果希望在任意的目录下面都可以访问到 javac java 命令，就必须配置 path
- 配置 CLASSPATH 的作用： 指定 Java 执行环境，在哪些目录下可以找到您所要执行的 Java 程序所需要的类或者包。通俗的说它的作用与 import、package 关键字有关，我们写的 java 源码中，当然会包含别人提供的工具类，比如当你写下 improt java.util.\*时，编译器面对 import 关键字时，就需要知道你要引入 java.util 这个 package 中的类到底在哪里。与上面的一样， 如果不告诉，他就默认在当前目录下，而如何告诉它呢？就是设置 CLASSPATH。（从 java5 开始也可以不配置，但建议配上）

在控制台分别输入 java，javac，java -version 命令，出现如下所示的 JDK 的编译器信息，包括修改命令的语法和参数选项等信息。

### Tomcat 配置

Tomcat 环境变量配置：

- 如果你的 Tomcat 安装在 C 盘里，如：`C:\Program Files\Apache Software Foundation\Tomcat 8.0`（在这里切记，安装 Tomcat 时，在其字母周围一定不要存在空格，否则最后可能导致配置不成功）

1. 点击新建。变量名为`TOMCAT_HOME`，变量值为 Tomcat 安装目录
2. 在系统变量里点新建：

- 变量名：`CATALINA_BASE`
- 变量值：`C:\Program Files\Apache Software Foundation\Tomcat 8.0;`

3. 再次新建：

- 变量名：`CATALINA_HOME`
- 变量值：`C:\Program Files\Apache Software Foundation\Tomcat 8.0;`
- 点击确定

4. 在 classpath 中加入`%CATALINA_HOME%\common\lib\servlet-api.jar;`（注意加的时候在原变量值后加英文状态下的`;`）
5. 在 path 中加入`%CATALINA_HOME%\bin;`（注意加的时候在原变量值后加英文状态下的`;`）

### IDEA VM Options

根据机器情况修改 idea.vmoptions 配置，可以提高 idea 的运行流畅度。

```bash
-Xms1024m
-Xmx2048m
-XX:+UseConcMarkSweepGC
-Djava.net.preferIPv4Stack=true
-Dfile.encoding=UTF-8
```

### 修改 IDEA 中 Tomcat 运行端口号

在`application.properties`配置文件中设置`server.port=8080`即可。

## MySQL 一行记录是怎么存储的？

1. MySQL 的数据都是保存在磁盘的，那具体是保存在哪个文件呢：MySQL 存储的行为是由存储引擎实现的，MySQL 支持多种存储引擎，不同的存储引擎保存的文件自然也不同。InnoDB 是我们常用的存储引擎，也是 MySQL 默认的存储引擎。所以，本文主要以 InnoDB 存储引擎展开讨论。
2.

3. MySQL 的 NULL 值会占用空间吗？
4. MySQL 怎么知道 varchar(n) 实际占用数据的大小？
5. varchar(n) 中 n 最大取值为多少？
6. 行溢出后，MySQL 是怎么处理的？

## 项目

### 秒杀系统

使用 SpringMVC+Spring+MyBatis 框架，原因：

1. 框架易于使用和轻量级
2. 低代码侵入性
3. 成熟的社区和用户群

#### 系统分析

1. 秒杀业务的核心：对产品库存的处理。
2. 难点在于“竞争”
3. 优化方向：减少事务行级锁的竞争

> 创建项目

命令：`mvn archetype:create -DgroupId=org.seckill -DartifactId=seckill -DarchetypeArtifactId=maven-archetype-webapp`

> MyBatis

#### MySQL 表设计-DAO 层设计与开发

#### MyBatis 合理使用

#### MyBatis 与 Spring 整合

JDBC、Hibernate、MyBatis 都是用来简化数据库操作的框架，把 Entity（Bean）对象映射成数据库中的对象也能把数据库中的数据映射成 Entity 对象，从而让开发者可以通过代码实现对数据库的操作，并得到相应的数据。MyBatis 是基于 Java 的持久层框架，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息，将接口和 Java 的 POJOs（Plain Old Java Objects）映射成数据库中的记录。Hibernate、MyBatis 都是 orm 对象关系映射框架。

1. MyBatis 特点：参数+SQL=Entity/List
2. SQL 写在哪？可以写在 xml 文件中或者写在注解中@SQL
3. 如何实现 DAO 接口？Mapper 自动实现 DAO 接口 impl 或者 API 编程方式实现 DAO 接口
4. Mapper 自动实现 DAO 接口 impl：创建对应的 DAO.xml 文件，然后设置正确的 DOCTYPE，然后在`<mapper></mapper>`标签中编写对应的 sql 语句，命名正确的 namespace。即 xml 提供 SQL，Mapper 自动实现 DAP 接口。
5. `jdbc.properties`中配置 driver、url 等数据库信息

```txt
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://127.0.0.1:3307
username=root
password=root
```

6. 在 xml 中，通过 bean 标签配置 c3p0 连接池 class，在 property 标签中配置`jdbc.properties`中的属性，比如设置 c3p0 连接池的私有属性：`<property name="maxPoolSize" value="30"/><property name="minPoolSize" value="10"/>`这种。还要配置 SqlSessionFactory 对象，在其下注入数据库连接池，配置 MyBatis 全局配置文件，对扫描的 Entity 包、sql 配置文件等使用别名配置正确。然后还要配置扫描 DAO 接口包，动态实现 DAO 接口注入到 Spring 容器中--MapperScannerConfigurer，sqlSessionFactoryBeanName。
7. `classpath`相当于 java 和 resources 两个文件夹的路径别名，比如`classpath:jdbc.properties`能直接找到 jdbc.properties 这个配置文件。
8. 在 MyBatis 中，DAO 接口方法的参数需要使用`@Param("myId") long id`的形式来在单元测试中识别多个参数，单个参数可以不用。

> Spring

#### Spring IOC 整合 Service

1. dto 文件夹下存放 service 返回的数据类，关注的是 web 和 web service 之间的数据传递。Entity 下面放的是业务数据的封装。
   - DTO 用于数据传输，主要用于在不同层之间传递数据，尤其是在 Web 层和服务层之间。关注的是接口层的需求，更多用于表示向客户端提供的数据结构。简化数据传输，解耦和安全，序列化友好。
   - Entity 则是业务数据的核心表示，通常表示业务数据和数据库表之间的映射。关注的是数据持久化和业务逻辑。与数据库表映射，业务逻辑，持久化。
2. 站在使用者角度设计 Service，而不是站在实现者角度设计 Service，方法定义粒度明确，参数要简洁，返回类型要友好
3. service 文件夹下创建 impl 文件夹实现 service
4. 使用 Spring 托管 service，并提供一致的访问接口，可以通过注解或者 applicationContext 去拿实例
5. Spring IOC 注入方式和场景：xml、注解、Java 配置类。
   - xml：1:Bean 实现类来自第三方类库，如：DataSource 等；2：需要命名空间配置如：context，aop，mvc 等
   - 注解：项目中自身开发使用的类，可直接在代码中使用注解如：@Service，@Controller，@Dao，@Component 等
   - Java 配置类：需要通过代码控制对象创建逻辑的场景如：自定义修改依赖类库。
6. xml 配置 -> package-scan -> Annotation 注解 `<context:component-scan base-package="com.example.xxx" />`

#### 声明式事务

1. 使用方式：
   - ProxyFactoryBean+xml
   - tx:advice+aop 命名空间
   - 注解@Transactional
2. 事务方法嵌套：新的事务会加入到已有的事务中，如果之前没有事务才会新建一个事务
3. 什么时候回滚事务：抛出运行期异常 RuntimeException 时。小心不当的 try catch，会导致部分事务即使失败了也不会自动回滚。

> SpringMVC

在 xml 中配置 SpringMVC

1. 开启 SpringMVC 注解模式：`<mvc:annotation-driven/>`
   - 简化配置：1. 自动注册 DefaultAnnotationHandlerMapping，AnnotationMethodHandlerAdapter；2. 提供一系列数据绑定、数字和日期的 format-@NumberFormat、@DateTimeFormat，xml、json 默认读写支持
2. 静态资源默认 servlet 配置：`<mvc:default-servlet-handler/>`
   - servlet-mapping 映射路径："/"
   - 加入对静态资源的处理：js，jpg，png，css，gif...
   - 允许使用"/"做整体映射
3. 配置 jsp 显示 ViewResolver：`<bean class="...InternalResourceViewResolver"><property xxx></property></bean>`
   - 配置 jsp，放置位置，后缀名，prefix，suffix，viewClass 等
   - 通过 ViewResolver 实现页面跳转
4. 扫描 web 相关的 bean：`<context:component-scan base-package="com.xx.xx" />`

#### Restful 接口设计和使用

#### 框架运作流程

#### Controller 开发技巧

> 高并发

#### 高并发点和高并发瓶颈分析

1. 数据库操作加解锁，事务竞争，排队，GC
2. 网络延迟，异地机房，CDN

| 问题     | 触发条件                                                             | 后果                                       | 解决方案                                       |
| -------- | -------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------- |
| 缓存击穿 | 某个热点数据的缓存突然失效，大量请求同时查询该数据。                 | 大量请求打到数据库，数据库压力骤增。       | 缓存预热、加锁、热点数据永不过期。             |
| 缓存雪崩 | 大量缓存数据在同一时间失效。                                         | 短时间内大量请求直接打到数据库，系统崩溃。 | 随机化过期时间、缓存预热、多级缓存、降级策略。 |
| 缓存穿透 | 查询一个数据库和缓存中都不存在的值，大量请求绕过缓存直接访问数据库。 | 数据库压力过大，可能被拖垮。               | 缓存空值、参数校验、布隆过滤器、限流。         |

#### 高并发优化思路及实现

1. 减少操作数据库时上锁的时间，减少数据库的压力
2. 使用缓存，减少数据库的访问
3. 使用异步处理，减少用户等待时间
4. 使用 CDN，减少网络延迟
5. 使用分布式，减少单机压力

#### 如何判断 Update 更新数据库成功

1. update 没报错+客户端确认 update 影响记录数

优化思路：把客户端逻辑放到 MySQL 服务端，避免网络延迟和 GC 的影响

方案：

1. 定制 SQL 方案：`update /* + [auto_commit] */`，需要修改 MySQL 源码
2. 使用存储过程：整个事务在 MySQL 端完成

#### Redis 后端缓存优化

0. 需要手动在 xml 中注入 RedisDao，因为 MyBatis 不处理 Redis，构造函数需要通过`<constructor-arg index="0" value="localhost" />`传入
1. 使用 protobuf 对 json 数据进行序列化反序列化，性能最强！
2. 创建 RedisPool 连接池，缓存优化
3. 在超时的基础上维护一致性

#### 并发优化

1. MyBatis 调用存储过程，在 xml 中配置
2. ![后端系统部署架构](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411071613279.png)

## IDEA

### 设置注释对齐

![设置注释对齐](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202411111111171.png)

## 工具

### Knife4j 和 Swagger

Knife4j 是一个为 Java 项目生成和管理 API 文档的工具。实际上，它是 Swagger UI 的一个增强工具集，旨在让 Swagger 生成的 API 文档更优雅、更强大。

### slf4j、logback 和 log4j

#### slf4j

slf4j 是一个日志门面，它提供了一个统一的日志接口，使得开发者可以在不同的日志实现之间进行切换，而不需要修改大量的代码。slf4j 本身并不提供日志实现，它只是一个接口。

#### logback

logback 是一个基于 slf4j 的日志框架，它提供了灵活的日志配置和高效的日志记录功能。logback 是 slf4j 的默认实现之一。

#### log4j

log4j 是另一个广泛使用的日志框架，它提供了丰富的日志配置选项和灵活的日志记录功能。log4j 是 slf4j 的另一个实现之一。

### MyBatis Generator

MyBatis Generator 是一个用于自动生成 MyBatis 相关代码的工具。它可以自动生成实体类、Mapper 接口和 XML 映射文件，从而减少手动编写代码的工作量。

### SonarQube

SonarQube 是一个代码质量管理工具，它可以帮助开发者检测代码中的缺陷、代码风格和代码复杂度等。

### JUnit

JUnit 是一个用于编写和运行单元测试的框架，它可以帮助开发者验证代码的正确性和稳定性。

### Mockito

Mockito 是一个用于编写单元测试的模拟框架，它可以帮助开发者模拟对象的行为，从而实现对代码的隔离测试。

### Spring Boot

Spring Boot 是一个用于简化 Spring 应用程序开发的框架，它提供了自动配置、嵌入式服务器和简化配置等功能。

### Spring Security

Spring Security 是一个用于实现安全控制的框架，它提供了认证、授权、加密和会话管理等功能。提供了强大的功能，帮助开发人员实现身份认证、授权、会话管理以及其他与安全相关的任务。

### Spring Data JPA

Spring Data JPA 是一个用于简化 JPA 开发的框架，它提供了自动仓库、查询方法和简化配置等功能。

### Spring Cloud

Spring Cloud 是一个用于构建分布式系统的框架，它提供了服务注册、服务发现、负载均衡和断路器等功能。
