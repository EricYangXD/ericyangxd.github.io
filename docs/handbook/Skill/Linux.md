---
title: 记录一些Linux命令
author: EricYangXD
date: "2021-12-29"
meta:
  - name: keywords
    content: linux,Linux,CentOS
---

## 打包/解压 & 加密打包/解密解压

- 注意修改 file/folder 为实际的文件或文件夹名称，注意文件夹层级。

- 1.打包

```bash
tar -zcvf root.tar.gz *
```

```bash
tar -zcvf /path/to/file.tar.gz file
```

- 2.解压

```bash
tar -zxvf /path/to/file.tar.gz /another-path/to
```

```bash
tar -zxvf root.tar.gz
```

- 3.加密打包

```bash
tar -czvf - your-file | openssl des3 -salt -k your-password -out /path/to/file.tar.gz
```

- 4.解密解压

```bash
openssl des3 -d -k your-password -salt -in /path/to/file.tar.gz | tar xzf -
```

- 5.排除目录中的某些文件，然后进行压缩

```bash
tar --exclude=目录名/* 或者 文件名 -zcvf 备份文件名.tgz 目录名
```

- 具体举例：

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

- 6.pbkdf2 加密/解密

```bash
# 压缩
openssl aes-256-cbc -salt -pbkdf2 -in name -out name.aes
```

```bash
# 解压
openssl aes-256-cbc -d -salt -pbkdf2 -in name.aes -out name
```

- ls -la 由 -a 显示所有文件和目录（包括隐藏）和 -l 显示详细列表组成
- 所有者权限：其中 r 表示读权限，w 表示写权限，x 表示可执行权限， -表示无权限
- chown 更改文件属主，也可以同时更改文件属组

```bash
# -R：递归更改文件属组
chown [–R] 属主名 文件名
chown [-R] 属主名：属组名 文件名
```

- chmod 更改文件权限:

* 权限除了用 `r w x` 这种方式表示，也可以用数字表示，数组与字母的对应关系为：
* r:4
* w:2
* x:1
* 例：`chmod 777 /var/data/nssa-sensor`，`7=4+2+1`也就表示同时赋予`rwx`三个权限

- 之所有如此对应关系，主要还是为了方便推导

```bash
# -R：递归更改文件属组
chmod [-R] xyz 文件或目录
```

- 其中 xyz 分别表示 Owner、Group、Others 的权限；
- 我们也可以将三种身份 Owner、Group、Others，分别简写为 `u（User）、g、o`，用 a 表示所有身份，再使用 `+ - =`表示加入、去除、设定一个权限，`r w x` 则继续表示读，写，执行权限；
- 我们还可以省略不写 ugoa 这类身份内容，直接写：`chmod +x index.html`，此时相当于使用了 a，会给所有身份添加执行权限

- su 切换身份
- whoami 显示用户名，简化版：who
- pwd 显示当前目录
- touch 创建文件
- echo 打印输出
- cat 连接文件并打印输出

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

- cp 复制文件或目录

```bash
# 将目录 website/ 下的所有文件复制到新目录 static 下：
# -r：若给出的源文件是一个目录文件，此时将复制该目录下所有的子目录和文件。
cp –r website/ static
```

- mv 移动并重命名

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

- rm 删除一个文件或者目录

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

- ssh 远程连接工具，注意 ssh 监听是 22 端口。

```bash
# 基本语法
ssh [OPTIONS] [-p PORT] [USER@]HOSTNAME [COMMAND]
ssh -p 300 git@8.8.8.8

# 打开调试模式
# -v 冗详模式，打印关于运行情况的调试信息
ssh -v git@8.8.8.8
```

## 命令

### id

显示用户身份号

### umask

设置默认的文件权限

### su

以另一个用户的身份来运行 shell

### chgrp

更改文件组所有权

### chown

更改文件所有者

Linux chown（英文全拼：change owner）命令用于设置文件所有者和文件关联组的命令。

- `chown` 需要超级用户 root 的权限才能执行此命令。
- `chown [-cfhvR] [--help] [--version] user[:group] file...`

参数 :

