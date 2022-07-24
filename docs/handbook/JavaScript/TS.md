---
title: 记录一些 TS 的奇技淫巧 2333
author: EricYangXD
date: "2021-12-29"
---

## TypeScript

### 是什么

TS 是 JS 的超集。

### 要解决什么问题

1. 为 JavaScript 提供可选的类型系统
   - 类型系统能够提高代码的质量和可维护性，尤其是大型团队协作开发大型项目时；
   - 类型有利于代码的重构，它有利于编译器在编译时而不是运行时捕获错误；
   - 类型是出色的文档形式之一；
2. 兼容当前以及未来的 JavaScript 特性

## 基本类型

### boolean

boolean 其实也是联合类型：`type boolean = true | false;`。

### 联合类型

1. boolean 其实也是联合类型。
2. 条件类型对 any 做了特殊处理，如果左边是 any，那么直接把 trueType 和 falseType 合并成联合类型返回。
3. 当条件类型左边是 never 时，直接返回 never。

```ts
type Test<T> = T extends true ? 1 : 2;
type res = Test<any>;
// type res = 1 | 2
```

### 分布式条件类型

当条件类型的左边是类型参数时，会有 distributive 的性质，也就是把联合类型的每个类型单独传入求值，把每个的结果合并成联合类型，这叫做分布式条件类型。

### 枚举类型 enum

在 TypeScript 中使用枚举是访问旨在跨多个文件共享的特定参数的好方法，例如特定用户的访问级别或特定常量。

但是 Enums 会生成大量代码，通过 const 在 TypeScript 中与我们的 Enums 一起引入关键字，我们可以减轻大量生成的代码。例如：

```ts
enum Sizes {
	Small,
	Medium,
	Large,
}
```

编译成 js 之后：

```js
var Sizes;

(function (Sizes) {
	Sizes[(Sizes["Small"] = 0)] = "Small";
	Sizes[(Sizes["Medium"] = 1)] = "Medium";
	Sizes[(Sizes["Large"] = 2)] = "Large";
})(Sizes || (Sizes = {}));

const coffee = {
	name: "Espresso",
	size: Sizes.Small,
};
```

显然，这时候可以使用反向映射：

```ts
const coffee = {
	name: "Espresso",
	size: Sizes[Sizes.Small], // 'Small'
};
```

但是当我们明确知道并不需要使用反向映射时，这样的代码显然有部分是多余的，此时可以使用 const 来声明 enum：

```ts
// 📣警告！这消除了具有反向映射行为的能力，因此如果您依赖它，请不要使用这种方法。
const enum Sizes {
	Small,
	Medium,
	Large,
}
```

此时编译出来的代码就会比之前少得多：

```js
const coffee = {
	name: "Espresso",
	size: 0 /* Small */,
};
```

## 官方提供的工具类型

### Omit

- Omit<T,K>类型让我们可以从另一个对象类型中剔除某些属性，并创建一个新的对象类型：T：是对象类型名称，K：是剔除 T 类型中的属性名称。

- Q.实现一个工具类型：SomeRequired<T,K>，作用是将对象 T 内，属于 K 的 key 标记为 required，其他的保持原样。

```ts
type SomeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
```

- A.先从 T 中剔除 K，得到新的对象类型；从 T 中选出 K 并标记为 Required 得到新的对象类型；合并这两个类型得到想要的类型。

```ts
type Pick<T, K extends keyof T> = {
	[P in K]: T[P];
};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Required

- 把所有属性变成必需的 required

```ts
//  eg.源码
type Required<T> = {
	[P in keyof T]-?: T[P];
};
```

### Pick

- 从一个复合类型中，取出几个想要的类型的组合，得到一个新类型

```ts
// eg.源码
type Pick<T, K extends keyof T> = {
	[key in k]: T[key];
};

// eg. 从TState中拿到name和age属性，组成一个新的类型TSingleState
interface TSingleState extends Pick<TState, "name" | "age"> {}
```

- 解析：在泛型中使用 extends 并不是用来继承的，而是用来约束类型的。所以这个 K extends keyof T，应该是说 key 被约束在 T 的 key 中，不能超出这个范围，否则会报错的。

### Partial

- Make all properties in T optional，把某个类型中的所有属性都变为可选

```ts
// eg.源码
type Partial<T> = {
	[P in keyof T]?: T[P];
};
```

### Readonly

- 变为只读

```ts
// eg.源码
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

