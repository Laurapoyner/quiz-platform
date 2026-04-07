<!-- main vue app der håndterer navigation mellem login, register og dashboard views. -->

<template>
  <div id="app">
    <h1>Quiz Platform</h1>

    <!-- Viser login, register eller dashboard baseret på currentView -->
    <!-- @login-success="gotoDashboard" lytter til event fra child component, som sender besked til app.vue om login lykkedes-->
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
      currentView: "login", // default
    };
  },
  methods: {
    // kaldes når login eller register er succesfuld
    gotoDashboard() {
      this.currentView = "dashboard";
    },
    gotoRegister() {
      this.currentView = "register";
    },
  },
};
</script>
