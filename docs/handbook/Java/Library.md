---
title: 3rd library
author: EricYangXD
date: "2023-06-01"
meta:
  - name: keywords
    content: 关键字
---

## 第三方库作用及其应用

### commons-io

1. 是一组有关 IO 操作的开源工具包，包括文件拷贝、文件删除、文件比较、文件读取、文件写入等等。
2. 有很多工具类：
   - StringUtils: 字符串工具类
   - NumberUtils: 数字工具类
   - ArrayUtils: 数组工具类
   - RandomUtils: 随机数工具类
   - DateUtils: 日期工具类
   - StopWatch: 计时器工具类
   - ClassUtils: 反射工具类
   - SystemUtils: 系统工具类
   - MapUtils: 集合工具类
   - BeanUtils: Bean 工具类
   - IOUtils: IO 工具类
   - FileUtils: 文件工具类

### hutool

1. Hutool 是一个 Java 工具包，也只是一个工具包，它帮助我们简化每一行代码，减少每一个方法，让 Java 语言也可以“甜甜的”。
2. 类似 commons-io，提供了很多组件和工具类，实现特定功能。

### jakarta.validation:jakarta.validation.api

同下

### org.hibernate.validator:hibernate-validator

`javax.validation.constraints` 包下，定义了一系列的约束( constraint )注解。共 22 个，如下：

#### 空和非空检查

- @NotBlank ：只能用于字符串不为 null ，并且字符串 #trim() 以后 length 要大于 0 。
- @NotEmpty ：集合对象的元素不为 0 ，即集合不为空，也可以用于字符串不为 null 。
- @NotNull ：不能为 null 。
- @Null ：必须为 null 。

#### 数值检查

- @DecimalMax(value) ：被注释的元素必须是一个数字，其值必须小于等于指定的最大值。
- @DecimalMin(value) ：被注释的元素必须是一个数字，其值必须大于等于指定的最小值。
- @Digits(integer, fraction) ：被注释的元素必须是一个数字，其值必须在可接受的范围内。
- @Positive ：判断正数。
- @PositiveOrZero ：判断正数或 0 。
- @Max(value) ：该字段的值只能小于或等于该值。
- @Min(value) ：该字段的值只能大于或等于该值。
- @Negative ：判断负数。
- @NegativeOrZero ：判断负数或 0 。

#### Boolean 值检查

- @AssertFalse ：被注释的元素必须为 true 。
- @AssertTrue ：被注释的元素必须为 false 。

#### 长度检查

- @Size(max, min) ：检查该字段的 size 是否在 min 和 max 之间，可以是字符串、数组、集合、Map 等。

#### 日期检查

— @Future ：被注释的元素必须是一个将来的日期。
— @FutureOrPresent ：判断日期是否是将来或现在日期。
— @Past ：检查该字段的日期是在过去。
— @PastOrPresent ：判断日期是否是过去或现在日期。

#### 其它检查

- @Email ：被注释的元素必须是电子邮箱地址。
- @Pattern(value) ：被注释的元素必须符合指定的正则表达式。

#### Hibernate Validator 附加的约束注解

`org.hibernate.validator.constraints` 包下，定义了一系列的约束( constraint )注解。如下：

- @Range(min=, max=) ：被注释的元素必须在合适的范围内。
- @Length(min=, max=) ：被注释的字符串的大小必须在指定的范围内。
- @URL(protocol=,host=,port=,regexp=,flags=) ：被注释的字符串必须是一个有效的 URL 。
- @SafeHtml ：判断提交的 HTML 是否安全。例如说，不能包含 javascript 脚本等等。

#### @Valid 和 @Validated

- @Valid 注解，是 Bean Validation 所定义（`javax.validation`包下），可以添加在普通方法、构造方法、方法参数、方法返回、成员变量上，表示它们需要进行约束校验。

- @Validated 注解，是 Spring Validation 所定义（`org.springframework.validation.annotation`包下），可以添加在类、方法参数、普通方法上，表示它们需要进行约束校验。同时，@Validated 有 value 属性，支持分组校验。

```java
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Validated {

 /**
  * Specify one or more validation groups to apply to the validation step
  * kicked off by this annotation.
  * <p>JSR-303 defines validation groups as custom annotations which an application declares
  * for the sole purpose of using them as type-safe group arguments, as implemented in
  * {@link org.springframework.validation.beanvalidation.SpringValidatorAdapter}.
  * <p>Other {@link org.springframework.validation.SmartValidator} implementations may
  * support class arguments in other ways as well.
  */
 Class<?>[] value() default {};

}
```

- 两者大致有以下的区别：

| 名称       | Spring Validation 是否实现了声明式校验 | 是否支持嵌套校验 | 是否支持分组校验 |
| ---------- | -------------------------------------- | ---------------- | ---------------- |
| @Validated | 是                                     | 否               | 是               |
| @Valid     | 否                                     | 是               | 否               |

总的来说，绝大多数场景下，我们使用 @Validated 注解即可。而在有嵌套校验的场景，我们使用 @Valid 注解添加到成员属性上。

### com.github.xiaoymin:knife4j-spring-boot-starter

Knife4j。是一个基于 Spring Boot 的 Swagger 增强工具，可以帮助我们更好的管理和维护我们的接口文档。它提供了一些增强功能，比如：接口文档的美化、接口文档的分组、接口文档的权限控制等等。

