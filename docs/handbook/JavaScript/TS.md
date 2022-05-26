---
title: 记录一些 TS 的奇技淫巧 2333
author: EricYangXD
date: "2021-12-29"
---

## 官方提供的工具类型

### Omit

-   Omit<T,K>类型让我们可以从另一个对象类型中剔除某些属性，并创建一个新的对象类型：T：是对象类型名称，K：是剔除 T 类型中的属性名称。

-   Q.实现一个工具类型：SomeRequired<T,K>，作用是将对象 T 内，属于 K 的 key 标记为 required，其他的保持原样。

```ts
type SomeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
```

-   A.先从 T 中剔除 K，得到新的对象类型；从 T 中选出 K 并标记为 Required 得到新的对象类型；合并这两个类型得到想要的类型。

```ts
type Pick<T, K extends keyof T> = {
	[P in K]: T[P];
};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Required

-   把所有属性变成必需的 required

```ts
# eg.源码
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

### Pick

-   从一个复合类型中，取出几个想要的类型的组合，得到一个新类型

```ts
# eg.源码
type Pick<T, K extends keyof T> = {
  [key in k]: T[key]
}

# eg. 从TState中拿到name和age属性，组成一个新的类型TSingleState
interface TSingleState extends Pick<TState, "name" | "age"> {};
```

-   解析：在泛型中使用 extends 并不是用来继承的，而是用来约束类型的。所以这个 K extends keyof T，应该是说 key 被约束在 T 的 key 中，不能超出这个范围，否则会报错的。

### Partial

-   Make all properties in T optional，把某个类型中的所有属性都变为可选

```ts
# eg.源码
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

### Readonly

-   变为只读

```ts
# eg.源码
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

被 readonly 标记的属性只能在声明时或类的构造函数中赋值。readonly 只能用在类（TS 里也可以是接口）中的属性上，相当于一个只有 getter 没有 setter 的属性的语法糖。

实现一个深度声明 readonly 的类型：

```ts
type DeepReadonly<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>;
};

const a = { foo: { bar: 22 } };
const b = a as DeepReadonly<typeof a>;
b.foo.bar = 33; // Cannot assign to 'bar' because it is a read-only property.ts(2540)
```

### Record

-   Construct a type with a set of properties K of type T，即将 K 中的每个属性([P in K]),都转为 T 类型。

```ts
# eg.源码
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
# eg.
type Person6 = Record<'name' | 'age', string>;
// Person6 === {name: string; age: string}
```

### Exclude<T,U>

把 T 中不属于 U 的提取出来

### Extract<T,U>

把 T 中属于的 U 提取出来

### NonNullable<T>

提取出 T 中不是 null、undefined 的值

### Parameters<T>

### ReturnType<T>

获取返回值的类型

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (
	...args: any[]
) => infer R
	? R
	: any;
```

### InstanceType<T>

### ThisType<T>

### Mutable

功能是将类型的属性「变成可修改」，这里的 -指的是去除。 -readonly 意思就是去除只读，也就是可修改啦。

```ts
type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};
```

## & 交叉类型 extends

-   与

## | 联合类型

-   或

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

## 几个好用的类型定义

```ts
export type HookSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type ValueOf<T> = T[keyof T];

export type Nullable<T> = T | undefined | null;

export type AllNullable<T> = { [K in keyof T]: Nullable<T[K]> };

export type AllNonNullable<T> = { [K in keyof T]: NonNullable<T[K]> };

export type SomePartial<T, R extends keyof T> = Omit<T, R> &
	Pick<Partial<T>, R>;

export type SomeRequired<T, R extends keyof T> = Omit<T, R> &
	Pick<Required<T>, R>;
```

### ts 怎么用类型表示一个 Serializable 对象

```ts
// 深层对象不行
type SerializableKey = string | number;

type SerializableValue = string | number | boolean | null | undefined;

type SerializableObject = Record<SerializableKey, SerializableValue>;

type SerializableDeepObject =
	| SerializableObject
	| Record<SerializableKey, SerializableValue | SerializableObject>;

type SerializableArray = SerializableValue[] | SerializableDeepObject[];

type Serializable =
	| SerializableValue
	| SerializableDeepObject
	| SerializableArray;

let obj: Serializable = [{ c: { a: 1 } }];

console.log(obj);
// 改进深层对象可以
interface SerializableObject {
	[key: SerializableKey]: SerializableValue | SerializableObject;
}

type Serializable = SerializableObject | SerializableObject[];

