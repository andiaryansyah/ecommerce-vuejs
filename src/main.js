import { createApp } from "vue";
import { Icon } from "@iconify/vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";

createApp(App).component("Icon", Icon).use(router).mount("#app");
