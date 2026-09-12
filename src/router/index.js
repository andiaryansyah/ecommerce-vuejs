import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../app/pages/ProductList.vue";
import LandingPage from "../app/pages/LandingPage.vue";
import DetailProduct from "../app/pages/DetailProduct.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/products", component: ProductList },
  { path: "/products/:slug", component: DetailProduct },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
