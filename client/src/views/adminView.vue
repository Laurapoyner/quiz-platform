<template>
  <div class="admin">
    <h2>Admin Panel</h2>
    <!-- <p>
      Du er logget ind som admin: <strong>{{ username }}</strong>
    </p> -->

    <!--- Upload quiz --->
    <div>
      <h3>Upload quiz</h3>

      <input type="file" @change="handleFile" accept=".xml" />
      <button @click="uploadQuiz">Upload</button>
    </div>
    <hr />

    <!--- Quiz liste --->
    <div>
      <h3>Quiz liste</h3>
      <!-- <button @click="loadQuizzes">Hent quizzer</button> -->
      <!-- <ul>
        <li v-for="quiz in quizzes" :key="quiz">
          {{ quiz }}

          <button @click="deleteQuiz(quiz)">Slet</button>
        </li>
      </ul> -->

      <ul v-if="quizzes.length">
        <li v-for="quiz in quizzes" :key="quiz">
          {{ quiz }}
          <button @click="deleteQuiz(quiz)">Slet</button>
        </li>
      </ul>
      <p v-else>Ingen quizzer fundet</p>
    </div>

    <hr />

    <!-- Brugerresultater  -->
    <div>
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

  // methods: {
  //   handleFile(event) {
  //     this.selectedFile = event.target.files[0];
  //   },

  //     async uploadQuiz() {
  //       if (!this.selectedFile) {
  //         alert("Vælg en fil først");
  //         return;
  //       }

  //       const formData = new FormData();
  //       formData.append("quiz", this.selectedFile);

  //       await fetch("http://localhost:3000/api/admin/upload", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       alert("Quiz uploadet");

  //       this.loadQuizzes();
  //     },

  //     async loadQuizzes() {
  //       const res = await fetch("http://localhost:3000/api/admin/quizzes");

  //       this.quizzes = await res.json();
  //     },

  //     async deleteQuiz(name) {
  //       await fetch(`http://localhost:3000/api/admin/quiz/${name}`, {
  //         method: "DELETE",
  //       });

  //       alert("Quiz slettet");
  //       this.loadQuizzes();
  //     },

  //     async loadResults() {
  //       const res = await fetch("http://localhost:3000/api/admin/results");
  //       const data = await res.json();
  //       this.results = JSON.stringify(data, null, 2);
  //     },
  //   },
  // };

  methods: {
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
