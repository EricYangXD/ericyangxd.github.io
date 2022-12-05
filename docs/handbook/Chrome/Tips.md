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
