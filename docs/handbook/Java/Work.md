---
title: tips
author: EricYangXD
date: "2022-10-11"
meta:
  - name: keywords
    content: 关键字
---

## Tips & Skills

### JDK 设置

1. 包含关系 JDK > JRE > JVM
2. 全局安装 JDK 配置`.zshrc` or`.bash_profile`

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

### Maven

- Apache Maven 是一种流行的构建工具，它获取项目的 Java 源代码，对其进行编译、测试并将其转换为可执行的 Java 程序：.jar 或 .war 文件。
- Maven 是 Java 世界中最流行的构建工具之一(其他的还有 Gradle 或者老式的 Ant)。您不仅可以使用它来构建 Java 项目，而且几乎所有用 JVM 语言(如 Kotlin 或 Scala)以及其他语言(如 C # 和 Ruby)编写的项目都可以使用它来构建。
- 1. 依赖管理：Maven 让您可以轻松地在项目中包含第 3 方依赖项（想想库/框架，例如 Spring）。其他语言的等价物是 Javascript 的 npm、Ruby 的 gems 或 PHP 的 composer。
- 2. 通过约定进行编译: 理论上，您可以使用 javac 命令行编译器(或者使用 bash 脚本实现自动化)手动编译大量 class 来编译大型 Java 项目。然而，这只适用于玩具项目。Maven 希望 Java 源代码驻留在某个目录结构中，当您稍后执行 mvn clean install 时，整个编译和打包工作将为您完成。
- 3. 一切皆 Java: Maven 还可以通过插件运行代码质量检查、执行测试用例，甚至将应用程序部署到远程服务器。几乎所有你能想到的任务。

1. [Download 相应版本](https://maven.apache.org/download.cgi?.)
2. install：解压，放到方便的目录下即可
3. Maven 配置：`maven/conf/settings.xml`，自定义修改配置，添加私有仓库、账户名、密码等等
4. Idea 配置：在 Preferences》Build》Build tools》Maven：
   1. 设置 Maven home path：2 中解压的 maven 目录即可，例`/Users/eric/backend/maven`
   2. 设置 User settings：`/Users/eric/backend/maven/conf/settings_eric.xml`，看需求，一般会需要自定义配置一些账号密码
5. 修改项目的 SDK 版本，在项目最外层目录右键》Open module settings》Project structure》Project settings》Project》SDK：设置相应版本的 SDK，可以设自己安装的，也可以通过 add sdk 下载新的。
6. Maven 命令：
   1. `mvn install`: First, it does a `package`(!). Then it takes that `.jar/.war` file and puts it into your local Maven repository, which lives in `~/.m2/repository`.
   2. `mvn clean install`: 您正在使用 clean 命令，该命令将删除项目中所有以前编译的 Java .class 文件和资源（如 .properties）。您的构建将从一个干净的状态开始。然后 install 将编译、测试和打包您的 Java 项目，甚至将您构建的 .jar/.war 文件安装/复制到您的本地 Maven 存储库中。
   3. `mvn -v`
   4. `mvn clean`: deletes the `/target` folder.
   5. `mvn package`: Converts your `.java` source code into a `.jar/.war` file and puts it into the `/target` folder.
7. 在 Maven 3.1 之前，增量编译基本上是不存在的，即使是最新的 Maven 和编译器插件版本，在增量编译支持中也存在奇怪的 bug 和文档问题。所以调用`mvn clean install`，尽管会多花一些时间。
8. `mvn clean install` 不构建兄弟项目。在多模块项目中，如果某个子项目 a 依赖某个兄弟项目 b，那么需要手动提前构建这个兄弟项目 b。例：

```bash
+ stocks-broker-app (parent)
    + stocks-data-module
    + stocks-rest-module (depends on stock-data)
    + stocks-ui-module (depends on stock-data)
```

9. 如上项目结构中，在 parent 目录下执行：`mvn -pl stocks-ui-module -am clean install`，可以指定要构建的子模块列表并进行依赖构建。
   1. `-pl`：让您指定要构建的子模块
   2. `-am`：表示`also make`，它也将构建依赖模块
10. `mvn -U`：有时，如果您的项目依赖于 SNAPSHOT 依赖项，Maven 不会使用最新的快照版本更新您的本地 Maven 存储库。如果你想确保 Maven 总是尝试下载最新的快照依赖版本，请使用 -U 开关调用它。
11. `mvnw`：一些项目附带一个 `mvnw` 可执行文件，它不代表 Maven (on) Windows，而是代表 Maven 包装器。这意味着您不必在您的机器上安装 mvn 来构建您的项目 - 相反，mvn 嵌入在您的项目目录中，您可以使用 `mvnw` 可执行文件调用它。
12. `mvn -U`：

#### pom.xml

> Maven’s pom.xml

从技术上讲，任何包含 pom.xml 文件的目录也是一个有效的 Maven 项目。 pom.xml 文件包含描述 Java 项目所需的所有内容。让我们看一个最小版本：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.marcobehler</groupId>
    <artifactId>my-project</artifactId> (1)
    <version>1.0-SNAPSHOT</version> (2)

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source> (3)
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency> (4)
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

如上：

1. 我们定义了一个名为"my-project"的项目
2. 版本号为 `1.0-SNAPSHOT`，例：`work-in-progress`
3. 使用 Java 1.8 进行编译
4. 单元测试需要一个依赖项：4.12 版本的 junit

> Maven’s src & target folders

除了 pom.xml 文件之外，无论何时调用 mvn clean install，您还需要 Java 源代码让 Maven 发挥它的魔力。按照惯例：

1. Java 源代码应存放在`/src/main/java`文件夹中
2. Maven 会将编译好的 Java .class 放入`target/classes`文件夹
3. Maven 还将根据您的项目构建位于`target`文件夹中的 `.jar` 或 `.war`文件。
4. 项目结构如下：

```bash
+ myproject
    + -- src
        + -- main
            + -- java
                 MyApp.java
    + -- target
        + -- classes (after 'mvn compile')
             MyApp.class

        myproject.jar (upon mvn package or mvn install)

    pom.xml
```

5. 安装 Maven 相当简单。与 Java 类似，它只是一个 .zip 文件，您需要下载该文件并将其放在硬盘驱动器的任何位置。
6. 现在你需要确保将 `maven/bin` 目录添加到你的 PATH 变量中，否则你不能从任何地方调用`mvn`命令（比如：`mvn clean install`）。
7. 看一下 Maven 构建生命周期：阶段

[maven-lifecycle](../../assets/maven-lifecycle.png)

8. 当你调用 `mvn deploy` 时，mvn 也会在部署前执行每个生命周期阶段，依次为：validate, compile, test, package, verify, install.
9. Same for verify: validate, compile, test, package. Same for all other phases.
10. 由于 clean 不是 Maven 默认生命周期的一部分，因此您最终会使用 `mvn clean install` 或 `mvn clean package` 之类的命令安装或打包将触发所有前面的阶段，但您需要另外指定 clean。

> Maven 在哪里存储 3rd 方库？

1. 与将项目依赖项存储在项目目录中的其他语言相反，Maven 具有存储库的概念。
2. 有本地存储库（在用户的主目录中：`~/.m2/`）和远程存储库。
3. 远程存储库可以是内部的、公司范围的存储库，例如 Artifactory 或 Nexus 或 （参考）全球存储 `https://repo.maven.apache.org/maven2/` 上的库。
4. Maven 将始终首先将您的项目依赖项下载到您的本地 Maven 存储库中，然后在您的构建中引用它们。
5. 在哪里可以找到任何 3rd 方库的 Maven 坐标？[https://search.maven.org/](https://search.maven.org/) & [https://mvnrepository.com/](https://mvnrepository.com/)
