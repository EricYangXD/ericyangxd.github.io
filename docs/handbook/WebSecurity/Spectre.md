---
title: Spectre
author: EricYangXD
date: "2022-03-02"
meta:
  - name: keywords
    content: Spectre
---

## 什么是 Spectre

如果一个漏洞很难构造，就算他能够造成再大的危害，可能也不会引起浏览器这么大的重视，那么我们今天的主角 Spectre，是又容易构造，而且造成的危害也很大的，利用 Spectre，你可以：

通过几行 JavaScript ，就可以读取到电脑/手机上的所有数据，浏览器中的网页可以读取你所有的密码，知道其他程序在干什么，这甚至不需要你写出来的程序是有漏洞的，因为这是一个计算机硬件层面上的漏洞。

想要理解 Spectre ，我们需要下面三个方面的知识：

### 理解什么是旁路攻击

啥是旁路（side-channel）呢？我们可以简单这样理解：假如在你的程序正常的通讯通道之外，产生了一种其他的特征，这些特征反映了你不想产生的信息，这个信息被人拿到了，你就泄密了。这个「边缘特征」产生的信息通道，就叫旁路。基于旁路的攻击，就称为旁路攻击。

### 理解内存的工作方式

计算机运行的时候，从存储设备加载程序进入 CPU，CPU 负责处理进行大量运算，这些运算需要对内存中的数据进行多次读取。然后把结果输出到我们的显示器等输出设备里面，这大概是一个计算机简单的工作原理。

内存要存储这么多信息，需要一个规范化的存储方式，我们可以把内存想像成一堆排列好的小的内存块，每个内存块里保存着一位信息。

另外，内存是有很多层的，CPU 去里面读一个数据是很慢的，所以我们又在 CPU 和 内存中建立了几级缓存，当我们取到一个被缓存过的数据时，速度会快一点。那当访问一个没被缓存过的数据时，数据会在缓存内存里创建一个副本，下次再访问到它就会很快。这就是内存大概的工作原理。

### 理解计算机的预测执行

当 CPU 运行的时候，会频繁的从内存中调取信息。但是读取内存很慢，CPU 为此要花费很长的时间空闲，只为了等待内存的数据。因此给 CPU 增加了可以推测下一步需要执行的命令的功能。比如对于 if 判断语句，CPU 不会等到得到判断结果后才执行，CPU 可以不等待内存返回，直接抢跑：跳过 if 判断直接执行里面的计算命令。

但是 CPU 执行需要非常小心，不能直接覆盖寄存器的值，从而真的改变程序的状态，一旦发现预测失败就立刻回滚改动。

### 攻击

直接访问要攻击的内存地址，CPU 会禁止访问。我们在要攻击的内存旁开辟一个小区域，利用数组下标越界，去访问这个小区域之外的内存，通常情况下， CPU 会阻止这一操作，抛出一个错误：“非法操作”，然后操作会被强制结束 ，然而我们可以再试图观测这个过程，我们看看是怎么做到的。

我们特别要求 CPU 对这段数据不要拷贝到缓存，只保留于内存，这是一段连续的内存区域。

我们在我们允许访问的内存范围内再次新建一个区域，可以叫工具箱。

假设我们执行的指令长这样，首先有个 if 判断语句`if(name === 'testtttt'){access Tools[A[x]]}`，一般来讲，CPU 执行会先无视这个判断，因为它需要等待内存返回 name 的值是不是等于 `testtttt`，因为有「预测执行」这样的技术，if 语句中的东西会被预先执行。

我们尝试读取 Tools 的第（A 的第 X 元素）个元素。假如我们读到的这个受害者内存中包含 3:这是我们不应该读取到的，但是我们可以通过预测执行做下面的事情：

CPU 执行了这个不应该被执行的命令后，CPU 认为它需要看一下 A[X] 的值是什么，这时 CPU 并未检查 A[X] 是否已经下标越界，因为 CPU 认为之后内核总会验证下标是否越界，如果越界就强制结束程序。

于是，预测执行就直接查询了 A[X] 的值，然后发现 A[X] = 3，也就是:`Tools[A[x]] = Tools[3]`，也就是我们实际内存中 Tools 存储的第四个元素 a，下面重点来了：CPU 访问到 a 后，将 a（即 Tools[3]） 放入了「高速缓存」！最后一步，就是遍历 Tool 中的每一个元素，我们发现访问前几个元素都有点慢，直到访问到第 3 个突然很快！因为第 3 个元素 a 在缓存中存储了一份！

当预测执行发现错误的时候，它就会回滚寄存器的变化，但是不会回滚高速缓存！

信息就这样的被泄漏了，因为访问第 3 个元素所需时间比其他要短！这也就是基于时间的旁路。

于是，我们知道 “受害者” 在内存的这个位置有个 3。

后面，我们可以把 Tools 这篇区域搞得更大，你就可以猜出其他更多的数据！当然，这就是实际去攻击需要考虑的失去了～

### 防御

#### 缓存推荐设置

1. 为了防止中间层缓存，建议设置：`Cache-Control: private`
2. 建议设置适当的二级缓存 key：如果我们请求的响应是跟请求的 Cookie 相关的，建议设置：Vary: Cookie

#### 禁用高分辨率计时器

要利用 Spectre，攻击者需要精确测量从内存中读取某个值所需的时间。所以需要一个可靠且准确的计时器。

浏览器提供的一个 `performance.now()` API ，时间精度可以精确到 5 微秒。作为一种缓解措施，所有主要浏览器都降低了 `performance.now()` 的分辨率，这可以提高攻击的难度。

获得高分辨率计时器的另一种方法是使用 `SharedArrayBuffer`。web worker 使用 Buffer 来增加计数器。主线程可以使用这个计数器来实现计时器。浏览器就是因为这个原因禁用了 SharedArrayBuffer。

#### rel="noopener"

浏览器推荐大家在打开不信任的外部页面时指定 `rel="noopener"` 。

#### 跨源开放者策略（COOP）

通过将 COOP 设置为 `Cross-Origin-Opener-Policy: same-origin`，可以把从该网站打开的其他不同源的窗口隔离在不同的浏览器 Context Group，这样就创建的资源的隔离环境。

#### 跨源嵌入程序政策（COEP）

启用 `Cross-Origin-Embedder-Policy: require-corp`，你可以让你的站点仅加载明确标记为可共享的跨域资源，或者是同域资源。

#### 跨域读取阻止（CORB）

即使所有不同源的页面都处于自己单独的进程中，页面仍然可以合法的请求一些跨站的资源，例如图片和 JavaScript 脚本，有些恶意网页可能通过 `<img>`元素来加载包含敏感数据的 JSON 文件。

如果没有 站点隔离 ，则 JSON 文件的内容会保存到渲染器进程的内存中，此时，渲染器会注意到它不是有效的图像格式，并且不会渲染图像。但是，攻击者随后可以利用 Spectre 之类的漏洞来潜在地读取该内存块。

跨域读取阻止（CORB）可以根据其 MIME 类型防止 balance 内容进入渲染器进程内存中。
