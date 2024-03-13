---
title: Nginx基础知识
author: EricYangXD
date: "2022-05-09"
meta:
  - name: keywords
    content: nginx,Nginx,NGINX
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

1. 正向代理：局域网中的用户想要直接访问网络是不可行的，只能通过代理服务器（Server）来访问，这种代理服务就被称为正向代理。代理服务器代理的是客户端。客户端向代理服务器发送请求，代理服务器再将请求转发给目标服务器，并将服务器的响应返回给客户端。正向代理可以隐藏客户端的真实 IP 地址，提供匿名访问和访问控制等功能。它常用于跨越防火墙访问互联网、访问被封禁的网站等情况。
2. 反向代理：客户端无法感知代理，因为客户端访问网络不需要配置，只要把请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据，然后再返回到客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器 IP 地址。代理服务器代理的是真正的服务端。客户端并不直接访问后端服务器，而是通过反向代理服务器来获取服务。反向代理可以实现负载均衡、高可用性和安全性等功能。它常用于网站的高并发访问、保护后端服务器、提供缓存和 SSL 终止等功能。

### 负载均衡

负载均衡：是高可用网络基础架构的关键组件，通常用于将工作负载分布到多个服务器来提高网站、应用、数据库或其他服务的性能和可靠性。

### 动静分离

常用的 Web 服务器有：Tomcat、Nginx。动静分离即把静态资源（如 html、css、图片等）放在一台服务器，把动态资源（后端服务等）放在另外的服务器。

1. 直接为静态内容设置一个别名或根目录：

```bash
location ~* .(jpg|jpeg|png|gif|ico|css|js)$ {
    root /path/to/static/files;
    expires 30d;  # 设置缓存时间
}
```

所有的静态文件都被存放在/path/to/static/files 目录下。expires 指令设置了静态文件的缓存时间。 2. 使用 alias 别名指定静态文件的实际路径：

```bash
location /static/ {
    alias /path/to/static/files/;
}
```

URL 中的`/static/`会映射到文件系统的`/path/to/static/files/`。 3. 代理动态内容将请求代理到后端的应用服务器，如 Tomcat、uWSGI 等。：