- Construct a type with a set of properties K of type T，即将 K 中的每个属性([P in K]),都转为 T 类型。

```ts
// eg.源码
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
# eg.
type Person6 = Record<'name' | 'age', string>;
// Person6 === {name: string; age: string}
```

### `Exclude<T,U>`

Exclude 和 Omit 的区别：Omit 返回的是新的类型，原理上是在 Exclude 之上进行的，Exclude 是根据自类型返回的。

把 T 中不属于 U 的提取出来。当 T 中有 U 就会剔除对应的属性，如果 U 中又的属性 T 中没有，或 T 和 U 刚好一样的情况都会返回 nerver，且对象永远返回 nerver

### `Extract<T,U>`

把 T 中属于的 U 提取出来

### `NonNullable<T>`

提取出 T 中不是 null、undefined 的值，从 T 中排除 null 和 undefined。

### `Parameters<T>`

用于获取 获取函数类型的参数类型。

### `ReturnType<T>`

用于获取 函数 T 的返回类型。

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (
	...args: any[]
) => infer R
	? R
	: any;
```

### `InstanceType<T>`

### `ThisType<T>`

### Mutable

功能是将类型的属性「变成可修改」，这里的 -指的是去除。 -readonly 意思就是去除只读，也就是可修改啦。

```ts
type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};
```

## & 交叉类型 extends

- 与

## | 联合类型

- 或

## declare namespace

- 如果代码中用到了一个 TS 无法识别的类型/变量或者引入一个第三方模块时，可以新建 同名.d.ts 文件，在里面 declare module 'xxx'；

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

- 或者在 global.d.ts 中全局声明：

```ts
declare namespace MyPlugin {
	var n: number;
	var s: string;
	var f: (s: string) => number;
}
```

- 修改已存在的全局变量声明

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

- keyof : 获取类型上的 key 值；
- extends : 泛型里面的约束；
- T[K] : 获取对象 T 相应 K 的元素类型；

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

- type 可以定义 基本类型的别名，如 type myString = string
- type 可以通过 typeof 操作符来定义，如 type myType = typeof someObj
- type 可以声明 联合类型，如 type unionType = myType1 | myType2
- type 可以声明 元组类型，如 type yuanzu = [myType1, myType2]

2. interface 可以做到，但是 type 不可以做到的事情

- interface 可以 声明合并，即两个同名的 interface 会自动合并成二者的并集，而对于 type 的话，就会是 覆盖 的效果，始终只有最后一个 type 生效

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

### interface 和 class 的区别

1. 在 OOP 语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。
2. TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。接口不仅可以定义对象, 还可以定义函数。
3. TypeScript 除了实现了所有 ES6 中的 class 的功能以外，还添加了一些新的用法。
4. Typescript 中声明 class，实际上，除了会创建一个类之外，同时也会创建一个同名的 interface（同名的 interface 只包含其中的实例属性和实例方法）。所以 class 既可以当作类来使用，也可以当作 interface 来使用。
5. 实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现。这个特性大大提高了面向对象的灵活性。
6. 一个类可以实现多个接口。
7. 接口也可以继承类，其实就是继承 4 中创建的同名 interface。
8. 有时候，一个函数还可以有自己的属性和方法。

## TypeScript 编译器是如何工作的？

1. TypeScript 文本首先会被 scanner 解析为 token 流。这个过程比较简单，就是单纯地按照分隔符去分割文本即可。
2. 接着 token 流会被 parser 转换为 AST，也就是抽象语法树。
3. binder 则根据 AST 信息生成 Symbol（TypeScript 中的一个数据结构）。
4. 当我们需要类型检查的时候， checker 会根据前面生成的 AST 和 symbols 生成类型检查结果。
5. 当我们需要生成 JS 文件的时候，emitter 同样会根据前面生成的 AST 和 symbols 生成 JS 文件。

- declare: 值空间声明
- type/interface/函数类型等: 类型空间声明
- 值空间虽然不能直接和类型空间接触，但是类型空间可以作用在值空间，从而给其添加类型

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

- 泛型要用尖括号 `<>`，而不是别的。
- 函数泛型，接口泛型和类泛型。

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

- 显式泛型

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

TypeScript 没有找到某个包的定义/声明时，你可以通过 `npm install @types/xxx` 安装相关声明文件；或者自己定义一份.d.ts 文件，并将 xxx 声明为 declare module。（安装 @types 和 自己 declare module）就是 TypeScript 官方提出的， 你可以选择适合你的方案。我的推荐是尽量使用 @types 下的声明，实在没有，再使用第二种方法。

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

## TS 中的逆变和协变

> 内涵: 概念中所反映的事物的特有属性
> 外延: 具有概念所反映的特有属性的所有事物
> 内涵越小的概念, 覆盖的范围越多, 外延越多.

### LSP(里氏替换原则)

1. 子类可以实现父类的抽象方法, 但不能覆盖父类的非抽象方法
2. 子类中可以增加自己特有的方法
3. 当子类的方法重载父类的方法时, 方法的前置条件 (即方法的输入参数) 要比父类的方法更宽松
4. 当子类的方法实现父类的方法时 (重写/重载或实现抽象方法), 方法的后置条件 (即方法的的输出/返回值) 要比父类的方法更严格或相等

### 定义

- 协变与逆变（Covariance and contravariance）是在计算机科学中，描述具有父/子型别关系的多个型别通过型别构造器、构造出的多个复杂型别之间是否有父/子型别关系的用语。
- 协变与逆变是在类型系统中为更好的支持 LSP 带来特性。
- 会发生「协变与逆变」场景是：「赋值」、「参数」、「返回值」，以下几条为个人理解：
  1. 赋值时，子类可以赋给父类，但是父类显然不能直接赋给子类，因为父类上可能缺少子类的某些自有的属性方法；发生了协变
  2. 作为参数传递时，父类可以包含子类，所以可以把参数类型由子类变为父类，而子类却不能代替父类，因为会导致同属于该父类的类型丢失；发生了逆变
  3. 作为返回值时，只能是返回更精确的类型，即子类可以赋给父类，但不能用父类代替子类；发生了协变
- 协变: 类型收敛、内涵缩小、外延扩大，允许子类型转换为父类型。
- 逆变: 类型外散、内涵扩大、外延缩小，允许父类型转换为子类型

```ts
class Animal {
	base = "";
}

