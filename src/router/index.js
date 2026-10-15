import { createRouter, createWebHistory } from "vue-router";
import ProductList from "../app/pages/ProductList.vue";
import LandingPage from "../app/pages/LandingPage.vue";
import DetailProduct from "../app/pages/DetailProduct.vue";
import DashboardLayout from "../app/dashboard/DashboardLayout.vue";
import Admin from "../app/dashboard/Admin.vue";
import DataProducts from "../app/dashboard/DataProducts.vue";
import Orders from "../app/dashboard/Orders.vue";
import Profile from "../app/dashboard/Profile.vue";
import DataCustomers from "../app/dashboard/DataCustomers.vue";
import Categories from "../app/dashboard/Categories.vue";

const routes = [
  { path: "/", name: "LandingPage", component: LandingPage },
  { path: "/products-list", name: "ProductList", component: ProductList },
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
        path: "/products",
        name: "Data Products",
        component: DataProducts,
      },
      {
        path: "/products/product-categories",
        name: "Categories",
        component: Categories,
      },
      {
        path: "/customers",
        name: "Data Customers",
        component: DataCustomers,
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
