// 配置网站的标题和描述，方便 SEO
module.exports = {
	title: "TypeScript4 文档",
	description: "TypeScript4 最新官方文档翻译",
	// 路径名为 "/<REPO>/"
	base: "/my-vuepress-blog/",
	locales: {
		"/": {
			lang: "zh-CN",
		},
	},
	theme: "reco",
	themeConfig: {
		subSidebar: "auto",
		nav: [
			{ text: "首页", link: "/" },
			{
				text: "冴羽的 JavaScript 博客",
				items: [
					{ text: "Github", link: "https://github.com/mqyqingfeng" },
					{
						text: "掘金",
						link: "https://juejin.cn/user/712139234359182/posts",
					},
				],
			},
		],
		sidebar: [
			{
				title: "欢迎学习",
				path: "/",
				collapsable: false, // 不折叠
				children: [{ title: "学前必读", path: "/" }],
			},
			{
				title: "基础学习",
				path: "/handbook/LearnReact",
				collapsable: false, // 不折叠
				children: [
					{ title: "条件类型", path: "/handbook/LearnReact" },
					{ title: "泛型", path: "/handbook/Generics" },
				],
			},
		],
		author: "EricYangXD",
		huawei: true,
		// logo: "/head.png",
		// authorAvatar: "/avatar.png",
		type: "blog",
	},
};
