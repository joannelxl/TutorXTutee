<template>
  <div class="page">
    <div class="heading">
        <h1>Tutor x Tutee</h1>
        <h4>All your tutoring requests are listed here</h4>
    </div>
  </div>
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

<style scoped>
.page{
    text-align: center;
    width: 90vw
}
.heading{
    text-align: center;
}
</style>