- user : 新的文件拥有者的使用者 ID
- group : 新的文件拥有者的使用者组(group)
- -c : 显示更改的部分的信息
- -f : 忽略错误信息
- -h :修复符号链接
- -v : 显示详细的处理信息
- -R : 处理指定目录以及其子目录下的所有文件
- --help : 显示辅助说明
- --version : 显示版本

例：

- 将当前前目录下的所有文件与子目录的拥有者皆设为 runoob，群体的使用者 runoobgroup:

```bash
chown -R runoob:runoobgroup \*
```

### PS

- 查看 Nginx 端口进程：`PS -ef|grep nginx`

### sudo

以另一个用户的身份来执行命令

1. 以管理员 root 权限运行程序脚本
2. 获取管理员权限：`sudo su`
3. 切换到管理员：`sudo -i`

### yum

包管理工具，类似 npm，yarn？例：`yum install lrzsz`，安装 rz、sz。

### wget

是一种下载工具，例：`wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh`，安装 openvpn。

#### wget 和 yum 有什么区别？

1. 一般来说著名的 linux 系统基本上分两大类：

- RedHat 系列：Redhat、Centos、Fedora 等
- Debian 系列：Debian、Ubuntu 等

2. RedHat 系列

- 常见的安装包格式 rpm 包,安装 rpm 包的命令是`rpm -参数`
- 包管理工具 yum
- 支持 tar 包

3. Debian 系列

- 常见的安装包格式 deb 包,安装 deb 包的命令是`dpkg -参数`
- 包管理工具 apt-get
- 支持 tar 包

4. yum 可以用于运作 rpm 包，例如在 Fedora 系统上对某个软件的管理：

- 安装：`yum install`
- 卸载：`yum remove`
- 更新：`yum update`

5. apt-get 可以用于运作 deb 包，例如在 Ubuntu 系统上对某个软件的管理：

- 安装：`apt-get install`
- 卸载：`apt-get remove`
- 更新：`apt-get update`

6. wget 和 yum 的比较

- wget 是一种下载工具是通过 HTTP、HTTPS、FTP 三个最常见的 TCP/IP 协议下载，并可以使用 HTTP 代理，而且 wget 可以在用户退出系统的之后在后台执行。名字是 World Wide Web 与 get 的结合。
- 而 yum 是 redhat，centos 系统下的软件安装方式，基于 Linux，是一个在 Fedora 和 RedHat 以及 CentOS 中的 Shell 前端软件包管理器。是基于 RPM 包管理，能够从指定的服务器自动下载 RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包。
- rpm: 软件管理； redhat 的软件格式 `rpm r=redhat p=package m=management`；
- 用于安装、卸载`.rpm`软件
- 将他们两个 比较呢 就好比 wget 是迅雷下载中心，yum 呢就像是应用商店 里面有很多软件当然也有没有的

### passwd

修改用户密码。

- `passwd`：修改当前用户密码
- `passwd hadoop`：修改 hadoop 用户密码
- `passwd -l hadoop`：注：锁定用户 hadoop 不能更改密码
- `su - hadoop`：注：su 切换到 hadoop 用户
- `passwd -d hadoop`：注：清除 hadoop 用户密码

> passwd 修改密码报错 `passwd：Authentication token manipulation error`

root 用户或者普通用户修改密码失败；报的错误--密码：身份验证令牌操作错误；一般是密码文件的权限的问题，或者是该用户锁定不能修改密码，或者是根目录空间满了。

1. 首先查看磁盘空间是否满了 `df -hl`，如果满了，查找出占用较大的无用文件清空或删除；常用到命令：

- `du -lh --max-depth=1` :查看当前目录下各文件大小
- `du -sh`:查看当前目录总的大小
- `du -sh * | sort -n`:统计当前目录下文件大小，并按文件大小排序
- `du -sk file_name`:查看指定的 file 文件大小

2. 可以用`lsattr`命令查看存放用户和密码的文件属性`lsattr /etc/passwd`、`lsattr /etc/shadow`，（i：不得任意更动文件或目录），如果有 i 选项，则会导致所有的用户都不能修改密码，因为没有权限允许；

