---
- title: 鸿蒙开发笔记
- author: EricYangXD
- date: 2025-12-22
- description: HarmonyOS,鸿蒙开发
---

## 尼尔森十大可用性原则

### 1 系统状态可见性

1. 告诉用户处在系统的什么位置
2. 让用户知道自己在做什么
3. 让用户知道系统在做什么
4. 让用户知道系统做了什么
5. 利用多种形式的反馈
6. 对系统延迟响应进行反馈

### 2 系统与用户现实匹配

1. 使用用户的语言
2. 符合现实世界的使用习惯
3. 使用现实世界的隐喻
4. 操作手势符合联想

### 3 用户控制和自由

1. 用户可自由导航
2. 用户可自由退出
3. 不可逆转的操作需要警告

### 4 一致性与标准化

1. 产品内部保持一致
2. 不同版本之间有延续性
3. 与业内产品保持一致

### 5 防止错误

1. 在执行危险操作之前请用户确认
2. 利用清晰的提示防止错误
3. 利用用户的联想防止错误

### 6 再认而不是回忆

1. 将选择对象可视化
2. 丰富记忆线索
3. 使用通用的命令，减少用户记忆负担
4. 更多地让用户选择而不是输入

### 7 灵活高效的使用

1. 提供快捷键
2. 允许用户使用重复操作
3. 提供系统默认值，减少用户多余操作

### 8 美观简洁的设计

1. 避免界面元素过于杂乱
2. 对重点信息突出显示

### 9 帮助用户认知、判断和修复错误

1. 引起用户注意
2. 提供建设性建议
3. 自动纠错

### 10 帮助文档及使用手册

1. 方便用户查找
2. 便于用户理解
3. 便于用户应用
4. 信息量简短

## Preferences 是否具备 ACID？

❌ 不具备完整的 ACID 特性：

- 原子性 (A)：put() + flush() 才能保证写入持久化，但不能保证多条写入操作作为一个“事务”原子完成。
  如果应用崩溃或掉电，可能只写了一部分。
- 一致性 (C)：没有严格的一致性约束，只能依赖开发者逻辑控制。
- 隔离性 (I)：多线程/多进程同时访问时没有强隔离机制，需要自己加锁或避免并发写入。
- 持久性 (D)：调用 flush() 后数据会落盘，有一定持久化能力，但不如数据库那样有 WAL 日志和 crash-safe 保证。

## Unit8Array

- 是 JavaScript/TypeScript 标准内置的 TypedArray 类型，在鸿蒙 ArkTS 中同样可用。
- 它表示一个 无符号 8 位整型数组，每个元素占用 1 个字节（0 ~ 255）。
- 底层基于 ArrayBuffer 内存视图，可以直接操作二进制数据。

简单理解：普通数组`[1,2,3]`存的是 JS 数字对象，而`Uint8Array([1,2,3])`存的是紧凑的二进制字节，更适合处理底层数据。

```js
// 方式一：指定长度（默认填充为0）
let arr1: Uint8Array = new Uint8Array(5);
console.log(arr1); // [0,0,0,0,0]

// 方式二：通过普通数组初始化
let arr2: Uint8Array = new Uint8Array([10, 20, 30]);
console.log(arr2[1]); // 20

// 方式三：基于 ArrayBuffer 创建
let buffer: ArrayBuffer = new ArrayBuffer(4);
let arr3: Uint8Array = new Uint8Array(buffer);
arr3[0] = 255;
console.log(arr3); // [255,0,0,0]

let u8 = new Uint8Array([1, 2, 3]);
u8.set([9, 9], 1);
console.log(u8); // [1,9,9]

let sub = u8.subarray(1);
console.log(sub); // [9,9]
```

## 抽象类和接口
1. 抽象类与接口都无法实例化。抽象类是类的抽象，抽象类用来捕捉子类的通用特性，接口是行为的抽象。
2. 一个类只能继承一个抽象类，而一个类可以实现一个或多个接口；
3. 接口中不能含有静态代码块以及静态方法，而抽象类可以有静态代码块和静态方法；
4. 抽象类里面可以有方法的实现，但是接口没有方法的实现，是完全抽象的；
5. 抽象类可以有构造函数，而接口不能有构造函数。

## TypeScript 中 extends 的三种核心用法

总结：

