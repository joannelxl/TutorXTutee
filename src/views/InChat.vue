
<template>
    <div class="page">
        <div class="heading">
            <h1>Tutor x Tutee</h1>
        </div>
    </div>
    <prevMessages/>
</template>

<script>
import prevMessages from '@/components/prevMessages.vue';

export default {
    components: {prevMessages}
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