obj: Serializable = [
	{
		a: {
			b: {
				c: 1,
			},
		},
	},
];
console.log(obj);
```

## 类型声明报错

在 tsconfig.json -> compilerOptions 的添加"skipLibCheck": true, 曲线救国。

## typescript 工具函数原理

### 类型索引

为了实现上面的工具函数, 我们需要先了解以下几个语法:

-   keyof : 获取类型上的 key 值；
-   extends : 泛型里面的约束；
-   T[K] : 获取对象 T 相应 K 的元素类型；

```ts
type Partial<T> = {
	[P in keyof T]?: T[P];
};

type Record<K extends string, T> = {
	[P in K]: T;
};
```

### never, 构造条件类型

never: 从未出现的值的类型

```ts
type Exclude<T, U> = T extends U ? never : T;

// 相当于: type A = 'a'
type A = Exclude<"x" | "a", "x" | "y" | "z">;
```

### 更简洁的修饰符: - 与 +

可以直接去除/增加 `?`或者 `readonly` 等修饰符.

```ts
// 移除 ?
type Required<T> = { [P in keyof T]-?: T[P] };

// Remove readonly
type MutableRequired<T> = {
	-readonly [P in keyof T]: T[P];
};
```

### infer

infer: 在 extends 条件语句中待推断的类型变量。在类型前加一个关键字前缀 infer，TS 会将推导出的类型自动填充进去。

```ts
// 需要获取到 Promise 类型里蕴含的值
type PromiseVal<P> = P extends Promise<infer INNER> ? INNER : P;

type PStr = Promise<string>;

// Test === string
type Test = PromiseVal<PStr>;
```

在这个条件语句 `T extends (param: infer P) => any ? P : T` 中，infer P 表示待推断的函数参数。

整句表示为：如果 T 能赋值给 `(param: infer P) => any`，则结果是 `(param: infer P) => any` 类型中的参数 P，否则返回为 T。

### type 和 interface 的区别

An interface can be named in an extends or implements clause, but a type alias for an object type literal cannot.

An interface can have multiple merged declarations, but a type alias for an object type literal cannot.

**能用 interface 实现，就用 interface， 如果不能才用 type。**

| type 类型别名                                      | interface 接口                        |
| -------------------------------------------------- | ------------------------------------- |
| 只能通过 & 进行合并/扩展，也可以叫做 交叉类型      | 同名自动合并，通过 extends 扩展/继承  |
| 更强大，除了以上的类型，还可以支持 string，数组... | 自身只能表达 object/class/function 等 |

接口和类型别名不是互斥的。接口可以扩展类型别名 `extends`，反之亦然 `&`。

1. type 可以做到，但 interface 不能做到的事情

-   type 可以定义 基本类型的别名，如 type myString = string
-   type 可以通过 typeof 操作符来定义，如 type myType = typeof someObj
-   type 可以声明 联合类型，如 type unionType = myType1 | myType2
-   type 可以声明 元组类型，如 type yuanzu = [myType1, myType2]

2. interface 可以做到，但是 type 不可以做到的事情

-   interface 可以 声明合并，即两个同名的 interface 会自动合并成二者的并集，而对于 type 的话，就会是 覆盖 的效果，始终只有最后一个 type 生效

3. 查找类型 + 泛型 + keyof

```ts
interface API {
	"/user": { name: string };
	"/menu": { foods: string[] };
}
const get = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
	return fetch(url).then((res) => res.json());
};
```

4. 多个同名 interface 发生合并时，同名属性的类型必须一致，否则报错，而其中同名函数（函数重载）的顺序是：1.后声明的 interface 中的先于早声明的；2.同个 interface 中按声明的先后排列；3.如果某个重载的参数类型是字符串字面量，那么该重载的优先级最高；

## TypeScript 编译器是如何工作的？

1. TypeScript 文本首先会被 scanner 解析为 token 流。这个过程比较简单，就是单纯地按照分隔符去分割文本即可。
2. 接着 token 流会被 parser 转换为 AST，也就是抽象语法树。
3. binder 则根据 AST 信息生成 Symbol（TypeScript 中的一个数据结构）。
4. 当我们需要类型检查的时候， checker 会根据前面生成的 AST 和 symbols 生成类型检查结果。
5. 当我们需要生成 JS 文件的时候，emitter 同样会根据前面生成的 AST 和 symbols 生成 JS 文件。

-   declare: 值空间声明
-   type/interface/函数类型等: 类型空间声明
-   值空间虽然不能直接和类型空间接触，但是类型空间可以作用在值空间，从而给其添加类型

### 类型推导 & 类型收敛

```ts
// 类型推导
const a = 1;
type A = typeof a; // A的类型是 1
// 类型收敛
let a = 1;
type A = typeof a; // A的类型是 number
```

### 泛型

泛型的写法就是在标志符后面添加尖括号`<>`，然后在尖括号里写形参，并在 body（函数体， 接口体或类体） 里用这些形参做一些逻辑处理。

这个时候 T 就不再是任意类型，而是被实现接口的 shape，当然你也可以继承多个接口。「类型约束是非常常见的操作，大家一定要掌握。」

-   泛型要用尖括号 `<>`，而不是别的。
-   函数泛型，接口泛型和类泛型。

### 泛型的参数类型 - “泛型约束”

```ts
interface Sizeable {
	size: number;
}
function trace<T extends Sizeable>(arg: T): T {
	console.log(arg.size);
	return arg;
}
```

### 默认参数

```ts
// 默认 string
type A<T = string> = Array<T>;
const aa: A = [1]; // type 'number' is not assignable to type 'string'.
const bb: A = ["1"]; // ok
const cc: A<number> = [1]; // ok

