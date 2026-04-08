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
      selectedFile: null,
      quizzes: [],
      results: "",
    };
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

      const formData = new FormData();
      formData.append("quiz", this.selectedFile);

      await fetch("http://localhost:3000/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      alert("Quiz uploadet");

      this.loadQuizzes();
    },

    async loadQuizzes() {
      const res = await fetch("http://localhost:3000/api/admin/quizzes");

      this.quizzes = await res.json();
    },

    async deleteQuiz(name) {
      await fetch(`http://localhost:3000/api/admin/quiz/${name}`, {
        method: "DELETE",
      });

      alert("Quiz slettet");
      this.loadQuizzes();
    },

    async loadResults() {
      const res = await fetch("http://localhost:3000/api/admin/results");
      const data = await res.json();
      this.results = JSON.stringify(data, null, 2);
    },
  },
};
</script>
