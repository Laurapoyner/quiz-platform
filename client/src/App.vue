<!-- main vue app der håndterer navigation mellem login, register og dashboard views. -->

<template>
  <div id="container">
    <h1>Quiz Platform</h1>

    <!-- Viser login, register eller dashboard baseret på currentView -->
    <!-- @login-success="gotoDashboard" lytter til event fra child component, som sender besked til app.vue om login lykkedes-->
    <LoginView
      v-if="currentView === 'login'"
      @login-success="gotoDashboard"
      @go-to-register="gotoRegister"
    />
    <RegisterView
      v-if="currentView === 'register'"
      @register-success="gotoDashboard"
    />
    <DashboardView v-if="currentView === 'dashboard'" />

    <!-- TO DO: <AdminView v-if="role === 'admin'" /> -->
    <AdminView v-if="currentView === 'admin'" />

    <!-- TO DO:  <DashboardView
      v-if="currentView === 'dashboard'"
      @start-quiz="startQuiz"
      @go-admin="currentView = 'admin'"
      :user="loggedInUser"
    /> -->

    <QuizView v-if="currentView === 'quiz'" />
  </div>
</template>

<script>
import LoginView from "./views/LoginView.vue";
import RegisterView from "./views/RegisterView.vue";
import DashboardView from "./views/DashboardView.vue";
import AdminView from "./views/AdminView.vue";
import QuizView from "./views/QuizView.vue";

export default {
  components: { LoginView, RegisterView, DashboardView, AdminView, QuizView },
  data() {
    return {
      // currentView: "login", // default
      currentView: "quiz", // midlertidig for at teste admin view uden at skulle logge ind hver gang
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
