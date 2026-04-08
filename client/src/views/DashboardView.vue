<template>
  <div class="admin">
    <h2>Admin Panel</h2>

    <p>
      Du er logget ind som admin: <strong>{{ username }}</strong>
    </p>

    <h3>Upload quiz</h3>

    <input type="file" @change="handleFile" />
    <button @click="uploadQuiz">Upload</button>

    <h3>Eksisterende quizzer</h3>

    <ul v-if="quizzes.length">
      <li v-for="quiz in quizzes" :key="quiz.id">
        {{ quiz.title }}

        <button @click="testQuiz(quiz.id)">Test</button>
        <button @click="deleteQuiz(quiz.id)">Slet</button>
      </li>
    </ul>

    <p v-else>Ingen quizzer fundet</p>

    <h3>Brugeraktivitet</h3>

    <ul v-if="logs.length">
      <li v-for="log in logs" :key="log.id">
        Bruger: {{ log.user }} | Quiz: {{ log.quiz }} | Score: {{ log.score }} |
        Tid: {{ log.time }}
      </li>
    </ul>

    <p v-else>Ingen aktivitet endnu</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      quizzes: [],
      logs: [],
      selectedFile: null,
    };
  },

  async mounted() {
    this.username = localStorage.getItem("username") || "Admin";

    try {
      const quizResponse = await fetch("http://localhost:3000/api/quizzes");

      if (quizResponse.ok) {
        this.quizzes = await quizResponse.json();
      }

      const logResponse = await fetch("http://localhost:3000/api/admin/logs");

      if (logResponse.ok) {
        this.logs = await logResponse.json();
      }
    } catch (err) {
      console.error("Fejl ved hentning:", err);
    }
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

      try {
        const response = await fetch("http://localhost:3000/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Quiz uploadet");

          const quizResponse = await fetch("http://localhost:3000/api/quizzes");

          this.quizzes = await quizResponse.json();
        }
      } catch (err) {
        console.error("Upload fejl:", err);
      }
    },

    async deleteQuiz(id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/quiz/${id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          this.quizzes = this.quizzes.filter((q) => q.id !== id);
        }
      } catch (err) {
        console.error("Slet fejl:", err);
      }
    },

    testQuiz(id) {
      console.log("Tester quiz:", id);

      // admin kan også tage quiz
      this.$emit("start-quiz", id);
    },
  },
};
</script>
