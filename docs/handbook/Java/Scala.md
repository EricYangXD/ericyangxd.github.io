---
title: Scala学习笔记
author: EricYangXD
date: "2023-05-31"
meta:
  - name: keywords
    content: scala
---

## 记录

Scala 版本： 2.12

### 基础知识
0. java+js+python的混合体

1. 打印九九乘法表：

```scala
for(i <- 1 to 9; j <- 1 to i){ print(i + "*" + j + "=" + i*j +(if( i==j ) "\n" else "\t" ))}
```
