---
title: 微前端
author: EricYangXD
date: "2022-02-10"
---

## 微前端

微前端（Micro-Frontends）是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。

微前端并不是前端领域的新概念。早期希望前端工程能够像后台的微服务一样，项目分开自治，核心的诉求是：

1. 兼容不同技术栈
2. 将项目看作页面、组件，能够复用到不同的系统中
3. 实现页面低成本接入是微前端的重要愿景之一，也是吸引大家持续探索的核心原因。

### 选型要考虑哪些方面

1. 要「快速」且「保证稳定性」？
2. 要将不同技术栈的系统整合到一起？
3. 如何选择合适的主应用和子应用？
4. 如何解决不同框架之间的冲突，比如全局样式、JavaScript 隔离、路由管理等?
5. CI/CD 怎么集成
6. 如何解决第三方 SDK、JS 文件加载失败问题
7. 打包、构建、线上 bug 如何修复等问题

### single-spa

### micro-app

### 无界

### pnpm workspace

### webpack5 Module Federation

### qiankun

qiankun 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。目标直指巨石应用业务难题，旨在解决单体应用在一个相对长的时间跨度下，由于参与的人员、团队的增多、变迁，从一个普通应用演变成一个巨石应用 (Frontend Monolith) 后，随之而来的应用不可维护的问题。这类问题在企业级 Web 应用中尤其常见。

微前端的概念借鉴自后端的微服务，主要是为了解决大型工程在变更、维护、扩展等方面的困难而提出的。目前主流的微前端方案包括以下几个：

- iframe
- 基座模式，主要基于路由分发，qiankun 和 single-spa 就是基于这种模式
- 组合式集成，即单独构建组件，按需加载，类似 npm 包的形式
- EMP，主要基于 Webpack5 Module Federation
- Web Components
- pnpm workspace

> 严格来讲，这些方案都不算是完整的微前端解决方案，它们只是用于解决微前端中运行时容器的相关问题。

1. who: 包含 qiankun 客户端、主应用 A、微应用 B 三部分，三者协作完成了微前端的设计。

在 qiankun 的框架下，一个页面集成到另外一个页面系统中，最关键的核心点就是将微应用封装成具有生命周期的页面组件，使得 qiankun 可以调用 React 或者 Vue 的 render 能力，将页面渲染到对应的 DOM 节点。

有个小细节就是微应用的 JS CSS 文件请求是属于 Ftech/XHR 类型，说明 js 文件的请求是 qiankun 客户端自行构造的。

这里必然要涉及前端的跨域问题，尤其是当主应用和微应用的域名不一致时，qiankun 客户端如何能够在跨域的限制之下获取到微应用的页面资源？一个解决方案是主应用提供一个鉴权秘钥下发的接口 signUrl，这个接口由微应用提供也可以，将秘钥信息下发到 cookie 中，通过配置 qiankun 自定义 fetch 方法，带上这些鉴权信息。官方也提供了一些通用方案以供参考。

#### 主应用的选择

通常主应用作为基座，负责整体布局、路由导航和子应用的加载。主应用可以使用任何框架，但需要支持微前端框架的要求。比如 qiankun 推荐主应用使用 React 或者 Vue，但也可以纯 JavaScript。

#### 子应用的改造

每个子应用需要暴露生命周期钩子，并配置 webpack。对于 Vue2、Vue3 和 React16，每个子应用都需要调整 webpack 配置，确保正确导出生命周期函数。同时，需要注意不同框架可能存在的全局变量污染，比如 Vue 的全局组件、React 的全局状态等，这时候需要沙箱隔离机制。

#### 路由管理

主应用需要处理一级路由，子应用处理自己的子路由。需要确保路由切换时正确加载和卸载子应用，避免内存泄漏。比如使用 history 模式路由，主应用和子应用的路由前缀需要配置正确。

#### 公共依赖的处理

