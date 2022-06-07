---
title: Nginx基础知识
author: EricYangXD
date: "2022-05-09"
---

## Nginx 是什么

Nginx (engine x) 是一个轻量级、高性能的 HTTP 服务器和反向代理服务器，同时也是一个通用代理服务器(TCP/UDP/IMAP/POP3/SMTP)。

### 优势

1. Nginx 是一个高性能的 Web 服务器，它非常的轻量级，消耗的 CPU、内存很少；
2. Nginx 采用“master/workers”进程池架构，不使用多线程，消除了进程、线程切换的成本；
3. Nginx 基于 epoll 实现了“I/O 多路复用”，不会阻塞，所以性能很高；
4. Nginx 使用了“职责链”模式，多个模块分工合作，自由组合，以流水线的方式处理 HTTP 请求。
5. 是一个轻量级、高性能的 HTTP 服务器和反向代理服务器，占用内存少，并发能力强，nginx 的并发能力要比在同类型的网页服务器中表现要好
6. 专为性能优化而开发，最重要的要求便是性能，且十分注重效率，有报告 nginx 能支持高达 50000 个并发连接数

### 缺点

Nginx 的服务管理思路延续了当时的流行做法，使用磁盘上的静态配置文件，所以每次修改后必须重启才能生效。

这在业务频繁变动的时候是非常致命的（例如流行的微服务架构），特别是对于拥有成千上万台服务器的网站来说，仅仅增加或者删除一行配置就要分发、重启所有的机器，对运维是一个非常大的挑战，要耗费很多的时间和精力，成本很高，很不灵活，难以“随需应变”。

### 正向代理和反向代理

1. 正向代理：局域网中的用户想要直接访问网络是不可行的，只能通过代理服务器（Server）来访问，这种代理服务就被称为正向代理。代理服务器代理的是客户端。
2. 反向代理：客户端无法感知代理，因为客户端访问网络不需要配置，只要把请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据，然后再返回到客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器 IP 地址。代理服务器代理的是真正的服务端。

### 负载均衡

负载均衡：是高可用网络基础架构的关键组件，通常用于将工作负载分布到多个服务器来提高网站、应用、数据库或其他服务的性能和可靠性。

### 动静分离

常用的 Web 服务器有：TomCat、Nginx。动静分离即把静态资源（如 html、css、图片等）放在一台服务器，把动态资源（后端服务等）放在另外的服务器。

### 常用的命令

- 查看版本：`./nginx -v`
- 启动：`./nginx`
- 关闭：`./nginx -s stop`(推荐) 或 `./nginx -s quit`
- 重新加载 nginx 配置：`./nginx -s reload`

### Nginx 的配置文件

配置文件分为三个模块：

- 全局块：从配置文件开始到 events 块之间，主要是设置一些影响 nginx 服务器整体运行的配置指令。（按道理说：并发处理服务的配置时，值越大，可支持的并发处理量越多，但此时会受到硬件、软件等设备等的制约）
- events 块：影响 nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 workprocess 下的网络连接进行序列化，是否允许同时接收多个网络连接等等
- http 块：如反向代理和负载均衡都在此配置

#### location 的匹配规则

共有四种方式：`location[ = | ~ | ~* | ^~ ] url {}`:

1. `=` ：精确匹配，用于不含正则表达式的 url 前，要求字符串与 url 严格匹配，完全相等时，才能停止向下搜索并处理请求
2. `^~`：用于不含正则表达式的 url 前，要求 nginx 服务器找到表示 url 和字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再匹配。表示 uri 以某个字符串开头
3. `~` ：最佳匹配，用于表示 url 包含正则表达式，并且区分大小写，匹配到就停止
4. `~*`：与~一样，只是不区分大小写，匹配到就停止
5. `/`：不使用上面四种时，表示通用匹配，每个 URI 都能匹配成功

注意:

- 如果 url 包含正则表达式，则不需要 ~ 作为开头表示
- nginx 的匹配具有优先顺序，一旦匹配上就会立马退出，不再进行向下匹配

location 的定义分为两种：

- 前缀字符串（prefix string）
- 正则表达式（regular expression），具体为前面带 ~\* 和 ~ 修饰符的

而匹配 location 的顺序为：

