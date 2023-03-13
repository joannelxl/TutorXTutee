<script>
import SignUp from '@/views/SignUp.vue'
import Login from '@/views/Login.vue'

export default {
	name: 'App',
	components: {
		SignUp,
		Login
	}
}
</script>

<template>
	<router-view/>
</template>

<style>
#app {
	width: 500px;
}

body {
	background: rgba(128, 0, 128, 0.1);
}
</style>