| 用法        | 场景          | 示例                                        |
| ----------- | ------------- | ------------------------------------------- |
| 1. 类继承   | OOP，代码复用 | `class Dog extends Animal`                  |
| 2. 接口继承 | 组合契约      | `interface Square extends Shape, PenStroke` |
| 3. 泛型约束 | 限制类型范围  | `<T extends HasLength>`                     |
| 4. 条件类型 | 类型编程      | `T extends U ? X : Y`                       |

### TypeScript 基础知识

1. 接口继承类的时候，接口中会自动抽离类中公共的/私有的/受保护的属性和方法；
2. 接口之间可以相互继承实现接口的复用，类之间也可以相互继承 extends 实现方法属性的复用；接口只能约束类的公有成员，一个类实现一个接口时必需实现其所包含的所有属性和方法。
3. TS 中的命名空间不要和 module 混用，多个文件可以共享一个命名空间，本质就是一个立即执行函数的闭包，这个空间名上挂了一些导出的属性和方法；
4. 命名空间中引入其他依赖时要使用三斜线`/// <reference path="xxx.ts" />`；
5. 可以通过`import aaa = MyNameSpace.aFunc`的形式为命名空间中的函数设置别名，简化调用；
6. 接口合并：最常见的是 interface，同名属性类型必需相同否则报错，同名函数自动重载，后声明的会先于先声明的匹配，对于函数参数是字符串字面量的情况，这种会单独提取出来优先匹配，如果有多个同名的依然遵守后声明的会先于先声明的匹配的规则。
7. 命名空间合并：多个文件中定义的同名命名空间会自动合并，但是对于导出的同名变量、方法会冲突。
8. 命名空间和函数声明合并：对一个函数再声明一个同名的命名空间，并在该命名空间中声明并导出新的属性，则相当于给这个函数添加了新的属性。
9. 命名空间和类的合并：同上和函数合并类似，只是相当于给类添加了静态属性。
10. 命名空间和枚举的合并：在同名命名空间中导出一个方法相当于给该枚举类型增加了一个方法。
11. 注意：8/9 中合并时，注意要把命名空间的声明放在函数/类声明的后面。
12. 如果引入了第三方库并安装了 types 声明库，那么还需要对该库进行声明 declare，在`xx.d.ts`中：`declare function xx`或者`declare namespace xxx { ... }`。
13. 使用`export = moduleLib`导出生命的命名空间，兼容性较好。
14. 通过`declare module 'moment' { export function myFunc(): void }`的形式，为第三方库添加自定义方法的声明。
15. tsconfig 中的`rootDirs`用于将多个文件夹目录放在一个虚拟目录下，这样编译之后他们的相对路径就会保持不变，不需要再去改动代码，用于运行时。
16. 流水线中取到的`.hap`或者编译出来的`.hap`包，修改文件格式为`.zip`，即可打开项目包的相关文件；从`module.json`和`pack.info`文件中可以详细读取到`targetAPIVersion`等项目包相关的字段；
17. 延时加载图片逻辑

```ts
Image(this.bookCoverUrl)
  .visibility(this.bookCoverLoadingSuccess ? Visibility.Visible : Visibility.None)
  .onComplete((event?) => {
    if (event?.loadingStatus) {
      this.bookCoverLoadingSuccess = true;
    }
  });
```

## 把本地的 kit 仓库中的 module 作为依赖添加到 master 仓库

这样本地修改 kit 仓的时候，运行 MyGameForHarmonyOS 工程可以把改动的部分体现出来。直接把这几个仓库 clone 到同一层级的目录下，然后修改 master 仓库的`build-profile.json5`，比如对于`lib_base`的`srcPath`直接改为`../MyGameKitForHarmonyOS/lib_base`，其他的路径同理，找到对应的地方就行。对于依赖的引用方式`oh-package.json5`，原来是对某些库引用指定的版本，现在直接把`overrides`下的对应的依赖版本号替换成本地的`module`或`service`等的路径就行了，比如`"@wefoundi-games/game_component": "file:../MyGameKitForHarmonyOS/game_component"`。

## 鸿蒙知识

ArkUI 提供了`@State+@Prop`、`@State+@Link`、`@State+@Observed+@ObjectLink`、`@Provide+@Consume`、`AppStorage`、`LocalStorage`六种装饰器组合以解决不同范围内的组件间状态共享。

