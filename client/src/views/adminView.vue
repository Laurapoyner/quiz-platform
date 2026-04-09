<template>
  <div class="topbar">
    <h1>Quiz Platform<span class="accent">.</span></h1>
  </div>
  <div class="admin">
    <div class="column">
      <div>
        <h2>Admin Panel</h2>
        <h3 class="text-dimmed">Velkommen {{ username }}!</h3>
      </div>

      <!--- Upload quiz --->
      <div class="upload">
        <h3>Upload en ny quiz</h3>
        <input type="file" @change="handleFile" accept=".xml" />
        <button class="quiz-item-btn" @click="uploadQuiz">Upload</button>
      </div>

      <!--- Quiz liste --->
      <div class="quiz-list">
        <h3>Quiz liste</h3>

        <ul v-if="quizzes.length">
          <li class="quiz-item" v-for="quiz in quizzes" :key="quiz">
            {{ quiz.replace(".xml", "") }}
            <button class="quiz-item-btn" @click="testQuiz(quiz)">Test</button>
            <button class="quiz-item-btn" @click="deleteQuiz(quiz)">
              Slet
            </button>
          </li>
        </ul>
        <p v-else>Ingen quizzer fundet</p>
      </div>
    </div>

    <!-- Brugerresultater  -->
    <div class="column">
      <h3>Brugerresultater</h3>
      <table v-if="results.length" class="results-table">
        <thead>
          <tr>
            <th>Bruger</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Tid (sek)</th>
            <th>Dato</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in results" :key="r.attemptId[0]">
            <td>{{ r.userId[0] }}</td>
            <td>{{ r.quizId[0] }}</td>
            <td>{{ r.score[0] }}</td>
            <td>{{ r.time[0] }}</td>
            <td>{{ formatDate(r.date[0]) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Ingen resultater endnu</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      selectedFile: null,
      quizzes: [],
      results: [],
    };
  },

  async mounted() {
    // Hent brugernavn fra localStorage
    this.username = localStorage.getItem("username") || "Admin";

    // Load quizser og resultater automatisk
    await this.loadQuizzes();
    await this.loadResults();
  },

  methods: {
    testQuiz(quizName) {
      this.$emit("start-quiz", quizName); // send quiznavnet op til App.vue
    },
    handleFile(event) {
      this.selectedFile = event.target.files[0];
    },

    async uploadQuiz() {
      if (!this.selectedFile) {
        alert("Vælg en fil først");
        return;
      }

      const formData = new FormData();
      formData.append("quiz", this.selectedFile);

      try {
        const res = await fetch("http://localhost:3000/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          alert("Quiz uploadet!");
          this.selectedFile = null;
          await this.loadQuizzes(); // opdater listen automatisk
        } else {
          const err = await res.text();
          alert("Upload fejl: " + err);
        }
      } catch (err) {
        console.error("Upload fejl:", err);
        alert("Upload fejl: " + err.message);
      }
    },

    async loadQuizzes() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/quizzes");
        if (!res.ok) throw new Error("Fejl ved hentning af quizzer");
        this.quizzes = await res.json();
      } catch (err) {
        console.error(err);
        alert("Kunne ikke hente quizzer");
      }
    },

    async deleteQuiz(name) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/admin/quiz/${name}`,
          {
            method: "DELETE",
          },
        );

        if (res.ok) {
          alert("Quiz slettet!");
          await this.loadQuizzes();
        } else {
          alert("Kunne ikke slette quiz");
        }
      } catch (err) {
        console.error(err);
        alert("Slet fejl: " + err.message);
      }
    },

    async loadResults() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/results");
        if (!res.ok) throw new Error("Fejl ved hentning af resultater");

        const data = await res.json();
        this.results = data.results?.result || [];
      } catch (err) {
        console.error(err);
        alert("Kunne ikke hente resultater");
      }
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString();
    },
  },
};
</script>
