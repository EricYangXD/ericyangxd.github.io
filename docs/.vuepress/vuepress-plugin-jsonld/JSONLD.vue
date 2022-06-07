/** * Copyright © 2011-2022 EricYangXD, All Rights Reserved. */

<template></template>

<script>
export default {
	created() {
		if (typeof this.$ssrContext !== "undefined") {
			this.$ssrContext.userHeadTags += `<script type='application/ld+json'>
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${this.$page.title}",
            "url": "${"https://ericyangxd.top" + this.$page.path}",
            "image": [
              "https://ericyangxd.top/logo.png"
              ],
            "datePublished": "${
							this.$page.frontmatter.date &&
							new Date(this.$page.frontmatter.date).toISOString()
						}",
            "dateModified": "${
							this.$page.lastUpdated &&
							new Date(this.$page.lastUpdated).toISOString()
						}",
            "author": [{
                "@type": "Person",
                "name": "EricYangXD",
                "url": "https://github.com/EricYangXD/ericyangxd.github.io"
            }]
          }
      <\/script>`;
		}
	},
};
</script>
