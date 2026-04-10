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

        <div v-if="q.type === 'single'">
          <label
            v-for="a in q.answers"
            :key="a.id"
            class="answer"
            :class="getAnswerClass(q, a.id)"
          >
            <input
              type="radio"
              :name="`q-${q.id}`"
              :value="a.id" 
              v-model="userAnswers[q.id]"
              :disabled="submitted"
            />
            {{ a.answertext }}
          </label>
        </div>

        <div v-else-if="q.type === 'multi'">
          <label
            v-for="a in q.answers"
            :key="a.id"
            class="answer"
            :class="getAnswerClass(q, a.id)"
          >
            <input
              type="checkbox"
              :value="a.id"
              v-model="userAnswers[q.id]"
              :disabled="submitted"
            />
            {{ a.answertext }}
          </label>
        </div>

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
  props: ["quizName"], // Sørg for at denne er med, hvis du bruger den

  data() {
    return {
      quizTitle: "",
      questions: [],
      userAnswers: {},
      submitted: false,
      score: 0,
      correctAnswers: {},
      showResults: false,
      startTime: null,
      timeSpent: 0,
    };
  },

  computed: {
    isAdmin() {
      return localStorage.getItem("role") === "admin";
    }
  },

  async mounted() {
    if (!this.quizName) return;
    this.startTime = Date.now();

    try {
      const res = await fetch(`http://localhost:3000/api/quiz/${this.quizName}`);
      const data = await res.json();
      this.quizTitle = data.topic?.[0] || "Quiz";

      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

      this.questions = shuffle((data.questions || []).map(q => ({
        ...q,
        answers: shuffle(q.answers)
      })));

      this.questions.forEach((q) => {
        this.userAnswers[q.id] = q.type === "multi" ? [] : "";
      });
    } catch (err) {
      console.error("Fejl ved indlæsning:", err);
    }
  },

  methods: {
    async submitQuiz() {
      this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

      try {
        const res = await fetch("http://localhost:3000/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: this.quizName,
            user: localStorage.getItem("username"),
            answers: this.userAnswers,
            time: this.timeSpent
          }),
        });
        const data = await res.json();        
        this.score = data.score;
        this.correctAnswers = data.correctAnswers;
        this.submitted = true;
        this.showResults = true;
      } catch (err) {
        console.error("Fejl ved afsendelse:", err);
      }
    },

    getAnswerClass(q, answerId) {
    if (!this.submitted) return "";
    
    // Vi tjekker nu mod den liste, vi lige har fået fra serveren
    const correctList = this.correctAnswers[q.id] || [];
    const isCorrect = correctList.includes(Number(answerId));
    
    const isSelected = q.type === 'multi' 
      ? this.userAnswers[q.id].includes(answerId)
      : this.userAnswers[q.id] === answerId;

    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "wrong";
    
    return "";
},

    goBack() {
      this.$emit("go-dashboard");
    }
  } // <--- Slutter methods
}; // <--- Slutter export default
</script>