3. 可以用`chattr`命令将 i 权限撤销 `chattr -i /etc/passwd`、`chattr -i /etc/shadow`，然后再修改用户密码。

### reboot

重启服务器

### sh

1. 执行某个 sh 脚本：`sh openvpn-install.sh`

### ssh

1. 远程登录：
   - 通过私钥：`ssh -i /Users/xxx/vpn/ssh-key-private.key username@192.168.1.1`
   - 直接登：`ssh root@123.4.5.6`
2. 略

### ps

1. 查看某个服务的进程：`ps -ef|grep openvpn`

### systemctl

Systemd 并不是一个命令，而是一组命令，涉及到系统管理的方方面面。

1. systemctl 是 Systemd 的主命令，用于管理系统。

```bash

# 重启系统
$ sudo systemctl reboot

# 关闭系统，切断电源
$ sudo systemctl poweroff

# CPU停止工作
$ sudo systemctl halt

# 暂停系统
$ sudo systemctl suspend

# 让系统进入冬眠状态
$ sudo systemctl hibernate

# 让系统进入交互式休眠状态
$ sudo systemctl hybrid-sleep

# 启动进入救援状态（单用户状态）
$ sudo systemctl rescue
```

2. systemd-analyze

systemd-analyze 命令用于查看启动耗时。

```bash

# 查看启动耗时
$ systemd-analyze

# 查看每个服务的启动耗时
$ systemd-analyze blame

# 显示瀑布状的启动过程流
$ systemd-analyze critical-chain

# 显示指定服务的启动流
$ systemd-analyze critical-chain atd.service
```

3. hostnamectl

hostnamectl 命令用于查看当前主机的信息。

```bash

# 显示当前主机的信息
$ hostnamectl

# 设置主机名。
$ sudo hostnamectl set-hostname rhel7
```

4. localectl
   localectl 命令用于查看本地化设置。

```bash

# 查看本地化设置
$ localectl

# 设置本地化参数。
$ sudo localectl set-locale LANG=en_GB.utf8
$ sudo localectl set-keymap en_GB
```

5. timedatectl

timedatectl 命令用于查看当前时区设置。

```bash

# 查看当前时区设置
$ timedatectl

# 显示所有可用的时区
$ timedatectl list-timezones

# 设置当前时区
$ sudo timedatectl set-timezone America/New_York
$ sudo timedatectl set-time YYYY-MM-DD
$ sudo timedatectl set-time HH:MM:SS
```

6. loginctl

loginctl 命令用于查看当前登录的用户。

```bash

# 列出当前session
$ loginctl list-sessions

# 列出当前登录用户
$ loginctl list-users

# 列出显示指定用户的信息
$ loginctl show-user ruanyf
```

7. 关闭防火墙：`systemctl stop firewalld.service vi /etc/selinux/config`

### telnet

- 什么是 Telnet？对于 Telnet 的认识，不同的人持有不同的观点，可以把 Telnet 当成一种通信协议，但是对于入侵者而言，Telnet 只是一种远程登录的工具。一旦入侵者与远程主机建立了 Telnet 连接，入侵者便可以使用目标主机上的软、硬件资源，而入侵者的本地机只相当于一个只有键盘和显示器的终端而已。
- 为什么需要 telnet？telnet 就是查看某个端口是否可访问。我们在搞开发的时候，经常要用的端口就是 8080。那么你可以启动服务器，用 telnet 去查看这个端口是否可用。
- Telnet 协议是 TCP/IP 协议家族中的一员，是 Internet 远程登陆服务的标准协议和主要方式。它为用户提供了在本地计算机上完成远程主机工作的能力。在终端使用者的电脑上使用 telnet 程序，用它连接到服务器。终端使用者可以在 telnet 程序中输入命令，这些命令会在服务器上运行，就像直接在服务器的控制台上输入一样。可以在本地就能控制服务器。要开始一个 telnet 会话，必须输入用户名和密码来登录服务器。Telnet 是常用的远程控制 Web 服务器的方法。
- Telnet 客户端命常用命令：
  - open : 使用 openhostname 可以建立到主机的 Telnet 连接。
  - close : 使用命令 close 命令可以关闭现有的 Telnet 连接。
  - display : 使用 display 命令可以查看 Telnet 客户端的当前设置。
  - send : 使用 send 命令可以向 Telnet 服务器发送命令。支持以下命令：
  - ao : 放弃输出命令。
  - ayt : `Are you there`命令。
  - esc : 发送当前的转义字符。
  - ip : 中断进程命令。
  - synch : 执行 Telnet 同步操作。
  - brk : 发送信号。
