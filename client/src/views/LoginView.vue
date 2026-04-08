<!-- Comment: Dette er login-siden (default view). Når login lykkedes, vil den sende et event til parent component (app.vue) -->
<!-- TO DO: skal kommunikere med password authentification -->

<template>
  <div class="login-view">
    <h2>Log på</h2>
    <form @submit.prevent="login">
      <div class="inputfield">
        <label>Brugernavn</label>
        <input
          v-model="username"
          type="text"
          placeholder="Brugernavn"
          required
        />
      </div>
      <div class="inputfield">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <button type="submit" class="submit-btn">Log på min konto</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>

    <p>
      Har du ikke en bruger endnu?
      <button class="text-link-btn" @click="$emit('go-to-register')">
        Opret konto
      </button>
    </p>
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
    async login() {
      this.error = "";
      try {
        // TO DO: skal ændres til den rigtige API endpoint
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.error || "Login fejlede";
          return;
        }

        // TO DO: Skal vi gemme i token her eller i tobiass kode?
        localStorage.setItem("token", data.token);
        // gem brugernavn
        localStorage.setItem("username", this.username);

        // Event: fortæl App.vue at login var succesfuldt. emit sender opad.
        this.$emit("login-success", {
          username: this.username,
        });
      } catch (err) {
        this.error = "Server fejl: " + err.message;
      }
    },
  },
};
</script>