```bash
location / {
    proxy_pass http://backend_server_address;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

- 确保你的静态文件路径配置正确，避免 404 错误。
- 使用 expires 指令为静态内容设置缓存，这可以减少服务器的负载并提高页面加载速度。
- 动静分离不仅可以提高服务器的响应速度，还可以减少后端服务器的压力，因为静态文件通常由 Nginx 直接处理，而不需要代理到后端服务器。

### 常用的命令

- 查看版本：`./nginx -v`
- 启动：`./nginx`
- 快速关闭：`./nginx -s stop`(推荐) 或 有序停止`./nginx -s quit`
- 重新加载 nginx 配置：`./nginx -s reload`
- 直接杀死 nginx 进程：`killall nginx`

### Nginx 的配置文件

配置文件分为三个模块：

- 全局块：从配置文件开始到 events 块之间，主要是设置一些影响 nginx 服务器整体运行的配置指令。（按道理说：并发处理服务的配置时，值越大，可支持的并发处理量越多，但此时会受到硬件、软件等设备等的制约）
- events 块：影响 nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 workprocess 下的网络连接进行序列化，是否允许同时接收多个网络连接等等
- http 块：如反向代理和负载均衡都在此配置

#### location 的匹配规则

共有四种方式：`location[ = | ~ | ~* | ^~ ] uri {...}`:

1. `=` ：精确匹配，用于不含正则表达式的 url 前，要求字符串与 url 严格匹配，**完全相等**时，才能停止向下搜索并处理请求。
2. `^~`：用于不含正则表达式的 url 前，要求 nginx 服务器找到表示 url 和字符串**匹配度最高**的 location 后，立即使用此 location 处理请求，而不再匹配。表示 uri 以某个字符串开头
3. `~` ：最佳匹配，用于表示 url 包含正则表达式，并且区分大小写，**匹配到就停止**
4. `~*`：与~一样，只是不区分大小写，**匹配到就停止**
5. `/`：不使用上面四种时，表示**通用匹配**，每个 URI 都能匹配成功
6. `!~`：区分大小写，不匹配
7. `!~*`：不区分大小写，不匹配
8. `uri`：匹配的网站地址
9. `{...}`：匹配 uri 后要执行的配置段

注意:

- 如果 url 包含正则表达式，则不需要 `~` 作为开头表示
- nginx 的匹配具有优先顺序，一旦匹配上就会立马退出，不再进行向下匹配

location 的定义分为两种：

- 前缀字符串（prefix string）
- 正则表达式（regular expression），具体为前面带 `~*` 和 `~` 修饰符的

而匹配 location 的顺序为：

1. 检查使用前缀字符串的 locations，在使用前缀字符串的 locations 中选择最长匹配的，并将结果进行储存
2. 如果符合带有 `=` 修饰符的 URI，则立刻停止匹配
3. 如果符合带有 `^~` 修饰符的 URI，则也立刻停止匹配。
4. 然后按照定义文件的顺序，检查正则表达式，匹配到就停止
5. 当正则表达式匹配不到的时候，使用之前储存的前缀字符串

再总结一下就是：

1. 在顺序上，前缀字符串顺序不重要，按照匹配长度来确定，正则表达式则按照定义顺序。
2. 在优先级上，`=` 修饰符最高，`^~` 次之，再者是`正则`，最后是`前缀字符串`匹配。
3. 如果没写这个前缀匹配，那么如果匹配到之后，会先暂存当前命中的匹配，然后继续向下匹配，如果有其他匹配命中，就用其他匹配，否则才会用这个暂存的匹配。

#### server_name 的匹配顺序

`server_name`的匹配顺序是怎样的呢？

按照如下顺序匹配--匹配顺序: -> 精确匹配 -> `*`在前的域名 -> `*`在后的域名 -> 按文件中的顺序匹配 -> `default server`:第一个，listen 指定 default。

#### 配置 rewrite

1. 语法如下：

```bash
指令语法：rewrite regex replacement[flag];
默认值：none
应用位置：server、location、if
rewrite是实现URL重定向的重要指令，他根据regex(正则表达式)来匹配内容跳转到replacement，结尾是flag标记.
```

| flag 标记 | 说明                                                 |
| --------- | ---------------------------------------------------- |
| last      | 本条规则匹配完成后继续向下匹配新的 location URI 规则 |
| break     | 本条规则匹配完成后终止，不再匹配任务规则             |
| redirect  | 返回 302 临时重定向                                  |
| permanent | 返回 301 永久重定向                                  |

2. 重定向：

- 返回 code:

```bash
location / {
    return 301 https://www.xxxx.com$request_uri;
}
```

- 通过$request_uri 变量匹配所有的 URI:

```bash
rewrite ^ https://www.xxxx.com$request_uri? permanent;
```

- 通过正则匹配所有的 URI 后再去掉开头第一个/(反斜线):

```bash
rewrite ^/(.*)$ https://www.xxxx.com/$1;
```

- 与 if 指令结合

```bash
server {
    listen       80;
    server_name  test1.net test2.net;
    if ($host != 'test1.net' ) {
        rewrite ^/(.*)$ http://www.baidu.net/$1 permanent;
    }
}
```

3. 查看 rewrite 日志: `rewrite_log on;`

#### 配置 proxy/反向代理

1. url 参数规则

   - url 必须以 http 或者 https 开头，接下来是域名、ip、unix socket 或者 upstream 名字，都可以就端口。后面是可选的 uri
   - url 中是否携带 uri，结果也不一样，如果在 proxy_pass 后面的 url 加/，相当于是绝对根路径，则 nginx 不会把 location 中匹配的路径部分代理走；如果没有/，则会把匹配的路径部分给代理走。
   - Url 参数中可以携带变量`proxy_pass http://$host$uri;`

2. 可以配合 rewrite break 语句

```bash
location /nameb/ { 
    rewrite /nameb/([^/]+) /test?nameb=$1 break;
    proxy_pass http://127.0.0.1:8801/; 
}
```