- 上表所列命令以外的其他命令都将以字符串的形式发送至 Telnet 服务器。例如，sendabcd 将发送字符串 abcd 至 Telnet 服务器，这样，Telnet 会话窗口中将出现该字符串。
- quit ：使用 quit 命令可以退出 Telnet 客户端。
- telnet 用于远程登录到网络中的计算机，并以命令行的方式远程管理计算机。需要注意的是，远程机器必须启动 telnet 服务器，否则无法打开 telnet 命令。
- 例如：在命令提示符中输入`telnet 114.80.67.193`，按回车键，但是为了安全起见，要输入`n`并按回车键，出现登录提示符。输入登录名后，按回车键即可登录到远程机器。
- 使用 telnet 的 open 子命令远程登录远程机器。命令格式：`open hostname[port]`，hostname 为 ip 地址，port 默认为 23。 在 telnet 提示符下输入`open 114.80.67.193`，按回车键。再输入`n`，根据提示输入用户名和密码即可远程机器上。
- 使用 telnet 的 unset 子命令关闭本地回显功能。操作过程：先在命令提示符中输入`telnet`，按回车键；然后输入`setlocalecho`，按回车键，即可打开本地回显功能；如要关闭回显能力，只要在 telnet 命令提示符后输入`unsetlocalecho`，按回车。
- 使用 telnet 的 status 子命令查看连接状态。操作过程： 输入`telnet`进入 telnet 命令，再输入`status`，按回车，此时显示当前已经登录到 IP 为 114.80.67.193 的机器上。
- Windows 开启 Telnet 功能：
  - Windows7： 开始　 → 　控制面板　 → 　程序和功能　 → 　打开或关闭 Windows 功能，在这里就可以看到`telnet服务器`和`telnet客服端`。
  - Windows10： 控制面板　 → 程序 → 　程序和功能　 → 　启用或关闭 Windows 功能，点击打开之后就能找到，勾选并确定等待安装完毕即可。
  - 使用第三方工具 putty 等
- MacOS 上：
  - `brew install telnet`
  - 使用 termius 等工具
- 以上主要是用作客户端的一些知识

## 修改密码并改 SSH 秘钥登录为密码登录

1. 修改密码，`sudo su`进到 root 下修改即可：`passwd [username]`。下面的步骤都以 root 用户操作。
2. 修改登陆方式：`vi /root/.ssh/authorized_keys`，找到`ssh-rsa`字样， 按键盘 `i` 进入编辑模式，将 `ssh-rsa` 前面的内容全部删除，修改以后按 `Esc` 键退出编辑模式，`:wq` 回车保存。
3. 修改第二处，输入命令：`vim /etc/ssh/sshd_config`，找到 `#PermitRootLogin` 字样，去掉前面的 `#` 号；找到 `PasswordAuthentication no` 这行，把 `no` 改成 `yes` 。修改以后按 `Esc` 键退出编辑模式，`:wq` 回车保存。
4. 到这一步基本完成，命令行输入`reboot` 重启 VPS 后用 root 密码登陆即可。

## Linux 开启 ssh 并允许 root 登录

### centos7

1. 安装 openssh-server
   `yum list installed | grep openssh-server`

- 如果有输出，证明已经安装了 openssh-server，如果没有，需要安装`yum install openssh-server`

2. 修改 sshd 服务配置文件

- 编辑 sshd 服务配置文件`vim /etc/ssh/sshd_config` ，没有 vim 用 vi 或者`yum install -y vim` 安装
- 开启监听端口

```bash
Port 22
ListenAddress 0.0.0.0
ListenAddress ::
```

- 允许远程 root 登录`PermitRootLogin yes`
- 使用用户名密码作为验证连接`PasswordAuthentication yes`

