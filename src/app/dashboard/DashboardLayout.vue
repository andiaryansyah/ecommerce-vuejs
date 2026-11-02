<template>
  <div class="h-screen flex bg-[#F1F5F9] overflow-hidden">
    <!-- Overlay Mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
      @click="isOpen = false"
    ></div>

    <!-- LEFT SIDEBAR -->
    <aside
      :class="[
        'z-50 fixed md:sticky top-0 h-screen flex flex-col bg-[#0B132B] text-white transition-all duration-300 ease-in-out shrink-0',
        isOpen
          ? 'translate-x-0 w-70'
          : '-translate-x-full md:translate-x-0 md:w-18',
        !isOpen ? 'md:w-18' : 'md:w-70',
      ]"
    >
      <div
        class="h-16 flex items-center px-4 shrink-0 border-b border-white/10"
      >
        <RouterLink
          to="/admin"
          class="flex items-center gap-3 w-full overflow-hidden"
        >
          <img
            v-if="isOpen"
            src="/havenkicks-full-logo.png"
            class="h-10 w-auto object-contain"
            alt="full logo"
          />
          <img
            v-else
            src="/havenkicks-logo.png"
            class="w-9 h-9 object-contain shrink-0"
            alt="logo"
          />
        </RouterLink>
      </div>
      <div class="flex-1 overflow-y-auto py-4 px-3">
        <Menu @toggleSidebar="isOpen = !isOpen" :collapsed="!isOpen" />
      </div>
      <div class="p-3 border-t border-white/10">
        <div v-if="isOpen" class="text-[10px] text-white/40 text-center">
          © 2026 Haven Kicks
        </div>
      </div>
    </aside>

    <!-- RIGHT CONTENT -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Navbar
        :isLoggedIn="!!auth.token"
        :user="auth.user"
        :cartCount="cartStore.count"
        @toggleSidebar="isOpen = !isOpen"
        @search="handleSearch"
        @wishlist="handleWishlist"
        @cart="showCartDrawer = true"
        @logout="handleLogout"
      />

      <Cart
        :showCartDrawer="showCartDrawer"
        @closeCart="showCartDrawer = false"
      />

      <main class="flex-1 overflow-y-auto p-3 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Menu from "@/components/dashboard/Menu.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import Navbar from "../../components/shared/Navbar.vue";
import { useWishlistStore } from "@/stores/wishlist.js";
import { useCartStore } from "@/stores/cart.js";
import Cart from "../../components/shared/Cart.vue";

const auth = useAuthStore();
const router = useRouter();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

const isOpen = ref(true);
const showCartDrawer = ref(false);

const handleSearch = (query) => {
  if (!query) return;
  router.push({ path: "/products-list", query: { q: query } });
};
const handleWishlist = () => {
  if (!auth.token) return router.push("/login");
  router.push("/user/shopping/wishlist");
};
const handleLogout = async () => {
  await auth.logout();
};

onMounted(() => {
  if (auth.token) {
    if (!wishlistStore.hasFetched) wishlistStore.fetch(true);
    if (!cartStore.hasFetched) cartStore.fetch();
  }
});
</script>