1. @State+@Prop 组合方案：
   @Prop 装饰器支持接收 Object、class、string、number、boolean、enum 类型，以及这些类型的数组。
   @Prop 装饰的变量是对父组件传入状态值的深拷贝，当@Prop 装饰器装饰的变量为复杂 Object、class 或其类型数组时，会增加状态创建时间以及占用大量内存。
   @Prop 装饰的变量和父组件是单向绑定的关系。当父组件数据源发生变化时，接收该数据源的@Prop 所在组件的实例会重新渲染。 当该组件内被@Prop 装饰的变量被修改时，父组件数据源不会变化，父组件实例也不会重新渲染。

2. @State+@Link 组合方案：
   @Link 装饰器支持接收 Object、class、string、number、boolean、enum 类型，以及这些类型的数组。
   @Link 装饰器修饰的变量是对父组件传入状态的引用的拷贝，两者指向同一个地址。当状态是简单数据类型或简单 Object 类型时，@Link 和@Prop 在状态创建时间和内存的占用方面区别不大。当状态为复杂的 Object、class 或其类型数组时，@Link 相较@Prop 能明显减少状态创建时间和内存的占用。
   @Link 装饰器的变量和父组件是双向绑定的关系。当父组件数据源发生变化时，接收该数据源的@Link 所在组件的实例会重新渲染。 当该组件内被@Link 装饰的变量被修改时，父组件数据源会同步修改，父组件实例也会重新渲染。

3. @State+@Observed+@ObjectLink 组合方案：
   @ObjectLink 只支持接收被@Observed 装饰的 class 实例及继承 Date 或者 Array 的 class 实例。
   @ObjectLink 装饰的变量是只读的，不支持对状态重新赋值。
   @ObjectLink 必须配合@Observed 使用，它的设计是为了解决对嵌套类对象属性变化的监听，如需要观察对象数组中单个数据项的属性值变化，或嵌套对象的对象类型属性的子属性变化。

结合三个方案的特性，在选择时有如下建议：

- 需要观察嵌套类对象的深层属性变化的场景，选择@State+@Observed+@ObjectLink。
- 状态是复杂对象、类或其类型数组的场景，选择@State+@Link。
- 状态是简单数据类型时，使用@State+@Link 和@State+@Prop 均可。在功能层面上，依据@Prop 单向绑定的特性，@State+@Prop 适合用于非实时修改的场景，如编辑电话薄联系人信息时，展示编辑界面的子组件信息的修改要求不实时同步回父组件，需要等到编辑完成后点击“确认”按钮时才会以事件驱动的方式修改父组件的状态。依据@Link 双向绑定的特性，@State+@Link 适合用于实时修改的场景，如组件嵌套时的滚动条同步。

### 总结

在实际开发中，合理选择装饰器主要包含以下三步：

1. 首先根据状态需要共享的范围大小，尽量选择共享能力小的装饰器方案，优先级依次为@State+@Prop、@State+@Link 或@State+@Observed+@ObjectLink > @Provide+@Consume > LocalStorage > AppStorage。

2. 当共享的状态的组件间层级相差较大时，为避免较差的代码可扩展性和可维护性，@Provide+@Consume 的方案要优于层层传递的共享方案。

3. 对于具有相同优先级的@State+@Prop、@State+@Link 或@State+@Observed+@ObjectLink 三个方案，应结合状态的复杂程度和装饰器各自的特性选择。

实际开发中，应根据业务需求衡量优先级选择合适的装饰器，整体可参考如下建议：

- @State+@Prop：适合状态结构简单，且共享状态的组件间层级相差不大的场景。或功能上要求子组件不实时同步修改给父组件的场景。
- @State+@Link：适合状态结构复杂，且共享状态的组件间层级相差不大的场景。或功能上要求子组件对状态的修改实时同步给父组件的场景。
- @State+@Observed+@ObjectLink：适合需要观察嵌套类对象的子属性变化的场景或对象数组的数据项属性变化的场景，如监听列表卡片上某个属性的变化。
- @Provide+@Consume：适合用于对于整个组件树而言“全局”的状态，且该状态改动不频繁的状态共享场景，如共享界面的路由信息。
- AppStorage：适合对于整个应用而言“全局”的变量或应用的主线程内多个 UIAbility 实例间的状态共享，如用户信息。
- LocalStorage：适合对于单个 Ability 而言“全局”的变量，主要用于不同页面间的状态共享场景。

