---
title: Next.js
author: EricYangXD
date: "2023-05-16"
meta:
  - name: keywords
    content: Next.js
---

## Next.js

1. `npx create-next-app@latest my-next-app`
2. 路由按文件结构自动设置
3. 默认用 page 作为 index 入口。根目录下：`page.js`创建一个路由的独特 UI，并使路径可以公开访问；`route.js`为一个路由创建服务器端 API 端点。
4. 文件夹用`()`包裹，可以做权限判断
5. 文件夹用`[]`包裹，可以做路由传参
6. 文件夹用`[...xxx]`的形式，可以做多层级路由传参：`shopcart/1/phone/apple/14`，都会在 props 的 params 中，返回数组。也可以`app/[categoryId]/[itemId]/page.js -- 	{ categoryId: string, itemId: string }`
7. `o`: 静态
8. `λ`: 动态
9. `export const dynamic = true;` 在 page 中使用这种方法可以设置该页面为动态页面、静态页面等。
10. `export const revalidate = 10;` 在 page 中使用这种方法可以设置该页面中的请求缓存 10s？类似 fetch 中的第二个参数 next 的 revalidate。可以把页面转成静态的。
11. `export async function generateStaticParams(){...}`: 生成静态参数，也可以把页面转成 SSG：服务端生成页面。
12. 在`layout`中可以配置`export const metadata={title:'xxx',description:'xxx'};`做 SEO。也可以配置页面输出布局结构、国际化等，类似 main，根目录下的 layout 不可删除，控制其所有的 children 显示（同层级）。
13. `export async function generateMetadata(){...}`:做 SEO
14. 根目录下创建`sitemap.ts`，做 SEO

```js
export default async function sitemap() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const allPosts = (await res.json()) as Post[];

  const posts = allPosts.map((post) => {
    return {
      url: `http://localhost:3000/post/${post.id}`,
      lastModified: new Date().toISOString(),
    };
  });

  const routes = ["", "/about", "/post"].map((route) => {
    return {
      url: `http://localhost:3000${route}`,
      lastModified: new Date().toISOString(),
    };
  });

  return [...posts, ...routes];
}
```

1.  根目录下添加一张图片并命名为`opengraph-image.png`作为Open Graph image。。。每个组下面都可以添加。
2.  `app/api/user/route.ts`: route 是固定写法，访问`http://localhost:3000/api/user`即可获取 mock 接口数据
3.  `export const runtime = 'edge';` 定义运行的环境
4.  `template.js`与`layout.js`类似，只是在导航时安装一个新的组件实例。除非你需要这种行为，否则请使用 layouts。
5.  `layout.js`为一个段和它的子段创建共享的用户界面。一个布局包裹着一个页面或子段。类似 vue 中的`router-view`或者 react 中的`<Layout></Layout>`
6.  `loading.js`将一个页面或子段包裹在`React Suspense Boundary`中，在它们加载时显示加载 UI。
7.  `error.js`将一个页面或子段包裹在 React 错误边界中，如果发现错误，就会显示错误 UI。
8.  `global-error.js`与`error.js`类似，但专门用于捕捉根`layout.js`中的错误。
9.  `not-found.js`当 notFound 函数在一个路由段中被抛出时，或者当一个 URL 没有被任何路由匹配时，创建 UI 来显示。
10. ![nextjs文件与react的对应关系](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202305161448254.png)
11. Metadata元数据可以通过在layout.js或page.js文件中导出一个元数据对象或generateMetadata函数来定义。
12. 要使用`<Link>`，请从`next/link`中导入它，并向组件传递一个`href`，类似react，用来跳转
13. 获取pathName：`import { usePathname } from 'next/navigation'; const pathname = usePathname();`
14. 要使用`useRouter` hook，请从`next/navigation`导入，并在你的客户端组件中调用钩子：`const router = useRouter(); router.push('/dashboard');`
15. 一个路径下有多个子路径时也是用layout来处理.
16. 要创建多个根布局，移除顶层的 layout.js 文件，并在每个路由组内添加 layout.js 文件。这对于将一个应用程序分割成具有完全不同的用户界面或体验的部分很有用。`<html>`和`<body>`标签需要被添加到每个根布局中。
17. `parallel routes`或者一个路径下的同级子路径，要同时显示出来，那么子路径定义时要用`@`加在子路径名称之前。然后就可以同时在父路径下展示了。父路径的layout可以通过props接收子路径的ReactNode。相当于slot插槽的功能。
18. 值得注意的是：`children prop`是一个隐含的插槽，不需要映射到一个文件夹。这意味着`app/page.js`等同于`app/@children/page.js`。你可以定义一个`default.js`文件，在Next.js无法根据当前URL恢复槽的活动状态时，作为后备文件呈现。
19. layout不能接受searchParams参数。
20. 在客户端组件中使用page的searchParams属性或useSearchParams钩子，他们在客户端和最新的searchParams重新渲染了。
