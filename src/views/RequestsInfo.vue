<template>
    <div class="page">
        <div class="heading">
            <h1>Tutor x Tutee</h1>
            <h4> You can use the chat function to clarify doubts that you might have or accept the request </h4>
            <br>
        </div>
        <ReqInfo :key="refreshComp" @accepted="change"/>
    </div>

</template>

<script>
import ReqInfo from '../components/ReqInfo.vue';

export default {
    name: "RequestInfo",
    components: {
        ReqInfo
    },
	data() {
		return {
            refreshComp: 0
		}
	},
    methods: {
        change() {
            this.refreshComp += 1
        }
    }
}
</script>

<style scoped>
.page{
    text-align: center;
    width: 90vw
}
.heading{
    text-align: center;
}
</style>