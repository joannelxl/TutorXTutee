<template>
    <AddProgressNotes @added="change" />
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
        };
    },
    methods: {
        change() {
            this.refreshComp += 1;
        },
    },
};
</script>
  
<style></style>