/**
 * Copyright © 2011-2022 EricYangXD, All Rights Reserved.
 */

const { path } = require("@vuepress/shared-utils");

module.exports = (options) => ({
	name: "vuepress-plugin-jsonld",
	enhanceAppFiles() {
		return [path.resolve(__dirname, "enhanceAppFile.js")];
	},
	globalUIComponents: ["JSONLD"],
});
