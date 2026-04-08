<template>
  <div class="quiz-view">
    <h2>Quiz: {{ quizTitle }}</h2>

    <form @submit.prevent="submitQuiz">
      <div v-for="(q, index) in questions" :key="q.id" class="question-block">
        <p v-html="`${index + 1}. ${q.questiontext}`"></p>

        <div v-for="(a, aIndex) in q.answers" :key="aIndex">
          <label :class="getAnswerClass(q.id, aIndex)">
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
      </div>

      <button type="submit" :disabled="submitted">Aflevér svar</button>
    </form>

    <div v-if="submitted" class="results-summary">
      <h3>Resultat: {{ score }}/{{ questions.length }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quizId"], // server skal sende quizId fra Dashboard
  data() {
    return {
      quizTitle: "",
      questions: [],
      userAnswers: {},
      correctAnswers: {},
      submitted: false,
      score: 0,
    };
  },
  async mounted() {
    if (!this.quizId) return;

    try {
      const res = await fetch(`http://localhost:3000/api/quiz/${this.quizId}`);
      const data = await res.json();

      this.quizTitle = data.topic || "Quiz";
      this.questions = data.questions.map((q) => ({
        id: q.id[0],
        questiontext: q.questiontext[0],
        answers: q.answer.map((a) => ({
          answertext: a.answertext[0],
          correct: a.correct[0] === "True",
        })),
      }));

      // Gem korrekte svar til evaluering
      this.questions.forEach((q) => {
        q.answers.forEach((a, i) => {
          if (a.correct) this.correctAnswers[q.id] = i;
        });
      });
    } catch (err) {
      console.error("Fejl ved hentning af quiz:", err);
    }
  },
  methods: {
    submitQuiz() {
      this.score = 0;
      this.submitted = true;

      this.questions.forEach((q) => {
        if (this.userAnswers[q.id] === this.correctAnswers[q.id]) {
          this.score++;
        }
      });
    },

    getAnswerClass(qId, aIndex) {
      if (!this.submitted) return "";
      if (aIndex === this.correctAnswers[qId]) return "correct";
      if (this.userAnswers[qId] === aIndex) return "wrong";
      return "";
    },
  },
};
</script>

<style scoped>
.question-block {
  margin-bottom: 1rem;
}

label.correct {
  background-color: #c8e6c9; /* grøn */
}

label.wrong {
  background-color: #ffcdd2; /* rød */
}

.results-summary {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
