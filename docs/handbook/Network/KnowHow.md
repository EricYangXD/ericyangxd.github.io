---
title: 建站名词解释
author: EricYangXD
date: "2022-09-23"
meta:
  - name: keywords
    content: 建站名词
---

## 建站名词解释

> DNS A 记录 NS 记录 MX 记录 CNAME 记录 TXT 记录 TTL 值 PTR 值 泛域名 泛解析 域名绑定 域名转向

1. DNS：Domain Name System 域名管理系统 域名是由圆点分开一串单词或缩写组成的，每一个域名都对应一个惟一的 IP 地址，这一命名的方法或这样管理域名的系统叫做域名管理系统。

   - DNS：Domain Name Server 域名服务器 域名虽然便于人们记忆，但网络中的计算机之间只能互相认识 IP 地址，它们之间的转换工作称为域名解析，域名解析需要由专门的域名解析服务器来完成，DNS 就是进行域名解析的服务器。 查看 DNS 更详细的解释

2. A 记录: A（Address）记录是用来指定主机名（或域名）对应的 IP 地址记录。用户可以将该域名下的网站服务器指向到自己的 web server 上。同时也可以设置域名的子域名。通俗来说 A 记录就是服务器的 IP,域名绑定 A 记录就是告诉 DNS,当你输入域名的时候给你引导向设置在 DNS 的 A 记录所对应的服务器。 简单的说，A 记录是指定域名对应的 IP 地址。
3. NS 记录: NS（Name Server）记录是域名服务器记录，用来指定该域名由哪个 DNS 服务器来进行解析。 您注册域名时，总有默认的 DNS 服务器，每个注册的域名都是由一个 DNS 域名服务器来进行解析的，DNS 服务器 NS 记录地址一般以以下的形式出现： ns1.domain.com、ns2.domain.com 等。 简单的说，NS 记录是指定由哪个 DNS 服务器解析你的域名。
4. MX 记录: MX（Mail Exchanger）记录是邮件交换记录，它指向一个邮件服务器，用于电子邮件系统发邮件时根据收信人的地址后缀来定位邮件服务器。例如，当 Internet 上的某用户要发一封信给 user@mydomain.com 时，该用户的邮件系统通过 DNS 查找 mydomain.com 这个域名的 MX 记录，如果 MX 记录存在， 用户计算机就将邮件发送到 MX 记录所指定的邮件服务器上。
5. CNAME 记录: CNAME（Canonical Name ）`别名`记录，允许您将多个名字映射到同一台计算机。通常用于同时提供 WWW 和 MAIL 服务的计算机。例如，有一台计算机名为 `host.mydomain.com`（A 记录），它同时提供 WWW 和 MAIL 服务，为了便于用户访问服务。可以为该计算机设置两个别名（CNAME）：WWW 和 MAIL， 这两个别名的全称就`www.mydomain.com`和`mail.mydomain.com`，实际上他们都指向 `host.mydomain.com`。
6. TXT 记录:
   TXT 记录，一般指某个主机名或域名的说明，如：admin IN TXT "管理员, 电话：XXXXXXXXXXX"，mail IN TXT "邮件主机，存放在 xxx , 管理人：AAA"，Jim IN TXT "contact: abc@mailserver.com"，也就是您可以设置 TXT 内容以便使别人联系到您。 TXT 的应用之一，SPF（Sender Policy Framework）反垃圾邮件。SPF 是跟 DNS 相关的一项技术，它的内容写在 DNS 的 TXT 类型的记录里面。MX 记录的作用是给寄信者指明某个域名的邮件服务器有哪些。SPF 的作用跟 MX 相反，它向收信者表明，哪些邮件服务器是经过某个域名认可会发送邮件的。SPF 的作用主要是反垃圾邮件，主要针对那些发信人伪造域名的垃圾邮件。例如：当邮件服务器收到自称发件人是spam@gmail.com的邮件，那么到底它是不是真的 gmail.com 的邮件服务器发过来的呢，我们可以查询 gmail.com 的 SPF 记录，以此防止别人伪造你来发邮件。
