<template>
    <div class="quiz-view">
        <h2>Quiz: {{ quizTitle }}</h2>

        <form @submit.prevent="submitQuiz">
            <div v-for="(q, index) in questions"
                 :key="q.id"
                 class="question-block">

                <p>
                    {{ index + 1 }}.
                    <span v-html="q.questiontext || 'Spørgsmål mangler'"></span>
                </p>

                <!-- SINGLE CHOICE -->
                <div v-if="q.type === 'single'">
                    <label v-for="(a, aIndex) in q.answers"
                           :key="aIndex"
                           class="answer"
                           :class="getAnswerClass(q, aIndex)">
                        <input type="radio"
                               :name="`q-${q.id}`"
                               :value="aIndex"
                               v-model="userAnswers[q.id]"
                               :disabled="submitted" />
                        {{ a.answertext }}
                    </label>
                </div>

                <!-- MULTI CHOICE -->
                <div v-else-if="q.type === 'multi'">
                    <label v-for="(a, aIndex) in q.answers"
                           :key="aIndex"
                           class="answer"
                           :class="getAnswerClass(q, aIndex)">
                        <input type="checkbox"
                               :value="aIndex"
                               v-model="userAnswers[q.id]"
                               :disabled="submitted" />
                        {{ a.answertext }}
                    </label>
                </div>

                <!-- CLOZE -->
                <div v-else-if="q.type === 'text'">
                    <input type="text"
                           v-model="userAnswers[q.id]"
                           :disabled="submitted" />
                </div>
            </div>

            <button type="submit" :disabled="submitted">
                Afslut quiz
            </button>
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

                //tid
                startTime: null,
                timeSpent: 0,
            };
        },

        async mounted() {
            if (!this.quizName) return;

            // start timer
            this.startTime = Date.now();

            try {
                const res = await fetch(
                    `http://localhost:3000/api/quiz/${this.quizName}`
                );
                const data = await res.json();

                this.quizTitle = data.topic?.[0] || "Quiz";

                const rawQuestions = data.question || [];

                const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

                this.questions = shuffle(
                    rawQuestions.map((q) => {
                        const answers = q.answer || [];

                        return {
                            id: q.id?.[0] || Math.random(),
                            questiontext: q.questiontext?.[0] || "",
                            type: "single",
                            answers: shuffle(
                                answers.map((a) => ({
                                    answertext: a.answertext?.[0] || "",
                                    correct: a.correct?.[0] === "True"
                                }))
                            ),
                        };
                    })
                );

                this.questions.forEach((q) => {
                    this.userAnswers[q.id] = "";
                });

            } catch (err) {
                console.error("Fejl ved hentning af quiz:", err);
            }
        },

        methods: {
            async submitQuiz() {
                this.submitted = true;
                this.showResults = true;
                this.score = 0;

                // beregn tid
                this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

                // beregn score
                this.questions.forEach((q) => {
                    const correctIndex = q.answers.findIndex(a => a.correct);

                    if (this.userAnswers[q.id] == correctIndex) {
                        this.score++;
                    }
                });

                // gem resultat
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
                            time: this.timeSpent
                        }),
                    });
                } catch (err) {
                    console.error("Fejl ved submit:", err);
                }
            },

            // farver svar
            getAnswerClass(q, index) {
                if (!this.submitted) return "";

                const correctIndex = q.answers.findIndex(a => a.correct);

                if (index === correctIndex) return "correct";
                if (this.userAnswers[q.id] == index) return "wrong";

                return "";
            }
        }
    };
</script>

<style scoped>
    .quiz-view {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem 4rem;
    }

    .question-block {
        margin-bottom: 2rem;
        padding: 1.2rem;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

        .question-block p {
            font-weight: 600;
            margin-bottom: 0.8rem;
        }

    .answer {
        display: block;
        margin-bottom: 0.5rem;
        padding: 4px;
        border-radius: 6px;
    }

    .correct {
        background-color: #c8f7c5;
    }

    .wrong {
        background-color: #f7c5c5;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    button {
        margin-top: 2rem;
    }

    .results-summary {
        margin-top: 20px;
        padding: 16px;
        background: rgba(2, 204, 137, 0.159);
        border: 1px solid rgba(2, 204, 137, 1);
        border-radius: 8px;
        font-weight: 600;
    }
</style>