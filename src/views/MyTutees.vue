<template>
    <DisplayProgress :key="refreshComp" />
    {{ id }}
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
    methods: {
        change() {
            this.refreshComp += 1;
        },
    },
    mounted() {
        this.id = this.$route.params.id;
    }
};
</script>
  
<style></style>