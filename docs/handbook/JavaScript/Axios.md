---
title: 用TS封装axios
author: EricYangXD
date: "2022-05-15"
---

## 用 TS 封装 axios

```js
import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type {
  RequestConfig,
  RequestInterceptors,
  CancelRequestSource,
} from './types'

class Request {
  // axios 实例
  instance: AxiosInstance
  // 拦截器对象
  interceptorsObj?: RequestInterceptors<AxiosResponse>

  /*
  存放取消方法的集合
  * 在创建请求后将取消请求方法 push 到该集合中
  * 封装一个方法，可以取消请求，传入 url: string|string[]
  * 在请求之前判断同一URL是否存在，如果存在就取消请求
  */
  cancelRequestSourceList?: CancelRequestSource[]
  /*
  存放所有请求URL的集合
  * 请求之前需要将url push到该集合中
  * 请求完毕后将url从集合中删除
  * 添加在发送请求之前完成，删除在响应之后删除
  */
  requestUrlList?: string[]

  constructor(config: RequestConfig) {
    this.requestUrlList = []
    this.cancelRequestSourceList = []
    this.instance = axios.create(config)
    this.interceptorsObj = config.interceptors
    // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    this.instance.interceptors.request.use(
      (res: AxiosRequestConfig) => res,
      (err: any) => err,
    )

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch,
    )
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch,
    )
    // 全局响应拦截器保证最后执行
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res: AxiosResponse) => {
        return res.data
      },
      (err: any) => err,
    )
  }
  /**
   * @description: 获取指定 url 在 cancelRequestSourceList 中的索引
   * @param {string} url
   * @returns {number} 索引位置
   */
  private getSourceIndex(url: string): number {
    return this.cancelRequestSourceList?.findIndex(
      (item: CancelRequestSource) => {
        return Object.keys(item)[0] === url
      },
    ) as number
  }
  /**
   * @description: 删除 requestUrlList 和 cancelRequestSourceList
   * @param {string} url
   * @returns {*}
   */
  private delUrl(url: string) {
    const urlIndex = this.requestUrlList?.findIndex(u => u === url)
    const sourceIndex = this.getSourceIndex(url)
    // 删除url和cancel方法
    urlIndex !== -1 && this.requestUrlList?.splice(urlIndex as number, 1)
    sourceIndex !== -1 &&
      this.cancelRequestSourceList?.splice(sourceIndex as number, 1)
  }
  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config)
      }
      const url = config.url
      // url存在保存取消请求方法和当前请求url
      if (url) {
        this.requestUrlList?.push(url)
        config.cancelToken = new axios.CancelToken(c => {
          this.cancelRequestSourceList?.push({
            [url]: c,
          })
        })
      }
      this.instance
        .request<any, T>(config)
        .then(res => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res)
          }

          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
        .finally(() => {
          url && this.delUrl(url)
        })
    })
  }
  // 取消请求
  cancelRequest(url: string | string[]) {
    if (typeof url === 'string') {
      // 取消单个请求
      const sourceIndex = this.getSourceIndex(url)
      sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][url]()
    } else {
      // 存在多个需要取消请求的地址
      url.forEach(u => {
        const sourceIndex = this.getSourceIndex(u)
        sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][u]()
      })
    }
  }
  // 取消全部请求
  cancelAllRequest() {
    this.cancelRequestSourceList?.forEach(source => {
      const key = Object.keys(source)[0]
      source[key]()
    })
  }
}

export default Request
export { RequestConfig, RequestInterceptors }
```

```ts
import type { AxiosRequestConfig, AxiosResponse } from "axios";
export interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;
  // 响应拦截
  responseInterceptors?: (config: T) => T;
  responseInterceptorsCatch?: (err: any) => any;
}
// 自定义传入的参数
export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
}
export interface CancelRequestSource {
  [index: string]: () => void;
}
```

## 取消请求

### 取消 axios

从 v0.22.0 开始，Axios 支持以 fetch API 方式 —— AbortController 取消请求：

```js
const controller = new AbortController();

axios
  .get("/foo/bar", {
    signal: controller.signal,
  })
  .then(function (response) {
    //...
  });
// 取消请求
controller.abort();
```

您还可以使用 cancel token 取消一个请求。此 API 从 v0.22.0 开始已被弃用，不应在新项目中使用。「可以使用同一个 cancel token 或 signal 取消多个请求」。

```js
// 创建取消令牌的生成器对象
const CancelToken = axios.CancelToken;
// 获取令牌对象
const source = CancelToke.source();
axios.get("/url/123", {
  cancelToken: source.token,
});
// 2秒后取消请求
setTimeout(() => {
  source.cancel();
}, 2000);
```

### 取消 XMLHttpRequest

如果该请求已被发出，XMLHttpRequest.abort() 方法将终止该请求。当一个请求被终止，它的 readyState 将被置为 XMLHttpRequest.UNSENT (0)，并且请求的 status 置为 0。

```js
var xhr = new XMLHttpRequest(),
  method = "GET",
  url = "https://developer.mozilla.org/";
xhr.open(method, url, true);

xhr.send();

if (OH_NOES_WE_NEED_TO_CANCEL_RIGHT_NOW_OR_ELSE) {
  xhr.abort();
}
```

### 取消 fetch

`fetch API` 中已经集成了`AbortSignal`，使用时需要将 controller 中的信号对象作为 signal 参数传递给 fetch，当调用`controller.abort()`后，fetch 的 promise 会变为`Abort Error DOMException reject`。catch 方法中的 error 变为：「DOMException: The user aborted a request.」

```js
const controller = new AbortController();
const signal = controller.signal;

fetch("https://baidu.com/", {
  signal,
})
  .then(() => {})
  .catch((err) => {
    console.log(err); // DOMException: The user aborted a request.
    if (err.name === "") {
      // 中止信号
    } else {
      // 其他错误
    }
  });

// 监听abort事件
signal.addEventListener("abort", () => {
  console.log("中断信号发出");
});

// 控制器发出中断信号
controller.abort();
console.log("是否中断：", signal.aborted);
```

### axios 与 fetch 的区别

1. fetch 是原生 js API，在 IE 下原生不支持，需要 polyfill。axios 是基于 XMLHttpRequest 封装的，可以兼容 IE11
2. axios 提供了 interceptors，可以在请求发出前和响应到达后统一处理（如自动加 token、统一错误处理）。fetch 没有拦截器机制，需要自己封装。
3. axios 默认会自动把返回的 JSON 数据转成对象（response.data），fetch 需要手动 .json()。axios 支持多种响应类型自动处理。
4. axios 内置超时控制，设置 timeout 参数即可。fetch 没有超时机制，需要用 Promise.race 或 AbortController 自己实现。
5. axios 支持 onUploadProgress、onDownloadProgress（XHR 实现）。fetch 原生不支持上传进度，下载进度要用 ReadableStream 手动实现，较复杂。
6. axios 会自动将对象参数转换为 URL 查询字符串或表单格式。fetch 要自己手动拼接。