7. TTL 值: TTL（Time-To-Live）原理：TTL 是 IP 协议包中的一个值，它告诉网络路由器包在网络中的时间是否太长而应被丢弃。有很多原因使包在一定时间内不能被传递到目的地。例如，不正确的路由表可能导致包的无限循环。一个解决方法就是在一段时间后丢弃这个包，然后给发送者一个报文，由发送者决定是否要重发。TTL 的初值通常是系统缺省值，是包头中的 8 位的域。TTL 的最初设想是确定一个时间范围，超过此时间就把包丢弃。由于每个路由器都至少要把 TTL 域减一，TTL 通常表示包在被丢弃前最多能经过的路由器个数。当记数到 0 时，路由器决定丢弃该包，并发送一个 ICMP 报文给最初的发送者。 简单的说，TTL 就是一条域名解析记录在 DNS 服务器中的存留时间。当各地的 DNS 服务器接受到解析请求时，就会向域名指定的 NS 服务器发出解析请求从而获得解析记录；在获得这个记录之后，记录会在 DNS 服务器中保存一段时间，这段时间内如果再接到这个域名的解析请求，DNS 服务器将不再向 NS 服务器发出请求，而是直接返回刚才获得的记录，而这个记录在 DNS 服务器上保留的时间，就是 TTL 值。
   TTL 值设置的应用：
   - 一是增大 TTL 值，以节约域名解析时间，给网站访问加速。 一般情况下，域名的各种记录是极少更改的，很可能几个月、几年内都不会有什么变化。我们完全可以增大域名记录的 TTL 值让记录在各地 DNS 服务器中缓存的时间加长，这样在更长的一段时间内，我们访问这个网站时，本地 ISP 的 DNS 服务器就不需要向域名的 NS 服务器发出解析请求，而直接从缓存中返回域名解析记录。
   - 二是减小 TTL 值，减少更换空间时的不可访问时间。 更换空间 99.9%会有 DNS 记录更改的问题，因为缓存的问题，新的域名记录在有的地方可能生效了，但在有的地方可能等上一两天甚至更久才生效。结果就是有的人可能访问到了新服务器，有的人访问到了旧服务器。仅仅是访问的话，这也不是什么大问题，但如果涉及到了邮件发送，这个就有点麻烦了，说不定哪封重要信件就被发送到了那已经停掉的旧服务器上。
   - 为了尽可能的减小这个各地的解析时间差，合理的做法是： 第一步，先查看域名当前的 TTL 值，我们假定是 1 天。 第二步，修改 TTL 值为可设定的最小值，可能的话，建议为 1 分钟，就是 60。 第三步，等待一天，保证各地的 DNS 服务器缓存都过期并更新了记录。 第四步，设置修改新记录，这个时候各地的 DNS 就能以最快的速度更新到新的记录。 第五步，确认各地的 DNS 已经更新完成后，把 TTL 值设置成您想要的值。 一般操作系统的默认 TTL 值如下： TTL=32 Windows 9x/Me TTL=64 LINUX TTL=128 Windows 200x/XP TTL=255 Unix
8. PTR 值: PTR 是 pointer 的简写，用于将一个 IP 地址映射到对应的域名，也可以看成是 A 记录的反向，IP 地址的反向解析。 PTR 主要用于邮件服务器，比如邮箱AAA@XXX.com给邮箱BBB@yahoo.com发了一封邮件，yahoo 邮件服务器接到邮件时会查看这封邮件的头文件，并分析是由哪个 IP 地址发出来的，然后根据这个 IP 地址进行反向解析，如果解析结果对应 XXX.com 的 IP 地址就接受这封邮件，反之则拒绝接收这封邮件。
9. 泛域名与泛解析: 泛域名是指在一个域名根下，以 `*.Domain.com` 的形式表示这个域名根所有未建立的子域名。 泛解析是把`*.Domain.com` 的 A 记录解析到某个 IP 地址上，通过访问任意的前缀.domain.com 都能访问到你解析的站点上。
10. 域名绑定: 域名绑定是指将域名指向服务器 IP 的操作。
11. 域名转向: 域名转向又称为域名指向或域名转发，当用户地址栏中输入您的域名时，将会自动跳转到您所指定的另一个域名。一般是使用短的好记的域名转向复杂难记的域名。

