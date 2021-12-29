---
title: 记录 Quill 编辑器使用时遇到的一些问题
author: EricYangXD
date: "2021-12-29"
---

## 基本用法示例

-   Quill 在 Vue 上有 vue-quill-editor 和 Vue2Editor，都是 Quill 衍生出来的适用于 Vue 的库，对于 React 则一般直接使用 Quill 即可，此处是在 Vue 中直接使用 Quill。

```vue
<template>
  <div class="quill-editor">
    <div id="editor" ref="editor"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit, Ref } from 'vue-property-decorator';
import Quill, { QuillOptionsStatic } from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';
import { addQuillTitle } from '../../utils/index';
/* 图片缩放插件 */
Quill.register('modules/blotFormatter', BlotFormatter);
/* Quill内置的模块只能通过Quill.import函数导入 */
const Image = Quill.import('formats/image');
Image.className = 'img-fluid';
Quill.register(Image, true);
/* 对Link插入链接功能进行自定义 */
// 原生的Quill必须插入**完整**的URL
const Link = Quill.import('formats/link');
Link.sanitize = function(url: string | undefined) {
  if (!url) return '';
  if (_.startsWith(url, 'http://') || _.startsWith(url, 'https://')) {
    return url;
  }
  return `https://${url}`;
};

@Component({})
export default class App extends Vue {
  // 默认编辑区域显示的内容
  @Prop({ default: '' }) readonly defaultText!: string;
  // 知识点！后面讲
  @Ref('editor') readonly quillDom!: HTMLElement;

