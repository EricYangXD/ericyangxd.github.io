---
title: 记录一些 TS 的奇技淫巧 2333
author: EricYangXD
date: "2021-12-29"
---

## Omit

-   Omit<T,K>类型让我们可以从另一个对象类型中剔除某些属性，并创建一个新的对象类型：T：是对象类型名称，K：是剔除 T 类型中的属性名称。

-   Q.实现一个工具类型：SomeRequired<T,K>，作用是将对象 T 内，属于 K 的 key 标记为 required，其他的保持原样。

```ts
type SomeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
```

-   A.先从 T 中剔除 K，得到新的对象类型；从 T 中选出 K 并标记为 Required 得到新的对象类型；合并这两个类型得到想要的类型。

## Required

-   把所有属性变成必需的 required

```bash
# eg.源码
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

## Pick

-   从一个复合类型中，取出几个想要的类型的组合，得到一个新类型

```bash
# eg.源码
type Pick<T, K extends keyof T> = {
  [key in k]: T[key]
}

# eg. 从TState中拿到name和age属性，组成一个新的类型TSingleState
interface TSingleState extends Pick<TState, "name" | "age"> {};
```

-   解析：在泛型中使用 extends 并不是用来继承的，而是用来约束类型的。所以这个 K extends keyof T，应该是说 key 被约束在 T 的 key 中，不能超出这个范围，否则会报错的。

## & 交叉类型 extends

-   与

## | 联合类型

-   或

## Partial

-   Make all properties in T optional，把某个类型中的所有属性都变为可选

```bash
# eg.源码
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

## Readonly

-   变为只读

```bash
# eg.源码
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

## Record

-   Construct a type with a set of properties K of type T，即将 K 中的每个属性([P in K]),都转为 T 类型。

```bash
# eg.源码
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
# eg.
type Person6 = Record<'name' | 'age', string>;
// Person6 === {name: string; age: string}
```

## declare namespace

-   如果代码中用到了一个 TS 无法识别的类型/变量或者引入一个第三方模块时，可以新建 同名.d.ts 文件，在里面 declare module 'xxx'；

```ts
// global.d.ts
declare var n: number;
declare let s: string;
declare const o: object;
declare function f(s: string): number;
declare enum dir {
	top,
	right,
	bottom,
	left,
}
```

-   或者在 global.d.ts 中全局声明：

```ts
declare namespace MyPlugin {
	var n: number;
	var s: string;
	var f: (s: string) => number;
}
```

-   修改已存在的全局变量声明

```ts
declare global {
	interface String {
		hump(input: string): string;
	}
}
// 注意: 修改"全局声明"必须在模块内部, 所以至少要有 export{}字样
// 不然会报错❌: 全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中
export {};
```

## 使用泛型时用 extends 进行类型约束

```ts
function test<T extends number | string, Y extends number | string>(
	a: T,
	b: Y
) {
	console.log(a, b);
}
test<number, number>(12, 23);
```
