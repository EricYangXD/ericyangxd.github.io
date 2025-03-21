---
title: Web应用常见安全漏洞
author: EricYangXD
date: "2022-01-06"
---

## SQL 注入

- SQL 注入就是通过给 web 应用接口传入一些特殊字符，达到欺骗服务器执行恶意的 SQL 命令。
- 当使用外部不可信任的数据作为参数进行数据库的增、删、改、查时，如果未对外部数据进行过滤，就会产生 SQL 注入漏洞。

### 解决方案

- 不信任任何外部输入

1. 对任何外部输入都进行过滤，替换特殊字符，然后再进行数据库的增、删、改、查
2. 适当的权限控制、不曝露必要的安全信息和日志也有助于预防 SQL 注入漏洞

## XSS 攻击

- XSS 攻击全称跨站脚本攻击（Cross-Site Scripting），简单的说就是攻击者通过在目标网站上注入恶意脚本并运行，获取用户的敏感信息如 Cookie、SessionID 等，影响网站与用户数据安全。
- 当攻击者通过某种方式向浏览器页面注入了恶意代码，并且浏览器执行了这些代码。

### 解决方案

- 一个基本的思路是渲染前端页面（不管是客户端渲染还是服务器端渲染）或者动态插入 HTML 片段时，任何数据都不可信任，都要先做 HTML 过滤，然后再渲染。
- 输入验证和输出编码：对用户输入进行严格的验证，将用户输入的内容输出到 HTML 页面之前，对内容进行适当的编码：
  - HTML 编码：将 <、>、& 等特殊字符转换为 HTML 实体。
  - JavaScript 编码：在 JavaScript 代码中使用 JSON.stringify 等方式处理字符串。
  - URL 编码：使用 encodeURIComponent 编码 URL 参数。
- 使用 Content Security Policy (CSP)：CSP 是一种安全特性，可以帮助检测和减轻某些类型的攻击，包括 XSS。通过配置 CSP，您可以限制哪些资源可以被加载和执行。例如，您可以禁止执行内联脚本，并只允许加载来自特定来源的脚本。
- 避免内联 JavaScript：避免在 HTML 中直接编写内联 JavaScript 代码。将所有 JavaScript 代码放在外部文件中，并通过 `<script>` 标签引入。
- HTTPOnly 和 Secure Cookie：设置 cookie 的 HttpOnly 属性，可以防止 JavaScript 访问 cookie，从而降低 XSS 攻击的风险。设置 Secure 属性，确保 cookie 仅在 HTTPS 连接中发送。
- 使用经过安全审计的 JavaScript 库和框架，避免使用已知有安全漏洞的库。

## CSRF 攻击

- CSRF 攻击全称跨站请求伪造（Cross-site Request Forgery），简单的说就是攻击者盗用了你的身份，以你的名义发送恶意请求--诱导用户去访问另一个网站的接口，伪造请求。

### 解决方案

- 防止 CSRF 攻击需要在服务器端入手，基本的思路是能正确识别是否是用户发起的请求。
- 严格的跨域限制 （验证 Referer 和 Origin 头：请求来源） + 关键操作/接口使用验证码，二次验证。
- 对于需要保护的 cookie，设置 SameSite，禁止跨域传递 cookie：将其设置为 Strict 或 Lax，可以防止浏览器在跨站请求中发送该 cookie。
- 使用 CSRF Token：为每个用户会话生成一个唯一的 CSRF Token，并在表单提交时将其包含在请求中。服务器在处理请求时验证该 Token 的有效性。只有在 Token 验证通过的情况下，才允许执行请求。
- 验证 Referer 和 Origin 头：在处理敏感请求时，检查请求的 Referer 或 Origin 头，确保请求来源于受信任的来源。
- 使用安全的 HTTP 方法：对于状态更改的请求（如 POST、PUT、DELETE），确保使用 CSRF Token 并限制这些请求的来源。尽量避免使用 GET 请求进行状态更改。

## DDoS 攻击

- DoS 攻击全称拒绝服务（Denial of Service），简单的说就是让一个公开网站无法访问，而 DDoS 攻击（分布式拒绝服务 Distributed Denial of Service）是 DoS 的升级版。

- 攻击者不断地提出服务请求，让合法用户的请求无法及时处理，这就是 DoS 攻击。

- 攻击者使用多台计算机或者计算机集群进行 DoS 攻击，就是 DDoS 攻击。

### 常见攻击方式

