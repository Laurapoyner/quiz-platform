<template>
  <div class="dashboard">
    <h2>Dashboard</h2>

    <p>
      Du er logget ind som <strong>{{ username }}</strong>
    </p>

    <hr />

    <!-- QUIZ LISTE -->
    <h3>Tilgængelige quizzer</h3>

    <ul v-if="quizzes.length">
      <li v-for="quiz in quizzes" :key="quiz">
        {{ quiz }}

        <button @click="startQuiz(quiz)">Start quiz</button>
      </li>
    </ul>

    <p v-else>Ingen quizzer fundet</p>

    <hr />

    <!-- RESULTATER -->
    <h3>Mine resultater</h3>

    <table v-if="results.length" class="results-table">
      <thead>
        <tr>
          <th>Quiz</th>
          <th>Score</th>
          <th>Tid (sek)</th>
          <th>Dato</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in results" :key="r.attemptId[0]">
          <td>{{ r.quizId[0] }}</td>
          <td>{{ r.score[0] }}</td>
          <td>{{ r.time[0] }}</td>
          <td>{{ formatDate(r.date[0]) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Du har ikke taget nogen quizzer endnu</p>
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
      // send quiz op til App.vue
      this.$emit("start-quiz", quizName);
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString();
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 700px;
  margin: 2rem auto;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  border: 1px solid #ccc;
  padding: 6px;
}

.results-table th {
  background: #f0f0f0;
}
</style>
