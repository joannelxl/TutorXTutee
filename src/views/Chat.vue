<script>
export default {
	data() {
		return {
			id: null
		}
	},
	mounted() {
		this.id = this.$route.params.id
	}
}
</script>

<template>
	{{ id }}
</template>