3. 重启 sshd 服务

- `service sshd start`
- `service sshd restart`
- 配置开机自启动：`systemctl enable sshd`

## Mac ssh 连接远程服务器，并实现文件的上传和下载

### 使用 Filezilla

一般通过 sftp 连接，可以通过密码或者密钥文件等方式登录。

### 使用 scp 命令实现上传下载

1. 从服务器上下载文件: `scp username@servername:/path/filename /Users/mac/Desktop（本地目录）`，例如:`scp root@123.207.170.40:/root/test.txt /Users/mac/Desktop`就是将服务器上的`/root/test.txt`下载到本地的`/Users/mac/Desktop`目录下。注意两个地址之间有空格！
2. 上传本地文件到服务器: `scp /path/filename username@servername:/path`，例如:`scp /Users/mac/Desktop/test.txt root@123.207.170.40:/root/`
3. 从服务器下载整个目录: `scp -r username@servername:/root/（远程目录） /Users/mac/Desktop（本地目录）`，例如:`scp -r root@192.168.0.101:/root/ /Users/mac/Desktop/`
4. 上传目录到服务器: `scp -r local_dir username@servername:remote_dir`，例如：`scp -r test root@192.168.0.101:/root/` 把当前目录下的 test 目录上传到服务器的`/root/` 目录，注：目标服务器要开启写入权限。
5. 例：`scp -r log root@192.168.1.1:/var/data/nssa-sensor-logs`

### 使用 sz/rz

> Linux rz 和 sz 命令使用教程

- sz：将选定的文件发送(send)到本地机器
- rz：运行该命令会弹出一个文件选择窗口，从本地选择文件上传到 Linux 服务器
- 安装命令：`yum install lrzsz`

1. 从服务端发送文件到客户端：`sz filename`
2. 从客户端上传文件到服务端：`rz`

- 在弹出的框中选择文件，上传文件的用户和组是当前登录的用户
- SecureCRT 设置默认路径：`Options -> Session Options -> Terminal -> Xmodem/Zmodem ->Directories`
- Xshell 设置默认路径：`右键会话 -> 属性 -> ZMODEM -> 接收文件夹`

## Oracle VPS

### 申请免费账号

最多可以注册 4 个实例。

### 重置实例

1. 甲骨文 `ubuntu 20.04`更换`Debian`系统，甲骨文 DD 系统，甲骨文 ARM 实例重置系统

```bash
# 命令模板
bash <(wget --no-check-certificate -qO- 'https://raw.githubusercontent.com/MoeClub/Note/master/InstallNET.sh') -d 9 -v 64 -p 密码

# 命令中的 -d 后面为Debian版本号，-v 后面为64位/32位，【7、8、9、10】
# 命令中的 -u 后面为Ubuntu版本号，-v 后面为64位/32位，【14.04、16.04、18.04、20.04】
# 示例
bash <(wget --no-check-certificate -qO- 'https://raw.githubusercontent.com/MoeClub/Note/master/InstallNET.sh') -d 9 -v 64 -p Xy12345678
```

## CentOS 8