  quill: any = null;
  // 配置toolbar，需要哪些就添加那些
  toolbarOptions = [
    [{ header: [false, 1, 2, 3, 4] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['link', 'image', 'video'],
  ];

  options: QuillOptionsStatic = {
    // bounds: this.quillDom, // 如果设置这个，则DOM需要通过ref获取，而不能用document.getElementById('editor') as HTMLElement，原理：Vue中data/state的init在beforeCreate到created之间，要早于mounted生命周期，而这时候显然拿不到editor这个DOM，如果传给bounds的这个数据不是响应式的，那么后面DOM mounted之后也无法更新，所以也可以在mounted时重新给bounds赋值。否则，Link插入链接功能会失效。
    // readOnly: true, // 只读，用于展示静态内容，不可编辑
    debug: false,
    // 主题
    theme: 'snow',
    modules: {
      // 工具栏  默认支持图片拖拽imageDrop
      toolbar: {
        container: this.toolbarOptions,
        handlers: {
          video: this.imageHandler,// 这里把video做成了图片上传，一般来说应该放到下面image中做个组件，让用户点击可以选择不同的图片源
          image: this.imageUpload,
          // link: this.handleLink,
        },
      },
      // 图片缩放 imageResize 现在用这个库，之前的image-resize已经不维护了，而且用起来各种报错不好解决
      blotFormatter: {},
      // 配置回退功能 Ctrl/command+Z
      history: {
        // Enable with custom configurations
        delay: 2000,
        userOnly: true,
        maxStack: 20,
      },
    },
    placeholder: '请输入研究分析',
  };

  /* 插入图片链接 */
  imageHandler() {
    const range = this.quill.getSelection();
    this.$prompt('请输入要插入的图片链接')
      .then((res: TODO) => {
        const { value } = res;
        if (isUrl(value) && this.isImage(value)) {
          // eslint-disable-next-line
          this.quill.insertEmbed(range.index, 'image', value);
        } else {
          this.$message({ showClose: true, message: '请输入正确的图片链接', type: 'error' });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  // emit一个事件，把编辑区的内容传给父组件
  @Emit('rich-text')
  richText(text: string) {
    return text;
  }

  // 失去焦点，把编辑区的内容传给父组件
  onEditorBlur() {
    this.richText(this.state.xx);
  }

  // watch，用于重新编辑内容
  @Watch('defaultText', { immediate: false, deep: false })
  onDefaultTextChange(newVal: string) {
    if (newVal !== '') {
      this.state.xx = newVal;
      this.richText(newVal);
    }
    /* 新的Quill编辑器都用delta格式存取内容 */
    if (typeof newVal === 'string') {
      this.quill.setContents(JSON.parse(this.defaultText));
    }
  }

  mounted() {
    // 知识点，此处DOM获取要用refs，不能使用document.getElementById等
    const dom = this.quillDom;
    this.options.bounds = dom;
    this.quill = new Quill(dom, this.options);
    if (this.defaultText) {
      try {
        // 判断一下内容是不是JSON（Delta）格式的
        if (this.defaultText.startsWith('{')) {
          this.quill.setContents(JSON.parse(this.defaultText));
        } else if (this.defaultText.startsWith('<')) {
          /* 知识点，处理HTML类型的内容 */
          const delta = this.quill.clipboard.convert(this.defaultText);
          this.quill.setContents(delta, 'silent');
        }
      } catch (e) {
        console.log(e);
      }
    }
    this.quill.on('text-change', () => {
      this.richText(this.quill.getContents());
    });
    /* 增加tip提示*/
    // 有两个方案：1.乞丐版，通过title来提示；2.模仿Quill官网首页（F12查看），自定义DOM；此处用的方案1.
    addQuillTitle();
    /* 修改添加链接时的输入框提示文字 */
    const linkInput = document.querySelector('input[data-link]');
    if (linkInput) {
      linkInput.setAttribute('data-link', '请输入链接 http(s)://...');
    }
  }

  /* 组件销毁前清除历史缓存 */
  beforeDestroy() {
    this.quill.history.clear();
  }
}

<style lang="scss" scoped>
.quill-editor {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.quill-editor ::v-deep #editor {
  min-height: 326px;
  border: 1px solid rgba(0, 11, 20, 0.12);
  border-top-width: 0;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  .ql-editor {
    min-height: 325px;
    padding: 8px;
    /* 重置默认样式 */
    strong {
      font-weight: bold !important;
    }
    em {
      font-style: italic !important;
    }
  }
  .ql-editor.ql-blank::before {
    left: 8px;
    right: 8px;
    font-size: 12px;
    font-style: normal;
    color: rgba(0, 11, 20, 0.28);
  }
}

.quill-editor ::v-deep .ql-snow {
  border-color: rgba(0, 11, 20, 0.12);

  .ql-tooltip {
    margin-left: 130px;
    z-index: 9999;
  }
  .ql-tooltip[data-mode='link']::before {
    content: '输入链接:';
  }
  .ql-tooltip::before {
    content: '访问链接:';
    line-height: 26px;
    margin-right: 8px;
  }
  .ql-preview {
    line-height: 40px;
  }
  .ql-action::after {
    content: '编辑';
  }
  .ql-remove::before {
    content: '移除';
  }
  .ql-tooltip.ql-editing a.ql-action::after {
    content: '保存';
  }

  .ql-picker.ql-header {
    line-height: 20px;
    .ql-picker-label::before,
    .ql-picker-item::before {
      content: '正文';
      font-size: 14px;
    }
    .ql-picker-label[data-value='1']::before,
    .ql-picker-item[data-value='1']::before {
      content: '标题 1';
      font-size: 14px;
    }
    .ql-picker-label[data-value='2']::before,
    .ql-picker-item[data-value='2']::before {
      content: '标题 2';
      font-size: 14px;
    }
    .ql-picker-label[data-value='3']::before,
    .ql-picker-item[data-value='3']::before {
      content: '标题 3';
      font-size: 14px;
    }
    .ql-picker-label[data-value='4']::before,
    .ql-picker-item[data-value='4']::before {
      content: '标题 4';
      font-size: 14px;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action:after {
      content: '保存';
      font-size: 14px;
    }
    .ql-snow .ql-tooltip[data-mode='link']::before {
      content: '链接：';
      font-size: 14px;
    }
    .ql-snow .ql-tooltip::before {
      content: '链接：';
      font-size: 14px;
    }
    .ql-snow .ql-tooltip a.ql-action::after {
      content: '保存';
      font-size: 14px;
    }
    .ql-snow .ql-tooltip a.ql-remove::before {
      content: '删除';
      font-size: 14px;
    }
    .qt-input-error {
      border-color: #ea4435 !important;
    }

    input.qt-input-error:focus {
      border-color: 1px solid #ea4435 !important;
    }
  }
}
</style>
```

-   Vue2.x Vue.prototype.\_init

```js
  ...
  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
  ...
```

-   工具函数

```ts
/*
  研报编辑页-编辑器toolbar
  鼠标指针移动到图标上提示功能
  tips列表：按需添加即可
*/
export const titleConfig: TitleCfg = {
	"ql-bold": "加粗",
	"ql-italic": "斜体",
	"ql-link": "添加链接",
	"ql-size": "字体大小",
	"ql-strike": "删除线",
	"ql-underline": "下划线",
	"ql-header": "标题",
	"ql-indent": "缩进",
	"ql-align": "文本对齐",
	"ql-direction": "文本方向",
	"ql-image": "添加本地图片",
	"ql-video": "添加网络图片", // 自定义的
};

/*
  研报编辑页-编辑器toolbar
  鼠标指针移动到图标上提示功能
  遍历增加title
*/
export function addQuillTitle() {
	const oToolBar = document.querySelector(".ql-toolbar") as HTMLElement;
	const aButton = oToolBar.querySelectorAll("button");
	const aSelect = oToolBar.querySelectorAll("select");
	aButton.forEach(function (item) {
		if (item.className === "ql-script") {
			item.value === "sub"
				? (item.title = "下标")
				: (item.title = "上标");
		} else if (item.className === "ql-indent") {
			item.value === "+1"
				? (item.title = "向右缩进")
				: (item.title = "向左缩进");
		} else if (item.className === "ql-align") {
			if (item.value === "center") {
				item.title = "居中对齐";
			} else if (item.value === "right") {
				item.title = "右对齐";
			} else if (item.value === "justify") {
				item.title = "两端对齐";
			} else {
				item.title = "左对齐";
			}
		} else if (item.className === "ql-video") {
			/* HACK 先用video图标占位，然后自定义插入网络图片链接功能 */
			item.className = "ql-video iconfont icon-upload";
			item.title = "添加网络图片";
			item.children[0].remove();
		} else {
			item.title = titleConfig[item.classList[0]];
		}
	});
	aSelect.forEach(function (item) {
		Object.assign(item.parentNode, {
			title: titleConfig[item.classList[0]],
		});
	});
}
```

## 需要注意的点

-   如下：

### 样式

-   通过 ::v-deep 来覆盖默认样式，比如对于标题的「汉化」，对于 Link 中的提示话术的「汉化」等

### Toolbar

-   工具栏的配置参考代码里的注释，通过 this.options.modules.toolbar 进行配置及自定义功能或者修改默认功能

### Link

-   算是一个很奇葩的问题，重新编辑内容时，无法插入链接了--通过 ref 代替 document.getElementById 解决，原理：mounted 的时候
-   另一个问题，插入的链接必须要带 http(s)://--通过 const Link = Quill.import('formats/link');Link.sanitize=(url)=>newUrl;解决。
-   还有一个遗留问题，不能给图片插入链接，未解决。原生的 Quill 是可以给图片插入链接的。

### 编辑图片时会有虚线框

-   应该是图片缩放插件引入的，通过给编辑区域设置 min-height 而不是 height，使得插入图片时编辑区域自适应图片的高度来解决。

### 图片缩放

-   quill-blot-formatter 插件

### 修改添加链接时的输入框提示文字

```js
const linkInput = document.querySelector("input[data-link]");
if (linkInput) {
	linkInput.setAttribute("data-link", "请输入链接 http(s)://...");
}
```

### HTML 格式转为 Delta 格式

```js
const delta = this.quill.clipboard.convert(HTML_Content);
this.quill.setContents(delta, "silent"); // 给编辑区域填充内容
```

### 加粗、斜体失效

-   一般项目中会使用 reset.css 或者 normalize.css 进行全局样式重置，导致 Quill 中的样式失效，重写样式即可。

```css
.ql-editor {
	/* 重置默认样式 */
	strong {
		font-weight: bold !important;
	}
	em {
		font-style: italic !important;
	}
}
```

### 插入图片链接

```js
  /* 插入图片链接 */
  imageHandler() {
    const range = this.quill.getSelection();
    this.$prompt('请输入要插入的图片链接')
      .then((res: any) => {
        const { value } = res;
        if (isUrl(value) && this.isImage(value)) {
          this.quill.insertEmbed(range.index, 'image', value);
        } else {
          this.$message({ showClose: true, message: '请输入正确的图片链接', type: 'error' });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }
```

[一篇 React 中使用 Quill 的文章](https://juejin.cn/post/6915301457541955598)
