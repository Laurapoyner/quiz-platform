<template>
  <div class="topbar">
    <h1>Quiz Platform<span class="accent">.</span></h1>
  </div>
  <div class="dashboard">
    <div class="column">
      <div>
        <h2>Dashboard</h2>
        <h3 class="text-dimmed">Velkommen {{ username }}!</h3>
      </div>

      <!-- QUIZ LISTE -->
      <div class="quiz-list">
        <h3>Tilgængelige quizzer</h3>

        <ul v-if="quizzes.length">
          <li class="quiz-item" v-for="quiz in quizzes" :key="quiz">
            {{ quiz.replace(".xml", "") }}

            <button class="quiz-item-btn" @click="startQuiz(quiz)">
              Start quiz
            </button>
          </li>
        </ul>

        <p v-else>Ingen quizzer fundet</p>
      </div>
    </div>
    <!-- RESULTATER -->
    <div class="results-section">
      <h3>Mine resultater</h3>

      <table v-if="results.length" class="results-table">
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Score</th>
            <th>Dato</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in results" :key="r.attemptId[0]">
            <td>{{ r.quizId[0] }}</td>
            <td class="score">{{ r.score[0] }}</td>
            <td>{{ formatDate(r.date[0]) }}</td>
          </tr>
        </tbody>
      </table>

      <p class="text-dimmed" v-else>Du har ikke taget nogen quizzer endnu</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      quizzes: [],
      results: [],
    };
  },

  async mounted() {
    this.username = localStorage.getItem("username") || "Bruger";

    await this.loadQuizzes();
    await this.loadResults();
  },

  methods: {
    async loadQuizzes() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/quizzes");
        const data = await res.json();

        this.quizzes = data;
      } catch (err) {
        console.error("Kunne ikke hente quizzer:", err);
      }
    },

    async loadResults() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/results");
        const data = await res.json();

        const allResults = data.results?.result || [];

        const username = localStorage.getItem("username");

        // filtrer så brugeren kun ser sine egne resultater
        this.results = allResults.filter((r) => r.userId[0] === username);
      } catch (err) {
        console.error("Kunne ikke hente resultater:", err);
      }
    },

    startQuiz(quizName) {
      const cleanName = quizName.replace(".xml", "");
      this.$emit("start-quiz", cleanName);
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString();
    },
  },
};
</script>
