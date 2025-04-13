---
title: Vite相关知识点
author: EricYangXD
date: "2022-01-06"
---

## 组成

主要由两部分组成：

1. 一个开发服务器，它基于 原生 ES Module 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
2. 一套构建指令，它使用 Rollup 打包代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。
3. 即开发的时候用 esbuild，生产打包用 rollup

## 原理

> 以下引用自[Vite 官方中文文档](https://cn.vitejs.dev/guide/why.html#slow-server-start)

- Vite 通过在一开始将应用中的模块区分为 「依赖」 和 「源码」 两类，改进了开发服务器启动时间。
- 依赖 大多为在开发时不会变动的纯 JavaScript。Vite 将会使用 esbuild 预构建依赖。
- 源码 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。
- Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

- ![Vite原理图](https://cn.vitejs.dev/assets/esm.3070012d.png "Vite原理图")

0. esbuild 构建之后，会对「依赖包」的请求设置强缓存`cache-control:max-age=31536000,immutable;`
1. 在启动的时候，vite 并不会打包源码，而是在浏览器请求路由时才会进行打包，而且也仅仅打包当前路由的源码。这相当于让浏览器掌握了打包的控制权，从而将`Bundle based dev server`(如 webpack)一次性打包全部源码的操作改为了多次，启动速度无疑会快非常多。
2. 在访问时转换的速度也不会慢下来，因为每次转换的源码只有在当前路由下的，并且「源码模块」还会设置协商缓存，当模块没有改变时，浏览器的请求会返回 304 Not Modified。

## 优势

### Vite 天然支持引入.ts、.jsx、.css 等文件

1. Vite 使用 esbuild 将 ts 转译为 js，约是 tsc 速度的 20-30 倍，同时 HMR 更新反映到浏览器的时间小于 50ms
2. .jsx 和.tsx 文件同样开箱即用。JSX 的转译同样是通过 esbuild，默认为 react16 风格
3. 导入.css 文件将会把内容插入到`<style>`标签中，同时也带有 HMR 支持。同时支持.scss/.sass/.less/.stylus 等格式文件。

### 方便

1. 开箱即用，对比 webpack，少了很多 plugin 和 loader 配置。
2. 对于库开发者，也可以通过简单的配置即可打包输出多种格式的包。
3. 开发和生产共享了 rollup 的插件接口，大部分 rollup 插件可以在 vite 上使用。
4. 类型化配置，配置文件可以使用 ts，具有配置类型提示。

### WebAssembly

预编译的.wasm 文件可以直接被导入——默认导出一个函数，返回值为所导出的 wasm 实例对象的 Promise。

### 构建优化——异步 chunk 加载优化

无优化时，当异步 chunkA 被导入时，浏览器将必须先请求和解析 A，然后才能弄清楚它也需要公用 chunkC，这会导致额外的网络请求开销；

优化后，Vite 使用一个预加载步骤自动重写代码，来分割动态导入调用，以实现当 A 被请求时，C 也将被同时请求；

Vite 的优化会跟踪所有的直接导入，无论导入的深度如何，都能够完全消除不必要的往返。

### 支持 SSR

## defineConfig 配置

- optimizeDeps.exclude: 在预构建中强制排除的依赖项。(mark as external)

## 迁移到 Vite

### 新项目

使用 Vite 提供的模板工具：@vitejs/create-app

### 老项目

1. webpack 项目：wp2vite，保留原来的 webpack 配置，把 vite 的配置注入到项目中以支持 vite

## Rollup.js 简介

1. 打包工具的作用是，将多个 JavaScript 脚本合并成一个脚本，供浏览器使用。浏览器需要脚本打包，主要原因有三个：

- 早期的浏览器不支持模块，大型网页项目只能先合并成单一脚本再执行。
- Node.js 的模块机制与浏览器不兼容，必须通过打包工具进行兼容处理。
- 浏览器加载一个大脚本，要比加载多个小脚本，性能更好。

2.  rollup.js 可以打包 ES 模块，简单易用。也支持 CommonJS，但是配置就会比较复杂。如果项目使用 CommonJS 模块，不推荐使用 rollup.js，优势不大。直接上 webpack。
3.  全局安装`npm install --global rollup`，也可以不安装直接使用，只需把命令中的`rollup`，替换成`npx rollup`。
4.  打包：`rollup filename.js`，打包时只需给出入口脚本 main.js，rollup 会自动把依赖项打包进去。打包结果默认输出到屏幕。
5.  打包时自动删除没有用到的代码，这种特性叫做摇树（tree-shaking）。rollup 输出的代码非常整洁，而且体积小于其他打包工具。
6.  使用参数`--file [FILENAME]`，将打包结果保存到指定文件。`rollup main.js --file bundle.js`
7.  使用注意点:
    1.  如果有多个入口脚本，就依次填写它们的文件名，并使用参数`--dir`指定输出目录。`rollup m1.js m2.js --dir dist`会在目录 dist，打包生成多个文件：m1.js、m2.js、以及它们共同的依赖项（如果有的话）。
    2.  参数`--format iife`，会把打包结果放在一个自动执行函数里面。`rollup main.js --format iife`
    3.  如果希望打包后代码最小化，使用参数`--compact`。`rollup main.js --compact`
    4.  另一种方法是使用专门工具。`rollup main.js | uglifyjs --output bundle.js`该命令分成两步，第一步是 rollup 打包，第二步是 uglifyjs 进行代码最小化，最后写入 bundle.js。
    5.  rollup 支持使用配置文件（rollup.config.js），把参数都写在里面，例：

```js
// rollup.config.js
export default {
  input: "main.js",
  output: {
    file: "bundle.js",
    format: "es",
  },
};
```

8. 参数`-c`启用配置文件。
9. rollup 还支持 ES 模块转成 CommonJS 模块，使用参数`--format cjs`就可以了。`rollup add.js --format cjs`

## 配置解释

### workspace:\*

```json
"devDependencies": {
  "vite": "workspace:*"
}
```

这里的`vite`是一个开发依赖项，它是一个现代化的前端构建工具，用于提高开发效率。`workspace:*`是一个特殊的语法，它指示 npm 或 yarn 从工作区（workspace）中获取 vite 的版本。

工作区（workspace）是 npm 和 yarn 支持的一种功能，允许你在单个仓库中管理多个包（package），这些包可以相互依赖。当你使用工作区时，你可以指定依赖项从工作区中获取，而不是从 npm 注册表中获取。

`workspace:*`中的`*`表示使用工作区中匹配的最新版本。这意味着如果 vite 是你的工作区中的一个包，那么这个配置会确保使用工作区中 vite 包的最新版本。

这种配置通常用于 monorepo（单一代码仓库）设置中，其中多个相关的项目被组织在同一个仓库中，并且它们之间可能存在依赖关系。通过使用`workspace:*`，你可以确保依赖项的版本与工作区中的实际版本保持一致，这有助于避免版本冲突和确保依赖项的一致性。

## 使用记录

### vite 配置别名

1. 首先安装为 Node.js 提供类型定义的包，也是解决 "「找不到模块 path 或其相对应的类型声明」" 问题。
2. 在 vite.config.ts 中配置 resolve.alias ，使用 @ 符号代表 src

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
});

