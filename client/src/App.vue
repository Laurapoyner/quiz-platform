<template>
  <div id="app">
    <h1>Quiz Platform</h1>

    <!-- Simple conditional rendering uden vue-router -->
    <LoginView v-if="currentView === 'login'" @login-success="gotoDashboard" />
    <RegisterView
      v-if="currentView === 'register'"
      @register-success="gotoDashboard"
    />
    <DashboardView v-if="currentView === 'dashboard'" />
  </div>
</template>

<script>
import LoginView from "./views/LoginView.vue";
import RegisterView from "./views/RegisterView.vue";
import DashboardView from "./views/DashboardView.vue";

export default {
  components: { LoginView, RegisterView, DashboardView },
  data() {
    return {
      currentView: "login", // default view
    };
  },
  methods: {
    gotoDashboard() {
      this.currentView = "dashboard";
    },
    gotoRegister() {
      this.currentView = "register";
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
}
</style>
