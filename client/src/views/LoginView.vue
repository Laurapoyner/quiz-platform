<template>
  <div class="login-view">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label>Brugernavn:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
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
    async login() {
      this.error = "";
      try {
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

        // Gem evt. token i localStorage
        localStorage.setItem("token", data.token);

        // Fortæl App.vue at login var succesfuldt
        this.$emit("login-success");
      } catch (err) {
        this.error = "Server fejl: " + err.message;
      }
    },
  },
};
</script>

<style>
.login-view {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