// 也可以是这样的：
import { defineConfig } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  //获取当前工作目录的路径
  const root: string = process.cwd();
  const pathResolve = (dir: string): string => {
    return resolve(root, ".", dir);
  };
  return { plugins: [vue()], resolve: { alias: { "@": pathResolve("src") } } };
};
```

3. 如果使用了 TypeScript 的话，需要在 tsconfig.json 中配置：

```ts
{
  "compilerOptions": {
    //使用相对路径，当前根目录
    "baseUrl": ".",
    "paths": {
        "@/*": ["src/*"],
    }
  }
}
```

### 省略拓展名列表

不建议忽略自定义导入类型的扩展名 .vue ，会影响 IDE 和类型支持。

```js
import { defineConfig } from "vite";
export default defineConfig({
  resolve: {
    //导入文件时省略的扩展名列表
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
```

### vite 插件

在 `plugins` 中可以添加你的插件，它是一个数组：

- @vitejs/plugin-vue-jsx JSX、TSX 语法支持
- vite-plugin-mock Mock 支持
- vite-plugin-svg-icons svg 图标
- unplugin-auto-import/vite 按需自动导入 集成按需引入配置
- unplugin-vue-components/vite 按需组件自动导入 集成按需引入配置
- unocss/vite 原子化 css
- vite-plugin-compression gzip 压缩打包
- rollup-plugin-visualize 打包分析可视化
- vite-plugin-chunk-split 代码分包

```js
//vite.config.ts
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
// 集成按需引入配置
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue(),
    //默认压缩gzip，生产.gz文件
    viteCompression({
      //压缩后是否删除源文件
      deleteOriginFile: false,
    }),
    visualizer({
      open: true, //build后，是否自动打开分析页面，默认false
      gzipSize: true, //是否分析gzip大小
      brotliSize: true, //是否分析brotli大小
      //filename: 'stats.html'//分析文件命名，使用命令 pnpm build 后，分析图 html 文件会在根目录下生成，默认命名为 stats.html。把分析文件加入 .gitignore ，不提交到 git 仓库中。
    }),
    // 集成按需引入配置
    Components({
      resolvers: [
        //AntDesignVueResolver({ importStyle: "less" }),
        ElementPlusResolver({ importStyle: "sass" }),
      ],
      dts: "src/typings/components.d.ts", //自定义生成 components.d.ts 路径
    }),
    // 集成按需引入配置
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        //一些全局注册的hook等，无需局部引入
        {
          // "@/hooks/useMessage": ["useMessage"],
        },
      ],
      resolvers: [ElementPlusResolver()], //AntDesignVueResolver()
      dts: "src/typings/auto-imports.d.ts", //自定义生成 auto-imports.d.ts 路径
    }),
  ],
});
```

- unplugin-vue-components 会在 src/typings 文件夹下生成 components.d.ts 类型文件
- unplugin-auto-import 会在 src/typings 文件夹下生成 auto-imports.d.ts 类型文件
- unplugin-vue-components 插件会自动引入 UI 组件及 src 文件夹下的 components 组件，规则是 src/components/\*.{vue}
- 请确保你的项目中拥有 src/typings 文件夹，或者更改上述配置项的 dts 路径
- 使用按需引入的话，不要忘了在 tsconfig.json 中引入组件库的类型声明文件
- 如果你使用的是 AntDesignVue 组件库，将  "element-plus/global" 替换成 "ant-design-vue/typings/global" 即可

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "types": ["node", "vite/client", "element-plus/global", "ant-design-vue/typings/global"]
  }
}
```

