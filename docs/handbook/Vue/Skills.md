---
title: Vue Tips
author: EricYangXD
date: "2021-12-29"
---

## 指令 directive

```js
// main.ts
// 引入全局filter
import filters from '@/assets/mod/filters';
// 引入全局组件注册
import globalComponents from '@/components/global-components';
import permission from '@/directives/permission';
// 指令
Vue.use(permission);
// 过滤器
Vue.use(filters);
// 全局组件
Vue.use(globalComponents);

// permission.ts
import { VueConstructor } from 'vue';
const checkPermission: (value: string, type?: string) => boolean = (value: string, type = 'xx') => {...};
const permission: DirectiveOptions = {
  inserted(el: HTMLElement, binding) {
    const { value, arg = 'or' } = binding;
    const hasPermission = checkPermission(value, arg);
    if (!hasPermission) {
      // eslint-disable-next-line no-param-reassign
      el.style.display = 'none';
    }
  },
};

const install = function(Vue: VueConstructor<Vue>) {
  Vue.directive('permission', permission);
};

export default {
  install,
};

// filters.ts
import { VueConstructor } from 'vue';
import { dateFormat, getShowDate } from './utils';

// 日期格式化
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDate = (value: any, pattern = 'yyyy-MM-dd hh:mm:ss') => dateFormat(value, pattern);

// 数字加百分比
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const numPercent = (val: any, sign = 1) => {
  const isNum = /^[+-]?[\d,.]*$/;
  if (isNum.test(val) && val > 0) {
    return sign ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`;
  }
  if (isNum.test(val) && val === 0) {
    return '0.00%';
  }
  if (isNum.test(val) && val < 0) {
    return `${val.toFixed(2)}%`;
  }
  return '-';
};
const showDate = (str: string) => getShowDate(str);
const filter = {
  install(Vue: VueConstructor<Vue>) {
    Vue.filter('formatDate', formatDate);
    Vue.filter('numPercent', numPercent);
    Vue.filter('showDate', showDate);
  },
};
export default filter;