interface Array<T = string> {
	// ...
}
```

### 泛型支持递归

```ts
type ListNode<T> = {
	data: T;
	next: ListNode<T> | null;
};

declare var HTMLElement: {
	prototype: HTMLElement;
	new (): HTMLElement;
};
```

-   显式泛型

```ts
function $<T extends HTMLElement>(id: string): T {
	return document.getElementById(id) as T;
}

// 不确定 input 的类型
// const input = $('input');

// Tell me what element it is.
const input = $<HTMLInputElement>("input");
console.log("input.value: ", input.value);
```

### React.FC

```ts
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
	(props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
	propTypes?: WeakValidationMap<P>;
	contextTypes?: ValidationMap<any>;
	defaultProps?: Partial<P>;
	displayName?: string;
}
```

### 接口智能提示

```ts
interface Seal {
	name: string;
	url: string;
}
interface API {
	"/user": { name: string; age: number; phone: string };
	"/seals": { seal: Seal[] };
}
const api = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
	return fetch(url).then((res) => res.json());
};
```

### types 和 @types 是什么

#### 找到某个包的定义/声明

TypeScript 没有找到某个包的定义/声明时，你可以通过 `npm install @types/xxx` 安装相关声明;或者自己定义一份.d.ts 文件，并将 xxx 声明为 declare module。（安装 @types 和 自己 declare module）就是 TypeScript 官方提出的， 你可以选择适合你的方案。我的推荐是尽量使用 @types 下的声明，实在没有，再使用第二种方法。

#### 包类型定义的查找

就好像 node 的包查找是先在当前文件夹找 node_modules，在它下找递归找，如果找不到则往上层目录继续找，直到顶部一样， TypeScript 类型查找也是类似的方式。例如：jquery，TypeScript 编译器先在当前编译上下文找 jquery 的定义。如果找不到，则会去 node_modules 中的@types （默认情况，目录可以修改，后面会提到）目录下去寻找对应包名的模块声明文件。如果你想查一个包是否在 @type 下，可以访问 `https://microsoft.github.io/TypeSearch/`。@types 下的定义都是全局的。

#### typeRoots 与 types

前面说了 TypeScript 会默认引入 node_modules 下的所有@types 声明，但是开发者也可以通过修改 tsconfig.json 的配置来修改默认的行为.

tsconfig.json 中有两个配置和类型引入有关。

1. typeRoots: 用来指定默认的类型声明文件查找路径，默认为 `node_modules/@types`, 指定 typeRoots 后，TypeScript 编译器会从指定的路径去引入声明文件，而不是 `node_modules/@types`, 比如以下配置会从 typings 路径下去搜索声明.
2. types: TypeScript 编译器会默认引入 typeRoot 下所有的声明文件，但是有时候我们并**不希望全局引入所有定义**，而是仅引入部分模块。这种情景下可以通过 types 指定模块名只引入我们想要的模块，比如以下只会引入 jquery 的声明文件

#### 总结