### 师夷长技以制夷

#### 常用协议

- PPTP：点对点隧道协议。以 GRE 协议做点对点传输，并由 TCP 1723 端口来发起和管理 GRE，本身没有加密和身份验证功能，仅依靠点对点协议（即 PTP）的隧道传输通道实现安全功能，所以速度快，但是由于安全性能低，早已不建议使用。
- IPSec：类似于 PPTP，也是比较老而过时的 VPN 隧道协议，尽管它的协议含有 AH/认证头，ESP/封装安全载荷，和 IKEv2/因特密匙失交换，对比 PPTP 拥有更好的安全性，IPSec 流量传输更容易被网路服务商识别并阻断。
- L2TP：第一个真正专为 VPN 开发的隧道协议。 为了升级其安全性，L2TP 经常会与 IPSec 搭配使用。它需要两次检查数据，即需要更多 CPU 资源和时间来处理。在没有 OpenVPN, WireGuard 这些首选协议的情况下，L2TP/IPsec 也不失为一个靠谱的选项。
- IKev2：与 OpenVPN 协议相比，在有硬件加速的背景下，它们有着差不多的数据安全加密级别、连接快速。在移动设备稳定性更高。 IKev2/IPSec 搭配起来可以向用户提供相对升级的 VPN 体验。
- SSTP：安全套接字隧道协议，通过使用 SSL/TLS 来传输 PPP 流量，从而给用户提供了传输级别的安全性。此外，对 TCP 端口 443（默认）的支持有助于使流量成功通过大多数防火墙和代理。非开源协议，微软专有。
- OpenVPN：技术核心是虚拟网卡和 SSL 协议实现，使用 OpenSSL 加密库的 SSL/TLS 进行密钥交换，以便严密保护点对点或站点到站点连接，并且通过将数据分成小包来传输数据。又可分为两种 OpenVPN TCP 和 OpenVPN UDP，前者更侧重网络安全而后者拥有更好的连接速度。
- WireGuard：新一代，不仅加密级别高，稳定，速度更是被认定比 OpenVPN 快。 但在平台的兼容性还比不上 OpenVPN。WireGuard 只是重新组装了现成的算法，以实现更简单但仍然安全的加密目标。具体来说，其前沿的密码学用法包括 Noise 协议框架、ChaCha20、Curve25519 等。
- Shadowsocks：免费且开源的加密代理/VPN 协议。它是一款基于 Socks5 的代理协议，最早由亚洲某审查严重国家的程序员开发，主要应用于绕过政府防火墙/GFW 审查。后面还延伸出了更多的代理协议，例如 V2Ray 和 Trojan。
- SSH：（安全 Shell）此协议创建一个隧道，同时加密所有数据。

#### PPTP、L2TP、OpenVPN 三种隧道协议的优缺点对比

- 易用性： PPTP > L2TP > OpenVPN
- 速度： PPTP > OpenVPN UDP > L2TP > OpenVPN TCP
- 安全性： OpenVPN > L2TP > PPTP
- 稳定性： OpenVPN > L2TP > PPTP
- 网络适用性：OpenVPN > PPTP > L2TP

#### 小米路由器刷机救砖

