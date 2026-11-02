<template>
  <div class="min-h-screen bg-[#F8F9FA] p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-[#0B132B]">Wishlist</h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ wishlistStore.count }} produk disimpan
          </p>
        </div>
        <RouterLink
          to="/"
          class="text-sm font-medium px-4 py-2 rounded-xl bg-white border hover:bg-slate-50"
          >Lanjut Belanja</RouterLink
        >
      </div>

      <div
        v-if="wishlistStore.loading && wishlistStore.items.length === 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="bg-white rounded-2xl p-4 animate-pulse"
        >
          <div class="w-full h-40 bg-slate-100 rounded-xl mb-3"></div>
          <div class="h-4 bg-slate-100 rounded mb-2"></div>
          <div class="h-3 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>

      <div
        v-else-if="wishlistStore.items.length === 0"
        class="bg-white rounded-3xl py-24 flex flex-col items-center text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4"
        >
          <Icon icon="mdi:heart-outline" class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="font-semibold">Wishlist kosong</h3>
        <p class="text-sm text-gray-400 mt-1 max-w-65">
          Simpan produk favoritmu disini untuk dibeli nanti
        </p>
        <RouterLink
          to="/"
          class="mt-6 h-11 px-6 bg-[#0B132B] text-white rounded-xl flex items-center justify-center text-sm font-medium"
          >Cari Produk</RouterLink
        >
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="item in wishlistStore.items"
          :key="item.id"
          class="group bg-white rounded-[20px] border border-slate-200 p-3 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col"
          :class="
            removingIds.has(item.id)
              ? 'opacity-0 scale-95'
              : 'opacity-100 scale-100'
          "
          style="transition: all 0.25s ease"
        >
          <div
            class="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3"
          >
            <img
              v-if="item.product?.image_url"
              :src="item.product.image_url"
              :alt="item.product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div class="flex-1">
            <p class="text-[13px] font-medium line-clamp-2 leading-snug">
              {{ item.product?.name || "Product" }}
            </p>
            <p class="text-sm font-bold mt-2">
              Rp {{ Number(item.product?.price || 0).toLocaleString("id-ID") }}
            </p>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-3">
            <button
              @click="removeWishlist(item)"
              class="h-10 rounded-xl border text-xs font-medium hover:bg-slate-50"
            >
              Hapus
            </button>
            <button
              @click="addToCart(item)"
              class="h-10 rounded-xl bg-[#0B132B] text-white text-xs font-medium hover:bg-black flex items-center justify-center gap-1"
            >
              <Icon icon="mdi:cart-outline" class="w-4 h-4" /> Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useWishlistStore } from "@/stores/wishlist.js";
import { cartByUser } from "@/api/cart.js";

const wishlistStore = useWishlistStore();
const removingIds = ref(new Set());

const removeWishlist = async (item) => {
  // langsung hapus dari store biar navbar 0ms
  removingIds.value.add(item.id);
  try {
    await wishlistStore.removeByItem(item);
  } catch (e) {
    console.error(e);
  } finally {
    removingIds.value.delete(item.id);
  }
};

const addToCart = async (item) => {
  try {
    await cartByUser.add(item.product_id, 1);
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  if (!wishlistStore.hasFetched) wishlistStore.fetch(true);
});
</script>
