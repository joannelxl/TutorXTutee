<template>
  <div id = "chats">
    <div class = "kelly">
        <button class = "kelly" type = "button" v-on:click = "toChat">
            <h2>Kelly Ng</h2>
            <h4>Thank you, will prepare the necessary notes for the upcoming lesson. See you.</h4>
        </button>
    </div>

    <button id = "teresa">
        <h2>Teresa See</h2>
        <h4>I will check on my available timings and get back to you again.</h4>
    </button>

    <button id = "joanne">
        <h2>Joanne Lim</h2>
        <h4>Are you able to start this week?</h4>
    </button>
  </div>
</template>

<script>
    export default {
        methods: {
            toChat() {
                this.$router.push("/Chat")
            }
        }
    }

</script>

<style scoped>
#chats { 
    background-color: #f3ddb0;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    text-align: center;
    border-radius: 25px;

    position: absolute;
    width: 50%;
    height: 450px;
    left: 340px;
    top: 60px;
}

.kelly, #teresa, #joanne {
    background-color: #f3ddb0;
    text-align: center;
    border-color: white;
    border-width: 2px;  
    width: 100%
}

</style>