### 环境变量

Vite 在一个特殊的  「import.meta.env」  对象上暴露环境变量，这些变量在构建时会被静态地替换掉。这里有一些在所有情况下都可以使用的内建变量：

- 「import.meta.env.MODE」: {string} 应用运行的模式。
- 「import.meta.env.BASE_URL」: {string} 部署应用时的基本 URL。由 base  配置项决定。
- 「import.meta.env.PROD」: {boolean} 应用是否运行在生产环境（使用  NODE_ENV='production'  运行开发服务器或构建应用时使用  NODE_ENV='production' ）。
- 「import.meta.env.DEV」: {boolean} 应用是否运行在开发环境 (永远与  import.meta.env.PROD 相反)。
- 「import.meta.env.SSR」: {boolean} 应用是否运行在  server   上。
- 可以打印 import.meta.env 对象查看拥有的属性

- 在 Vite 中，只有以 VITE\_ 为前缀的变量才会交给 Vite 来处理。如果要改前缀的话，在 vite.config.ts 中设置 envPrefix ，它可以是一个字符串或者字符串数组。
- Vite 也提供了 envDir 用来自定义环境文件存放目录
  - 新建 .env 文件，表示通用的环境变量，优先级较低，会被其他环境文件覆盖
  - 新建 .env.development 文件，表示开发环境下的环境变量
  - 新建 .env.production 文件，表示生产环境下的环境变量
  - 需要的话，你可以加入更多的环境，比如 预发布环境 .env.staging (它的配置一般与生产环境无异，只是 url 变化) 和 测试环境 .env.testing
  - 在默认情况下，运行的脚本 dev 命令(pnpm dev)是会加载 .env.development 中的环境变量，而脚本 build 命令是加载 .env.production 中的环境变量
- 最常见的业务场景就是，前端与后端的接口联调，本地开发环境与线上环境用的接口地址不同，这时只需要定义不同环境文件的相同变量即可。
- 也可以通过在 package.json 中改写脚本命令来自定义加载你想要的环境文件，关键词是 --mode。`"build:dev": "vue-tsc -b && vite build --mode development"`

### TS 智能提示

在 `src/typings` 目录下新建一个 `env.d.ts`，写入以下内容，即可得到类型提示，鼠标停留在变量上也会显示注释：

