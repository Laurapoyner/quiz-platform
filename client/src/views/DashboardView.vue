<template>
  <div class="dashboard-view">
    <h2>Dashboard</h2>
    <p>Velkommen til dit dashboard!</p>
    <p>Du er logget ind som: {{ username }}</p>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  props: ["username"],
};
</script>
