<template>
  <div class="card">
    <h1>{{ subject }}</h1>

    <p>Preferred Days: {{ preferredDays }}</p>
    <p>Preferred Time: {{ preferredTime }}</p>
    <p>Location: {{ location }}</p>
    <p>Address: {{ address }}</p>
    <p>Remarks: {{ remarks }}</p>
  </div>
</template>

<script>
export default {
  props: {
    subject: String,
    preferredDays: String,
  },
};
</script>