```js
//环境变量-类型提示
interface ImportMetaEnv {
  /** 全局标题 */
  readonly VITE_APP_TITLE: string;
  /** 本地开发-端口号 */
  readonly VITE_DEV_PORT: number;
  //加入更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

记得在 tsconfig 文件中配置 include 引入类型声明文件，typings 代表你的类型文件目录名称：

```js
{
  // "compilerOptions": {},
  "include": ["typings/**/*.d.ts","typings/**/*.ts"]
}
```

### 在 vite.config.ts 中使用环境变量

```js
import { loadEnv } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd();
  const env = loadEnv(mode, root);
  console.log(env);
  return { plugins: [vue()] };
};
```

### CSS 配置

Vite 提供了一个 css.preprocessorOptions 选项，用来指定传递给 CSS 预处理器选项：css-preprocessoroptions：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      //less: {
      //  additionalData: '@import "@/styles/variable.less";',
      //  javascriptEnabled: true,
      //},
      scss: {
        api: "modern-compiler",
        additionalData: `@use "@/styles/variables.scss" as *;`,
        javascriptEnabled: true,
      },
    },
  },
});
```

### 依赖预构建配置

在 Vite 中，依赖预构建是指将第三方依赖预先编译和优化，以便在开发过程中更快地构建和加载这些依赖。这种预构建的方式有助于减少开发服务器在启动和重新加载时的延迟，并且可以利用现代浏览器的 ES 模块支持来更高效地加载模块。

默认情况下，预构建结果会保存到  node_modules  的  .vite  目录下。

一些动态的 import 导入，常常无法进行预构建，而是会触发二次预构建，严重拖慢程序速度。

Vite 提供了 optimizeDeps 配置项允许我们自定义预构建的配置，依赖优化选项。自定义构建行为：

    - optimizeDeps.include：强制预构建链接的包
    - optimizeDeps.exclude ：在预构建中强制排除的依赖项

```js
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
export default ({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [vue()],
    optimizeDeps: { include: ["qs", "echarts", "@vueuse/core", "nprogress", "lodash-es", "dayjs"], exclude: [] },
  };
};
```

### 打包配置

生产环境去除 console.log、debugger(esbuild 模式)

```js
//vite.config.ts
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
export default ({ mode }: ConfigEnv): UserConfig => {
  return { plugins: [vue()], esbuild: { drop: ["debugger"], pure: ["console.log"] } };
};
```

### 分包策略

根据不同的规则和逻辑来分割成大大小小的包，把一些固定，常规不更新的文件，进行分割切包处理。分包是一种优化程序加载速度，性能的策略和操作。

- 「减少代码体积和加载时间」: 当你的项目包含多个模块或者依赖项时，将它们分割成多个包可以减少单个包的体积。并且只重新加载修改的文件，减少加载时间。
- 「提高缓存利用率」:处理部分包而不是全部，分包可以提高浏览器的缓存命中率，从而减少不必要的网络请求，加快页面加载速度。
- 「优化资源结构」: 对于大型项目或者复杂的应用程序，通过合理划分功能模块和依赖项，有利于管理项目的整理结构和维护

分包策略根据项目不同，会呈现出不同的策略，这里提供一些通用的思路：

- 按功能或模块分包
- 按页面或路由分包
- 按第三方依赖分包
- 公共代码分包
- 按环境分包

```js
//vite.config.ts
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }: ConfigEnv): UserConfig => {
  /**颗粒度更细的分包 */
  const manualChunks = (id: string) => {
    if (id.includes("node_modules")) {
      if (id.includes("lodash-es")) {
        return "lodash-vendor";
      }
      if (id.includes("element-plus")) {
        return "el-vendor";
      }
      if (id.includes("@vue") || id.includes("vue")) {
        return "vue-vendor";
      }
      return "vendor";
    }
  };

  return {
    plugins: [vue()],
    build: {
      chunkSizeWarningLimit: 1500, //超出 chunk 大小警告阈值，默认500kb
      //Rollup 打包配置
      rollupOptions: {
        output: {
          entryFileNames: "assets/js/[name]-[hash:8].js", //入口文件名称
          chunkFileNames: "assets/js/[name]-[hash:8].js", //引入文件名名称
          assetFileNames: "assets/[ext]/[name]-[hash:8][extname]", //静态资源名称
          manualChunks,
        },
      },
    },
  };
};
```