1. typeRoots 是 tsconfig 中 compilerOptions 的一个配置项，typeRoots 下面的包会被 ts 编译器自动包含进来，typeRoots 默认指向 `node_modules/@types`。
2. @types 是 npm 的 scope 命名空间，和@babel 类似，@types 下的所有包会默认被引入，你可以通过修改 compilerOptions 来修改默认策略。
3. types 和 typeRoots 一样也是 compilerOptions 的配置，指定 types 后，typeRoots 下只有被指定的包才会被引入。

```ts
{
  "compilerOptions": {
    "typeRoots": ["./typings"],
		"types": ["jquery"],
  }
}
```

## 类型检查的几种方法和机制

1. typeof 检查基本类型；
2. instanceof 检查引用类型；
3. in 检查某个属性是否存在；
4. 自定义类型保护函数，例如：

```ts
class Java {
	helloJava() {}
}
class JavaScript {
	helloJavaScript() {}
}
// lang is Java：这种返回值叫做类型谓词
function isJava(lang: Javascript | Java): lang is Java {
	return (lang as Java).helloJava !== undefined;
}
```

5. 类型推断：自动推断，类型断言 as；
6. 类型兼容：对于类或者接口，属性少的兼容属性多的；对于函数，参数多的兼容参数少的；

## 命名空间

1. 多个文件可以共享一个命名空间 namespace；
2. 某个命名空间中的变量、函数只能在这个命名空间中访问，如果需要在全局可见，就需要用 export 导出变量、函数；
3. 不要混用模块和命名空间，不要在模块中使用命名空间，尽量在全局环境使用命名空间；
4. 通过三斜线指令来引用命名空间：`/// <reference path="xx/yy/zz.ts" />`（相对路径）；
5. 命名空间会被编译成一个立即执行函数，这个函数创建了一个闭包，命名空间名称会作为一个全局变量被声明，用于挂载被导出的变量、函数，并被传入这个闭包；
6. 命名空间和同名函数可以合并，相当于给函数增加了属性（命名空间声明要放在函数声明后面，且需要 export）；
7. 命名空间和同名 class 可以合并，相当于给 class 增加了静态属性（命名空间声明要放在 class 声明后面，且需要 export）；
8. 命名空间和同名 enum 可以合并，相当于给 enum 增加了属性（顺序无关，需要 export）；
9.

## 给外部类库增加自定义方法

比如给 moment 增加一个自定义方法 myFunc:

```ts
// 在ts文件中增加声明：
declare module "moment" {
	export function myFunc(): void;
}
// or 可以在 global.d.ts 中增加：
declare global {
	namespace globalLib {
		function doSth(): void;
	}
}
```

## tsconfig.json 的配置

1. tsc --init：创建默认 tsconfig 文件；
2. files/include/exclude：三者共同决定要编译的文件；
3. extends：继承基础/其他文件中的 ts 配置；
4. compileOnSave：保存时自动编译；
5. compilerOptions：配置编译时的设置；
    1. incremental：增量编译；
    2. diagnostic：打印诊断信息；
    3. composite：工程可以被引用且可以被增量编译；
    4. target：编译结果的版本；
    5. module：编译的模块类型；
    6. outFile
    7. lib
    8. allowJs、checkJs
    9. outDir、rootDir
    10. declaration、declarationDir
    11. sourceMap、inlineSourceMap
    12. typeRoots、types
    13. removeComments
    14. noEmitHelpers、importHelpers
6. strict
    1. noImplicitAny
    2. alwaysStrict
    3. strictNullChecks
    4. strictBindCallApply
    5. noImplicitThis
7. noUnusedLocals
    1. noUnusedParameters
    2. noFallthroughCasesInSwitch：switch 中防止忘记 break
    3. noImplicitReturns：每个分支都要有返回值
8. esModuleInterop:允许`export=`导出，有 import from 导入
9. moduleResolution：模块解析策略，默认 node，定义查找文件时候的策略
10. paths:[]：路径映射
11. rootDirs:[]：将多个目录放在一个虚拟目录下，用于运行时
12. references:[]：引用的其他工程 path、prepend 等

## TS 的编译工具

1. 在 webpack.config.js 中，如果使用了 ts-loader，那么可以设置`options.transpileOnly=true`，只做语言转换，不做类型检查，提高打包速度。
2. 借助`fork-ts-checker-webpack-plugin`插件，在另一个独立的进程中做类型校验。
3. `awesome-typescript-loader`：1.更适合与 babel 集成，使用 babel 的转义和缓存；2.不需安装额外的插件就可以把类型检查放在独立的进程中进行；不推荐；
4. babel7 之前不支持 ts，使用`@babel/preset-typescript`插件
