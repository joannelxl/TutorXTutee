<template>
    <div class="container">
        <div class="heading">
            <h1> Tutor x Tutee</h1>
            <h4> Please click on the listings to find out more about each student.</h4>
        </div>
        <RequestDisplay/>
    </div>
</template>

<script>

import RequestDisplay from '../components/RequestDisplay.vue';

export default {
    name: 'Requests',
    components: {
        RequestDisplay
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

.container{
    text-align: center;
    width: 90vw
}
.heading{
    text-align: center;
}

</style>