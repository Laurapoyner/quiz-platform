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
                           class="answer">
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
                           class="answer">
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
            };
        },

        async mounted() {
            if (!this.quizName) return;

            try {
                const res = await fetch(
                    `http://localhost:3000/api/quiz/${this.quizName}`
                );
                const data = await res.json();

                // Titel fix (fjerner [ ])
                this.quizTitle = data.topic?.[0] || "Quiz";

                const rawQuestions = data.question || [];

                // 🔥 shuffle funktion
                const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

                // 🔥 map + random rækkefølge
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
                                }))
                            ),
                        };
                    })
                );

                // init svar
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

                try {
                    await fetch("http://localhost:3000/api/quiz/submit", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            quiz: this.quizName,
                            user: localStorage.getItem("username"),
                            answers: this.userAnswers,
                        }),
                    });
                } catch (err) {
                    console.error("Fejl ved submit:", err);
                }
            },
        },
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
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    button {
        margin-top: 2rem;
    }
</style>