3. 要配置 Nginx 作为反向代理，您需要使用 `location` 块中的 `proxy_pass` 指令
   - 当使用 proxy_pass 指令时，确保后端服务器是可用的，否则 Nginx 将返回错误。
   - 使用 proxy_set_header 确保后端服务器接收到正确的请求头。
   - 如果后端服务器和 Nginx 在不同的机器上，确保网络连接是稳定的。

#### 正则表达式

- `~`: 表示大小写敏感的正则匹配；
- `^`: 匹配字符串的开始；
- `{.+}`: 换行符以外的任意字符重复一次或多次；
- `()`: 分组与取值；
- `:`: 表示转义；
- `serno`: 设置提取的变量；`server_name ~^my(?<serno>.+).mydomain.com$;`
- `$`: 匹配字符串的结束；

#### 单页面应用刷新 404 问题

```bash
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 配置跨域请求

```bash
server {
    listen   80;
    location / {
        # 服务器默认是不被允许跨域的。
        # 配置`*`后，表示服务器可以接受所有的请求源（Origin）,即接受所有跨域的请求
        add_header 'Access-Control-Allow-Origin' '*';
        # 允许的请求方法。
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        # 允许的请求头。
        add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        # 允许浏览器缓存预检请求的结果，单位为秒。
        add_header 'Access-Control-Max-Age' 1728000;
        # 允许浏览器在实际请求中携带用户凭证。
        add_header 'Access-Control-Allow-Credentials' 'true';
        # 设置响应类型为JSON。
        add_header 'Content-Type' 'application/json charset=UTF-8';
        # 发送"预检请求"时，需要用到方法 OPTIONS ,所以服务器需要允许该方法
        # 给OPTIONS 添加 204的返回，是为了处理在发送POST请求时Nginx依然拒绝访问的错误
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### root 与 alias 的区别

1. root 是直接拼接 root + location 而 alias 是用 alias 替换 location
2. server 和 location 中的 root:
   - server 和 location 中都可以使用 root
   - 如果两者都出现，优先级就是就近原则，如果 location 中能匹配到，就是用 location 中的 root 配置，忽略 server 中的 root，当 location 中匹配不到的时候，则使用 server 中的 root 配置。

### 开启 gzip

Nginx 内置了 ngx_http_gzip_module 模块，该模块会拦截请求，并对需要做 Gzip 压缩的文件做压缩。因为是内部集成，所以我们只用修改 Nginx 的配置，就可以直接开启。

```bash
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
  location / {
    # 配置下nginx，告诉服务器，当我们访问的路径资源不存在的时候，默认指向静态资源index.html，配合history路由模式
    try_files $uri $uri/ /index.html;
  }
  location ^~ /my-vuepress-blog/ {
    alias /home/www/website/ts/;
  }
  location / {
    alias /home/www/website/ts/;
    index index.html;
  }
  # 这里是新增的 gzip 配置
  gzip on; #开启gzip压缩输出
  gzip_min_length 1k; #最小压缩文件大小
  gzip_comp_level 6; #压缩等级
  gzip_buffers 4 16k; #压缩缓冲区
  gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）

  # 设置什么类型的文件需要压缩
  gzip_types application/atom+xml application/geo+json application/javascript application/x-javascript application/json application/ld+json application/manifest+json application/rdf+xml application/rss+xml application/xhtml+xml application/xml font/eot font/otf font/ttf image/svg+xml text/css text/javascript text/plain text/xml;

  # 用于设置使用Gzip进行压缩发送是否携带“Vary:Accept-Encoding”头域的响应头部
  # 主要是告诉接收方，所发送的数据经过了Gzip压缩处理
  gzip_vary on;
}
```

1. gzip ：是否开启 gzip 模块 on 表示开启 off 表示关闭，默认是 off
2. gzip_min_length：设置压缩的最小文件大小，小于该设置值的文件将不会压缩
3. gzip_comp_level：压缩级别，从 1 到 9，默认 1，数字越大压缩效果越好，但也会越占用 CPU 时间，这里选了一个常见的折中值
4. gzip_types：进行压缩的文件类型
5. gzip_vary：设置是否携带"Vary:Accept-Encoding"的响应头部。
6. gzip_buffers：处理请求压缩的缓冲区数量和大小。
7. gzip_disable：选择性地开启和关闭 gzip 功能，基于客户端的浏览器标志。
8. gzip_http_version：针对不同的 http 协议版本，选择性地开启和关闭 gzip 功能。
9. gzip_proxied：设置是否对 nginx 服务器对后台服务器返回的结果进行 gzip 压缩。

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

## 缓存问题

### 前端缓存-前端发布新代码后的浏览器缓存问题

解决方法

1. 用户自行清理浏览器缓存。

- 优点：清除浏览器缓存后可达到效果。
- 缺点：影响用户体验

2. 使用禁用缓存标签，实现禁用浏览器缓存。（优先级略低）

- 优点：可达到效果。
- 缺点：每次请求页面都要重新请求，我们还是希望有缓存的

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Cache" content="no-cache" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

3. 为 js 和 css 文件添加版本号。

- 优点：可达到效果。
- 缺点：给所有的静态资源都添加版本号参数，这个参数可以是时间戳或者随机数。处理方式的代码如下：

```html
<link
  rel="stylesheet"
  type="text/css"
  href="${pageContext.request.contextPath}/static/plugins/layui-v2.5.5/layui/css/layui.css?v=20200110052406" />
<link
  rel="stylesheet"
  type="text/css"
  href="${pageContext.request.contextPath}/static/css/style.css?v=20200110052406" />
<link
  rel="stylesheet"
  type="text/css"
  href="${pageContext.request.contextPath}/static/css/addStyle.css?v=20200110052406" />
<link
  rel="stylesheet"
  type="text/css"
  href="${pageContext.request.contextPath}/static/css/template/addStyle.css?v=20200110052406" />
```

4. 修改 nginx 配置。（满足以下条件后有缓存可以修改 nginx 配置文件）背景：

- 使用 nginx 做代理
- 使用 webpack 等打包出一个唯一的入口文件 index.html，或者其他方式的入口 html 文件
- 入口 html 文件中 js 已经使用 hash 后缀方式加载
- 缺点：需要前端人员会配置 nginx

```bash
location ~ .*\.(htm|html)?$ {
  # 原来这样设置的不管用
  # expires -1;
  # 现在改为，增加缓存
  add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
  access_log on;
}
```

### Nginx 缓存问题

每次修改了动态的内容，缓存却没过期，这样就必须手动清理缓存了。于是尝试使用`nginx`+`ngx_cache_purge`模块。

需要下载 NGINX 源码和模块源码进行编译，参考[这里](https://www.henghost.com/zixun/7981/)

### Nginx 同域名不同前缀，访问不同前后端项目

在一台 NGINX 机器上通过多端口多域名来配置实现同时跑多个项目。

```bash
server {
  # 这里默认监听80端口，可根据项目需要自行设置需要监听的端口号
  listen 80;
  server_name 此处填写项目发布的域名或者ip地址;
  # listen       80 default_server;
  # listen       [::]:80 default_server;
  # server_name  _;
  # root         /usr/share/nginx/html;
  # Load configuration files for the default server block.
  # include /etc/nginx/default.d/*.conf;

  location / {
    root 此处填写前端项目文件路径（默认访问的前端项目一的路径）;
    index index.html index.htm;
  }
  # eg.
  location / {
    root /etc/nginx/html/;
    index index.html;
  }

  # 这里因为每个server只能有一个root 所以在根目录默认有root之后，
  # 可以通过alias来配置其他文件路径
  # ex: http://www.xxx.com:xxx/unst/#/xxx,
  # 将/unst这个前置在页面跳转时加入url的#号之前即可
  location /unst {
    alias 此处填写前端项目文件路径（前端项目二的路径）;
    index index.html index.htm;
  }

	# 前端项目一对应的后端服务一的跳转配置
	location /st/ {
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://127.0.0.1:8089;
  }

  # 前端项目二对应的后端服务二的跳转配置
  location /un/ {
    proxy_pass http://127.0.0.1:8091;
  }
}
```

## Nginx 日志

Nginx 存储主要活动日志的目录可能位于 `/var/log/nginx/`或 `/usr/local/nginx/logs/` 这两个位置。

## CentOS 设置 Nginx 开机启动

1. 在系统服务目录里创建`nginx.service`文件，`vi /usr/lib/systemd/system/nginx.service`，内容如下：

```sh
[Unit]
Description=The nginx HTTP and reverse proxy server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/run/nginx.pid
# Nginx will fail to start if /run/nginx.pid already exists but has the wrong
# SELinux context. This might happen when running `nginx -t` from the cmdline.
# https://bugzilla.redhat.com/show_bug.cgi?id=1268621
ExecStartPre=/usr/bin/rm -f /run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/usr/sbin/nginx -s quit
KillSignal=SIGQUIT
TimeoutStopSec=5
KillMode=mixed
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

2. 设置开机自启动: `systemctl enable nginx.service`
3. 查看 nginx 状态: `systemctl status nginx.service`
4. 杀死 nginx 重启 nginx: `pkill -9 nginx`,`ps aux | grep nginx`,`systemctl start nginx`

## 静态资源优化

为了提高静态资源的传输效率，Nginx 提供了以下三个主要的优化指令：

- `sendfile`: 用于开启高效的文件传输模式。它通过调用系统内核的 `sendfile` 函数来实现，从而避免了文件的多次拷贝，同时减少了用户态和内核态之间的切换，从而提高了静态文件的传输效率。
- `tcp_nopush`: 当 `sendfile` 开启时，`tcp_nopush` 也可以被启用。它的主要目的是提高网络数据包的传输效率。
- `tcp_nodelay`: 只有在 `keep-alive` 连接开启时，`tcp_nodelay` 才能生效。它的目的是提高网络数据包的实时性。

## 防盗链

防盗链是指防止其他网站直接链接到你的网站资源（如图片、视频等），从而消耗你的服务器带宽。Nginx 提供了一个非常方便的模块——`ngx_http_referer_module`，用于实现防盗链功能。

### 基本的防盗链配置：

```bash
location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked www.example.com example.com *.example.net;

    if ($invalid_referer) {
        return 403;
    }
}
```

### 使用错误图片代替原图片

```bash
location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked www.example.com example.com *.example.net;

    if ($invalid_referer) {
        rewrite ^/.*$ /path/to/error/image.jpg;
    }
}
```

### 注意事项：

- 防盗链配置可能会影响搜索引擎的爬虫，因此在实施防盗链策略时要小心。
- 如果你的网站使用了 CDN，确保 CDN 的服务器也在 valid_referers 列表中，否则 CDN 可能无法正常工作。
- 为了确保防盗链配置正确，你应该在生产环境之前在测试环境中进行充分的测试。

## 内置变量

nginx 的配置文件中可以使用的内置变量以美元符$开始。其中，大部分预定义的变量的值由客户端发送携带。

```bash
$args 请求行中的参数，同$query_string
$content_length 请求头中的Content-length字段
$content_type 请求头中的Content-Type字段
$document_root 当前请求在root指令中指定的值
$host 请求行的主机名，或请求头字段 Host 中的主机名
$http_user_agent 客户端agent信息
$http_cookie 客户端cookie信息
$limit_rate 可以限制连接速率的变量
$request_method 客户端请求的动作，如GET或POST
$remote_addr 客户端的IP地址
$remote_port 客户端的端口
$remote_user 已经经过Auth Basic Module验证的用户名
$request_filename 当前请求的文件路径
$scheme HTTP方法（如http，https）
$server_protocol 请求使用的协议，如HTTP/1.0或HTTP/1.1
$server_addr 服务器地址
$server_name 服务器名称
$server_port 请求到达服务器的端口号
$request_uri 包含请求参数的原始URI
$uri 不带请求参数的当前URI
$document_uri 与$uri相同
```

### 本地nginx

1. 安装：`brew install nginx`
2. 安装位置：`/usr/local/Cellar/nginx/1.25.3`
3. 配置文件：`/usr/local/etc/nginx/nginx.conf`
4. 重启（不一定有用）：`brew services restart nginx`