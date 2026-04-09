<template>
  <div class="topbar">
    <h1>
      <span class="accent">Quiz:</span>
      {{ quizTitle }}
    </h1>
  </div>
  <div class="quiz-view">
    <form @submit.prevent="submitQuiz">
      <div v-for="(q, index) in questions" :key="q.id" class="question-block">
        <p>
          {{ index + 1 }}.
          <span v-html="q.questiontext || 'Spørgsmål mangler'"></span>
        </p>

        <!-- SINGLE CHOICE -->
        <div v-if="q.type === 'single'">
          <label
            v-for="(a, aIndex) in q.answers"
            :key="aIndex"
            class="answer"
            :class="getAnswerClass(q, aIndex)"
          >
            <input
              type="radio"
              :name="`q-${q.id}`"
              :value="aIndex"
              v-model="userAnswers[q.id]"
              :disabled="submitted"
            />
            {{ a.answertext }}
          </label>
        </div>

        <!-- MULTI CHOICE -->
        <div v-else-if="q.type === 'multi'">
          <label
            v-for="(a, aIndex) in q.answers"
            :key="aIndex"
            class="answer"
            :class="getAnswerClass(q, aIndex)"
          >
            <input
              type="checkbox"
              :value="aIndex"
              v-model="userAnswers[q.id]"
              :disabled="submitted"
            />
            {{ a.answertext }}
          </label>
        </div>

        <!-- CLOZE -->
        <div v-else-if="q.type === 'text'">
          <input
            type="text"
            v-model="userAnswers[q.id]"
            :disabled="submitted"
          />
        </div>
      </div>

      <button type="submit" :disabled="submitted">Afslut quiz</button>
    </form>

    <!-- RESULTAT -->
    <div v-if="showResults" class="results-summary">
      <h3>Resultat: {{ score }} / {{ questions.length }}</h3>
      <p>Tid: {{ timeSpent }} sekunder</p>
    </div>

    <div v-if="submitted" class="results-summary">
      <h3>Quiz afsluttet ✅</h3>
      <p>Dit svar er sendt til serveren</p>
    </div>

    <button v-if="submitted" @click="goBack" class="back-btn">
      {{ isAdmin ? 'Tilbage til Admin Panel' : 'Tilbage til dashboard' }}
    </button>
  </div>
</template>

<script>
export default {
  props: ["quizName"],

  data() {
    return {
      quizTitle: "",
      questions: [],
      userAnswers: {},
      submitted: false,
      score: 0,
      showResults: false,

      startTime: null,
      timeSpent: 0,
    };
  },

  async mounted() {
    if (!this.quizName) return;

    this.startTime = Date.now();

    try {
      const res = await fetch(
        `http://localhost:3000/api/quiz/${this.quizName}`,
      );
      const data = await res.json();

      this.quizTitle = data.topic?.[0] || "Quiz";

      const rawQuestions = data.question || [];

      const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

      this.questions = shuffle(
        rawQuestions.map((q) => {
          const answers = q.answer || [];

          // auto detect multi vs single
          const correctCount = answers.filter(
            (a) => a.correct?.[0] === "True",
          ).length;

          return {
            id: q.id?.[0] || Math.random(),
            questiontext: q.questiontext?.[0] || "",
            type: correctCount > 1 ? "multi" : "single", // 🔥 NY
            answers: shuffle(
              answers.map((a) => ({
                answertext: a.answertext?.[0] || "",
                correct: a.correct?.[0] === "True",
              })),
            ),
          };
        }),
      );

      //  multi = [] / single = ""
      this.questions.forEach((q) => {
        this.userAnswers[q.id] = q.type === "multi" ? [] : "";
      });
    } catch (err) {
      console.error("Fejl ved hentning af quiz:", err);
    }
  },

computed: {
  isAdmin() {
    return localStorage.getItem("role") === "admin";
  }
},

  methods: {
    async submitQuiz() {
      this.submitted = true;
      this.showResults = true;
      this.score = 0;

      this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

      // score logik
      this.questions.forEach((q) => {
        if (q.type === "single") {
          const correctIndex = q.answers.findIndex((a) => a.correct);

          if (this.userAnswers[q.id] == correctIndex) {
            this.score += 1;
          }
        }

        if (q.type === "multi") {
          const userAnswer = this.userAnswers[q.id] || [];

          const correctAnswers = q.answers
            .map((a, i) => (a.correct ? i : null))
            .filter((i) => i !== null);

          let correctChosen = 0;
          let wrongChosen = 0;

          userAnswer.forEach((index) => {
            if (correctAnswers.includes(index)) {
              correctChosen++;
            } else {
              wrongChosen++;
            }
          });

          let points = 0;

          if (correctChosen === 0 && wrongChosen === 0) points = 0;
          if (correctChosen === 1 && wrongChosen === 0) points = 0.5;
          if (correctChosen === 2 && wrongChosen === 0) points = 1;

          if (correctChosen === 0 && wrongChosen === 1) points = -0.5;
          if (correctChosen === 1 && wrongChosen === 1) points = 0;
          if (correctChosen === 2 && wrongChosen === 1) points = 0.5;

          if (correctChosen === 0 && wrongChosen === 2) points = -1;
          if (correctChosen === 1 && wrongChosen === 2) points = -0.5;
          if (correctChosen === 2 && wrongChosen === 2) points = 0;

          this.score += points;
        }
      });

      try {
        await fetch("http://localhost:3000/api/quiz/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quiz: this.quizName,
            user: localStorage.getItem("username"),
            score: this.score,
            time: this.timeSpent,
          }),
        });
      } catch (err) {
        console.error("Fejl ved submit:", err);
      }
    },

    getAnswerClass(q, index) {
      if (!this.submitted) return "";

      const correctIndex = q.answers.findIndex((a) => a.correct);

      if (q.type === "single") {
        if (index === correctIndex) return "correct";
        if (this.userAnswers[q.id] == index) return "wrong";
      }

      if (q.type === "multi") {
        const correct = q.answers[index].correct;
        const selected = this.userAnswers[q.id].includes(index);

        if (correct) return "correct";
        if (selected && !correct) return "wrong";
      }

      return "";
    },

    goBack() {
      this.$emit("go-dashboard");
    },
  },
};
</script>