1. 普通攻击：客户端伪造 IP，频繁对服务器发起请求
2. 反射攻击：通过第三方机器向被攻击服务器发起大规模请求
3. 放大攻击：DNS 请求返回的数据远大于请求的数据且通常使用 UDP 协议做 DNS 查询，攻击者不断地对 DNS 服务器发起查询请求，并把源地址改为被攻击的服务器地址，使得 DNS 查询的数据都返回给被攻击服务器
4. 攻击服务器连接资源
   1. TCP 洪水：发起大量 TCP 连接从而占满 TCP 连接表，从而无法响应和建立正常的 TCP 连接
   2. SYN 洪水：利用 tcp 的重传机制，只发送 SYN 而不做后续响应，占据并浪费服务器资源
   3. HTTP 洪水：比如利用网站的搜索功能，生成大量关键词去调用搜索接口，消耗服务器资源
   4. RST 洪水：伪造 IP 发送大量 RST 数据盲打，一旦 IP 和其他的某些配置与正常用户的匹配上，就能切断正常用户和服务器之间的连接

### 解决方案

- 清理僵尸网络
- 反射治理：防止 DDoS 攻击的基本思路是限流，限制单个用户的流量（包括 IP 等，黑名单白名单）、硬件预防--阿里云 WAF、RRL 响应速率限制。
- 基于路由的分布式包过滤--治理地址伪造
- 流量稀释：CDN
- 流量清洗：在服务端和客户端之间接入流量清洗设备，只有正常的流量才能发送到服务端

## XXE 漏洞

- XXE 漏洞全称 XML 外部实体漏洞（XML External Entity），当应用程序解析 XML 输入时，如果没有禁止外部实体的加载，导致可加载恶意外部文件和代码，就会造成任意文件读取、命令执行、内网端口扫描、攻击内网网站等攻击。
- 这个只在能够接收 XML 格式参数的接口才会出现。

### 解决方案

- 禁用外部实体
- 过滤用户提交的 XML 数据

## JSON 劫持

- JSON 劫持（JSON Hijacking）是用于获取敏感数据的一种攻击方式，属于 CSRF 攻击的范畴。

- 一些 Web 应用会把一些敏感数据以 json 的形式返回到前端，如果仅仅通过 Cookie 来判断请求是否合法，那么就可以利用类似 CSRF 的手段，向目标服务器发送请求，以获得敏感数据。

### 解决方案

- X-Requested-With 标识
- 浏览器 JSON 数据识别
- 禁止 Javascript 执行 JSON 数据

## 暴力破解

- 这个一般针对密码而言，弱密码（Weak Password）很容易被别人（对你很了解的人等）猜到或被破解工具暴力破解。

### 解决方案

- 密码复杂度要足够大，也要足够隐蔽
- 限制尝试次数
- 增加校验，两步验证等

## HTTP 报头追踪漏洞

- HTTP/1.1（RFC2616）规范定义了 HTTP TRACE 方法，主要是用于客户端通过向 Web 服务器提交 TRACE 请求来进行测试或获得诊断信息。

- 当 Web 服务器启用 TRACE 时，提交的请求头会在服务器响应的内容（Body）中完整的返回，其中 HTTP 头很可能包括 Session Token、Cookies 或其它认证信息。攻击者可以利用此漏洞来欺骗合法用户并得到他们的私人信息。

### 解决方案

- 禁用 HTTP TRACE 方法。

## 目录遍历漏洞

- 攻击者向 Web 服务器发送请求，通过在 URL 中或在有特殊意义的目录中附加 ../、或者附加 ../ 的一些变形（如 ..\ 或 ..// 甚至其编码），导致攻击者能够访问未授权的目录，以及在 Web 服务器的根目录以外执行命令。

## 命令执行漏洞

- 命令执行漏洞是通过 URL 发起请求，在 Web 服务器端执行未授权的命令，获取系统信息、篡改系统配置、控制整个系统、使系统瘫痪等。

## 文件上传漏洞

- 如果对文件上传路径变量过滤不严，并且对用户上传的文件后缀以及文件类型限制不严，攻击者可通过 Web 访问的目录上传任意文件，包括网站后门文件（webshell），进而远程控制网站服务器。

### 解决方案

- 在开发网站及应用程序过程中，需严格限制和校验上传的文件，禁止上传恶意代码的文件
- 限制相关目录的执行权限，防范 webshell 攻击

## 业务漏洞

- 一般业务漏洞是跟具体的应用程序相关，比如参数篡改（连续编号 ID / 订单、1 元支付）、重放攻击（伪装支付）、权限控制（越权操作）等。

## 点击劫持

- click jackiing：通过在页面上增加一个透明的 iframe 蒙层，诱导用户去点击，让用户误以为进行了正常的操作，实际点击的是 iframe 中的按钮，然后利用 cookie 或者别的东西做一些有害的操作。

### 解决方案

预防：让 iframe 不能跨域加载

1. 在网站上判断`top.location.hostname === self.location.hostname`，如果不同，则`top.location.href = self.location.href`
2. Response Headers 中增加：`X-Frame-Options: sameorigin`