swagger 相关，调试接口。启动程序，然后再浏览器里我们就可以进行输入: swagger 访问地址：`http://localhost:8080/doc.html#/home` 打开 swagger 文档 就可以进行测试了。

#### org.projectlombok:lombok

注解开发

#### spring-boot-starter-web

spring web

#### JWT鉴权身份认证

Spring Security 整合 JWT。它是一种基于 JSON 的轻量级令牌，由三部分组成：头部（Header）、载荷（Payload）和签名（Signature）。JWT 被广泛用于实现身份验证和授权，特别适用于前后端分离的应用程序。由 `header.payload.signature` 三部分组成，你可以在此网站: `https://jwt.io/` 上获得解析结果。

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>${jjwt.version}</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>${jjwt.version}</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>${jjwt.version}</version>
</dependency>
```

#### 日志

Log4j基本被淘汰了，一般使用slf4j+logback的形式。SLF4J 是一个日志门面（facade），使得应用程序可以在运行时更换日志实现。Logback 是日志框架 SLF4J 的一个实现，它被设计用来替代 log4j。Logback 提供了更高的性能，更丰富的日志功能和更好的配置选项。

Spring Boot 默认使用 Logback，所以当你在 pom.xml 中加入 `spring-boot-starter-web` 依赖时，它会自动包含 Logback 相关依赖，无需额外添加。

```xml
<!-- logback.xml示例 -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <jmxConfigurator/>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- 应用名称 -->
    <property scope="context" name="appName" value="weblog"/>
    <!-- 自定义日志输出路径，以及日志名称前缀 -->
    <property name="LOG_FILE" value="logs/${appName}.%d{yyyy-MM-dd}"/>
    <!-- 使用 %X 来引用MDC中的值 [TraceId: %X{traceId}] -->
    <property name="FILE_LOG_PATTERN"
              value="[TraceId: %X{traceId}] %d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"/>
    <!--<property name="CONSOLE_LOG_PATTERN" value="${FILE_LOG_PATTERN}"/>-->

    <!-- 按照每天生成日志文件 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 日志文件输出的文件名 -->
            <FileNamePattern>${LOG_FILE}-%i.log</FileNamePattern>
            <!-- 日志文件保留天数 -->
            <MaxHistory>30</MaxHistory>
            <!-- 日志文件最大的大小 -->
            <maxFileSize>10MB</maxFileSize>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!-- 格式化输出：%d 表示日期，%thread 表示线程名，%-5level：级别从左显示 5 个字符宽度 %errorMessage：日志消息，%n 是换行符-->
            <pattern>${FILE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- dev 环境（仅输出到控制台） -->
    <springProfile name="dev">
        <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>
        <root level="info">
            <appender-ref ref="CONSOLE"/>
        </root>
    </springProfile>

    <!-- prod 环境（仅输出到文件中） -->
    <springProfile name="prod">
        <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>
        <root level="INFO">
            <appender-ref ref="FILE"/>
        </root>
    </springProfile>
</configuration>
```

####
####

#### com.baomidou:mybatis-plus-boot-starter

#### p6spy:p6spy

组件打印完整的 SQL 语句、执行耗时。

### xml 文件解析

1. dom4j
2. jaxb-api
3. jaxb-impl
4. jaxb-core
5. jaxb-runtime
6. jaxb-xjc
7. jaxb-jxc

### IT-test

1. junit
2. cargo-mavenX-plugin

### 数据库连接池工具

1. druid-spring-boot-starter

### JSON Web Token

1. io.jsonwebtoken.jjwt

### 配置文件解析

1. org.springframework.boot:spring-boot-configuration-processor

### 常见实现热部署的方式

1. JRebel：旨在通过即时应用代码更改来加快开发周期，提高开发效率，通过动态地重载 Java 类，可以大幅减少开发人员在开发应用程序时的等待时间。
2. Spring Loaded
3. spring-boot-devtools

### com.google.guava:guava

集合类增强，缓存，函数式编程支持，字符串处理，并发工具
### org.apache.commons:commons-lang3

为 Java 提供各种实用程序类，如 StringUtils, ArrayUtils, NumberUtils 等，简化了常见的操作。时间和日期工具类DateUtils。异常处理辅助：提供类如 ExceptionUtils，帮助更轻松地处理和记录异常。随机数生成：RandomStringUtils。
###
###
###
###
###

## xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.ratel</groupId>
    <artifactId>java-validation</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>java-validation</name>
    <description>java validation action</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!-- spring-boot-starter-web 已经引入了 spring-boot-starter-validation，而 spring-boot-starter-validation 中也引入了 hibernate-validator 依赖，所以无需重复引入。 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!--在一些高版本springboot中默认并不会引入这个依赖，需要手动引入-->
        <!-- <dependency>
            <groupId>org.hibernate.validator</groupId>
            <artifactId>hibernate-validator</artifactId>
            <scope>compile</scope>
        </dependency> -->

        <!-- 保证 Spring AOP 相关的依赖包 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
        </dependency>

        <!--lombok相关 方便开发-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>

        <!--knife4j接口文档 方便待会进行接口测试-->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-spring-boot-starter</artifactId>
            <version>3.0.3</version>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```
