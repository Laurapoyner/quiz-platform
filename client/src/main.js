// Comment: her "starter" vores Vue app. Komponenter importeres og appen mountes til DOM'en.
// TO DO / Note: Man kan også bruge en vue-router til at håndtere navigation mellem forskellige sider

import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.mount("#app");