比如 Vue 或 React 的版本不同，如何避免冲突？可能需要使用 externals 配置，将公共库从子应用中排除，由主应用统一提供，但不同版本的库可能会有问题。或者利用 webpack 的模块联邦（Module Federation）来共享依赖，但需要确认是否兼容不同版本的框架。

#### 构建和部署方面

子应用需要独立部署，主应用只需加载子应用的入口文件。可能需要配置子应用的打包输出为 umd 格式，并设置 publicPath 为动态的，以适应不同环境。

#### 一些优化措施

比如预加载子应用资源，提升性能；统一的状态管理方案，比如使用 redux 或 vuex 在主应用和子应用之间共享状态；以及错误处理机制，比如子应用加载失败时的降级处理。

#### qiankun 优缺点

1. 成熟度高、社区资源丰富、沙箱隔离完善
2. 需手动配置子应用生命周期、依赖管理较复杂
3. 适用于多技术栈混合、快速落地的场景

### 微应用改造

一个业务系统并不是一开始就有被集成的价值的，往往是在业务发展到一定程度，经过市场验证其价值之后，大家才会明确这个业务系统具有微应用改造的价值，这就导致一个窘迫的境地：你需要改造已经成型的项目，使其成为可快速接入的微应用。

qiankun 的微应用改造相对比较简单，一般在开启严格沙箱模式之后，微应用和主应用之间建立比较好的环境隔离，你并不需要太多的工作。

1. 首先样式隔离，参考下面 css 隔离。其核心的麻烦在于 qiankun 启动严格沙箱模式之后，会导致 dialog、Modal 等组件无法找到 body 节点，进而无法挂载到 DOM 中。
2. 其次 JS 作用域隔离，这里主要是一些第三方库会在 window 上挂载单例实例，导致主应用和微应用之间单例配置相互覆盖，常见于日志上报、微信 SDK、QQ SDK 等第三方应用。解决方案分为两个方向:
   - 假如主应用存在则沿用主应用的配置：这种方式对主应用比较有利。以日志上报的配置为例，微应用的日志会上报到主应用空间下，那么主应用的日志监控会很完整。缺点则是微应用本身失去了这些监控信息。
   - 微应用对自身使用的单例进行隔离：这种方式对微应用比较有利。以 Axios 的配置为例，子应用可以实现类似中台应用的效果，可以探知到微应用在不同的主应用中的实际使用场景和数据统计。
   - 采用第二种方式时，假如主应用需要进行数据共享或者配置共享，可以通过主应用和微应用之间的参数和数据传递的方式来实现共享，微应用提供丰富的监听 hooks。

### FAQ

#### 1. 如何解决第三方 SDK、JS 文件加载失败问题

- 原因：微信和企业微信的 SDK 是不可以自行构建 Http 请求加载的，这是由于其安全策略导致的，且每次返回的内容有安全限制的改动，无法复用。
- 结果：因此必须要在 html 的 header 中引入，但 qiankun 会对 html - header 所有 script、link 资源构造请求链接，进而导致获取第三方 SDK 的请求报错，整个 qiankun 客户端加载微应用进程报错，无法加载出对应页面。

- 官网在常见问题给了三个解决方案：
  1. 使用 getTemplate 过滤异常脚本；
  2. 使用自定义 fetch 阻断 script 脚本；
  3. 终极方案 - 修改 html 的 content-type；

前两种方案需要在乾坤渲染函数中增加一个对应的参数，这里面有个坑点，则是 prefetchApps 不支持这些参数，因此一旦启用预加载函数，则会导致渲染函数的传入配置失效，因此需要关闭使用预加载函数。

#### 2. CSS 隔离

- 微前端核心理念：解耦 / 技术栈无关，简单来说就是希望微应用之间，基站应用和微应用之间的技术栈可以互相隔离，从而各种定制自己的技术体系来实现开发效率和产品质量的最优化配置，这也是微前端的核心价值体现。
- 主流的沙箱模式是通过创建一个独立的作用域隔离作用域链，同时克隆全局变量来实现的，但是这种隔离 + 克隆方案并不完美，在复杂运行场景中，无论性能还是安全性都是难以保证的，特别是 CSS 的隔离。