// utils.ts
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path);
export const isString = function(str: any) {
  return typeof str === 'string';
};
// 日期时间格式化
export const dateFormat = function(str: string, format: string) {
  if (!str) return '-';
  let val = str;
  if (typeof str === 'string' && str.indexOf('T') === -1) {
    val = str.replace(/-/g, '/');
  }
  const value = new Date(val);

  interface DateFormat {
    [index: string]: number;
  }
  const o: DateFormat = {
    'M+': value.getMonth() + 1,
    'd+': value.getDate(),
    'h+': value.getHours(),
    'm+': value.getMinutes(),
    's+': value.getSeconds(),
  };
  if (/(y+)/.test(format)) {
    // eslint-disable-next-line no-param-reassign
    format = format.replace(RegExp.$1, `${value.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      // eslint-disable-next-line no-param-reassign
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? `${o[k]}` : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  }
  return format;
};

/**
 * 防抖函数
 * @param  {Function}   fn   需要防抖的函数
 * @param  {Number}     interval   防抖间隔时间
 * @return  {Function}      处理后的方法
 */
export const debounce = function(fn: Function, interval = 300) {
  let timeout: number;

  return function() {
    window.clearTimeout(timeout);

    timeout = window.setTimeout((...ags: any) => {
      fn(...ags);
    }, interval);
  };
};
/**
 * 节流函数
 * @param func
 * @param delay
 */
export const throttle = function(func: any, delay = 300) {
  let prev = Date.now();
  return function() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const now = Date.now();
    if (now - prev >= delay) {
      func(args);
      prev = Date.now();
    }
  };
};

/**
 *获取url参数
 * @param variable
 */
export const getQueryVariable = function(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
};

export const getCookie = function(name: string) {
  const re = new RegExp(`(?:^|;+|\\s+)${name}=([^;]*)`);
  const result = document.cookie.match(re);
  return !result ? '' : result[1];
};

// 字符串下划线转驼峰写法
export const toCamelCase = function(str: string) {
  return str.replace(/([^_])(?:_+([^_]))/g, ($0, $1, $2) => $1 + $2.toUpperCase());
};

// 字符串驼峰转下划线(蛇式写法)
export const toSnakeStyle = function(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

// 属性转驼峰
export const dataKeyToCamelCase = function(data: any) {
  if (data && data.toString() === '[object Object]') {
    // 属性值为对象情况
    Object.keys(data).forEach((key) => {
      if (key.includes('_')) {
        // eslint-disable-next-line no-param-reassign
        data[toCamelCase(key)] = data[key];
        // eslint-disable-next-line no-param-reassign
        delete data[key];
      }
      dataKeyToCamelCase(data[key]);
    });
  } else if (data && data instanceof Array) {
    // 属性值为数组情况
    data.forEach((item) => {
      dataKeyToCamelCase(item);
    });
  }
};

// 属性转蛇式写法
export const dataKeyToSnakeStyle = function(data: any, reqParams: string[]) {
  if (data && data.toString() === '[object Object]') {
    // 属性值为对象情况
    Object.keys(data).forEach((key) => {
      if (reqParams.length === 0 || (reqParams && reqParams.includes(key))) {
        // eslint-disable-next-line no-param-reassign
        data[toSnakeStyle(key)] = data[key];
        // eslint-disable-next-line no-param-reassign
        delete data[key];
      }
      dataKeyToSnakeStyle(data[key], reqParams);
    });
  } else if (data && data instanceof Array) {
    // 属性值为数组情况
    data.forEach((item) => {
      dataKeyToSnakeStyle(item, reqParams);
    });
  }
};

export const formatDataToCamel = function(obj: any) {
  const { next, data } = obj;
  dataKeyToCamelCase(data);
  next(obj);
};

export const getTextWidth = function(text: string, font: string) {
  // re-use canvas object for better performance
  const canvas: any =
    (getTextWidth as any).canvas ||
    ((getTextWidth as any).canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};
/**
 * 日期比较(d1 - d2)
 *
 * @method dateDiff
 * @param {Date} d1
 * @param {Date} d2
 * @param {String} [cmpType:ms] 比较类型, 可选值: Y/M/d/h/m/s/ms -> 年/月/日/时/分/妙/毫秒
 * @return {Float}
 */
function dateDiff(d1: any, d2: any, cmpType?: string) {
  let diff = 0;
  // eslint-disable-next-line no-param-reassign
  d1 = new Date(d1);
  // eslint-disable-next-line no-param-reassign
  d2 = new Date(d2);
  switch (cmpType) {
    case 'Y':
      diff = d1.getFullYear() - d2.getFullYear();
      break;
    case 'M':
      diff = (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
      break;
    case 'd':
      // eslint-disable-next-line no-param-reassign
      d1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
      // eslint-disable-next-line no-param-reassign
      d2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
      diff = (d1 - d2) / 86400000;
      break;
    case 'h':
      // eslint-disable-next-line no-param-reassign
      d1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours());
      // eslint-disable-next-line no-param-reassign
      d2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours());
      diff = (d1 - d2) / 3600000;
      break;
    case 'm':
      // eslint-disable-next-line no-param-reassign
      d1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes());
      // eslint-disable-next-line no-param-reassign
      d2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes());
      diff = (d1 - d2) / 60000;
      break;
    case 's':
      // eslint-disable-next-line no-param-reassign
      d1 = Date.UTC(
        d1.getFullYear(),
        d1.getMonth(),
        d1.getDate(),
        d1.getHours(),
        d1.getMinutes(),
        d1.getSeconds()
      );
      // eslint-disable-next-line no-param-reassign
      d2 = Date.UTC(
        d2.getFullYear(),
        d2.getMonth(),
        d2.getDate(),
        d2.getHours(),
        d2.getMinutes(),
        d1.getSeconds()
      );
      diff = (d1 - d2) / 1000;
      break;
    default:
      diff = d1 - d2;
      break;
  }
  return diff;
}
// 获取特定时间
export const getShowDate = function(targetDate: any) {
  const MINUTE = 6e4; // 60秒
  const curDate = new Date();
  const diff = dateDiff(curDate, targetDate); // 相差的秒数
  let diffMinute = Math.floor(diff / MINUTE); // 相差的分钟
  const diffDays = Math.floor(diffMinute / (60 * 24)); // 相差的天数
  let result;

  if (diffDays < 0) {
    result = '刚刚';
  } else if (diffDays === 0) {
    if (!diffMinute || diffMinute <= 0) {
      diffMinute = 1;
    }
    // eslint-disable-next-line no-nested-ternary
    result =
      diffMinute < 60
        ? diffMinute < 5
          ? '刚刚'
          : `${diffMinute}分钟前`
        : `${parseInt(`${diffMinute / 60}`, 10)}小时前`;
  } else if (diffDays < 7) {
    result = `${diffDays}天前`;
  } else {
    result = dateFormat(targetDate, 'yyyy-MM-dd hh:mm');
  }

  return result;
};

// global-components.ts
import { VueConstructor } from 'vue';
import MyPagination from '@/components/my-pagination/index.vue';

export default {
  install(Vue: VueConstructor<Vue>) {
    Vue.component('my-pagination', MyPagination);
  },
};

// my-pagination/index.vue
// 自定义ElementUI的分页样式
<template>
  <div class="am-pagination">
    <el-pagination
      :current-page.sync="currentPageSync"
      :layout="layout"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    >
      <el-dropdown placement="bottom" @command="handleSizeChange">
        <div>
          <span class="pagination-text left">每页</span>
          <el-button class="dropdowm-page__button">
            <span>{{ pageSize }}<i class="el-icon-arrow-down el-icon--right"></i></span>
          </el-button>
          <span class="pagination-text right">条</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="p in pageSizes" :key="p" :command="p">{{ p }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-pagination>
  </div>
</template>

<script lang="ts">
/**
 * 自定义分页组件
 * 默认参数
 * layout: slot, prev, pager, next
 * total:  0
 * pageSize: 5
 * currentPage: 1
 * */

import { Component, Prop, PropSync, Emit, Vue } from 'vue-property-decorator';

@Component
export default class AmPagination extends Vue {
  @Prop({ default: 0 }) total!: number;

  @Prop({ default: 5 }) pageSize!: number;

  @Prop({ default: (layout: string) => `slot, ${layout || 'prev, pager, next'}` }) layout!: string;

  @Prop({ default: () => [5, 20, 50, 100] }) pageSizes!: Array<number>;

  @PropSync('currentPage', { default: 1, type: Number }) currentPageSync!: number;

  @Emit('size-change')
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  handleSizeChange(pageSize: number) {}

  @Emit('current-change')
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  handleCurrentChange(currentPage: number) {}
}
</script>
<style lang="scss" scoped>
.am-pagination .el-pagination {
  .pagination-text {
    width: 30px;
    height: 30px;
    font-size: 14px;
    color: #000b14;
    letter-spacing: 0;
    line-height: 30px;
    font-weight: 400;
    &.right {
      text-align: left;
      padding-left: 8px;
    }
    &.left {
      text-align: right;
      padding-right: 8px;
    }
  }

  .dropdowm-page__button {
    width: 60px;
    height: 28px;
    position: relative;
    text-align: left;
    line-height: 24px;
    padding: 0 10px 0 12px;
    background: #fff;
    border: 1px solid rgba(2, 5, 10, 0.08);
    color: rgba(0, 0, 0, 0.6);
  }

  .el-icon-arrow-down.el-icon--right {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
</style>
```

## webpack devServer proxy 配置

```js
module.exports = {
  devServer: {
    proxy: (() => {
      if (SERVER_ENV === 'mock') {
        return {
          '/api/search': {
            target: 'http://127.0.0.1:8081', // target表示代理的服务器url
            pathRewrite: {
              // pathRewrite表示路径重写，key表示一个正则，value表示别名
              '^/api': '/api', // 即用 '/api'表示'http://localhost:3000/api'
            },
          },
          ...
        };
      }
      return {
        '/fileProcess': { // mock 个接口啥的
          target:
            'https://www.baidu.com/fileProcess', // target表示代理的服务器url
          pathRewrite: {
            // pathRewrite表示路径重写，key表示一个正则，value表示别名
            '^/fileProcess': '/', // 即用 '/api'表示'http://localhost:3000/api'
          },
        },
        ...
      };
    })(),
  }
};

```

## TypeScript

-   "vue-class-component"
-   "vue-property-decorator"
-   "vuex"
-   "vuex-module-decorators"
-   "vue-router"
-   "vue"

## webpack plugin

-   写个插件把打包后的文件中的环境配置替换为对应的环境变量

```js
class CustomHtmlPlugin {
	constructor(options = {}) {
		this.options = options;
	}

	apply(compiler) {
		const replacements = this.options.replacements || {};
		compiler.hooks.compilation.tap("CustomHtmlPlugin", (compilation) => {
			compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapPromise(
				"CustomHtmlPlugin",
				(data) => {
					let html = data.html;
					return new Promise((resolve) => {
						Object.keys(replacements).forEach((key) => {
							// key = key.replace(/\s*/g, '');
							let value = replacements[key];
							if (typeof value !== "string") {
								value = JSON.stringify(value);
							}
							html = html.replace(
								new RegExp("{{" + key + "}}", "g"),
								value
							);
						});
						data.html = html;
						resolve(data);
					});
				}
			);
		});
	}
}

module.exports = CustomHtmlPlugin;
```

-   使用的时候：

```js
new CustomHTMLPlugin({
  replacements: require('./env-configs/index')
}),
```

## 利用 webpack 的 require.context 动态注册路由

```js
const registerRoutes = () => {
	const contextInfo = require.context("./views", true, /.vue$/);
	const routes = contextInfo.keys().map((filePath) => {
		// filePath 形如 ./Home.vue、./modifiers/capture.vue
		// path我们希望是/home、/modifiers/capture
		// 所以需要把开头的./和.vue都替换为空
		const path = filePath.toLowerCase().replace(/^\.|\.vue/g, "");
		// name的话将/home、/modifiers/capture转成小驼峰即可
		// 把开头的/先替换掉，再把第一个/后的单词变成大写就可以了
		const name = path
			.replace(/^\//, "")
			.replace(/\/(\w)/, ($0, $1) => $1.toUpperCase());
		// 通过require去读取.vue文件内容
		const component = require(`./views${filePath.replace(
			/^\./,
			""
		)}`).default;

		return {
			path,
			name,
			component,
		};
	});

	return routes;
};
```

## 查看 Vue 默认 webpack 配置

在使用 vue-cli-service 新建的项目中：`vue-cli-service inspect > output.js`
