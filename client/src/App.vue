<!-- main vue app der håndterer navigation mellem login, register og dashboard views. -->

<template>
  <div id="container">
    <LoginView 
      v-if="currentView === 'login'"
      @login-success="handleLoginSuccess" 
      @go-to-register="gotoRegister" 
    />

    <RegisterView 
      v-if="currentView === 'register'"
      @register-success="currentView = 'login'" 
    />

    <DashboardView 
      v-if="currentView === 'dashboard'" 
      @start-quiz="startQuiz" 
    />

    <AdminView 
      v-if="currentView === 'admin'" 
      @start-quiz="startQuiz" 
    />

    <QuizView 
      v-if="currentView === 'quiz'"
      :quizName="selectedQuiz"
      @go-dashboard="currentView = 'dashboard'" 
    />
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
      currentView: "login",
      selectedQuiz: null,
      userRole: null, // Vi tilføjer denne til at holde styr på rollen lokalt
    };
  },
  methods: {
    // Denne funktion styrer nu HELE trafikken efter login
    handleLoginSuccess(userData) {
      this.userRole = userData.role; // Gem rollen ("admin" eller "user")
      
      if (this.userRole === "admin") {
        this.currentView = "admin";
      } else {
        this.currentView = "dashboard";
      }
    },
    
    gotoRegister() {
      this.currentView = "register";
    },

    startQuiz(quizName) {
      this.selectedQuiz = quizName;
      this.currentView = "quiz";
    },

    // En lille hjælper til at komme tilbage
    gotoDashboard() {
      this.currentView = this.userRole === 'admin' ? 'admin' : 'dashboard';
    }
  },
};
</script>