1. 首先是基础页面的 CSS，采用的是成熟的 CSS module 方案，简单来说就是将 CSS 变成局部生效，每个 class 生成一个独一无二的名字。从最早的 Less、SASS，到后来的 PostCSS，再到最近的 CSS in JS，都是为了解决 CSS 全局生效带来的副作用。
2. [参考这里](https://mp.weixin.qq.com/s/3SogWNKKJvbaQbvPMg7lVg)

### 微前端集成优化

1. 减少子应用体积：让所有子应用体积更小，加载更快，在代码层的优化，比如按需加载、懒加载、静态资源优化、cdn 等的都是大家熟知的方案

   - 打包优化：gzip 压缩和依赖共享
   - 代码分割：按需加载和动态加载
   - 静态资源优化：图片压缩、字体压缩、css 压缩、js 压缩（tree-shaking 等）等
   - cdn 加速：通过 cdn 加速静态资源，减少请求次数，提高性能
   - 缓存策略：缓存静态资源，减少请求次数，提高性能
   - 错误处理：错误处理，如 404、500 等，优化用户体验
   - 监控：监控系统，如监控用户访问量、页面性能、错误日志等，优化用户体验
   - 优化：如减少请求次数、减少请求体积、减少渲染时间、减少内存占用等，优化用户体验

2. 影响一个前端服务体积、加载速度的主要文件就是第三方依赖`chunk-vendors.js`

#### 依赖共享

未优化时：假设我们有非常多的子应用，每个子应用的 node_modlues 依赖打包也是单独的，在请求这个子应用时，这个依赖文件也是必须请求的。但是很多子应用的第三方依赖都是重复的。比如 vue 的底层依赖、store 的依赖、eslint 的依赖及一些常用的工具依赖。

1. 外部化依赖：最简单的实现方案就是可以将常用的依赖库配置为外部依赖，不打包在每个子应用中，而是通过 CDN 加载。当我们加载主应用时，主应用通过 CDN 的方式请求了 vue 的底层依赖、一些常用的公共库等所有依赖。当我们加载子应用时，和主应用相同的这些依赖因为已经请求过了，浏览器会通过缓存机制直接读取已经缓存的数据，避免了重新请求，子应用的加载速度也得到了进一步的提升！
   - 使用`vite-plugin-cdn-import`

```js
// vite.config.js
import { defineConfig } from "vite";
import cdnImport from "vite-plugin-cdn-import";

export default defineConfig({
  plugins: [
    cdnImport({
      imports: [
        {
          // 库名，比如 `react`
          libraryName: "react", // 库的CDN地址，比如 `https://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js`
          url: "https://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js", // 生产环境是否使用CDN
          prod: true, // 开发环境是否使用CDN
          dev: false,
        }, // 可以继续添加其他库的配置...
      ],
    }),
  ],
});
```

### demo

#### 搭建主应用基座

```js
// main-app/src/micro-fe-setup.js
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "vue2-app",
    entry: "//localhost:7101",
    container: "#subapp-container",
    activeRule: "/vue2",
    props: { authToken: "xxx" }, // 传递全局参数
  },
  {
    name: "vue3-app",
    entry: "//localhost:7102",
    container: "#subapp-container",
    activeRule: "/vue3",
  },
  {
    name: "react16-app",
    entry: "//localhost:7103",
    container: "#subapp-container",
    activeRule: "/react16",
  },
]);

start({
  prefetch: "all", // 预加载子应用
  sandbox: {
    experimentalStyleIsolation: true, // 开启样式沙箱
  },
});
```

#### 子应用改造（Vue2）

```js
// 关键配置
// vue2-app/src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// vue2-app/src/main.js
let instance = null;

function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 暴露qiankun生命周期钩子
export async function bootstrap() {
  console.log("[vue2] app bootstraped");
}

