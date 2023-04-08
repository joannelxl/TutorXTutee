<template>
  <RequestForm @added="change" />
  <RequestDisplay :key="refreshComp" />
</template>

<script>
import RequestForm from "../components/RequestForm.vue";
import RequestDisplay from "../components/MyRequestDisplay.vue";

export default {
  components: {
    RequestDisplay,
    RequestForm,
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
