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
      <div class="divider">
        <h3>Upload en ny quiz</h3>
        <div class="upload">
          <input
            id="fileInput"
            type="file"
            @change="handleFile"
            accept=".xml"
            style="display: none"
          />

          <label for="fileInput" class="file-label">
            Vælg en quiz
            <p class="file-name">
              {{ selectedFileName || "Quiz skal være typen .xml" }}
            </p>
          </label>

          <button class="quiz-item-btn upload-btn" @click="uploadQuiz">
            Upload
          </button>
        </div>
      </div>

      <!--- Quiz liste --->
      <div>
        <h3>Uploadede quizzer</h3>
        <div class="quiz-list-admin">
          <ul v-if="quizzes.length">
            <li class="quiz-item" v-for="quiz in quizzes" :key="quiz">
              {{ quiz.replace(".xml", "") }}
              <div class="admin-quiz-btns">
                <button class="quiz-item-btn" @click="testQuiz(quiz)">
                  Test Quiz
                </button>
                <button class="quiz-item-btn" @click="deleteQuiz(quiz)">
                  Slet
                </button>
              </div>
            </li>
          </ul>
          <p v-else>Ingen quizzer fundet</p>
        </div>
      </div>
    </div>

    <!-- Brugerresultater  -->

    <div class="results-section">
      <h3>Brugerresultater</h3>

      <div class="results-table-container" v-if="results.length">
        <table class="results-table">
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
              <td class="userid">{{ r.userId[0] }}</td>
              <td>{{ r.quizId[0] }}</td>
              <td class="score">{{ r.score[0] }}</td>
              <td>{{ r.time[0] }}</td>
              <td>{{ formatDate(r.date[0]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

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
      selectedFileName: "",
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
      const file = event.target.files[0];
      this.selectedFile = file;
      this.selectedFileName = file ? file.name : "";
    },

    async uploadQuiz() {
      if (!this.selectedFileName) {
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
          await this.loadQuizzes();
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
