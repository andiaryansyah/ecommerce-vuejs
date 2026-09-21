<template>
  <header class="relative top-0 z-50 transition-all duration-300">
    <section
      :class="[
        'w-full',
        isScrolled
          ? 'bg-slate-100/95 backdrop-blur shadow-md py-2'
          : 'bg-slate-100 py-4',
      ]"
    >
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6"
        >
          <!-- LOGO + MOBILE MENU TOGGLE -->
          <div class="flex justify-between items-center w-full md:w-auto">
            <a href="/" class="text-2xl font-bold text-secondary">
              <img
                src="../../../public/havenkicks-full-logo.png"
                alt="full-logo"
                class="w-48 h-12"
              />
            </a>
            <HamburgerIcon
              :isOpen="isMobileMenuOpen"
              @toggle="
                route.path === '/'
                  ? (isMobileMenuOpen = !isMobileMenuOpen)
                  : emit('toggleSidebar')
              "
            />
          </div>
          <!-- Search Bar -->
          <form
            class="w-full md:flex-1 max-w-sm"
            role="search"
            aria-label="Site search"
          >
            <label class="relative w-full">
              <input
                type="search"
                placeholder="Search..."
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary"
                aria-label="Search Button"
              >
                <Icon icon="mdi:magnify" class="w-6 h-6" />
              </button>
            </label>
          </form>
          <!-- Icons -->
          <div
            class="flex items-center justify-between gap-4 md:gap-6 w-full md:w-auto"
          >
            <aside
              class="flex items-center justify-end space-x-4 w-full md:w-auto"
            >
              <button
                class="relative p-2 text-gray-700 hover:text-secondary"
                aria-label="Wishlist"
              >
                <Icon icon="mdi:heart-outline" class="w-5 h-5" />
                <span
                  class="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  3
                </span>
              </button>
              <button
                class="relative p-2 text-gray-700 hover:text-secondary"
                aria-label="cart"
              >
                <Icon icon="mdi:cart-outline" class="w-5 h-5" />
                <span
                  class="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  5
                </span>
              </button>
              <button
                class="relative p-2 text-gray-700 hover:text-secondary"
                aria-label="account"
              >
                <Icon icon="mdi:account-outline" class="w-5 h-5" />
              </button>
            </aside>
          </div>
        </div>
      </div>
    </section>
    <div></div>
  </header>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted, onUnmounted } from "vue";
import HamburgerIcon from "@/components/shared/HamburgerIcon.vue";
import { useRoute } from "vue-router";
import { navItems } from "@/data/navItems.js";
import { menuItems } from "@/data/menuItems.js";

const emit = defineEmits(["toggleSidebar"]);

const route = useRoute();
const items = route.path === "/" ? navItems : menuItems;

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
