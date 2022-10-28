---
title: Maven
author: EricYangXD
date: "2022-10-13"
meta:
  - name: keywords
    content: Maven
---

## Maven

- Apache Maven 是一种流行的构建工具，它获取项目的 Java 源代码，对其进行编译、测试并将其转换为可执行的 Java 程序：.jar 或 .war 文件。
- Maven 是 Java 世界中最流行的构建工具之一(其他的还有 Gradle 或者老式的 Ant)。您不仅可以使用它来构建 Java 项目，而且几乎所有用 JVM 语言(如 Kotlin 或 Scala)以及其他语言(如 C # 和 Ruby)编写的项目都可以使用它来构建。
- 1. 依赖管理：Maven 让您可以轻松地在项目中包含第 3 方依赖项（想想库/框架，例如 Spring）。其他语言的等价物是 Javascript 的 npm、Ruby 的 gems 或 PHP 的 composer。
- 2. 通过约定进行编译: 理论上，您可以使用 javac 命令行编译器(或者使用 bash 脚本实现自动化)手动编译大量 class 来编译大型 Java 项目。然而，这只适用于玩具项目。Maven 希望 Java 源代码驻留在某个目录结构中，当您稍后执行 mvn clean install 时，整个编译和打包工作将为您完成。
- 3. 一切皆 Java: Maven 还可以通过插件运行代码质量检查、执行测试用例，甚至将应用程序部署到远程服务器。几乎所有你能想到的任务。

1. [Download 相应版本](https://maven.apache.org/download.cgi?.)
2. install：解压，放到方便的目录下即可
3. Maven 配置：`${maven}/conf/settings.xml`，自定义修改配置，添加私有仓库、账户名、密码等等，在 servers、mirrors 等标签里。也可以在 pom 文件中手动配置源：

```xml
<!-- ... -->
<!--配置maven地址 -->
<repositories>
   <repository>
        <id>myrepository</id>
        <url>https://my.repository.com/nexus/repository/maven-releases/</url>
    </repository>
</repositories>
<!-- ... -->

<!-- 配置与源id对应的的maven仓库地址的用户和密码 -->
 <servers>
        <server>
            <id>myrepository</id>
            <username>user</username>
            <password>password</password>
        </server>
 </servers>
```

4. idea 配置：在 Preferences》Build》Build tools》Maven：
   1. 设置 Maven home path：2 中解压的 maven 目录即可，例`/Users/eric/backend/maven`
   2. 设置 User settings：`/Users/eric/backend/maven/conf/settings_eric.xml`，看需求，一般会需要自定义配置一些账号密码
5. 修改项目的 SDK 版本，在项目最外层目录右键》Open module settings》Project structure》Project settings》Project》SDK：设置相应版本的 SDK，可以设自己安装的，也可以通过 add sdk 下载新的。
6. Maven 命令：
   1. `mvn install`: First, it does a `package`(!). Then it takes that `.jar/.war` file and puts it into your local Maven repository, which lives in `~/.m2/repository`.
   2. `mvn clean install`: 您正在使用 clean 命令，该命令将删除项目中所有以前编译的 Java .class 文件和资源（如 .properties）。您的构建将从一个干净的状态开始。然后 install 将编译、测试和打包您的 Java 项目，甚至将您构建的 .jar/.war 文件安装/复制到您的本地 Maven 存储库中。
   3. `mvn -v`: 看版本
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
12. `mvn compile`：编译
13. `mvn test`：测试
14. `mvn package`：打包
15. `mvn clean`：清理
16. `mvn install`：安装依赖到本地例，会把 pom.xml 中的依赖等下载到本地

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
    <!-- (1) -->
    <artifactId>my-project</artifactId>
    <!-- (2) -->
    <version>1.0-SNAPSHOT</version>

    <properties>
        <!-- (3) -->
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- (4) -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <!-- （5）  xxx-common 是继承的父依赖   -->
        <dependency>
            <groupId>com.xx.xxx</groupId>
            <artifactId>xxx-common</artifactId>
            <version>1.0.0</version>
            <!-- (6) -->
            <type>pom</type>
            <exclusions>
                <exclusion>
                    <!--   nacos 配置冲突，需要排除   -->
                    <groupId>com.alibaba.cloud</groupId>
                    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

    </dependencies>
</project>
```

如上：

1. 我们定义了一个名为"my-project"的项目
2. 版本号为 `1.0-SNAPSHOT`，例：`work-in-progress`
3. 使用 Java 1.8 进行编译
4. 单元测试需要一个依赖项：4.12 版本的 junit
5. 引入父依赖并排除指定的依赖关系，也可以在子模块中重新引用相应的版本。
6. `type=pom`表示对这个以来做一个单独的聚合管理，减少配置代码。这一个依赖实际是多个依赖的组合。比如引入 Spring 时可以这么配置。
7. PS：当改变了某个模块的依赖之后，这个模块又被其他模块引用了，那么此时需要重新运行`mvn clean install`，重新打 jar/war 包。

PS：[Maven 中常用的各个标签的含义](./pom.xml)

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

![maven-lifecycle](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/maven-lifecycle.png)

1. 当你调用 `mvn deploy` 时，mvn 也会在部署前执行每个生命周期阶段，依次为：validate, compile, test, package, verify, install.
2. Same for verify: validate, compile, test, package. Same for all other phases.
3. 由于 clean 不是 Maven 默认生命周期的一部分，因此您最终会使用 `mvn clean install` 或 `mvn clean package` 之类的命令安装或打包将触发所有前面的阶段，但您需要另外指定 clean。

> Maven 在哪里存储 3rd 方库？

1. 与将项目依赖项存储在项目目录中的其他语言相反，Maven 具有存储库的概念。
2. 有本地存储库（在用户的主目录中：`~/.m2/`）和远程存储库。
3. 远程存储库可以是内部的、公司范围的存储库，例如 Artifactory 或 Nexus 或 （参考）全球存储 `https://repo.maven.apache.org/maven2/` 上的库。
4. Maven 将始终首先将您的项目依赖项下载到您的本地 Maven 存储库中，然后在您的构建中引用它们。
5. 在哪里可以找到任何 3rd 方库的 Maven 坐标？[https://search.maven.org/](https://search.maven.org/) & [https://mvnrepository.com/](https://mvnrepository.com/)

## 教程笔记

- Maven 的本质是一个项目管理工具，将项目开发和管理过程抽象成一个项目对象模型（POM）
- POM：Project Object Model：项目对象模型
- pom.xml --> 项目对象模型（POM) <--> 依赖管理（dependency） --> 本地 repo --> 私有 repo --> 中央 repo
- 也是构建工具，生命周期阶段能做不同的事，利用插件。提供标准的、跨平台的自动化项目构建方式
- 依赖管理：方便快捷的管理项目依赖的资源（jar 包），避免资源间的版本冲突问题
- 统一开发结构：提供标准的、统一的项目结构

### 仓库

- 本地、私服、中央
- 本地仓库存放地址默认是：`${user.home}/.m2/repository`
- 配置本地仓库：`conf/settings.xml` -> `<localRepository>...</localRepository>`
- 配置镜像仓库：`conf/settings.xml` -> `<morror>...</morror>`，配置阿里镜像

### 坐标&依赖

- 格式：`groupId-artifactId-version[-packaging]`
- groupId：当前 Maven 项目隶属组织名称，通常是域名反写
- artifactId：当前 Maven 项目名称，通常是模块名称
- version：版本号
- packaging：包最终的产物？
- 在 pom.xml -> project 层级 -> build -> plugins -> plugin -> 需要的插件信息：groupId、artifactId、version
- 依赖传递：可以直接使用依赖中的依赖
  1. 直接依赖：在当前项目中通过依赖配置建立的依赖关系
  2. 间接依赖：被引入的依赖如果依赖其他资源，当前项目间接依赖其他资源
- 依赖传递的冲突解决：

  1.  路径优先：当依赖中出现相同的资源时，层级越深，优先级越低，层级越浅，优先级越高
  2.  声明优先：当资源在相同的层级被依赖时，配置顺序靠前的覆盖顺序靠后的
  3.  特殊优先：当同级配置了相同的资源的不同版本，后配置的覆盖先配置的

- 可选依赖：指对外隐藏当前所依赖的资源，不透明。在 dependency 中增加 optional 标签并设为 true 即可
- 排除依赖：通过配置，不使用依赖中的依赖，主动断开间接依赖。在 dependency 中增加 exclusions>exclusion 标签并写上依赖的 groupId 和 artifactId 即可
- 依赖范围：
  1.  依赖的 jar 默认情况下可以在任何地方使用，可以通过 scope 标签设定其作用范围，四个值参考下面表格
  2.  作用范围：
      1. 主程序范围有效（main 文件夹范围内）
      2. 测试程序范围有效（test 文件夹范围内）
      3. 是否参与打包（package 指令范围内）

|          | compile | test | provided | runtime | 直接依赖 |
| -------- | ------- | ---- | -------- | ------- | -------- |
| compile  | compile | test | provided |         |          |
| test     |         |      |          |         |          |
| provided |         |      |          |         |          |
| runtime  | runtime | test | provided | runtime |          |
| 间接依赖 |         |      |          |         |          |

### 生命周期和插件

1. 项目构建的生命周期分为三大阶段：
   1. clean：清理工作
   2. default：核心工作，例如编译、测试、打包、部署等
   3. site：产生报告，发布站点等
2. clean：
   1. pre-clean：
   2. clean：移除所有上一次构建生成的文件
   3. post-clean：
3. default：只关注几个常用的即可
   1. validate：
   2. compile：
   3. test-compile：
   4. test：
   5. package：
   6. verify：
   7. install：
   8. deploy：
4. site：
   1. pre-site：
   2. site：生成项目的站点文档
   3. post-site：
   4. site-deploy：
5. 每个生命周期都有不同的插件，生命周期从头执行到自己设置的那个 phase

## Maven 高级

### 分模块开发与设计

- 老项目会用这种形式，新项目一般用微服务了？
- 大致的做法就是把一个项目中的各个模块分别新建成单独的 module，然后新建属于这个 module 的 pom.xml 文件，并配置相应的依赖关系，小技巧--可以直接把老的 pom.xml 拷过来然后根据实际情况去删除一些不需要的配置即可，然后需要构建成功才算拆完。后续各模块之间通过接口进行通信。然后再在根目录下添加一个根 pom.xml 文件，配置 modules>module，把每个单独拆出来的 module 引用进来，之后便可以通过这里进行集中维护。
-

### 模块聚合

1. 目的就是拆分完 module 之后，对各个 module 做一个统一的管理，改动、版本之类的都要同步
2. 新建一个空的 root module，配置他的 pom.xml，在其中增加 modules>module 的配置，把所有拆出来的 module 添加进去（相对路径？顺序无关！）。另外 **packaging 要设置成 「pom」**，表示该工程的用途是用来进行构建管理而非业务。另外也要设置相应的 groupId、artifactId 等。
3. 配好之后，当需要对项目整体进行打包编译时，直接在 idea 右侧的 Maven 栏中打开这个 root module，然后在 Lifecycle 里面双击 compile 即可。
4. 默认打 jar 包

### 模块继承

1. 模块依赖关系维护
2. 父工程中定义的依赖版本

### 属性

添加自定义属性，做统一管理。

1. `<properties>`标签中，可以自定义需要配置的属性名称，参考各自公司规范或者个人喜好，自定义属性标签中写上变量对应的值（自定义标签相当于变量名称），然后在后面需要使用的地方通过`${xxx}`的形式就可以使用自定义的变量了。
2. 最外层的标签如：`<version>`等也可以当成属性来引用，不用写在`<properties>`标签中。

除了自定义属性，还有系统内置属性、settings 属性（Maven 配置文件中 settings.xml 中的属性，通过`${settings.xx}`调用）、Java 的系统属性（通过`System.getProperties()`或者`mvn help:system`获取）、环境变量属性（`mvn help:system`获取，通过`${env.xx}`调用）

### 版本管理

1. SNAPSHOT 快照版、尝鲜版
2. RELEASE 发布版本

### 资源配置

管理其他自定义的资源配置

1. 比如管理 jdbc 配置，如果要在 jdbc.properties 中使用全局的配置，那么要在 root module 的 pom.xml 中配置`<resources>`标签，在其下添加`<resource>`标签，1 写明`<directory>`即资源文件对应的「目录」，相对 root module 的路径，不到文件名，2 配置`<filtering>`为 true，表示开启对配置文件的资源加载过滤。1 中可以通过`${project.basedir}`做优化。
2. `<testResources>`同理

### 环境配置

不同环境兼容区分

1. pom.xml 中，project 根层级下，通过`<profiles>`->`<profile>`标签定义具体的环境，通过`<id>`区分不同环境。通过`<properties>`设置自定义参数属性，通过`<activation>`->`<activeByDefault>`true 设置默认启动。

### 跳过测试

1. 命令模式：`mvn install -D skipTests`
2. 在 pom.xml 中，对 `plugin` 增加 `configuration` 标签然后设置 `skipTests` 为 true。不推荐。
3. 在 pom.xml 中，对 `plugin` 增加 `configuration` 标签然后设置 `includes` 和 `excludes` 来配置需要执行的和不需要执行的测试。

### 私服

1. nexus 启动：`nexus.exe /run nexus`
2. 在 `nexus-default.properties` 文件和 `nexus.vmoptions` 中修改一些配置信息
3. 仓库：
   1. 宿主仓库 hosted：无法保存从中央仓库获取的资源-自主研发、第三方非开源项目。
   2. 代理仓库 proxy：代理远程仓库，通过 nexus 访问其他公共仓库，例如中央仓库。
   3. 仓库组 group：将若干仓库组成一个群组，简化配置；仓库组不能保存资源，属于设计性仓库。
4. 发布管理配置：在 `pom.xml` 的 `distributionManagement` 标签中配置私服的地址，`mvn deploy`
5. 下载某个依赖的源码或者别的：

```xml
<!-- 示例： -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>30.1.1-jre</version>
</dependency>
```

```bash
# 下载源码，按需修改依赖GroupID及ArtifactId
mvn dependency:sources -DdownloadSources=true -DincludeGroupIds=com.google.guava -DincludeArtifactIds=guava
# 下载JavaDoc，按需修改依赖GroupID及ArtifactId
mvn dependency:resolve -Dclassifier=javadoc -DincludeGroupIds=com.google.guava -DincludeArtifactIds=guava
```

6. 注意要通过 idea 中的 maven 执行上述命令，源码等会下载到默认位置。
7. 另一种：

```bash
mvn dependency:get -DremoteRepositories=repositoryURL -Dartifact=[GROUP_ID]:[ARTIFACT_ID]:[VERSION] -Dpackaging=pom

mvn dependency:get -Dartifact=junit:junit:4.12:jar:sources
```

8. [用 maven 下载 jar 包](https://blog.csdn.net/howard_shooter/article/details/127228404)
9. 借助`maven-dependency-plugin`插件：

```bash
mvn org.apache.maven.plugins:maven-dependency-plugin:2.8:get -Dartifact=groupId:artifactId:version[:packaging[:classifier]]

mvn org.apache.maven.plugins:maven-dependency-plugin:2.8:get -Dartifact=org.hibernate:hibernate-entitymanager:3.4.0.GA:jar:sources
```

10. 原始的做法：先写个 xml 定义好需要的依赖，源，及账号密码。然后在 xml 所在的目录下运行如下的 mvn 命令：`mvn -f pom.xml dependency:copy-dependencies`

### 插件

1. 依赖检查：`org.owasp:dependency-check-maven`，在 pom 中添加如下代码：

```xml
<dependencies>
    <dependency>
        <groupId>org.owasp</groupId>
        <artifactId>dependency-check-maven</artifactId>
        <version>6.5.2</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- 代码依赖包安全漏洞检测 -->
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
</build>
```

2. TODO
