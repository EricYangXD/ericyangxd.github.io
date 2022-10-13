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