### 父子组件通信

- 父到子：@Prop 传递@state 或者 callback 函数
- 子到父：@Prop 中传入的回调函数

```js
// 子组件 MyChild.ets
@Component
struct MyChild {
  @Prop message: string; // 接收父传来的属性

  build() {
    Text(this.message)
      .fontSize(20)
      .fontColor(Color.Blue)
  }
}

// 父组件 Parent.ets
@Component
struct Parent {
  private msg: string = "Hello from Parent";

  build() {
    Column() {
      MyChild({ message: this.msg }) // 父传子
    }
  }
}
```

<!-- 子到父 -->

```js
// 子组件 MyButton.ets
@Component
struct MyButton {
  @Prop onClickCallback: (value: string) => void;

  build() {
    Button("点我")
      .onClick(() => {
        this.onClickCallback("子组件点击了按钮");
      })
  }
}
// 父组件 Parent.ets
@Component
struct Parent {
  private info: string = "";

  build() {
    Column() {
      Text(this.info)

      MyButton({
        onClickCallback: (val: string) => { // 接收子回调的数据
          this.info = val;
        }
      })
    }
  }
}
```

### 跨层级通信（状态共享）

如果多个不相关的兄弟/跨层级组件需要共享状态，可以使用 状态管理装饰器：

- @State：本地状态
- @Prop：从父接收
- @Link：双向绑定
- @Provide / @Consume：类似 Vue 的 provide/inject，用于跨层级共享
- 使用自定义事件发布订阅，当组件关系复杂或跨越层级过多时，推荐使用 EventHub 或者 Emitter 自定义事件发布订阅的方式。当数据源改变时发布事件，依赖该数据源的组件通过订阅事件来获取数据源的改变，完成业务逻辑的处理，从而实现组件的精准刷新。

详细代码示例：

```js
// 顶层 App.ets
@Component
struct AppRoot {
  @Provide themeColor: Color = Color.Red; // 提供一个全局颜色

  build() {
    Column() {
      ChildA()
      ChildB()
    }
  }
}

// 子 A 使用这个颜色渲染文字
@Component struct ChildA {
  @Consume themeColor: Color;

  build() { Text("我是 ChildA").fontColor(this.themeColor) }
}

// 子 B 使用同样的颜色渲染文字
@Component struct ChildB {
  @State localThemeColor: Color;
  // @Consume themeColor: Color;
  // 还可以和watch配合，执行新的逻辑
  @Consume('themeColor') @Watch('onThemeColorChange') themeColor: Color;
  // 还可以改个名字
  @Consume('themeColor') myThemeColor: Color;

  build() { Text("我是 ChildB").fontColor(this.themeColor) }

  // 不要用private修饰
  onThemeColorChange() {
    this.localThemeColor = this.themeColor + "FF";
  }
}
```

<!-- @Observed/@ObjectLink -->

```js
// Step 1: 用 @Observed 装饰一个类
@Observed
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

@Component
struct ParentComponent {
  // Step 2: 父组件持有状态（可以是 @State, @Link, @StorageLink 等）
  @State user: User = new User('OldName', 25);

  build() {
    Column() {
      Text(`Parent: ${this.user.name}, ${this.user.age}`)
      // Step 3: 将对象的引用传递给子组件
      ChildComponent({ userLink: $user }) // 使用 $ 操作符传递引用
    }
  }
}

@Component
struct ChildComponent {
  // Step 4: 子组件用 @ObjectLink 接收对象引用
  // 注意：这里不是通过构造参数直接赋值，而是通过 @Link 建立引用关系
  @Link userLink: User;
  // Step 5: 用 @ObjectLink 装饰一个变量来监听属性变化
  @ObjectLink user: User;

  // 在 aboutToAppear 中初始化 @ObjectLink 变量
  aboutToAppear() {
    this.user = this.userLink;
  }

  build() {
    Column() {
      // Step 6: 修改属性，UI会更新！
      TextInput({ text: this.user.name })
        .onChange((newName) => {
          this.user.name = newName; // 直接修改属性，无需创建新对象！
        })
      TextInput({ text: this.user.age.toString() })
        .onChange((newAge) => {
          this.user.age = parseInt(newAge);
        })
    }
  }
}
```

<!-- PersistentStore  -->

