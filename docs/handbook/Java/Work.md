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


### Tomcat配置

Tomcat环境变量配置：
- 如果你的Tomcat安装在C盘里，如：`C:\Program Files\Apache Software Foundation\Tomcat 8.0`（在这里切记，安装Tomcat时，在其字母周围一定不要存在空格，否则最后可能导致配置不成功）

1. 点击新建。变量名为`TOMCAT_HOME`，变量值为Tomcat安装目录
2. 在系统变量里点新建：
  - 变量名：`CATALINA_BASE`
  - 变量值：`C:\Program Files\Apache Software Foundation\Tomcat 8.0;`
3. 再次新建：
  - 变量名：`CATALINA_HOME`
  - 变量值：`C:\Program Files\Apache Software Foundation\Tomcat 8.0;`
  - 点击确定
4. 在classpath中加入`%CATALINA_HOME%\common\lib\servlet-api.jar;`（注意加的时候在原变量值后加英文状态下的`;`）
5. 在path中加入`%CATALINA_HOME%\bin;`（注意加的时候在原变量值后加英文状态下的`;`）


## MySQL 一行记录是怎么存储的？

1. MySQL 的数据都是保存在磁盘的，那具体是保存在哪个文件呢：MySQL 存储的行为是由存储引擎实现的，MySQL 支持多种存储引擎，不同的存储引擎保存的文件自然也不同。InnoDB 是我们常用的存储引擎，也是 MySQL 默认的存储引擎。所以，本文主要以 InnoDB 存储引擎展开讨论。
2.  



1. MySQL 的 NULL 值会占用空间吗？
2. MySQL 怎么知道 varchar(n) 实际占用数据的大小？
3. varchar(n) 中 n 最大取值为多少？
4. 行溢出后，MySQL 是怎么处理的？