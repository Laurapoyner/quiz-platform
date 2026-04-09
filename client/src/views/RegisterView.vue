<!-- Her kan man registrere sig som ny bruger. Når registrering lykkedes, 
  vil den sende et event til parent component (app.vue) om at registrering var succesfuld, 
  og app.vue vil så navigere til dashboard view. -->

<!-- TO DO: Hvordan bliver bruger oprettet i systemet? Skal kommunikere med backend API endpoint for at oprette bruger.
  Hvordan vil vi sikkerhedstjekke - fx. skal man skrive password to gange? -->

<template>
  <div class="register-view">
    <h2>Opret en bruger</h2>
    <form @submit.prevent="register">
      <div class="inputfield">
        <label>Brugernavn</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="inputfield">
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      <div class="inputfield">
        <label>Gentag password</label>
        <input v-model="confirmPassword" type="password" required />
      </div>

      <div class="password-rules">
        <p
          :class="{
            valid: passwordRules.hasUppercase,
            invalid: !passwordRules.hasUppercase,
          }"
        >
          • Password skal have stort bogstav
        </p>
        <p
          :class="{
            valid: passwordRules.hasLength,
            invalid: !passwordRules.hasLength,
          }"
        >
          • Password skal være over 6 tegn
        </p>
        <p
          :class="{
            valid: passwordRules.hasSpecial,
            invalid: !passwordRules.hasSpecial,
          }"
        >
          • Password skal have specialtegn
        </p>
        <p
          :class="{
            valid: passwordRules.passwordsMatch,
            invalid: !passwordRules.passwordsMatch,
          }"
        >
          • Password matcher ikke hinanden
        </p>
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
      confirmPassword: "",
      error: "",
    };
  },
  computed: {
    passwordRules() {
      return {
        hasUppercase: /[A-Z]/.test(this.password),
        hasLength: this.password.length >= 6,
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(this.password),
        passwordsMatch:
          this.password === this.confirmPassword && this.password !== "",
      };
    },
  },

  methods: {
    async register() {
      if (
        !this.passwordRules.hasUppercase ||
        !this.passwordRules.hasLength ||
        !this.passwordRules.hasSpecial ||
        !this.passwordRules.passwordsMatch
      ) {
        this.error = "Password opfylder ikke kravene";
        return;
      }

      //check om passwords matcher
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords matcher ikke";
        return;
      }
      //minimum længde på 6
      if (this.password.length < 6) {
        this.error = "Password skal være mindst 6 tegn";
        return;
      }
      try {
        // TO DO: Hvordan bliver bruger oprettet i systemet // send til rigtigt endpoint
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = data.message || "Registrering fejlede";
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
