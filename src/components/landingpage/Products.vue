<template>
  <section id="products" class="py-16 bg-[#FFFEF7]">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold">Featured Products</h2>
          <router-link
            to="/products"
            class="text-[#C5A880] hover:underline text-sm"
            >View All →</router-link
          >
        </div>
        <div class="flex gap-2">
          <button
            @click="prevSlide"
            class="p-2 rounded-full bg-white shadow-md"
          >
            <Icon icon="line-md:arrow-small-left" width="24" />
          </button>
          <button
            @click="nextSlide"
            class="p-2 rounded-full bg-white shadow-md"
          >
            <Icon icon="line-md:arrow-small-right" width="24" />
          </button>
        </div>
      </div>

      <div
        v-if="visibleProducts.length === 0"
        class="grid grid-cols-2 md:grid-cols-4 gap-5"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
        >
          <div class="aspect-square bg-gray-200"></div>
          <div class="p-3 space-y-2">
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div
          v-for="product in visibleProducts"
          :key="product.id"
          class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
        >
          <div class="relative aspect-square bg-gray-100 overflow-hidden">
            <img
              :src="getImage(product.image_url)"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <button
              @click.stop="handleWishlist(product)"
              class="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-100 shadow-sm border active:scale-75"
              :class="
                isWishedLocal(product.id)
                  ? 'bg-[#EF4444] border-[#EF4444] text-white'
                  : 'bg-white border-gray-100 text-gray-600'
              "
            >
              <Icon
                :icon="
                  isWishedLocal(product.id) ? 'mdi:heart' : 'mdi:heart-outline'
                "
                width="18"
                height="18"
              />
            </button>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-1 text-xs text-gray-400 mb-1">
              <div class="flex text-yellow-400">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  icon="mdi:star"
                  :class="
                    i <= Math.round(product.rating || 0) ? '' : 'text-gray-300'
                  "
                  width="12"
                />
              </div>
              <span>({{ product.rating || 0 }})</span>
            </div>
            <h3 class="font-semibold text-sm truncate">{{ product.name }}</h3>
            <div class="flex justify-between items-center mt-2">
              <p class="text-[#C5A880] font-bold text-sm">
                Rp {{ Number(product.price).toLocaleString("id-ID") }}
              </p>
              <button
                @click.stop="handleAddCart(product)"
                class="h-7 px-3 rounded-full text-[11px] font-medium flex items-center justify-center gap-1 transition-all active:scale-95"
                :class="
                  isInCart(product.id)
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]'
                    : 'bg-[#0F172A] text-white hover:bg-black'
                "
              >
                <Icon
                  :icon="isInCart(product.id) ? 'mdi:check' : 'mdi:cart'"
                  width="14"
                />
                {{ isInCart(product.id) ? "Di Keranjang" : "Add" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav
      class="flex justify-center mt-6 space-x-2"
      aria-label="Carousel pagination"
    >
      <button
        v-for="index in totalSlides"
        :key="index"
        @click="currentSlide = index - 1"
        :class="[
          'w-3 h-3 rounded-full',
          currentSlide === index - 1 ? 'bg-secondary' : 'bg-gray-400',
        ]"
      />
    </nav>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useWishlistStore } from "@/stores/wishlist.js";
import { useCartStore } from "@/stores/cart.js";
import { useImage } from "@/composables/useImage.js";

const props = defineProps({ products: { type: Array, default: () => [] } });
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { getImage } = useImage();

const currentSlide = ref(0);
const productsPerPage = ref(4);

const localWished = ref(new Set());
watch(
  () => wishlistStore.items,
  (items) => {
    const s = new Set();
    items.forEach((w) => s.add(Number(w.product_id)));
    localWished.value = s;
  },
  { immediate: true, deep: true },
);
const isWishedLocal = (id) => localWished.value.has(Number(id));
const handleWishlist = (product) => {
  const pid = Number(product.id);
  if (localWished.value.has(pid)) localWished.value.delete(pid);
  else localWished.value.add(pid);
  localWished.value = new Set(localWished.value);
  wishlistStore.toggle(product);
};

const localCart = ref(new Set());
watch(
  () => cartStore.items,
  (items) => {
    const s = new Set();
    items.forEach((c) => s.add(Number(c.product_id)));
    localCart.value = s;
  },
  { immediate: true, deep: true },
);

const isInCart = (id) => localCart.value.has(Number(id));

const handleAddCart = async (product) => {
  try {
    localCart.value.add(Number(product.id));
    localCart.value = new Set(localCart.value);
    await cartStore.add(product, null);
  } catch (e) {
    localCart.value.delete(Number(product.id));
    localCart.value = new Set(localCart.value);
    console.error(e);
  }
};

const limitedProducts = computed(() => props.products.slice(0, 8));
const totalSlides = computed(() =>
  Math.ceil(limitedProducts.value.length / productsPerPage.value),
);
const visibleProducts = computed(() => {
  const start = currentSlide.value * productsPerPage.value;
  return limitedProducts.value.slice(start, start + productsPerPage.value);
});
const nextSlide = () => {
  currentSlide.value =
    currentSlide.value === totalSlides.value - 1 ? 0 : currentSlide.value + 1;
};
const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1;
};
const handleResize = () => {
  if (window.innerWidth < 640) productsPerPage.value = 1;
  else if (window.innerWidth < 768) productsPerPage.value = 2;
  else if (window.innerWidth < 1024) productsPerPage.value = 3;
  else productsPerPage.value = 4;
};
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
