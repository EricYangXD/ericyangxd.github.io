// 配置网站的标题和描述，方便 SEO
module.exports = {
	title: "木易的OT",
	description: "前端面试|React|Vue|JavaScript|CSS|HTML|HTTP|TCP|Webpack|算法|数据结构|LeetCode|小程序|油猴|计算机网络|NodeJs|Vite|Antdesign|EricYangXD|Eric|Chrome|Android|V8|Mac|git|网络安全|开发技巧|路由|router|话费|充值|诗歌|金句|源码|面试|docker",
	// 路径名为 "/<REPO>/"
	base: "/",
	locales: {
		"/": {
			lang: "zh-CN",
		},
	},
	// head: [
	// [
	// 	"link",
	// 	{
	// 		rel: "icon",
	// 		href: "/public/favicon.ico",
	// 	},
	// ],
	// [
	// 	"meta",
	// 	{
	// 		name: "viewport",
	// 		content: "width=device-width,initial-scale=1,user-scalable=no",
	// 	},
	// ],
	// ],
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
				path: "/handbook/React/SourceCode",
				children: [
					{ title: "React源码", path: "/handbook/React/SourceCode" },
					{
						title: "React路由守卫",
						path: "/handbook/React/RouterGuard",
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
						path: "/handbook/React/React-TS-CheatSheet-README",
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
				path: "/handbook/Vue/SourceCode",
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
				path: "/handbook/LeetCode/BinaryTree",
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
				path: "/handbook/JavaScript/FrontEnd",
				children: [
					{
						title: "APIs",
						path: "/handbook/JavaScript/Api",
					},
					{
						title: "前端开发技巧(1)",
						path: "/handbook/JavaScript/FrontEnd1",
					},
					{
						title: "前端开发技巧(2)",
						path: "/handbook/JavaScript/FrontEnd2",
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
						title: "手写函数",
						path: "/handbook/JavaScript/Function",
					},
					{
						title: "包管理工具",
						path: "/handbook/JavaScript/PackageManageTools",
					},
					{
						title: "用TS封装Axios",
						path: "/handbook/JavaScript/Axios",
					},
				],
			},
			{
				title: "CSS",
				// path: "/handbook/CSS/CSS",
				children: [{ title: "CSS", path: "/handbook/CSS/CSS" }],
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
				// path: "/handbook/Webpack/Plugin-Loader",
				children: [
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
				path: "/handbook/Skill/DevelopmentSkills",
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
						title: "Emoji表情",
						path: "/handbook/Skill/Emoji",
					},
					{
						title: "Android",
						path: "/handbook/Skill/Android",
					},
					{
						title: "问题记录",
						path: "/handbook/Skill/FixBugs",
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
				],
			},
			{
				title: "Nodejs",
				children: [
					{
						title: "Nodejs相关知识点",
						path: "/handbook/NodeJS/Nodejs",
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
				],
			},
			{
				title: "Google Chrome V8",
				children: [
					{
						title: "GeekTime 图解 Google V8",
						path: "/handbook/Chrome/V8",
					},
					{
						title: "在浏览器中输入URL后发生了什么",
						path: "/handbook/Chrome/Url",
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
						title: "记录一些文章诗句",
						path: "/handbook/Poem/Poem",
					},
				],
			},
		],
		author: "EricYangXD",
		huawei: true,
		// logo: "/public/logo.png",
		// authorAvatar: "/public/logo.png",
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
		// searchMaxSuggestions: 10,
		// 自动形成侧边导航
		// sidebar: 'auto',
		// 最后更新时间
		lastUpdated: "Last Updated",
		// 备案号
		// record: "xxxx",
		// 项目开始时间
		// startYear: "2015",
	},
	// markdown: {
	// 	lineNumbers: true,
	// },
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
				showText: "客官欢迎回来~",
				// hideIcon:
				// 	"https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae",
				hideText: "客官不要走嘛~",
				recoverTime: 2000,
			},
		],
	],
};
