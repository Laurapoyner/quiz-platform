<template>
  <div class="admin">
    <h2>Admin Panel</h2>

    <h3>Upload quiz</h3>
    <input type="file" @change="handleFile" accept=".xml" />
    <button @click="uploadQuiz">Upload</button>

    <hr />

    <h3>Quiz liste</h3>
    <button @click="loadQuizzes">Hent quizzer</button>
    <ul>
      <li v-for="quiz in quizzes" :key="quiz">
        {{ quiz }}
        <button @click="deleteQuiz(quiz)">Slet</button>
      </li>
    </ul>

    <hr />

    <h3>Resultater</h3>
    <button @click="loadResults">Hent resultater</button>

    <!-- Erstat <pre>{{ results }}</pre> med denne -->
    <ul v-if="results.length">
      <li v-for="r in results" :key="r.attemptId[0]">
        Bruger: {{ r.userId[0] }} | Quiz: {{ r.quizId[0] }} | Score:
        {{ r.score[0] }} | Tid: {{ r.time[0] }} sek | Dato: {{ r.date[0] }}
      </li>
    </ul>

    <p v-else>Ingen resultater endnu</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
      quizzes: [],
      results: "",
    };
  },

  mounted() {
    // Ved mount, hent quizzer og resultater
    this.loadQuizzes();
    this.loadResults();
  },

  methods: {
    handleFile(event) {
      this.selectedFile = event.target.files[0];
    },

    async uploadQuiz() {
      if (!this.selectedFile) {
        alert("Vælg en fil først");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("quiz", this.selectedFile);

        const res = await fetch("http://localhost:3000/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload fejlede");

        alert("Quiz uploadet!");
        this.loadQuizzes();
      } catch (err) {
        alert("Fejl ved upload: " + err.message);
      }
    },

    async loadQuizzes() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/quizzes");
        if (!res.ok) throw new Error("Kan ikke hente quizzer");
        this.quizzes = await res.json();
      } catch (err) {
        console.error(err);
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
        if (!res.ok) throw new Error("Sletning fejlede");
        alert("Quiz slettet!");
        this.loadQuizzes();
      } catch (err) {
        alert("Fejl: " + err.message);
      }
    },

    async loadResults() {
      try {
        const res = await fetch("http://localhost:3000/api/admin/results");
        if (!res.ok) throw new Error("Kan ikke hente resultater");
        const data = await res.json();
        this.results = JSON.stringify(data, null, 2);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.admin {
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}
button {
  margin-left: 1rem;
}
pre {
  background: #f0f0f0;
  padding: 1rem;
  overflow-x: auto;
}
</style>