[参考的这里](https://blog.csdn.net/sunno326/article/details/105798590)

### Centos 添加 ip 黑名单禁止某个 ip 访问，对登陆失败的主机进行封禁

1. 只需要把 ip 添加到`/etc/hosts.deny`文件中即可完成禁止访问操作
2. 添加命令格式为：`sshd:$IP:deny`，例：`sshd:192.168.163.128:deny`
3. 添加允许网段编辑文件`/etc/hosts.allow`

### ssh 登录失败次数超过 10 次，自动将此远程 IP 放入 Tcp Wrapper 的黑名单中予以禁止防问

#### 编写脚本

编写脚本`/root/bin/checkip.sh`，每 5 分钟检查一次，如果发现通过 ssh 登录失败次数超过 10 次，自动将此远程 IP 放入 Tcp Wrapper 的黑名单中予以禁止防问

1. 创建脚本:`nano /bin/checkip.sh`

```bash
#!/bin/bash

#过滤/var/log/secure日志，因为有密码输入错误和用户名输入错误，awk取IP值要利用NF-3取值
awk '/Failed password/{count[$(NF-3)]++}END{for(i in count){if(count[i]>10) print i}}' /var/log/secure > /tmp/ssh_faild.log
while read ip;do
	#如果IP为空或者已经在/etc/hosts.deny中，就跳过此次循环
	if grep -q "$ip" /etc/hosts.deny;then
		continue
	else
		echo "sshd:$ip" >> /etc/hosts.deny
	fi
done </tmp/ssh_faild.log
```

2. `chmod +x /bin/checkip.sh`，赋权
3. 添加计划任务:`nano /etc/crontab`

```bash
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
*/5  *  *  *  * root sh /root/bin/checkip.sh &>/dev/null
```

4. 模拟错误登陆...
5. 检查`/var/log/secure`日志
6. 执行脚本，检查`/etc/hosts.deny`

   1. `sh /bin/checkip.sh`
   2. `cat /etc/hosts.deny`

7. `tail -3 /var/log/secure`，查看日志

#### 增加个用户并配置权限

配置 magedu 用户的 sudo 权限，允许 magedu 用户拥有 root 权限。

1. `useradd magedu`:增加用户
2. `passwd magedu`:设置密码
3. `visudo`:参考下面

```bash
...
## Allow root to run any commands anywhere
root    ALL=(ALL)   ALL
magedu  ALL=(ALL)   ALL  ###添加此行
...
```

4. `su - magedu`:切换用户
5. `sudo touch /root/abc.txt`:可以在 root 下创建文件
6. `sudo ls /root`:可以列出 root 下的内容

#### Oracle 计算实例保活

安装一个 lookbusy，配置几个参数，达到 oracle 的要求即可，以 CentOS8 为例：

1. 依次执行，如果已经安装了 curl 则不必再次安装

```sh
yum install curl build-essential
curl -L http://www.devin.com/lookbusy/download/lookbusy-1.4.tar.gz -o lookbusy-1.4.tar.gz
tar -xzvf lookbusy-1.4.tar.gz
cd lookbusy-1.4/
./configure
make
make install
```

2. 新建 systemd 服务：`systemctl edit --full --force lookbusy.service`，这一步可能会报错：
   1. `systemctl list-units --type=service`先查看一下有没有这个服务，如果有的话再执行
   2. 如果没有就等会。或者`systemctl daemon-reload`
   3. 如果依然不行，那么直接：`sudo vim /etc/systemd/system/lookbusy.service`创建一个。
3. 第 2 步新建的文件里写入：参数-c 指 cpu 使用率，-m 指内存使用率。可以根据自己的实例配置来适当配置。

```sh
[Unit]
Description=lookbusy service

[Service]
Type=simple
ExecStart=/usr/local/bin/lookbusy -c 20 -m 5120MB
Restart=always
RestartSec=10
KillSignal=SIGINT

[Install]
WantedBy=multi-user.target
```

4. 启动并设置 lookbusy 开机自启：`systemctl enable --now lookbusy.service`
5. `top`: 查看当前机器的 cpu、内存、负载情况，确定超过甲骨文规定的 10%即可

#### 几条查看 CPU、内存命令

1. 查看 CPU 型号：`dmidecode -s processor-version`/`cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c`/`more /proc/cpuinfo | grep "model name"`
2. 查看物理 CPU: `cat /proc/cpuinfo | grep "physical id" | sort | uniq|wc -l`
3. 查看 CPU 详情: `cat /proc/cpuinfo`/`lscpu`
4. 查看物理 CPU 核数: `cat /proc/cpuinfo | grep “cores”|uniq`
5. 查看逻辑 CPU: `cat /proc/cpuinfo | grep “processor” |wc -l`
6. 查看内存占用: `free -h`
7. 查看磁盘分区: `lsblk`
8. 查看磁盘使用详情: `df -h`
9. 使用 systemd 初始化进程服务。当然 systemd 初始化进程服务采取了并发启动机制，因此开机速度得到了不小的提升。`systemctl start xx/restart xx/stop xx/status/reload xx/enable xx/disable xx/`
10. `systemctl daemon-reload`：reload units

#### install dev tools

- `yum groupinstall "Development Tools"`
- `yum install -y gcc g++ kernel-devel`

- `sudo dnf install **python3-librepo**`解决 centos8 报错：`Failed loading plugin "osmsplugin": No module named 'librepo'`

### 每次通过密码链接 vps 时都会提示有 xx 次失败记录

可能是爬虫或者恶意攻击，解决方法有至少两个：

1. 关闭`PasswordAuthentication`，修改`nano /etc/ssh/sshd_config`这个文件里对应的地方。同时最好也关闭`PermitRootLogin`root 账户登录。只使用`ssh-key`登录。
2. 换个不常用的端口，降低被扫到的几率。

## 查看操作系统版本

1. Linux:

- Ubuntu/Debian: `lsb_release -a`
- CentOS/RedHat: `cat /etc/redhat-release`
- Arch: `cat /etc/arch-release`

2. macOS:

- `sw_vers`

3. Windows:

- `winver` (运行命令行并输入 winver)
- 系统属性 (打开系统属性对话框)

## 阿里云搭建 WordPress

```sh
yum -y install httpd mod_ssl mod_perl mod_auth_mysql
httpd -v
systemctl start httpd.service # 启动之后可以在浏览器访问ecs地址查看页面

yum install -y mariadb-server
systemctl start mariadb
systemctl status mariadb
mysqladmin -u root -p password # 默认没有密码，先回车一次，然后会设置新密码
mysql -uroot -p # 执行下面的sql
  create database wordpress;
  show databases;
  exit;

yum -y install php php-mysql gd php-gd gd-devel php-xml php-common php-mbstring php-ldap php-pear php-xmlrpc php-imap
echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php # 创建测试页面
systemctl restart httpd # 访问 http://<ECS公网地址>/phpinfo.php

yum -y install wordpress
# 执行如下命令，修改wp-config.php指向路径为绝对路径。
# 进入/usr/share/wordpress目录。
cd /usr/share/wordpress
# 修改路径。
ln -snf /etc/wordpress/wp-config.php wp-config.php
# 查看修改后的目录结构。
ll
# 执行如下命令，移动wordpress文件到Apache根目录。
# 在Apache的根目录/var/www/html下，创建一个wp-blog文件夹。
mkdir /var/www/html/wp-blog
mv * /var/www/html/wp-blog/
# 执行以下命令，修改wp-config.php配置文件。
sed -i 's/database_name_here/wordpress/' /var/www/html/wp-blog/wp-config.php
sed -i 's/username_here/root/' /var/www/html/wp-blog/wp-config.php
sed -i 's/password_here/123456789/' /var/www/html/wp-blog/wp-config.php

cat -n /var/www/html/wp-blog/wp-config.php
systemctl restart httpd

# 访问http://<ECS公网地址>/wp-blog/wp-admin/install.php
# 在WordPress配置页面，配置相关信息，然后单击Install WordPress。
# 在Success！页面，单击Log In。
# 在登录页面，输入您的用户名和密码，单击Log In。

```

## CPU 是怎么工作的

或者简单点说，我们写的代码是怎么通过 CPU 去操作其他硬件的。（没学过计算机组成原理和微机原理，简单了解一下）

1. 我们写的代码一般是高级语言，会被编译器编译成机器语言，也就是机器码，然后存在芯片里面去执行，可以去操作内存。
2. 比如 C 语言，它在实际运行中，都是以汇编指令的方式运行的，由编译器把 C 语言编译成汇编指令，CPU 直接执行汇编指令。
3. 那么汇编指令是怎么运行起来从而实现操作硬件的呢？
4. 如果把硬件平台限制在 x86 环境下，那么汇编指令操作硬件基本上只有两种方式：
   1. 通过向内存空间写数据。硬件会把硬件上的各种寄存器（外行可以理解为访问硬件的接口或者操作硬件的工具）映射到某一块内存地址空间上，之后只要用汇编指令，甚至 C 语言去读写这一段内存地址空间（并非真正操作物理内存），就可以达到操作硬件的目的了。硬件的各种寄存器会被映射到某一块物理内存中，这种方式称为 MMIO，在 Windows 的设备管理器里，右键点设备，看属性->资源里，不少硬件设备都有“内存范围”的参数，这里的内存范围就表示这个硬件的资源可以通过访问这一段内存来控制它。
   2. x86 汇编中，还有两个特殊的指令是 IN 和 OUT，这是 x86 平台独有的，上面图里的 I/O 范围，就是用 IN/OUT 这两个指令来访问和控制的。IN/OUT 方式没有直接的 C 语言语法对应，需要自己封装汇编。
5. 那么为什么平时很难用 C 语言操作硬件呢？这是因为平时写的代码大多数都在保护模式下，保护模式下，直接访问物理地址会受到限制，C 语言操作的地址都是虚地址。对于 Windows 来说，要访问物理地址，需要工作在内核模式，也就是的写驱动才行。
6. 芯片的引脚跟寄存器是相对应的，寄存器是 8 位的内存单元（对，存在于内存上面），当你往这个内存单元里面写入数据时，芯片的引脚的电压会发生变化，比如说我写入的是 01100001，则芯片上与之对应的 8 个引脚的电压状态（分为高电平与低电平两种）会输出：低高高低低低低高。cpu 可以执行代码指令，指令可以操作内存。所以从上面两点可以我们可以知道，cpu 可以执行指令，使芯片的引脚电平（电压）发生变化。
7. 单片机芯片与显示器相连，可以通过引脚输出的电平来控制显示器的字符显示。综合上面，也就是说，单片机芯片 cpu 可以通过执行指令来控制显示器的字符显示。
8. 我们可以通过在单片机芯片里面写显示器的“驱动”程序来屏蔽掉硬件（显示器硬件）层。
9. 内存里有一段是跟寄存器相对应的，而寄存器是跟芯片的引脚相对应的，于是操作该段内存就能控制芯片引脚的电压变化。
10. 硬件（比如说显示器）有引脚（或者说排线，这些也是一样的东西），这些引脚跟芯片的引脚相连可以接受芯片的控制。
11. 通常我们（消费者或者非底层开发者）操作硬件就是直接调厂商提供的驱动啥的就可以了，就是调库调函数去控制/实现一些功能。

## SSH Config

### SSH 设置多个 SSH Key

比如同一台电脑要登录多个 GitHub 账号并通过 ssh key 去登录验证推拉代码的时候，为了正确配置多个 GitHub 账号的 SSH key，你需要为每个账号设置一个不同的 Host 别名。

1. 打开`~/.ssh/config`文件并修改
2. 示例：

```bash
# CodeSandbox SSH Integration
Include "csb/config"
# End of CodeSandbox SSH Integration

# 配置第一个 GitHub 账号
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

# 配置第二个 GitHub 账号，使用别名
Host github-second
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_github_second

# 配置 gitlab 账号
Host gitlab.com
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/id_rsa
```

3. 使用别名 github-second: 在这种配置下，你需要在使用第二个 GitHub 账号时，使用别名 github-second。

```bash
# 使用第一个 GitHub 账号
git clone git@github.com:your-username/your-repo.git

# 使用第二个 GitHub 账号
git clone git@github-second:your-username/your-repo.git
```

4. 配置现有项目使用别名: 如果你已经有一个项目需要切换到使用第二个 GitHub 账号，你可以修改项目的 Git 配置

```bash
cd your-repo
git remote set-url origin git@github-second:your-username/your-repo.git
```

### SSH 将 IP 地址配置成别名

使用 SSH 登录远端服务器时：`ssh myserver1`即可登录`10.21.22.233`

```bash
# 配置第一个服务器 -- 简单密码登录
Host myserver1
  HostName 10.21.22.233
  User root

# 配置第二个服务器 -- 使用秘钥登录
Host myserver2
  HostName 192.168.1.100
  User root
  Port 2222
  IdentityFile ~/.ssh/id_rsa_myserver1  # 密钥文件本地路径
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
```

## 服务器面板工具

1. 宝塔面板
2. [1panel](https://github.com/1Panel-dev/1Panel)：现代化、开源的 Linux 服务器运维管理面板，`curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh`一键安装。