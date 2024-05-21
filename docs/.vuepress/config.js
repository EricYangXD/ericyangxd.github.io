/**
 * Copyright © 2011-2099 By EricYangXD, All Rights Reserved.
 */

let lcSecret;
if (process.env.PRODUCTION) {
  lcSecret = {
    LEANCLOUD_MYBLOG_APPID: "",
    LEANCLOUD_MYBLOG_APPKEY: "",
  };
} else {
  lcSecret = require("../../LeanCloudSecrets");
}

const appId = process.env.LEANCLOUD_MYBLOG_APPID || lcSecret.LEANCLOUD_MYBLOG_APPID;
const appKey = process.env.LEANCLOUD_MYBLOG_APPKEY || lcSecret.LEANCLOUD_MYBLOG_APPKEY;

// 配置网站的标题和描述，方便 SEO
module.exports = {
  title: "木易的OT",
  description:
    "前端面试,React,Vue,JavaScript,CSS,HTML,HTTP,HTTPS,websocket,UDP,TCP,Webpack,算法,数据结构,LeetCode,小程序,油猴,计算机网络,NodeJs,Vite,Antdesign,EricYangXD,Eric,Chrome,Android,V8,Mac,git,网络安全,开发技巧,路由,router,诗歌,金句,源码,面试,Docker,Shell,clash,Windows",
  // 路径名为 "/<REPO>/"
  base: "/",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  head: [
    // [
    // 	"link",
    // 	{
    // 		rel: "icon",
    // 		href: "/public/favicon.ico",
    // 	},
    // ],
    // TODO：Algolia 搜索
    // ["link", { href: "https://cdn.jsdelivr.net/npm/@docsearch/css@3", rel: "stylesheet" }],
    // ["script", { src: "https://cdn.jsdelivr.net/npm/@docsearch/js@3" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1",
      },
    ],
    [
      "meta",
      {
        name: "keywords",
        content:
          "前端面试,React,Vue,JavaScript,CSS,HTML,HTTP,TCP,Webpack,算法,数据结构,LeetCode,小程序,油猴,计算机网络,NodeJs,Vite,Antdesign,EricYangXD,Eric,Chrome,Android,V8,Mac,git,网络安全,开发技巧,路由,router,话费,充值,诗歌,金句,源码,面试,docker",
      },
    ],
    // SEO - JS 重定向
    [
      "script",
      {},
      `
        (function() {
          if (location.href.indexOf('github.io') > -1 || location.href.indexOf('gitee.io') > -1) {
             location.href = 'https://ericyangxd.top'
           }
        })();
        `,
    ],
  ],
  theme: "reco",
  themeConfig: {
    subSidebar: "auto",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "木易的OT",
        items: [
          { text: "Github", link: "https://github.com/EricYangXD" },
          {
            text: "掘金",
            link: "https://juejin.cn/user/2295436007445021",
          },
        ],
      },
    ],
    sidebar: [
      {
        title: "About",
        path: "/",
        children: [{ title: "About me", path: "/" }],
      },
      {
        title: "React",
        // path: "/handbook/React/SourceCode",
        children: [
          { title: "React源码", path: "/handbook/React/SourceCode" },
          {
            title: "React路由守卫",
            path: "/handbook/React/RouterGuard",
            // isShowComments: false,
          },
          { title: "React开发体会", path: "/handbook/React/Skills" },
          {
            title: "Hooks - useReducer",
            path: "/handbook/React/UseReducer",
          },
          {
            title: "Hooks - useImperativeHandle",
            path: "/handbook/React/UseImperativeHandle",
          },
          {
            title: "React+TypeScript Cheatsheets",
            path: "/handbook/React/React-TS-CheatSheet",
          },
          {
            title: "JSX原理",
            path: "/handbook/React/JSX",
          },
          {
            title: "React-Router",
            path: "/handbook/React/React-Router",
          },
        ],
      },
      {
        title: "Vue",
        // path: "/handbook/Vue/SourceCode",
        children: [
          { title: "Vue源码", path: "/handbook/Vue/SourceCode" },
          {
            title: "ElementUI踩坑记录",
            path: "/handbook/Vue/ElementUI",
          },
          {
            title: "Vue开发体会",
            path: "/handbook/Vue/Skills",
          },
        ],
      },
      {
        title: "LeetCode",
        // path: "/handbook/LeetCode/BinaryTree",
        children: [
          {
            title: "二叉树",
            path: "/handbook/LeetCode/BinaryTree",
          },
          {
            title: "递归",
            path: "/handbook/LeetCode/Recursive",
          },
          {
            title: "动态规划",
            path: "/handbook/LeetCode/DP",
          },
          {
            title: "排序",
            path: "/handbook/LeetCode/Sort",
          },
          {
            title: "算法数据结构基础",
            path: "/handbook/LeetCode/Basic",
          },
          {
            title: "双越前端面试100题",
            path: "/handbook/LeetCode/Interview",
          },
        ],
      },
      {
        title: "JavaScript",
        // path: "/handbook/JavaScript/FrontEnd1",
        children: [
          {
            title: "前端开发技巧(1)",
            path: "/handbook/JavaScript/FrontEnd1",
          },
          {
            title: "前端开发技巧(2)",
            path: "/handbook/JavaScript/FrontEnd2",
          },
          {
            title: "前端开发技巧(3)",
            path: "/handbook/JavaScript/FrontEnd3",
          },
          {
            title: "APIs",
            path: "/handbook/JavaScript/Api",
          },
          {
            title: "手写Promise",
            path: "/handbook/JavaScript/Promise",
          },
          {
            title: "Quill编辑器",
            path: "/handbook/JavaScript/Quill",
          },
          {
            title: "正则表达式",
            path: "/handbook/JavaScript/RegExp",
          },
          { title: "TypeScript", path: "/handbook/JavaScript/TS" },
          { title: "JavaScript", path: "/handbook/JavaScript/JS" },
          { title: "co.js", path: "/handbook/JavaScript/Cojs" },
          {
            title: "手写函数1",
            path: "/handbook/JavaScript/Function1",
          },
          {
            title: "手写函数2",
            path: "/handbook/JavaScript/Function2",
          },
          {
            title: "包管理工具",
            path: "/handbook/JavaScript/PackageManageTools",
          },
          {
            title: "用TS封装Axios",
            path: "/handbook/JavaScript/Axios",
          },
          {
            title: "ESLint+Prettier",
            path: "/handbook/JavaScript/ESLint",
          },
          {
            title: "Jest",
            path: "/handbook/JavaScript/Jest",
          },
          {
            title: "Next.js",
            path: "/handbook/JavaScript/NextJS",
          },
          {
            title: "Mock数据",
            path: "/handbook/JavaScript/Mock",
          },
        ],
      },
      {
        title: "CSS",
        // path: "/handbook/CSS/CSS1",
        children: [
          { title: "CSS Tips1", path: "/handbook/CSS/CSS1" },
          { title: "CSS Tips2", path: "/handbook/CSS/CSS2" },
          { title: "CSS Tips3", path: "/handbook/CSS/CSS3" },
          { title: "SCSS Tips", path: "/handbook/CSS/SCSS" },
        ],
      },
      {
        title: "AntDesign",
        // path: "/handbook/AntDesign/AntDesign",
        children: [
          {
            title: "AntDesign",
            path: "/handbook/AntDesign/AntDesign",
          },
        ],
      },
      {
        title: "小程序",
        // path: "/handbook/Applet/Taro",
        children: [
          {
            title: "小程序 & Taro",
            path: "/handbook/Applet/Taro",
          },
        ],
      },
      {
        title: "Webpack",
        // path: "/handbook/Webpack/Basic",
        children: [
          {
            title: "Webpack基础知识",
            path: "/handbook/Webpack/Basic",
          },
          {
            title: "常用插件和Loader",
            path: "/handbook/Webpack/Plugin-Loader",
          },
          {
            title: "Tree Shaking",
            path: "/handbook/Webpack/Tree-Shaking",
          },
        ],
      },
      {
        title: "开发技巧",
        // path: "/handbook/Skill/DevelopmentSkills",
        children: [
          {
            title: "前端常用开发技巧",
            path: "/handbook/Skill/DevelopmentSkills",
          },
          {
            title: "Linux常用命令",
            path: "/handbook/Skill/Linux",
          },
          {
            title: "Nginx",
            path: "/handbook/Skill/Nginx",
          },
          {
            title: "Python",
            path: "/handbook/Skill/Python",
          },
          {
            title: "Shell笔记",
            path: "/handbook/Skill/Shell",
          },
          {
            title: "Shell每日一练",
            path: "/handbook/Skill/ShellPractice",
          },
          {
            title: "微前端",
            path: "/handbook/Skill/MicroFE",
          },
          {
            title: "Windows",
            path: "/handbook/Skill/Windows",
          },
          {
            title: "Android",
            path: "/handbook/Skill/Android",
          },
          {
            title: "VSCode",
            path: "/handbook/Skill/VSCode",
          },
          {
            title: "阿里云ACP",
            path: "/handbook/Skill/Aliyun",
          },
          {
            title: "Bugs问题记录",
            path: "/handbook/Skill/FixBugs",
          },
          {
            title: "摄影笔记",
            path: "/handbook/Skill/Photograph",
          },
          {
            title: "Emoji表情",
            path: "/handbook/Skill/Emoji",
          },
          {
            title: "Tauri",
            path: "/handbook/Skill/Tauri",
          },
        ],
      },
      {
        title: "Angular",
        // path: "/handbook/Angular/Angular",
        children: [
          {
            title: "Angular",
            path: "/handbook/Angular/Angular",
          },
          {
            title: "Angular 企业实战开发",
            path: "/handbook/Angular/AngularDoc",
          },
        ],
      },
      {
        title: "Backend（Java Based）",
        children: [
          {
            title: "Learn Java",
            path: "/handbook/Java/Learn",
          },
          {
            title: "Java Work",
            path: "/handbook/Java/Work",
          },
          {
            title: "Maven",
            path: "/handbook/Java/Maven",
          },
          {
            title: "Spring",
            path: "/handbook/Java/Spring",
          },
          {
            title: "MySQL笔记",
            path: "/handbook/Java/SQL",
          },
          {
            title: "Groovy笔记",
            path: "/handbook/Java/Groovy",
          },
          {
            title: "Scala笔记",
            path: "/handbook/Java/Scala",
          },
          {
            title: "第三方库",
            path: "/handbook/Java/Library",
          },
        ],
      },
      {
        title: "Docker",
        children: [
          {
            title: "Docker",
            path: "/handbook/Docker/Docker",
          },
        ],
      },
      {
        title: "油猴",
        // path: "/handbook/TamperMonkey/Plugin",
        children: [
          {
            title: "油猴常用插件",
            path: "/handbook/TamperMonkey/Plugin",
          },
        ],
      },
      {
        title: "计算机网络",
        // path: "/handbook/Network/Http",
        children: [
          {
            title: "Http(s)协议相关知识",
            path: "/handbook/Network/Http",
          },
          {
            title: "TCP协议相关知识",
            path: "/handbook/Network/TCP",
          },
          {
            title: "DMZ区域",
            path: "/handbook/Network/DMZ",
          },
          {
            title: "knowhow",
            path: "/handbook/Network/KnowHow",
          },
        ],
      },
      {
        title: "Nodejs",
        children: [
          {
            title: "Nodejs相关知识点",
            path: "/handbook/NodeJS/Nodejs",
          },
          {
            title: "Express Doc",
            path: "/handbook/NodeJS/Express",
          },
        ],
      },
      {
        title: "Vite",
        children: [
          {
            title: "Vite相关知识点",
            path: "/handbook/Vite/Vite",
          },
        ],
      },
      {
        title: "Web安全",
        children: [
          {
            title: "Web安全相关知识点",
            path: "/handbook/WebSecurity/WebSecurity",
          },
          {
            title: "Spectre攻击",
            path: "/handbook/WebSecurity/Spectre",
          },
        ],
      },
      {
        title: "Google Chrome V8",
        // path: "/handbook/Chrome/V8",
        children: [
          {
            title: "GeekTime 图解 Google V8",
            path: "/handbook/Chrome/V8",
          },
          {
            title: "在浏览器中输入URL后发生了什么",
            path: "/handbook/Chrome/Url",
          },
          {
            title: "DevTools Tips",
            path: "/handbook/Chrome/Tips",
          },
        ],
      },
      {
        title: "Git",
        children: [
          {
            title: "Git有用的命令 & VSCode插件",
            path: "/handbook/Git/Git",
          },
        ],
      },
      {
        title: "Mac使用记录",
        children: [
          {
            title: "Mac配置&使用记录",
            path: "/handbook/Mac/Mac",
          },
        ],
      },
      {
        title: "文章诗句",
        children: [
          {
            title: "记录一些文章诗句1",
            path: "/handbook/Poem/Poem",
          },
          {
            title: "记录一些文章诗句2",
            path: "/handbook/Poem/Article",
          },
        ],
      },
      {
        title: "Office软件",
        children: [
          {
            title: "MS Word",
            path: "/handbook/Office/Word",
          },
        ],
      },
      {
        title: "股海浮沉",
        children: [
          {
            title: "通达信指标收集",
            path: "/handbook/Stock/TDX",
          },
          {
            title: "风清扬",
            path: "/handbook/Stock/FQY",
          },
          {
            title: "可转债",
            path: "/handbook/Stock/KZZ",
          },
        ],
      },
      {
        title: "打工人须知",
        children: [
          {
            title: "打工人打工魂",
            path: "/handbook/Worker/Work",
          },
        ],
      },
    ],
    author: "EricYangXD",
    huawei: true,
    // logo: "/public/logo.png",
    // authorAvatar: "/public/logo.png",
    // authorAvatar: "https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/header.png",
    type: "blog",
    //友情链接
    // friendLink: [
    // 	{
    // 		title: "午后南杂",
    // 		desc: "Enjoy when you can, and endure when you must.",
    // 		email: "1156743527@qq.com",
    // 		link: "https://www.recoluan.com",
    // 	},
    // 	{
    // 		title: "vuepress-theme-reco",
    // 		desc: "A simple and beautiful vuepress Blog & Doc theme.",
    // 		avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    // 		link: "https://vuepress-theme-reco.recoluan.com",
    // 	},
    // ],
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    // sidebar: 'auto',
    // 最后更新时间
    lastUpdated: "上次更新", //"Last Updated", // 上次更新
    // 备案号
    // record: "xxxx",
    // 项目开始时间
    // startYear: "2015",
    // 腾讯公益
    noFoundPageByTencent: true,
    // TODO：Algolia 搜索
    // algolia: {
    //   apiKey: "xxx",
    //   indexName: "ericyangxd",
    //   // 如果 Algolia 没有为你提供 `appId` ，使用 `BH4D9OD16A` 或者移除该配置项
    //   appId: "xxx",
    //   insights: true,
    //   container: ".search-box",
    //   debug: true,
    // },
    // 接入评论，存储在LeanCloud
    valineConfig: {
      appId, // your appId
      appKey, // your appKey
      // showComment: false,
      visitor: true, // 阅读量统计
      ignore_local: true,
    },
  },
  // devServer: {
  // 	proxy: {
  // 		'/api': {
  // 			target: 'http://localhost:8090',
  // 		}
  // 	}
  // },
  markdown: {
    lineNumbers: true,
    externalLinks: { target: "_blank", rel: "nofollow noopener noreferrer" },
  },
  plugins: [
    [
      "vuepress-plugin-nuggets-style-copy",
      {
        copyText: "复制代码",
        tip: {
          content: "复制成功",
        },
      },
    ],
    [
      "copyright",
      {
        authorName: "EricYangXD", // 选中的文字将无法被复制
        minLength: 50, // 如果长度超过 50 个字符
      },
    ],
    [
      "dynamic-title",
      {
        // showIcon:
        // 	"https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae",
        showText: "欢迎回来~",
        // hideIcon:
        // 	"https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae",
        hideText: "再学一会儿~",
        recoverTime: 2000,
      },
    ],
    [
      "@vuepress/last-updated",
      {
        // transformer: (timestamp, lang) => {
        // 	// 不要忘了安装 moment
        // 	const moment = require("moment");
        // 	moment.locale(lang);
        // 	return moment(timestamp).fromNow();
        // },
        transformer: (timestamp, lang) => {
          return new Date(timestamp).toLocaleDateString();
        },
      },
    ],
    [
      "sitemap",
      {
        hostname: "https://ericyangxd.top",
      },
    ],
    // [
    // 	"@vuepress-reco/vuepress-plugin-bgm-player",
    // 	{
    // 		audios: [
    // 			{
    // 				name: "LOSER",
    // 				artist: "莫扎特：C大调奏鸣曲",
    // 				url: "http://m10.music.126.net/20220608011844/3d5dd623edcf774853e955a55db8c7c0/ymusic/535b/0e5e/0608/d19fc3fe829430610ce61b58d95fecba.mp3",
    // 				cover:
    // 					"https://p1.music.126.net/qTSIZ27qiFvRoKj-P30BiA==/109951165895951287.jpg?param=200y200",
    // 			},
    // 		],
    // 		// 是否默认缩小
    // 		autoShrink: true,
    // 		// 缩小时缩为哪种模式
    // 		shrinkMode: "float",
    // 		// 悬浮窗样式
    // 		floatStyle: { bottom: "10px", "z-index": "999999" },
    // 	},
    // ],
    ["@vuepress-reco/extract-code"],
    [
      "seo",
      {
        siteTitle: (_, $site) => "木易的OT",
        title: ($page) => $page.title,
        description: ($page) => $page.frontmatter.description,
        author: (_, $site) => "EricYangXD",
        type: ($page) => "article",
        url: (_, $site, path) => "https://ericyangxd.top" + path,
        image: ($page, $site) => "https://ericyangxd.top/logo.png",
        publishedAt: ($page) => $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: ($page) => $page.lastUpdated && new Date($page.lastUpdated),
      },
    ],
    [require("./vuepress-plugin-jsonld")],
    [
      "uglifyjs-webpack-plugin",
      {
        parallel: true,
        cache: true,
      },
    ],
    ["hard-source-webpack-plugin"],
    ["fulltext-search"],
  ],
};
