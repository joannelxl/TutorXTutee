
<template>
  <Chat />
</template>

<script>
import Chat from './components/Chat.vue';
import SignUp from '@/views/SignUp.vue'
import Login from '@/views/Login.vue'

export default {
    name: "App",
    components: {
        Chat, 
        SignUp, 
        Login
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app input {
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-right: 5px;
  width: 300px;
}
#app button {
  background-color: #21cfbc;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/*<script>
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
  <Chat />
</template>

<style scoped>
</style>