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

#### com.github.xiaoymin:knife4j-spring-boot-starter

swagger 相关，调试接口。启动程序，然后再浏览器里我们就可以进行输入: swagger 访问地址：`http://localhost:8080/doc.html#/home` 打开 swagger 文档 就可以进行测试了。

#### org.projectlombok:lombok

注解开发

#### spring-boot-starter-web

spring web

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
