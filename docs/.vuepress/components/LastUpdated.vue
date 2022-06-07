<template></template>

<script>
export default {
	props: ["slot-key"],
	mounted() {
		this.$page.lastUpdated = "2022/1/6 下午2:00:00";
	},
};
</script>