```js
import { PersistentStore } from '@kit.ArkData';

// 获取 PersistentStore 实例
let store = PersistentStore.getPersistentStore({
  name: 'MyAppSettings', // 存储文件的名称，自定义
  level: PersistentStore.Level.STORE_LEVEL_DEVICE // 存储级别
});

try {
  // 存储字符串
  store.putSync('username', '张三');
  // 存储数字
  store.putSync('userAge', 28);
  // 存储布尔值
  store.putSync('isAgreed', true);
  // 存储对象 (会自动序列化为JSON字符串)
  store.putSync('userInfo', { id: 123, level: 'VIP' });
  console.log('Data saved successfully.');
} catch (err) {
  console.error(`Failed to save data. Code: ${err.code}, message: ${err.message}`);
}

try {
  // 读取数据，如果key不存在，则返回提供的默认值
  let userName = store.getSync('username', 'DefaultUser'); // -> '张三'
  let age = store.getSync('userAge', 0); // -> 28
  let isAgreed = store.getSync('isAgreed', false); // -> true
  let userInfo = store.getSync('userInfo', { id: 0, level: '' }); // -> { id: 123, level: 'VIP' }

  console.log(`Username: ${userName}`);
} catch (err) {
  console.error(`Failed to get data. Code: ${err.code}, message: ${err.message}`);
}

try {
  store.deleteSync('userAge'); // 删除 userAge 这个key及其对应的值
  console.log('Data deleted successfully.');
} catch (err) {
  console.error(`Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}

try {
  let hasKey = store.hasSync('username'); // -> true
  if (hasKey) {
    // 执行某些操作
  }
} catch (err) {
  console.error(`Failed to check data. Code: ${err.code}, message: ${err.message}`);
}

// Index.ets @Entry 组件中
import { AppStorage } from '@kit.ArkData';

aboutToAppear() {
  // 1. 获取 PersistentStore 实例
  let store = PersistentStore.getPersistentStore({
    name: 'MyAppSettings',
    level: PersistentStore.Level.STORE_LEVEL_DEVICE
  });

  try {
    // 2. 从持久化存储中读取数据
    const savedTheme = store.getSync('appTheme', 'light');
    const isLoggedIn = store.getSync('isLoggedIn', false);
    const userToken = store.getSync('userToken', '');

    // 3. 将数据加载到全局内存状态 AppStorage 中
    AppStorage.SetOrCreate('appTheme', savedTheme);
    AppStorage.SetOrCreate('isLoggedIn', isLoggedIn);
    AppStorage.SetOrCreate('userToken', userToken);

  } catch (err) {
    console.error(`Failed to load persistent data: ${err.message}`);
  }
}

// 例如，在一个设置页面，用户切换了主题
function onThemeChange(newTheme: string) {
  // 1. 更新内存状态（UI立即响应）
  AppStorage.Set('appTheme', newTheme);

  // 2. 更新持久化存储（保证下次启动生效）
  let store = PersistentStore.getPersistentStore({...});
  try {
    store.putSync('appTheme', newTheme);
  } catch (err) {
    // 处理错误
  }
}
```

### 全局状态管理（AppStorage / LocalStorage）

如果是全局范围的数据（比如用户信息、登录态），可以用 AppStorage 或 LocalStorage。

- `AppStorage.SetOrCreate('userName', '李四');`
- `@StorageLink('userName') name:string = ''; // 取值并重命名，且自动双向绑定`

<!-- @StorageLink/@StorageProp -->

```js
// 在 AppStorage 中初始化一个全局主题色，或者在某个入口组件中初始化
// AppStorage.SetOrCreate('AppTheme', '#007AFF');

@Component
struct ThemeSettingPage {
  // 双向绑定：修改 localTheme，会自动更新 AppStorage 中的 'AppTheme'
  // AppStorage 中 'AppTheme' 变化，也会自动更新 localTheme
  @StorageLink('AppTheme') localTheme: string = '#007AFF';

  build() {
    Column() {
      Text('Select Theme')
      ColorPicker({ color: this.localTheme })
        .onChange((value: ColorPickerResult) => {
          // 修改会同步到全局 AppStorage
          this.localTheme = value.color.toString();
        })
    }
  }
}

@Component
struct ThemedButton {
  // 单向绑定：只从 AppStorage 读取 'AppTheme'，本地修改不会影响全局
  @StorageProp('AppTheme') buttonColor: string = '#000';

  build() {
    Button('Themed Button')
      .backgroundColor(this.buttonColor)
      .onClick(() => {
        // 这个修改不会影响 AppStorage 和其他组件
        this.buttonColor = '#FF0000'; // 仅本组件按钮临时变红
      })
  }
}
```

