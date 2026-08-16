import { createApp } from "vue";
import { Icon } from "@iconify/vue";
import "./style.css";
import App from "./App.vue";

createApp(App).component("Icon", Icon).mount("#app");
