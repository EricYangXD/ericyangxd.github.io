---
title: 记录一些Linux命令
author: EricYangXD
date: "2021-12-29"
---

## 打包/解压 & 加密打包/解密解压

-   注意修改 file/folder 为实际的文件或文件夹名称，注意文件夹层级。

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

-   ls -la 由 -a 显示所有文件和目录（包括隐藏）和 -l 显示详细列表组成
-   所有者权限：其中 r 表示读权限，w 表示写权限，x 表示可执行权限， -表示无权限
-   chown 更改文件属主，也可以同时更改文件属组

```bash
# -R：递归更改文件属组
chown [–R] 属主名 文件名
chown [-R] 属主名：属组名 文件名
```

-   chmod 更改文件权限:

*   权限除了用 r w x 这种方式表示，也可以用数字表示，数组与字母的对应关系为：
*   r:4
*   w:2
*   x:1

-   之所有如此对应关系，主要还是为了方便推导

```bash
# -R：递归更改文件属组
chmod [-R] xyz 文件或目录
```

-   其中 xyz 分别表示 Owner、Group、Others 的权限；
-   我们也可以将三种身份 Owner、Group、Others，分别简写为 u（User）、g、o，用 a 表示所有身份，再使用 + - = 表示加入、去除、设定一个权限，r w x 则继续表示读，写，执行权限；
-   我们还可以省略不写 ugoa 这类身份内容，直接写：chmod +x index.html，此时相当于使用了 a，会给所有身份添加执行权限

-   su 切换身份
-   whoami 显示用户名
-   pwd 显示当前目录
-   touch 创建文件
-   echo 打印输出
-   cat 连接文件并打印输出

```bash
# 显示转义字符
echo "\"test content\""

# 创建或覆盖文件内容为 "test content"：
echo "test content" > index.html

# 如果是想追加内容，就用 >> 即在这个文件原有的内容后面增加新的内容
echo "test content" >> index.html

# 查看文件内容：
cat ~/.ssh/id_rsa.pub

# 清空 index.html 内容：
cat /dev/null > index.html

# 把 index.html 的内容写入 second.html：
cat index.html > second.html

# 把 index.html 的内容追加写入 second.html：
cat index.html >> second.html

# 把 index.html 和 second.html 追加写入 third.html：
cat index.html second.html >> third.html
```

-   cp 复制文件或目录

```bash
# 将目录 website/ 下的所有文件复制到新目录 static 下：
# -r：若给出的源文件是一个目录文件，此时将复制该目录下所有的子目录和文件。
cp –r website/ static
```

-   mv 移动并重命名

```bash
# 文件改名：
mv index.html index2.html

# 隐藏文件：
# 文件名上加上 .
mv index.html .index.html

# 移动文件：
# 仅仅移动
mv  /home/www/index.html   /home/static/
# 移动又重命名
mv /home/www/index.html   /home/static/index2.html
```

-   rm 删除一个文件或者目录

```bash
# 系统会询问
rm file

# -f 表示直接删除
# -r 表示目录下的所有文件删除

# 删除当前目录下的所有文件及目录
rm -r  *

# 跑路
rm -rf /*
```

-   ssh 远程连接工具，注意 ssh 监听是 22 端口。

```bash
# 基本语法
ssh [OPTIONS] [-p PORT] [USER@]HOSTNAME [COMMAND]
ssh -p 300 git@8.8.8.8

# 打开调试模式
# -v 冗详模式，打印关于运行情况的调试信息
ssh -v git@8.8.8.8
```

## 命令

### chown

Linux chown（英文全拼：change owner）命令用于设置文件所有者和文件关联组的命令。

-   chown 需要超级用户 root 的权限才能执行此命令。
-   chown [-cfhvR] [--help] [--version] user[:group] file...

参数 :

-   user : 新的文件拥有者的使用者 ID
-   group : 新的文件拥有者的使用者组(group)
-   -c : 显示更改的部分的信息
-   -f : 忽略错误信息
-   -h :修复符号链接
-   -v : 显示详细的处理信息
-   -R : 处理指定目录以及其子目录下的所有文件
-   --help : 显示辅助说明
-   --version : 显示版本

例：

-   将当前前目录下的所有文件与子目录的拥有者皆设为 runoob，群体的使用者 runoobgroup:

```bash
chown -R runoob:runoobgroup \*
```

### PS

-   查看 Nginx 端口进程：`PS -ef|grep nginx`
