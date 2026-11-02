import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const LandingPage = () => import("../app/pages/LandingPage.vue");
const ProductList = () => import("../app/pages/ProductList.vue");
const DetailProduct = () => import("../app/pages/DetailProduct.vue");
const DashboardLayout = () => import("../app/dashboard/DashboardLayout.vue");

const routes = [
  // Public
  { path: "/", name: "LandingPage", component: LandingPage },
  { path: "/products-list", name: "ProductList", component: ProductList },
  { path: "/products/:slug", name: "DetailProduct", component: DetailProduct },

  // Auth pages
  {
    path: "/login",
    name: "Login",
    component: () => import("../app/pages/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../app/pages/Register.vue"),
    meta: { guest: true },
  },

  // ADMIN
  {
    path: "/admin",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("../app/dashboard/Admin.vue"),
      },
      {
        path: "products",
        name: "AdminProducts",
        component: () => import("../app/dashboard/DataProducts.vue"),
      },
      {
        path: "products/categories",
        name: "AdminCategories",
        component: () => import("../app/dashboard/Categories.vue"),
      },
      {
        path: "customers",
        name: "AdminCustomers",
        component: () => import("../app/dashboard/DataCustomers.vue"),
      },
      {
        path: "orders",
        name: "AdminOrders",
        component: () => import("../app/dashboard/Orders.vue"),
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: () => import("../app/dashboard/AdminSettings.vue"),
      },
    ],
  },

  {
    path: "/user",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "user" },
    children: [
      {
        path: "account/profile",
        name: "UserProfile",
        component: () => import("../app/dashboard/users/Profile.vue"),
      },
      {
        path: "account/password",
        name: "UserPassword",
        component: () => import("../app/dashboard/users/Password.vue"),
      },
      {
        path: "shopping/purchases",
        name: "UserPurchases",
        component: () => import("../app/dashboard/users/Purchases.vue"),
      },
      {
        path: "shopping/vouchers",
        name: "UserVouchers",
        component: () => import("../app/dashboard/users/Vouchers.vue"),
      },
      {
        path: "shopping/wishlist",
        name: "UserWishlist",
        component: () => import("../app/dashboard/users/Wishlist.vue"),
      },
      {
        path: "notifications/orders",
        name: "NotifOrders",
        component: () => import("../app/dashboard/users/NotifOrders.vue"),
      },
      {
        path: "notifications/promotions",
        name: "NotifPromos",
        component: () => import("../app/dashboard/users/NotifPromos.vue"),
      },
      {
        path: "settings",
        name: "UserSettings",
        component: () => import("../app/dashboard/users/UserSettings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARD
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.token || localStorage.getItem("token");
  const user = authStore.user;

  //login with token
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.meta.role && user) {
    if (to.meta.role !== user.role) {
      return next(user.role === "admin" ? "/admin" : "/");
    }
  }

  if (to.meta.guest && token) {
    return next(user?.role === "admin" ? "/admin" : "/user/account/profile");
  }

  next();
});

export default router;
