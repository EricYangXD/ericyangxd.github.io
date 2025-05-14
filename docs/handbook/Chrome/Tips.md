---
title: Chrome DevTools
author: EricYangXD
date: "2022-11-30"
meta:
  - name: keywords
    content: Chrome DevTools
---

## 记录

### Local Overrides

可以使用本地资源覆盖网页所使用的资源，在「Overrides」中，比如将本地的 css 文件夹映射到网络，那么在 Chrome 开发者功能里对 css 样式的修改都会直接改动本地文件，页面重新加载也是使用本地资源，达到持久化的效果。[详见](https://developer.chrome.com/blog/new-in-devtools-65/#overrides)

### 截图

Chrome 浏览器内置了截图功能，可以在浏览器开发者工具中使用 `Ctrl+Shift+P`（Windows）或者`Command+Shift+P`（Mac）快捷键打开搜索来查找`screenshot`

### 保留日志

在设置中勾选 Preserve log 选项以保留控制台中的日志

### 代码覆盖率

打开设置，在`Experiments`中勾选`Record coverage while performance tracing`选项。在面板下方的`Coverage`面板中点击红色按钮以记录页面的代码覆盖率：代码覆盖率使用动态分析法来收集代码运行时的覆盖率，让开发者知道有代码在页面上真正的使用。动态分析是指在应用运行状态下收集代码执行数据的过程，换句话说，覆盖率数据就是在代码执行过程中通过标记收集到的。

### 显示重绘

在浏览器的开发者工具中可以通过开启显示重绘选项以查看页面在执行操作时哪些元素会发生重绘。在控制台右上角三个点中的 `More tools` 选项中开启 `Rendering` 选项卡：开启 `Rendering`（渲染）选项后，开启 `Paint flashing`：当刷新页面时，显示**绿色的区域**就是重新绘制区域。

### 检查动画

在控制台右上角三个点中的 `More tools` 选项中开启 `Animations` 选项卡：当页面的动画执行时，就会在时间轨道上查看所有的动画，点击其中一个动画可以懂得执行过程以及时间轴：我们可以在时间轴上定位到任一时刻的动画帧，也可以拖动左右两端的圆点来修改动画的延迟和周期，修改之后可以在属性面板看到对应的 CSS 样式。

### 全局搜索代码

点击开发者工具右上角的三个点，点击 Search 选项，在 Search 面板中搜索所需关键字即可，点击搜索结果即可跳到对应文件的代码行

### 事件监听器的断点

有时应用会在用户发生交互时出现问题，这时我们就可以添加事件监听器添加断点来捕获这些事件以检查交互时的问题。可以在`Source`面板右侧的`Event Listener Breakpoints`中勾选相应的事件

### DOM 操作的断点

当页面的内容发生变化时，如果想要知道是哪些脚本影响了它，就可以给 DOM 设置断点。我们可以右键点击需要设置断点的 DOM 元素，在弹出的菜单中点击`Break on`以选择合适的断点。

Break on 中有三个选项：

- Subtree Modifications：子节点（内容、属性）修改通知，常用在子节点内容发生变化后，来定位源码；
- Attributes Modifications：当前节点的属性修改通知，常用在节点的 className 等属性被修改后，来定位源码了；
- Node Removal：当前节点移动时通知，常用在节点被移除时，定位源码。

### 异步请求的断点

XHR breakpoints 可以用于异步请求的断点，点击加号即可添加断点规则，输入请求 的 URL 地址（片段），会在请求地址包含对应字符串的异步请求发出的位置自动停止：

### CSS Overview

在 Chrome 的管理面板中，开启 `CSS Overview` 面板之后，就可以查看当前网站的样式信息了，包括颜色信息、字体信息、媒体查询等。当我们需要优化页面的 CSS 时，这个功能就派上用场了。除此之外，还可以使用该功能方便地查看其他优秀网站的样式信息。

默认情况下，该面板是不开启的，可以通过以下步骤来开启此功能：

- 在任意页面打开 Chrome 浏览器的 DevTools；
- 单击`更多选项` -> `More tools` -> `CSS Overview`。

那该如何使用 `CSS Overview` 面板呢？很简单，只需要点击 `Capture overview` 按钮来生成页面的 `CSS overview`报告即可。如果想重新运行`CSS Overview`，只需点击左上角的清除图标，然后再点击 `Capture overview` 按钮即可。

`CSS Overview` 报告主要由五部分组成：

1. `Overview summary`： 页面 CSS 的高级摘要
2. `Colors`： 页面中的所有颜色。颜色按背景颜色、文本颜色等用途分组。它还显示了具有低对比度问题的文本。
3. `Font info`：字体信息， 页面中的所有字体及其出现，按不同的字体大小、字体粗细和行高分组。与颜色部分类似，可以单击以查看受影响元素的列表。
4. `Unused declarations`： 未使用的声明，包含所有无效的样式，按原因分组。
5. `Media queries`： 媒体查询，页面中定义的所有媒体查询，按出现次数最高的排序。单击可以查看受影响元素的列表。

### CSP 违规断点

Chrome DevTools CSP 违规断点可以捕捉到与 CSP 违规有关的可能的异常，并在代码中指出这些异常。启用该功能将为应用程序增加一个额外的安全层，减少跨站脚本（XSS）等漏洞。当遇到有安全问题的代码时，Chrome DevTools 甚至会显示如何修复改问题。

通过以下步骤来开启此功能：

1. 在任意页面打开 Chrome 浏览器的 DevTools；
2. 点击右上角`设置`图标 -> 选中左侧 `Experiments` -> 勾选 `Show CSP Violations view`；
3. 重启浏览器的 DevTools；
4. 在 `CSP Violations Breakpoints` 下选择 `Trusted Type Violations` 即可。

### 新的字体编辑器工具

Chrome DevTools 提供了一个实验性的字体编辑器工具，可以用来改变字体设置。可以用它来改变字体、大小、粗细、行高、字符间距，并实时看到变化。

通过以下步骤来开启此功能：

1. 在任意页面打开 Chrome 浏览器的 DevTools；
2. 点击右上角设置图标 -> 选中左侧 `Experiments` -> 勾选 `Enable New Font Editor Tools within Styles Pane`；
3. 重启浏览器的 DevTools；
4. 选择 HTML 元素，其中包括想改变的字体，点击字体图标即可。

### 双屏模式

通过启用双屏模式，可以在 Chrome DevTools 模拟器的双屏设备上调试你的 web 应用。这对于开发要适配折叠屏手机的应用是非常有用的。

通过以下步骤来开启此功能：

1. 在任意页面打开 Chrome 浏览器的 DevTools；
2. 点击右上角设置图标 -> 选中左侧 `Experiments` -> 勾选 `Emulation: Support dual-screen mode`；
3. 重启浏览器的 DevTools；
4. ① 切换到移动设备调试 -> ② 选择一个双屏设备 -> ③ 点击上方的切换双屏模式。

### 完整的可访问性树视图

通过 Chrome DevTools Accessibility Tree，可以检查为每个 DOM 元素创建的可访问性对象。这项功能与 Elements 选项卡相似，但使用它可以深入探索应用的更多可访问性细节。

通过以下步骤来开启此功能：

1. 在任意页面打开 Chrome 浏览器的 DevTools；
2. 点击右上角设置图标 -> 选中左侧 `Experiments` -> 勾选 `Enable the Full accessibility tree view in the Elements pane`；
3. 重启浏览器的 DevTools；
4. 在 Elements 面板中点击右上角的无障碍按钮，将元素视图模式切换为无障碍树视图。

## Chrome 保存密码漏洞

![Chrome保存密码漏洞](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/WechatIMG389.jpeg)

## 浏览器通信方式

每个浏览器标签页通常被视为一个独立的进程，而不是一个线程。这种多进程架构被称之为多进程浏览器，谷歌浏览器就是采用这种方式。主要目的是提高浏览器的稳定性、安全性和性能。在多进程浏览器中，每个标签页都独立运行在独立的进程中，这样一旦一个标签页崩溃或遇到问题，不会影响其他标签页和浏览器本身的稳定性。而每个进程都有属于自己的内存。在多进程浏览器中，不同标签页之间的通信是通过进程间通信 IPC 机制来实现的。IPC 是操作系统提供的一种机制，允许不同进程之间交换数据和消息，从而实现协同工作。

在操作系统中，常见的几种通信方式：

1. 基于管道的通信：

   - 管道是一种半双工的通信机制，可用于同一父进程与其子进程之间通信，或者用于同一计算机上的不同进程之间通信。
   - 命名管道提供了进程间进行双向通信的能力。可以被多个进程打开和使用。其中一个进程将数据写入管道，而另一个进程则可以从管道中读取这些数据。命名管道通常用于在不相关的进程之间传递数据，比如客户端和服务器之间的通信。
   - 匿名管道是一种用于单向通信的机制，仅用于具有父子关系的进程之间。它只能在创建时通过操作系统提供的机制进行传递。匿名管道在创建时自动建立，并且只能用于具有亲缘关系的进程之间的通信。其中一个进程将数据写入管道的写端，而另一个进程则从管道的读端读取这些数据。

2. 消息队列： 消息队列允许进程通过将消息放入队列中来进行通信。进程可以从队列中接收消息，实现异步通信。消息队列适用于不需要直接的点对点连接的场景，而且可以在不同计算机之间通信。
3. 共享内存： 共享内存允许多个进程访问同一块物理内存区域，从而实现高效的数据共享。进程可以在共享内存中读写数据，而不需要显式的数据传输操作。
4. 套接字 Socket：套接字通信是一种在计算机网络中实现进程间通信的方式。它基于网络协议栈，使用 TCP 或 UDP 等传输层协议，在不同的主机之间进行数据传输和通信。
5. Remote Procedure Call： RPC 允许一个进程通过网络请求调用另一个进程中的函数，就像调用本地函数一样。远程过程调用隐藏了底层通信细节，使得进程间通信更加方便。
6. 信号（Signal）：信号通信是一种在操作系统中实现进程间通信的机制。它允许一个进程向另一个进程发送信号，用于通知、中断或请求处理等目的。它是一种异步事件，当某个事件发生时，操作系统会向进程发送相应的信号。进程可以事先注册信号处理函数来捕获并处理这些信号。

## JavaScript 如何实现跨标签页通信

### BroadcastChannel

BroadcastChannel 通信的方式原理就是一个命名管道。它允许让指定的同源下浏览器不同的窗口来订阅它。每个 BroadcastChannel 对象都需要使用一个唯一的名称来标识通道，这个名称在同一域名下的不同页面之间必须是唯一的。它**允许同一域名下的不同页面之间进行通信**。通过 postMessage 方法，一个页面可以将消息发送到频道中，而其他页面则可以监听 message 事件来接收这些消息。通过这种方式是短线了一种实时通信的机制，可以在不同的页面之间传递信息，实现页面间的即时交流。页面关闭时需手动 close。传递结构化数据。

```html
<!-- a.html -->
<script>
  const broad = new BroadcastChannel("moment");
  setInterval(() => {
    broad.postMessage({
      value: `moment ${new Date()}`,
    });
  }, 3000);
  broad.onmessage = function (e) {
    console.log(e.data);
  };
</script>

<!-- b.html -->
<script>
  const broad = new BroadcastChannel("moment");
  let index = 1;
  setInterval(() => {
    broad.postMessage({
      value: `supper ${index++}`,
    });
  }, 3000);
  broad.onmessage = function (e) {
    console.log(e.data);
  };
</script>
```

### Service Worker

Service Worker 它是一种服务工作线程，是一种在浏览器背后运行的脚本，用于处理网络请求和缓存等任务。它是一种在浏览器与网络之间的中间层，允许开发者拦截和控制页面发出的网络请求，以及管理缓存，从而实现离线访问、性能优化和推送通知等功能。它在浏览器背后独立运行与网页分开，这意味着即使用户关闭了网页，Service Worker 仍然可以运行。可以用于实现推送通知功能。它可以注册为推送消息的接收者，当服务器有新的通知要发送时，Service Worker 可以显示通知给用户，即使网页没有打开。用于复杂场景如离线、后台同步等。

```html
<!-- a.html -->
<script>
  navigator.serviceWorker.register("worker.js").then(() => {
    console.log("注册成功");
  });

  setInterval(() => {
    navigator.serviceWorker.controller.postMessage({
      value: `moment ${new Date()}`,
    });
  }, 3000);

  navigator.serviceWorker.onmessage = function (e) {
    console.log(e.data.value);
  };
</script>

<!-- b.html -->
<script>
  navigator.serviceWorker.register("worker.js").then(() => {
    console.log("注册成功");
  });

  setInterval(() => {
    navigator.serviceWorker.controller.postMessage({
      value: `moment ${new Date()}`,
    });
  }, 3000);

  navigator.serviceWorker.onmessage = function (e) {
    console.log(e.data.value);
  };
</script>
```

```js
// worker.js
self.addEventListener("message", function (e) {
  e.waitUntil(
    self.clients.matchAll().then(function (clients) {
      if (!clients || clients.length === 0) {
        return;
      }
      clients.forEach(function (client) {
        client.postMessage(e.data);
      });
    })
  );
});
```

Service Worker 将遵守以下生命周期：

1. 注册: 在网页的 JavaScript 代码中调用 navigator.serviceWorker.register() 方法来注册一个 Service Worker;
2. 安装: 当 Service Worker 文件被下载并首次运行时，会触发 install 事件。在 install 事件中，你可以缓存静态资源，如 HTML、CSS、JavaScript 文件，以便在离线时使用;
3. 激活: 安装成功后，Service Worker 并不会立即接管页面的网络请求。它需要等到之前的所有页面都关闭，或者在下次页面加载时才会激活();
4. 控制: 一旦 Service Worker 被激活，它就开始控制在其作用域内的页面。它可以拦截页面发出的网络请求，并根据缓存策略返回缓存的内容;
5. 更新: 当你更新 Service Worker 文件并再次注册时，会触发一个新的 install 事件。你可以在新的 install 事件中更新缓存，然后在下次页面加载时进行激活，以确保新的 Service Worker 被使用;
6. 解除注册: 如果你不再需要 Service Worker，可以通过调用 navigator.serviceWorker.unregister() 来解除注册;

它本身是一个由 promise 封装的对象，未初始化时是一个 pending 状态的，当成功注册之后会变成 fulfilled，并且对外暴露方法。

### localStorage

在 Web Storage 中，每一次将一个值存储到本地存储时，都会触发一个 `storage` 事件，通过事件监听器绑定回调函数做处理，适用于同源页面之间通信。只能传递字符串。

```html
<!-- a.html -->
<script>
  let index = 0;
  setInterval(() => {
    localStorage.moment = `moment ${index++}`;
  }, 1000);

  window.addEventListener("storage", (e) => {
    console.log("被修改的键: ", e.key);
    console.log("旧值: ", e.oldValue);
    console.log("新值: ", e.newValue);
  });
</script>

<!-- b.html -->
<script>
  let index = 0;
  setInterval(() => {
    localStorage.supper = `supper ${index++}`;
  }, 1000);

  window.addEventListener("storage", (e) => {
    console.log("被修改的键: ", e.key);
    console.log("旧值: ", e.oldValue);
    console.log("新值: ", e.newValue);
    console.log("----------");
  });
</script>
```

### SharedWorker

SharedWorker 是一种在 Web 浏览器中使用的 Web API，它允许不同的浏览上下文,如不同的浏览器标签页之间共享数据和执行代码。它可以用于在多个浏览上下文之间建立通信通道，以便它们可以共享信息和协同工作。与普通的 Worker 不同，SharedWorker 可以在多个浏览上下文中实例化，而不仅限于一个单独的浏览器标签页或框架。这使得多个浏览上下文可以共享同一个后台线程，从而更有效地共享数据和资源，而不必在每个标签页或框架中都创建一个独立的工作线程。

```html
<!-- a.html -->
<script>
  let index = 0;
  const worker = new SharedWorker("worker.js");

  setInterval(() => {
    worker.port.postMessage(`moment ${index++}`);
  }, 1000);
</script>

<!-- b.html -->
<script>
  const worker = new SharedWorker("worker.js");

  worker.port.start();
  setInterval(() => {
    worker.port.postMessage("php是世界上最好的语言");
  }, 1000);

  worker.port.onmessage = function (e) {
    if (e.data) {
      console.log(e.data);
    }
  };
</script>
```

```js
let data = "";

self.onconnect = (e) => {
  const port = e.ports[0];

  port.onmessage = function (e) {
    if (e.data === "php是世界上最好的语言") {
      port.postMessage(data);
      data = "";
    } else {
      data = e.data;
    }
  };
};
```

### IndexDB

IndexedDB 是一种在浏览器中用于存储和管理大量结构化数据的 Web API。它提供了一种持久性存储解决方案，允许 Web 应用程序在客户端存储数据，以便在不同会话、页面加载或浏览器关闭之间保留数据。与传统的 cookie 或 localStorage 等存储方式不同，IndexedDB 更适合存储复杂的、结构化的数据，例如对象、数组、键值对等。这使得它特别适用于应用程序需要存储大量数据、执行高级查询或支持离线工作的情况。

```html
<!-- a.html -->
<script>
  let index = 0;
  // 打开或创建 IndexedDB 数据库
  const request = indexedDB.open("database", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("dataStore", {
      keyPath: "key",
    });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["dataStore"], "readwrite");
    const objectStore = transaction.objectStore("dataStore");

    // 存储数据

    objectStore.put({ key: "supper", value: `moment` });

    transaction.oncomplete = () => {
      db.close();
    };
  };
</script>

<!-- b.html -->
<script>
  // 打开相同的 IndexedDB 数据库
  const request = indexedDB.open("database", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["dataStore"], "readonly");
    const objectStore = transaction.objectStore("dataStore");

    // 获取数据
    const getRequest = objectStore.get("supper");

    getRequest.onsuccess = (event) => {
      const data = event.target.result;
      if (data) {
        console.log(data.value);
      }
    };

    transaction.oncomplete = () => {
      db.close();
    };
  };
</script>
```

### cookie

```html
<!-- a.html -->
<script>
  let index = 0;
  setInterval(() => {
    document.cookie = `supper=moment ${index++}`;
  }, 1000);
</script>

<!-- b.html -->
<script>
  console.log("cookie 的值为: ", document.cookie);

  setInterval(() => {
    console.log("cookie 的值发生了变化: ", document.cookie);
  }, 1000);
</script>
```

### postMessage

`window.postMessage()` 方法可以安全地实现`跨源` Tab 间的通信。通常，对于两个不同页面的脚本，只有同源时，这两个脚本才能相互通信。适用于有明确窗口引用的场景，即通过 A 窗口`window.open(B.html,xxx);`打开的 B 窗口时。

注意：

1. 同源策略：postMessage 是为了绕过同源策略的限制而设计的，但仍然需要在处理消息时注意源的验证。开发者需确保接收消息时检查 event.origin。
2. 数据大小限制：发送的数据大小有限制，虽然这个限制因浏览器而异，但通常在几 MB 的范围内。因此，发送大数据量时需要考虑使用其他方式。
3. 顺序问题：消息发送是异步的，可能会导致接收方无法按预期顺序接收到消息。这意味着如果消息的顺序很重要，需要做额外的处理来维护顺序。
4. 安全性问题：如果没有正确地验证消息来源，可能会导致安全问题，比如跨站脚本攻击（XSS）。始终确保验证 event.origin，并避免使用 '\*' 作为目标源。
5. 浏览器兼容性：虽然大多数现代浏览器都支持 postMessage，但在某些老旧的浏览器中可能不完全支持，因此在开发时需要考虑兼容性问题。
6. 不支持 DOM 访问：通过 postMessage 传递的消息只包含数据，而不包含 DOM 元素，因此无法直接在消息中传递对象或函数。

```html
<!-- a.html -->
<body>
  <button class="pop">弹出新窗口</button>
  <button class="button">发送数据</button>
  <script>
    const pop = document.querySelector(".pop");
    const button = document.querySelector(".button");

    let index = 0;
    let opener = null;

    pop.addEventListener("click", () => {
      opener = window.open("b.html", "123", "height=600,width=600,top=20,resizeable=yes");
    });

    button.addEventListener("click", () => {
      const data = {
        value: `moment ${index++}`,
      };

      opener.postMessage(data, "*"); // 第二个参数可以传域名或者其他参数
    });

    // 监听来自B页面的消息
    window.addEventListener("message", (event) => {
      // 确保消息来自可信来源
      if (event.origin === "http://example.com") {
        // 替换为您的实际域名
        console.log("Received message from B:", event.data);
      }
    });
  </script>
</body>

<!-- b.html -->
<body>
  <div>moment</div>
  <script>
    window.addEventListener("message", (e) => {
      // 可以通过判断e.origin来确定是否是发给当前窗口的信息。可以自行约定规则。
      console.log(e.data);
      // 确保消息来自可信来源
      if (event.origin === "http://example.com") {
        // 替换为您的实际域名
        console.log("Received message from A:", event.data);

        // 向A页面发送消息
        if (window.opener) {
          window.opener.postMessage("Hello from B!", "*"); // 可以指定目标源，增强安全性
        }
      }
    });
  </script>
</body>
```

通过点击按钮在主窗口和弹出的新窗口之间进行通信。通过 postMessage，主窗口可以向新窗口发送数据，从而实现了简单的跨窗口通信。在实际应用中，你可以在接收消息的窗口中监听 message 事件，然后在事件处理程序中处理接收到的数据。