## 开发知识笔记

1. 沙箱路径：`file://com.myapp.demo/data/app/el2/100/base/com.example.app.games/haps/MyGames/files`，在`DevEco Testing > 实用工具 > HarmonyAtlas > 文件系统`，书籍所需文件包括 epub、图片、html 等都存在这里。也可以存到`temp`下面。
2. 书封图片存储路径：`${GlobalContext.getInstance().getAbilityContext().filesDir}/ebook/${bookId}/cover/${fileName}`
3. 精品书动效使用的 `webview+lottie` 动画库实现，在`DetailNode > dynamicLoadWebPage` 中的`DefinedBookWebPage.ets`组件里写的。

```js
// 沙箱目录中图片文件的路径 1
const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
let fileName = 'startIcon.png';
let tempPath1 = context.tempDir + fileName; // 沙箱目录中图片文件的路径
// filesDir /data/storage/el2/base/haps/MyGames/files

// 沙箱目录中图片文件的路径 2
const filePath2 = GlobalContext.getInstance().getAbilityContext().filesDir + '/custome/path/'; // GlobalContext.getInstance().getAbilityContext()需自行封装
// tempDir /data/storage/el2/base/haps/MyGames/temp

// 最终
let dirUri = fileUri.getUriFromPath(filePath); // 通过传入的路径path生成uri：'file://com.example.app.games/data/storage/el2/base/haps/MyGames/files/ebook/200011532806316459025921/covers/xxx.webp'
```

4. 外层 Stack 组件设置了`onClick`和`PanGesture`事件，子组件设置的`onClick`事件无法触发：在内层子节点的外面给`NodeContainer`添加`hitTestBehavior`属性，设置`HitTestMode.Transparent`模式，支持兄弟节点的触摸测试。

5. 设置鼠标样式状态，使用`import { pointer } from '@kit.InputKit';`结合`onMouse()`方法等来控制鼠标样式和显隐等。

```ts
// const cursorController = this.getUIContext().getCursorController();
// cursorController.setCursor(pointer.PointerStyle.DEFAULT); // 隐藏光标
// cursorController.restoreDefault(); // 恢复默认

MyMainPage()
  .id(TAG + 'MyMainPage')
  .onClick(() => {
    this.onMouseMove('onClick');
    // ComponentStatusManager.getComponentPopUpStatus() !== ComponentPopUpStatus.POP_NONE
  })
  .onClick(() => {
    // pointer.setPointerStyleSync();
    this.getUIContext().getCursorController().setCursor(pointer.PointerStyle.EAST);
    // cursorControl.setCursor(pointer.PointerStyle.EAST)
    try {
      pointer.setPointerVisible(this.pointerFlag, (error: Error) => {
        if (error) {
          console.error(`Set pointer visible failed, error: ${JSON.stringify(error, [`code`, `message`])}`);
          return;
        }
        logger.info(TAG, `Set pointer visible success`, this.pointerFlag);
        this.pointerFlag = !this.pointerFlag;
      });
    } catch (error) {
      console.error(`Set pointer visible failed, error: ${JSON.stringify(error, [`code`, `message`])}`);
    }
  })
  .onClick(() => {
    window.getLastWindow(this.getUIContext().getHostContext(), (error: BusinessError, win: window.Window) => {
      if (error.code) {
        console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(error));
        return;
      }
      let windowId = win.getWindowProperties().id;
      if (windowId < 0) {
        console.info(`Invalid windowId`);
        return;
      }
      try {
        pointer.setPointerStyle(windowId, pointer.PointerStyle.CROSS, (error) => {
          console.info(`Set pointer style success`);
        });
      } catch (error) {
        console.error(`Set pointer style failed, error: ${JSON.stringify(error, [`code`, `message`])}`);
      }
    });
  })
  .onMouse((e: MouseEvent) => {
    this.onMouseMove(e.action);
  });
```

## hdc

### 常用命令

