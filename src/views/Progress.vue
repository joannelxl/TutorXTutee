<template>
    <AddProgressNotes @added="change" />
    {{ id }}
</template>
  
<script>
import AddProgressNotes from "../components/AddProgressNotes.vue";
export default {
    components: {
        AddProgressNotes,
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