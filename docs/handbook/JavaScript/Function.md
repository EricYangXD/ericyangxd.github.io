---
title: 记录一些常见的函数实现
author: EricYangXD
date: "2022-02-09"
---

## 手写某些函数，理解其原理

### 防抖 debounce

防抖 (debounce): 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。

```js
function debounce(fn, wait, immediate) {
	let timer = null;

	return function () {
		let args = arguments;
		let context = this;

		if (immediate && !timer) {
			fn.apply(context, args);
		}

		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, wait);
	};
}
```

### 节流 throttle

节流(throttle): 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms 执行一次即可。

```js
function throttle(fn, wait, immediate) {
	let timer = null;
	let callNow = immediate;

	return function () {
		let context = this,
			args = arguments;

		if (callNow) {
			fn.apply(context, args);
			callNow = false;
		}

		if (!timer) {
			timer = setTimeout(() => {
				fn.apply(context, args);
				timer = null;
			}, wait);
		}
	};
}
```

### 坐标转换

1. 百度坐标转高德（传入经度、纬度）

```js
function bd_decrypt(bd_lng, bd_lat) {
	var X_PI = (Math.PI * 3000.0) / 180.0;
	var x = bd_lng - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return { lng: gg_lng, lat: gg_lat };
}
```

2. 高德坐标转百度（传入经度、纬度）

```js
function bd_encrypt(gg_lng, gg_lat) {
	var X_PI = (Math.PI * 3000.0) / 180.0;
	var x = gg_lng,
		y = gg_lat;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
	var bd_lng = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return {
		bd_lat: bd_lat,
		bd_lng: bd_lng,
	};
}
```

## 随机颜色

```js
function randomHexColor() {
	return (
		"#" +
		("0000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
	);
}
```

## 检测是否能跨域

```js
function corsEnabled(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, false);
	try {
		xhr.send();
	} catch (e) {}
	return xhr.status >= 200 && xhr.status <= 299;
}
```

## 数组乱序 Fisher–Yates

缺陷：理论上会有可能 shuffle 结果和原数组相同的情况。

```js
function shuffle(a) {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
	return a;
}
```
