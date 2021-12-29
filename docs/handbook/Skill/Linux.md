---
title: 记录一些Linux命令
author: EricYangXD
date: "2021-12-29"
---

## 打包/解压 & 加密打包/解密解压

-   注意修改 file/folder 为实际的文件或文件夹名称

-   1.打包

```bash
tar -zcvf root.tar.gz *
```

```bash
tar -zcvf /path/to/file.tar.gz file
```

-   2.解压

```bash
tar -zxvf /path/to/file.tar.gz /another-path/to
```

```bash
tar -zxvf root.tar.gz
```

-   3.加密打包

```bash
tar -czvf - your-file | openssl des3 -salt -k your-password -out /path/to/file.tar.gz
```

-   4.解密解压

```bash
openssl des3 -d -k your-password -salt -in /path/to/file.tar.gz | tar xzf -
```

-   5.排除目录中的某些文件，然后进行压缩

```bash
tar --exclude=目录名/* 或者 文件名 -zcvf 备份文件名.tgz 目录名
```

-   具体举例：

```bash
# 创建一个名为 abc 的目录
mkdir abc

# 进入 abc 这个目录
cd abc

# 创建两个文件,文件名为1.txt 2.txt
touch 1.txt 2.txt

# 切换到 abc 的父目录
cd ..

# 将文件 abc 进行压缩时，排除1.txt，压缩后的文件名为 abc.tar
tar --exclude=abc/1.txt -zcvf abc.tgz abc

# 解压文件
tar -zxvf abc.tgz

# 删除压缩文件
rm abc.tgz

# 删除解压后的文件，并删除文件夹
rm -rf abc
```

-   6.pbkdf2 加密/解密

```bash
# 压缩
openssl aes-256-cbc -salt -pbkdf2 -in name -out name.aes
```

```bash
# 解压
openssl aes-256-cbc -d -salt -pbkdf2 -in name.aes -out name
```
