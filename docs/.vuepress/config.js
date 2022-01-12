// 配置网站的标题和描述，方便 SEO
module.exports = {
	title: "木易的OT",
	description: "随笔杂谈",
	// 路径名为 "/<REPO>/"
	base: "/my-vuepress-blog/",
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
				],
			},
			{
				title: "JavaScript",
				path: "/handbook/JavaScript/FrontEnd",
				children: [
					{
						title: "前端开发技巧",
						path: "/handbook/JavaScript/FrontEnd",
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
				title: "Http(s)",
				// path: "/handbook/Http/Http",
				children: [
					{
						title: "Http协议相关知识",
						path: "/handbook/Http/Http",
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
};