1. [小米路由器修复工具](http://www1.miwifi.com/miwifi_download.html)下载救砖工具，需用 Windows 电脑；
2. 参考官方步骤：[小米路由器修复工具刷机使用步骤](https://web.vip.miui.com/page/info/mio/mio/detail?postId=19134127&app_version=dev.20051)
   1. 下载小米路由器修复工具 PC 客户端和用来刷机的 ROM 包；
   2. 接通小米路由器电源，用网线连接电脑和路由器 LAN 口；
   3. 建议关闭杀毒软件后再打开小米路由器修复工具，选择本地上传刷机 ROM 包；
   4. 选择网卡：请选择与路由器 LAN 口相连的网卡；（此步骤将使用管理员权限为用户更改网卡配置，以确保路由器和电脑处于同一局域网。关闭应用时会提醒并自动恢复网卡配置。）
   5. 网卡配置成功后，先断开路由器电源，然后按住 Reset 键再接通电源，直到橙灯闪烁松开 Reset 键；
   6. 等待大约 3-5 分钟，蓝灯闪烁表示刷机成功，需要断电重启路由器；
   7. 如果红灯闪烁表示刷机失败，请检查以上的刷机过程并重新进行刷机操作。
3. 【路由器指示灯状态说明】
   1. 蓝灯长亮：工作正常
   2. 蓝灯闪烁：刷机成功（需要断电重启，注意路由断电后请等待 10s 以上再通电）
   3. 橙灯长亮：正在启动
   4. 橙灯闪烁：进入刷机流程或系统升级中（该过程不要断电）
   5. 红灯长亮：系统故障
   6. 红灯闪烁：刷机失败

#### 开源工具

1. clashX（Mac），clash（Windows）：github 上搜索
2. shadowsockets：同上，两个平台软件的名称不太一样
3. OpenVPN：同上

#### clashX 用法

Windows 上的 clash 非常好用，Mac 上的 clashX 刚用起来有点不知所措。

1. 添加订阅链接：在工具栏左键点击 clashX 的图标，选择 config-》remote config-》manage，然后点击 add，粘贴上订阅地址即可。删除也是在这里。
2. 订阅地址转换：[subconverter](https://subconverter.speedupvpn.com/)
3. 订阅地址转换：[acl4ssr](https://acl4ssr-sub.github.io/)
4. 勾选「设为系统代理」可以开启代理。

## 1 分钟建站

1. [https://www.lnmp.org/install.html](LNMP一键安装)，安装必备的一些软件工具
2. TODO

## 甲骨文云安装 x-ui 面板

> [github 仓库](https://github.com/vaxilu/x-ui)

1. 支持 Centos7+、Ubuntu16+、Debian8+
2. 一键安装即可`bash <(curl -Ls https://raw.githubusercontent.com/vaxilu/x-ui/master/install.sh)`
3. 安装过程中需要设置用户名密码等
4. 操作系统里设置放开端口，参考下面
5. 对于甲骨文云，还要去实例控制面板这里添加入站规则，开放对应的端口。

## CentOS 7 使用 firewalld 开放端口

1. 开放端口

```sh
firewall-cmd --zone=public --add-port=5672/tcp --permanent   # 开放5672端口

firewall-cmd --zone=public --remove-port=5672/tcp --permanent  #关闭5672端口

firewall-cmd --reload   # 配置立即生效
```

2. 查看防火墙所有开放的端口

`firewall-cmd --zone=public --list-ports`

3. 关闭防火墙

如果要开放的端口太多，嫌麻烦，可以关闭防火墙，安全性自行评估

`systemctl stop firewalld.service`

4. 查看防火墙状态

`firewall-cmd --state`

5. 查看监听的端口

`netstat -lnpt`

> PS: Centos7 默认没有 netstat 命令，需要安装 net-tools 工具，`yum install -y net-tools`

6. 检查端口被哪个进程占用

`netstat -lnpt |grep 5672`

7. 查看进程的详细信息

`ps 6832`

8. 中止进程

`kill -9 6832`

## CentOS 7 使用 iptables 开放端口

> CentOS 7.0 默认使用的是 firewall 作为防火墙，这里改为 iptables 防火墙。

1. 关闭 firewall：

```sh
systemctl stop firewalld.service

systemctl disable firewalld.service

systemctl mask firewalld.service
```

2. 安装 iptables 防火墙:`yum install iptables-services -y`

3. 启动设置防火墙

   - `systemctl enable iptables`
   - `systemctl start iptables`

4. 查看防火墙状态:`systemctl status iptables`

5. 编辑防火墙，增加端口:`vi /etc/sysconfig/iptables #编辑防火墙配置文件`

```sh
-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT

-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT

-A INPUT -m state --state NEW -m tcp -p tcp --dport 3306 -j ACCEPT

:wq! #保存退出
```

6. 重启配置，重启系统

```sh
systemctl restart iptables.service #重启防火墙使配置生效

systemctl enable iptables.service #设置防火墙开机启动
```

7. 完整的防火墙配置信息

[root@izm5e11fdcw9aa5w6w9mm2z ~]# more /etc/sysconfig/iptables

```bash
# sample configuration for iptables service
# you can edit this manually or use system-config-firewall
# please do not ask us to add additional ports/services to this default configuration
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT

-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT

-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT

-A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```

8. 注意开放端口的配置位置在 icmp-host-prohibited 这一行上面。

## 网络零散知识点

### localhost/127.0.0.1/0.0.0.0 三者之间的关系

1. `127.0.0.1`是回环地址，`localhost`是域名，但默认等于`127.0.0.1`。
2. `ping`回环地址和`ping`本机地址，是一样的，走的是`lo0"假网卡"`，都会经过网络层和数据链路层等逻辑，最后在快要出网卡前`狠狠地拐了个弯`，将数据插入到一个`链表`中之后就`软中断`通知`ksoftirqd`来进行收数据的逻辑，压根就不出网络。所以断了网也能 `ping` 通回环地址。
3. 如果服务器 `listen` 的是`0.0.0.0`，那么此时用`127.0.0.1`和本机地址`都可访`问到服务。
4. 客户端`connect`时，不能用`0.0.0.0`，必须指明要连接哪个服务器 IP。

```bash
ping localhost
PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.046 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.049 ms
^C
--- localhost ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.038/0.044/0.049/0.004 ms


ping 127.0.0.1
PING 127.0.0.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.104 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.062 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.065 ms
^C
--- 127.0.0.1 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.042/0.068/0.104/0.022 ms


ping 0.0.0.0
PING 0.0.0.0 (0.0.0.0): 56 data bytes
ping: sendto: Socket is not connected
ping: sendto: Socket is not connected
Request timeout for icmp_seq 0
ping: sendto: Socket is not connected
Request timeout for icmp_seq 1
^C
--- 0.0.0.0 ping statistics ---
3 packets transmitted, 0 packets received, 100.0% packet loss
```

## 微信接入 chatgpt

1. 搞台 vps，比如装个 Centos7，然后在这个系统上操作：
2. 安转 git：`sudo yum install git`
3. 安装 golang：`sudo yum install golang`
4. 安装 screen：`yum install screen`，类似 pm2
5. 选择一个地方，获取项目：`git clone https://github.com/ZYallers/chatgpt_wechat_robot.git`
6. 进入项目目录`chatgpt_wechat_robot`，编辑配置文件：`cp config.dev.json config.json`
7. 去 openai[这里](https://platform.openai.com/account/api-keys)获取你的 key，然后复制到上一步的`config.json`中
8. 启动守护进程：`screen -S chatgpt`
9. 运行：`go run main.go`
10. 复制命令行输出的微信登录 URL 到浏览器中，使用准备当机器人的微信扫码登录（据说可能会被封号），然后就可以和这个微信号对话了。
