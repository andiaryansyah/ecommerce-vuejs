<template>
  <header
    class="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60"
  >
    <section
      :class="[
        'w-full transition-all duration-300',
        isScrolled ? 'py-2.5 shadow-sm' : 'py-3.5',
      ]"
    >
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-4">
          <!-- LEFT -->
          <div>
            <HamburgerIcon
              v-if="isLanding"
              :isOpen="isMobileMenuOpen"
              @toggle="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden"
            />
            <button
              v-else
              @click="emit('toggleSidebar')"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Icon icon="mdi:menu" class="w-5 h-5" />
            </button>
          </div>

          <!-- RIGHT -->
          <div class="flex items-center gap-1.5">
            <button
              @click="emit('wishlist')"
              class="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition"
            >
              <Icon icon="mdi:heart-outline" class="w-5 h-5 text-slate-700" />
              <span
                v-if="displayWishlistCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full font-bold shadow-sm"
                >{{ displayWishlistCount }}</span
              >
            </button>
            <div>
              <button
                v-if="isLoggedIn"
                @click="emit('cart')"
                class="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition"
              >
                <Icon icon="mdi:cart-outline" class="w-5 h-5 text-slate-700" />
                <span
                  v-if="displayCartCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full font-bold shadow-sm"
                  >{{ displayCartCount }}</span
                >
              </button>
              <RouterLink
                v-else
                to="/login"
                class="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition"
              >
                <Icon icon="mdi:cart-outline" class="w-5 h-5 text-slate-700" />
              </RouterLink>
            </div>
            <div class="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

            <!-- LOGGED IN: Avatar customer -->
            <div v-if="isLoggedIn" class="relative ml-1" ref="profileRef">
              <button
                @click="showProfile = !showProfile"
                class="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition"
              >
                <img
                  v-if="user?.avatar || user?.photo"
                  :src="user.avatar || user.photo"
                  :alt="user?.name"
                  class="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold text-xs shadow-sm"
                >
                  {{ user?.name?.charAt(0)?.toUpperCase() || "U" }}
                </div>
                <span
                  class="hidden sm:block text-sm font-medium text-slate-700 max-w-25 truncate"
                  >{{ user?.name }}</span
                >
                <Icon
                  icon="mdi:chevron-down"
                  class="w-4 h-4 text-slate-400 hidden sm:block"
                  :class="showProfile ? 'rotate-180' : ''"
                />
              </button>

              <!-- Dropdown -->
              <div
                v-if="showProfile"
                class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 overflow-hidden animate-in fade-in"
              >
                <div class="px-3 py-3 flex items-center gap-3">
                  <img
                    v-if="user?.avatar || user?.photo"
                    :src="user.avatar || user.photo"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold"
                  >
                    {{ user?.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate">
                      {{ user?.name }}
                    </p>
                    <p class="text-xs text-slate-500 truncate">
                      {{ user?.email }}
                    </p>
                  </div>
                </div>
                <div class="h-px bg-slate-100 my-1"></div>
                <RouterLink
                  to="/user/account/profile"
                  @click="showProfile = false"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 transition"
                >
                  <Icon
                    icon="mdi:account-outline"
                    class="w-5 h-5 text-slate-500"
                  />
                  My Profile
                </RouterLink>
                <RouterLink
                  to="/user/settings"
                  @click="showProfile = false"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 transition"
                >
                  <Icon icon="mdi:cog-outline" class="w-5 h-5 text-slate-500" />
                  Settings
                </RouterLink>
                <div class="h-px bg-slate-100 my-1"></div>
                <button
                  @click="
                    emit('logout');
                    showProfile = false;
                  "
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <Icon icon="mdi:logout" class="w-5 h-5" /> Logout
                </button>
              </div>
            </div>

            <div v-else class="flex gap-2 ml-1">
              <RouterLink
                to="/login"
                class="h-9 px-5 flex items-center rounded-full bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50"
                >Login</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Landing nav -->
    <nav v-if="isLanding" class="bg-[#0B132B]">
      <div class="max-w-7xl mx-auto px-4">
        <ul
          class="hidden md:flex justify-center py-3 gap-x-8 text-sm font-medium text-white/80"
        >
          <li v-for="item in navItems" :key="item.id">
            <a :href="item.href" class="hover:text-white transition">{{
              item.label
            }}</a>
          </li>
        </ul>
        <div
          v-if="isMobileMenuOpen"
          class="text-center md:hidden bg-white rounded-2xl shadow-xl border p-2 my-2 space-y-1"
        >
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click="isMobileMenuOpen = false"
            class="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-100"
            >{{ item.label }}</a
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import HamburgerIcon from "@/components/shared/HamburgerIcon.vue";
import { navItems } from "@/data/navItems.js";
import { useWishlistStore } from "@/stores/wishlist.js";
import { useCartStore } from "@/stores/cart.js";

const props = defineProps({
  isLoggedIn: Boolean,
  user: Object,
  cartCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
});

const emit = defineEmits([
  "toggleSidebar",
  "search",
  "wishlist",
  "cart",
  "logout",
]);

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const showProfile = ref(false);
const profileRef = ref(null);
const route = useRoute();
const isLanding = computed(() => route.path === "/");

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

// FIX: langsung dari store biar badge update 0ms & gak lag
const displayWishlistCount = computed(() => wishlistStore.count);
const displayCartCount = computed(() => cartStore.count);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};
const handleClickOutside = (e) => {
  if (profileRef.value && !profileRef.value.contains(e.target))
    showProfile.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("click", handleClickOutside);
  if (props.isLoggedIn) {
    if (!wishlistStore.hasFetched) wishlistStore.fetch(true);
    if (cartStore.items.length === 0) cartStore.fetch();
  }
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("click", handleClickOutside);
});
</script>
