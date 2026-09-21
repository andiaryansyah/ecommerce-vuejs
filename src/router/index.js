import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../app/pages/ProductList.vue";
import LandingPage from "../app/pages/LandingPage.vue";
import DetailProduct from "../app/pages/DetailProduct.vue";
import DashboardLayout from "../app/dashboard/DashboardLayout.vue";
import Admin from "../app/dashboard/Admin.vue";
import DataProducts from "../app/dashboard/DataProducts.vue";
import Orders from "../app/dashboard/Orders.vue";
import Profile from "../app/dashboard/Profile.vue";

const routes = [
  { path: "/", name: "LandingPage", component: LandingPage },
  { path: "/products", name: "ProductList", component: ProductList },
  { path: "/products/:slug", name: "DetailProduct", component: DetailProduct },
  {
    path: "/:role",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "Admin",
        component: Admin,
      },
      {
        path: "/myproducts",
        name: "Data Products",
        component: DataProducts,
      },
      {
        path: "/orders",
        name: "Orders",
        component: Orders,
      },
      {
        path: "/account/profile",
        name: "Profile",
        component: Profile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
