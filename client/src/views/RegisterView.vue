<!-- Her kan man registrere sig som ny bruger. Når registrering lykkedes, 
  vil den sende et event til parent component (app.vue) om at registrering var succesfuld, 
  og app.vue vil så navigere til dashboard view. -->

<!-- TO DO: Hvordan bliver bruger oprettet i systemet? Skal kommunikere med backend API endpoint for at oprette bruger.
  Hvordan vil vi sikkerhedstjekke - fx. skal man skrive password to gange? -->

<template>
  <div class="register-view">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Brugernavn:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async register() {
      this.error = "";
      try {
        // TO DO: Hvordan bliver bruger oprettet i systemet // send til rigtigt endpoint
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.error || "Registrering fejlede";
          return;
        }

        // Fortæl App.vue at registrering var succesfuldt
        this.$emit("register-success");
      } catch (err) {
        this.error = "Server fejl: " + err.message;
      }
    },
  },
};
</script>