1. 检查使用前缀字符串的 locations，在使用前缀字符串的 locations 中选择最长匹配的，并将结果进行储存
2. 如果符合带有 = 修饰符的 URI，则立刻停止匹配
3. 如果符合带有 ^~ 修饰符的 URI，则也立刻停止匹配。
4. 然后按照定义文件的顺序，检查正则表达式，匹配到就停止
5. 当正则表达式匹配不到的时候，使用之前储存的前缀字符串

再总结一下就是：

1. 在顺序上，前缀字符串顺序不重要，按照匹配长度来确定，正则表达式则按照定义顺序。
2. 在优先级上，= 修饰符最高，^~ 次之，再者是正则，最后是前缀字符串匹配。

### root 与 alias 的区别

1. root 是直接拼接 root + location 而 alias 是用 alias 替换 location
2. server 和 location 中的 root:
   1. server 和 location 中都可以使用 root
   2. 如果两者都出现，优先级就是就近原则，如果 location 中能匹配到，就是用 location 中的 root 配置，忽略 server 中的 root，当 location 中匹配不到的时候，则使用 server 中的 root 配置。

### 开启 gzip

Nginx 内置了 ngx_http_gzip_module 模块，该模块会拦截请求，并对需要做 Gzip 压缩的文件做压缩。因为是内部集成，所以我们只用修改 Nginx 的配置，就可以直接开启。

```nginx
# 登陆服务器
ssh -v root@8.147.xxx.xxx

# 进入 Nginx 目录
cd /etc/nginx

# 修改 Nginx 配置
vim nginx.conf

# 在 server 中添加 Gzip 压缩相关配置：
server {
  listen 443 ssl;
  server_name ericyangxd.top;
  ssl_certificate ...;
  ssl_certificate_key ...;
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
  ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  location ^~ /my-vuepress-blog/ {
    alias /home/www/website/ts/;
  }
  location / {
    alias /home/www/website/ts/;
    index index.html;
  }
  # 这里是新增的 gzip 配置
  gzip on;
  gzip_min_length 1k;
  gzip_comp_level 6;
  gzip_types application/atom+xml application/geo+json application/javascript application/x-javascript application/json application/ld+json application/manifest+json application/rdf+xml application/rss+xml application/xhtml+xml application/xml font/eot font/otf font/ttf image/svg+xml text/css text/javascript text/plain text/xml;
}
```

1. gzip ：是否开启 gzip 模块 on 表示开启 off 表示关闭，默认是 off
2. gzip_min_length：设置压缩的最小文件大小，小于该设置值的文件将不会压缩
3. gzip_comp_level：压缩级别，从 1 到 9，默认 1，数字越大压缩效果越好，但也会越占用 CPU 时间，这里选了一个常见的折中值
4. gzip_types：进行压缩的文件类型

重新加载一次 Nginx 配置：`systemctl reload nginx`

## OpenResty

OpenResty 并不是一个全新的 Web 服务器，而是基于 Nginx，它利用了 Nginx 模块化、可扩展的特性，开发了一系列的增强模块，并把它们打包整合，形成了一个“一站式”的 Web 开发平台。

虽然 OpenResty 的核心是 Nginx，但它又超越了 Nginx，关键就在于其中的 ngx_lua 模块，把小巧灵活的 Lua 语言嵌入了 Nginx，可以用脚本的方式操作 Nginx 内部的进程、多路复用、阶段式处理等各种构件。脚本语言的好处你一定知道，它不需要编译，随写随执行，这就免去了 C 语言编写模块漫长的开发周期。OpenResty 还把 Lua 自身的协程与 Nginx 的事件机制完美结合在一起，优雅地实现了许多其他语言所没有的“同步非阻塞”编程范式，能够轻松开发出高性能的 Web 应用。

1. Nginx 依赖于磁盘上的静态配置文件，修改后必须重启才能生效，缺乏灵活性；
2. OpenResty 基于 Nginx，打包了很多有用的模块和库，是一个高性能的 Web 开发平台；
3. OpenResty 的工作语言是 Lua，它小巧灵活，执行效率高，支持“代码热加载”；
4. OpenResty 的核心编程范式是“同步非阻塞”，使用协程，不需要异步回调函数；
5. OpenResty 也使用“阶段式处理”的工作模式，但因为在阶段里执行的都是 Lua 代码，所以非常灵活，配合 Redis 等外部数据库能够实现各种动态配置。

::: tip
tips test
:::

::: details
折叠详情块，在 IE/Edge 中不生效
:::