export async function mount(props) {
  console.log("[vue2] props from main framework", props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
}

// Webpack配置
// vue2-app/vue.config.js
module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*", // 允许跨域
    },
  },
  configureWebpack: {
    output: {
      library: `vue2App`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_vue2App`,
    },
  },
};
```

#### 解决多框架冲突

##### 样式隔离方案

1. 启用 qiankun 的  `experimentalStyleIsolation`（添加前缀选择器）
2. 各子应用使用 CSS Modules，Vue 的话使用 scoped，或者 BEM
3. 主应用提供基础 Reset CSS

##### JS 沙箱策略

```js
// 主应用启动配置
start({
  sandbox: {
    strictStyleIsolation: true, // Shadow DOM隔离
    speedy: false, // 兼容IE
  },
});
```

##### 公共依赖处理

```js
// 主应用package.json
{
"sharedDependencies": {
    "lodash": "^4.17.21",
    "axios": "^0.21.1"
  }
}

// 子应用webpack配置
externals: {
'lodash': 'lodash',
'axios': 'axios'
}
```

#### 路由统一管理

1. 主应用路由配置:

```js
// main-app/src/router.js
const routes = [
  { path: "/vue2/*", name: "vue2", meta: { title: "Vue2子系统" } },
  { path: "/vue3/*", name: "vue3", meta: { title: "Vue3子系统" } },
  { path: "/react16/*", name: "react16", meta: { title: "React16子系统" } },
];
```

2. 子应用路由改造（以 React16 为例）：

```js
// react16-app/src/App.js
<Routerbasename={window.__POWERED_BY_QIANKUN__ ? '/react16' : '/'}>
  <Switch>
    <Routepath="/detail"component={DetailPage} />
  </Switch>
</Router>
```

#### 部署优化策略

1. 独立部署：每个子应用单独构建，主应用通过 Nginx 配置反向代理

```bash
location /vue2 {
  proxy_pass http://vue2-server;
}
location /vue3 {
  proxy_pass http://vue3-server;
}
```

2. 资源预加载

```js
start({
  prefetch: (app) => app.name !== "react16-app", // 按需预加载
});
```

3. 性能监控

```js
// 主应用集成监控SDK
import { performanceMonitor } from "@monitor/sdk";

performanceMonitor.init({
  apps: ["vue2-app", "vue3-app", "react16-app"],
});
```

#### 常见问题解决方案

1. 样式污染

- 使用 scoped 样式（Vue）或 CSS Modules
- 主应用添加命名空间前缀：`#subapp-container.ant-btn { /* 覆盖Ant Design样式 */ }`

2. 全局变量冲突

- 子应用卸载时清理全局变量

```js
exportasyncfunctionunmount() {
  deletewindow.__VUE_APP_SHARED_DATA__;
}
```

3. 通信方案

- 使用 qiankun 全局状态

```js
// 使用qiankun全局状态
import { initGlobalState } from "qiankun";

const actions = initGlobalState({ user: null });

// 子应用监听变化
actions.onGlobalStateChange((state, prevState) => {
  console.log("全局状态变更:", state);
});
```

2. 子应用间通信使用 PostMessage、Websocket、EventEmitter、localStorage、URL 传参等都有适用场景。

## CI/CD 持续集成

简单示例：服务器一台，代码仓库托管在 gitlab 上，docker 镜像托管在 dockerhub 上，通过 k8s 部署镜像到服务器上，前端 app 运行在 nginx 上，通过 nginx 代理到后端 app。

> 预处理：dockerhub 以及国内镜像仓库的问题造成直接 docker pull 时无法运行；使用 Github Action 将国外的 Docker 镜像转存到阿里云私有仓库。此处使用 oracle 的云服务器，使用 docker-compose 部署。

具体步骤：假设 gitlab 也部署在 oracle 的云服务器。

| 工具       | 作用                                                       |
| ---------- | ---------------------------------------------------------- |
| GitLab     | 托管代码，触发 Jenkins 构建（通过 Webhook）                |
| Jenkins    | 执行 CI/CD 流水线（构建、测试、打包镜像）                  |
| Docker     | 容器化应用，生成镜像                                       |
| Kubernetes | 编排容器，实现滚动更新、扩缩容                             |
| 镜像仓库   | 存储 Docker 镜像（如 Docker Hub、Harbor、GitLab Registry） |

1. 比如我有一台运行 centos7 的甲骨文云主机，我想在这个机器上部署一套 CICD 流水线，包括 gitlab 托管代码，jenkins，docker，k8s 等，我从本地能推送代码到这个云主机上的 gitlab 仓库里，然后触发 jenkin 去打包生成镜像，然后通过 k8s 部署到这台机器上。
2. GitLab + Jenkins + Docker + Kubernetes 的 CI/CD 流水线设计，![架构图](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/20250417155815962.png)
3. 环境准备（CentOS 7 云主机）:`sudo yum update -y && sudo yum install -y curl wget git vim`
4. 安装 Docker

```bash
# 安装 Docker CE
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证
docker --version
```

5. 安装 Kubernetes（单节点 MiniKube 或 K3s）:`curl -sfL https://get.k3s.io | sh -`，`sudo kubectl get nodes`验证
6. 安装 GitLab

```bash
# 使用 Docker 运行 GitLab
docker run -d \
  --name gitlab \
  --hostname your-server-ip \
  -p 80:80 -p 443:443 -p 22:22 \
  -v /gitlab/config:/etc/gitlab \
  -v /gitlab/logs:/var/log/gitlab \
  -v /gitlab/data:/var/opt/gitlab \
  --restart always \
  gitlab/gitlab-ce:latest

# 等待初始化完成（约 5 分钟），检查状态
docker logs -f gitlab
```

7. 访问 GitLab：`http://<云主机IP>`，初始密码：`sudo docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password`
8. 安装 Jenkins

```bash
# 使用 Docker 运行 Jenkins
docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v /jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --restart always \
  jenkins/jenkins:lts

# 获取初始密码
docker logs jenkins  # 查找 "InitialAdminPassword"
```

9. 访问 Jenkins：`http://<云主机IP>:8080`
10. 配置 GitLab 和 Jenkins:

- 在 GitLab 中创建项目（如 my-app），上传代码（含 Dockerfile）。
- 配置 GitLab Webhook：进入 `Settings > Webhooks`，URL 填写 `http://<云主机IP>:8080/gitlab/build_now`。触发事件选择 `Push events`。
- 在 Jenkins 中安装插件：GitLab Plugin、Docker Pipeline、Kubernetes CLI。
- 创建 Jenkins Pipeline：选择 Pipeline 类型，定义从 GitLab 拉取代码的 Jenkinsfile（见下文）。

```jenkinsfile
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'http://<云主机IP>/your-group/my-app.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("my-app:${env.BUILD_ID}")
                }
            }
        }
        stage('Deploy to K8s') {
            steps {
                sh """
                    kubectl apply -f k8s-deployment.yaml
                """
            }
        }
    }
}
```

11. 准备 Kubernetes 部署文件，创建 k8s-deployment.yaml：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:latest # Jenkins 会动态替换为 ${BUILD_ID}
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: NodePort
  ports:
    - port: 80
      nodePort: 30080
  selector:
    app: my-app
```

12. 将 Jenkins 用户加入 Docker 组：`sudo usermod -aG docker jenkins`，防止 Jenkins 构建权限不足。
13. 本地推送代码触发流水线自动触发流程：`GitLab → Jenkins → Docker → Kubernetes → 应用部署`。
14. 验证部署：`sudo kubectl get pods`，`curl http://<云主机IP>:30080`。
15. 生产环境建议分离组件到不同节点。使用 Harbor 替代本地 Docker Registry 管理镜像。
