<template>
    <DisplayProgress :key="refreshComp" :id="id" />
</template>

<script>
import DisplayProgress from "../components/DisplayProgress.vue";

export default {
    components: {
        DisplayProgress,
    },
    data() {
        return {
            refreshComp: 0,
            id: null,
        };
    },
    mounted() {
        this.id = this.$route.params.id
    },
    methods: {
        change() {
            this.refreshComp += 1;
        },
    },

};
</script>

<style></style>
