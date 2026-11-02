import { defineStore } from "pinia";
import { wishlistByUser } from "@/api/wishlist.js";
import { ref, computed } from "vue";

export const useWishlistStore = defineStore("wishlist", () => {
  const items = ref([]);
  const loading = ref(false);
  const hasFetched = ref(false);

  let blockFetchUntil = 0;
  const timers = new Map();

  const count = computed(() => items.value.length);

  const wishedIds = computed(() => {
    const s = new Set();
    items.value.forEach((w) => s.add(Number(w.product_id)));
    return s;
  });
  const isWished = (productId) => wishedIds.value.has(Number(productId));

  const fetch = async (isInitial = false) => {
    if (Date.now() < blockFetchUntil) return;
    if (isInitial) loading.value = true;
    try {
      const res = await wishlistByUser.getAll();
      items.value = res.items || [];
      hasFetched.value = true;
    } catch (e) {
      console.error(e);
    } finally {
      if (isInitial) loading.value = false;
    }
  };

  const toggle = (product) => {
    const productId = Number(product.id);

    const idx = items.value.findIndex(
      (w) => Number(w.product_id) === productId,
    );
    if (idx !== -1) items.value.splice(idx, 1);
    else items.value.push({ id: Date.now(), product_id: productId, product });

    if (timers.has(productId)) clearTimeout(timers.get(productId));

    const t = setTimeout(async () => {
      blockFetchUntil = Date.now() + 1500;
      try {
        await wishlistByUser.toggle(productId);
        hasFetched.value = true;
      } catch (e) {
        fetch(true);
      } finally {
        timers.delete(productId);
      }
    }, 400);

    timers.set(productId, t);
  };

  const removeByItem = async (item) => {
    const productId = Number(item.product_id);
    if (timers.has(productId)) clearTimeout(timers.get(productId));

    items.value = items.value.filter((w) => w.id !== item.id);
    blockFetchUntil = Date.now() + 1500;
    try {
      await wishlistByUser.toggle(productId);
      hasFetched.value = true;
    } catch (e) {
      fetch(true);
    }
  };

  return {
    items,
    loading,
    hasFetched,
    count,
    wishedIds,
    isWished,
    fetch,
    toggle,
    removeByItem,
  };
});