class Dog extends Animal {
	type = "Dog";
}

// 赋值
let a: Animal;
let b: Dog;

a = new Dog(); // 发生了协变 类型收敛 Dog => Animal 内涵缩小了 外延扩大了
b = new Animal(); // error 不安全的 Property 'type' is missing in type 'Animal' but required in type 'Dog'.

// 参数
let fn1 = (animal: Animal) => {};
let fn2 = (dog: Dog) => {};

fn1 = fn2; // error 不安全的 Type '(dog: Dog) => void' is not assignable to type '(animal: Animal) => void'.
fn2 = fn1; // 发生了逆变 类型外散 Animal => Dog 内涵扩大了 外延缩小了

// 返回值
let fx1: () => Animal = () => new Animal();
let fx2: () => Dog = () => new Dog();

fx1 = fx2; // 发生了协变 类型收敛 Dog => Animal 内涵缩小了  外延扩大了
fx2 = fx1; // error 不安全的 Type '() => Animal' is not assignable to type '() => Dog'.
```

1. 本质：协变与逆变是为了安全的使用类型转换。
2. 为什么会有这种现象：类型转换为了更好的满足面向对象编程，继承，多态，LSP 的使用，如果严格限定了各种类型转换，那么开发过程也就更加繁琐。
3. 这个东西是怎么实现的：实现上就是原本是 B 检测的时候，然后把他的继承的类型也同时拿来比较验证，并且符合安全转换条件的情况。
4. 变型都是发生在父子类型之间的。
5. 子类型的属性比父类型更多、更具体：
   - 在类型系统中，属性更多的类型是子类型。
   - 在集合论中，属性更少的集合是子集。
6. 双向协变：
   - 在老版本的 TS 中，函数参数是双向协变的。也就是说，既可以协变又可以逆变，但是这并不是类型安全的。
   - 在新版本 TS (2.6+) 中 ，你可以通过开启 `strictFunctionTypes` 或 `strict` 来修复这个问题。设置之后，函数参数就不再是双向协变的了。
