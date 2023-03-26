<script>
import SignUp from '@/views/SignUp.vue'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'
import AllChats from '@/views/AllChats.vue'
import ConfirmDialogue from './components/ConfirmDialogue.vue'
import PopupModal from './components/PopupModal.vue'

export default {
	name: 'App',
	components: {
		SignUp,
		Login,
        Chat,
        AllChats,
        ConfirmDialogue,
        PopupModal,
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