1. 重启进入 fastboot 模式：`hdc shell reboot bootloader或hdc shell "echo c > /proc/sysrq-trigger"`；手机 USB 连上电脑后，同时按电源和音量下键；手机关机断开 usb 连接，长按音量下键然后手机连接上 USB。
2. 查看设备型号：`hdc shell param get const.product.model`
3. 查看设备系统 ROM 版本（组合包版本号）1：`hdc shell param get const.product.software.version` -- `VDE-AL10 6.0.0.110(SP5C00E110R3P5log)`
4. 查看设备系统版本（组合包版本号）2：`hdc shell param get const.build.ver.physical` -- `VDE-AL10 206.0.0.110(SP5C00E110R3P5log)`
5. 重启设备：`hdc shell reboot（或者hdc target boot）`
6. 获取手机的 sn 号：`hdc list targets`
7. 查询 ROM 版本号：`adb shell getprop ro.build.display.id`
8. 查询手机解锁状态：`fastboot oem lock-state info`
9. 获取 SOCID 方法：`fastboot oem get_socid`
10. 清空缓存：`hdc shell bm clean -n com.wefoundi.app.games -d`
11. 查看设备的 api 版本：`hdc shell param get const.ohos.apiversion`

### 安装 pc 上的 hap 到手机上

- 安装：`hdc install D:\apps\demo.hap`，先进入到相应的目录下（直接从文件夹拖到 cmd），不然路径可能不对。

- 卸载：`hdc uninstall com.wefoundi.app.games`

- `hdc -t <deviceId> install demo.hap`

- `hdc shell aa start -a EntryAbility -b com.wefoundi.app.games`

- `hdc shell bm dump com.wefoundi.app.games`

- 保存手机上的 app 到本地：`hdc file recv "/data/app/el1/bundle/public/com.wefoundi.app.games/MyGames.hap" "D:\backup\MyGames.3.1.8.hap"`

- 查看设备型号：`hdc shell bm dump com.wefoundi.app.games`/`hdc shell param get const.build.product`

```bash
12:10:26.619: Build task in 25 s 612 ms
12:10:26.619: Launching com.wefoundi.app.games
12:10:26.620: $ hdc shell aa force-stop com.wefoundi.app.games
12:10:27.183: $ hdc shell mkdir data/local/tmp/d33b3090fac74957a84501fbed862594
12:10:31.646: $ hdc file send D:\work\MyGameForHarmonyOS\product\default\build\default\outputs\default\MyGames-default-signed.hap "data/local/tmp/d33b3090fac74957a84501fbed862594" in 4 s 463 ms
12:10:33.276: $ hdc shell bm install -p data/local/tmp/d33b3090fac74957a84501fbed862594 in 1 s 630 ms
12:10:33.434: $ hdc shell rm -rf data/local/tmp/d33b3090fac74957a84501fbed862594
12:10:33.906: $ hdc shell aa start -a MainAbility -b com.wefoundi.app.games in 236 ms
12:10:33.906: com.wefoundi.app.games successfully launched within 7 s 287 ms
```

### git 恢复本地删除的分支或者提交

前提是知道被删掉的 commitId。

```bash
# 从服务器拿到所有提交对象（防止没有完整对象）
git fetch origin

# 假设最后一个提交 id 是 abc123456789
git checkout -b master-c abc123456789
```

### git 忽略某些不需要提交的本地改动

`git update-index --assume-unchanged relative/path/*`

### powerShell 安装 posh-git

```bash
Install-Module posh-git -Scope CurrentUser

Import-Module posh-git

notepad $PROFILE # 在文件中添加  Import-Module posh-git
```

### 查看 PowerShell 版本

`$PSVersionTable`/`$PSVersionTable.PSVersion`

### CSS

#### 设置正方形

自适应保持正方形比例

```css
/* 1. 使用aspect-ratio */
width: 100%;
aspect-ratio: 1 / 1; /* 设置宽高比为1:1 */

/* 2. 使用padding-bottom技巧 */
width: 100%;
height: 0;
padding-bottom: 100%; /* 1:1的宽高比 */

/* 3. 使用vw单位 */
width: 100vw;
height: 100vw;
max-width: 666px; /* 限制最大尺寸 */
max-height: 666px;

/* 4. 使用CSS Grid */
display: grid;
place-items: center;
width: 100%;
aspect-ratio: 1 / 1;
```
