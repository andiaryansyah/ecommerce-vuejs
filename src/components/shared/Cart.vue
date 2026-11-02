<template>
  <transition name="fade">
    <div
      v-if="showCartDrawer"
      @click="emit('closeCart')"
      class="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
    />
  </transition>

  <transition name="slide">
    <div
      v-if="showCartDrawer"
      class="fixed top-0 right-0 h-full w-full max-w-105 bg-white z-50 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.15)]"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center p-6 border-b border-gray-100"
      >
        <div>
          <h3 class="font-bold text-[15px] tracking-tight">Keranjang</h3>
          <p class="text-[11px] text-gray-400 mt-0.5">
            {{ cartStore.count }} item • {{ cartStore.items.length }} produk
          </p>
        </div>
        <button
          @click="emit('closeCart')"
          class="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition"
        >
          <Icon icon="mdi:close" width="18" />
        </button>
      </div>

      <!-- Empty -->
      <div
        v-if="cartStore.items.length === 0"
        class="flex-1 flex flex-col items-center justify-center p-10 text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4"
        >
          <Icon icon="mdi:cart-outline" width="32" class="text-gray-300" />
        </div>
        <p class="text-[14px] font-semibold">Keranjang kosong</p>
        <p class="text-[12px] text-gray-400 mt-1 max-w-50">
          Tambahkan sepatu favoritmu untuk mulai belanja
        </p>
        <button
          @click="emit('closeCart')"
          class="mt-6 text-[12px] border rounded-full px-5 py-2 hover:bg-gray-50"
        >
          Lanjut Belanja
        </button>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-0">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex gap-4 p-5 border-b border-gray-50 last:border-0 group relative"
        >
          <img
            :src="getImage(item.product?.image_url)"
            :alt="item.product?.name"
            class="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
            loading="lazy"
          />
          <div class="flex-1 min-w-0">
            <div class="flex justify-between gap-2">
              <h4 class="text-[13px] font-semibold leading-tight truncate pr-2">
                {{ item.product.name }}
              </h4>
              <button
                @click="cartStore.remove(item.id)"
                class="text-gray-300 hover:text-red-500 transition -mt-1"
              >
                <Icon icon="mdi:trash-can-outline" width="16" />
              </button>
            </div>
            <p class="text-[12px] text-[#C5A880] font-bold mt-1">
              Rp {{ Number(item.product.price).toLocaleString("id-ID") }}
            </p>

            <!-- Size Selector -->
            <div class="mt-3 flex items-center gap-2">
              <div class="flex-1">
                <p
                  v-if="
                    !getDisplaySize(item) &&
                    !cartStore.committingTempMap[item.id]
                  "
                  class="text-[10px] text-red-500 font-medium mb-1.5 flex items-center gap-1"
                >
                  <Icon icon="mdi:alert-circle" width="12" /> Pilih size dulu
                </p>
                <select
                  :value="getDisplaySize(item)"
                  @change="onSizeChange(item, $event)"
                  :disabled="
                    !!cartStore.committingTempMap[item.id] ||
                    !!cartStore.updatingSizeMap[item.id] ||
                    !!cartStore.qtyQueue[item.id]
                  "
                  class="text-[11px] border rounded-full px-3.5 py-2 bg-white w-full max-w-45 outline-none focus:border-black transition disabled:opacity-50 disabled:cursor-wait"
                  :class="
                    !getDisplaySize(item)
                      ? 'border-red-300 bg-red-50/50'
                      : 'border-gray-200'
                  "
                >
                  <option value="">Pilih Size</option>
                  <option
                    v-for="v in item.product.variants"
                    :key="v.id"
                    :value="String(v.size)"
                    :disabled="v.stock < 1"
                  >
                    Size {{ v.size }} — stok {{ v.stock
                    }}{{ v.stock < 1 ? " (habis)" : "" }}
                  </option>
                </select>
              </div>
              <div
                v-if="
                  cartStore.updatingSizeMap[item.id] ||
                  cartStore.committingTempMap[item.id] ||
                  cartStore.qtyQueue[item.id]
                "
                class="w-4 h-4 border-2 border-gray-200 border-t-black rounded-full animate-spin"
              ></div>
            </div>

            <div class="flex justify-between items-center mt-3.5">
              <div class="flex items-center gap-1 bg-gray-50 rounded-full p-1">
                <button
                  @click="cartStore.updateQty(item.id, item.quantity - 1)"
                  :disabled="
                    !!cartStore.committingTempMap[item.id] ||
                    !!cartStore.updatingSizeMap[item.id] ||
                    !!cartStore.qtyQueue[item.id] ||
                    item.quantity <= 1
                  "
                  class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-[13px] transition disabled:opacity-30 active:scale-90 hover:bg-black hover:text-white"
                >
                  -
                </button>
                <span
                  class="text-[12px] w-7 text-center font-semibold flex justify-center"
                >
                  <span>{{ item.quantity }}</span>
                </span>
                <button
                  @click="cartStore.updateQty(item.id, item.quantity + 1)"
                  :disabled="
                    !!cartStore.committingTempMap[item.id] ||
                    !!cartStore.updatingSizeMap[item.id] ||
                    !!cartStore.qtyQueue[item.id] ||
                    !item.size ||
                    item.quantity >= getStock(item)
                  "
                  class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-[13px] transition disabled:opacity-30 active:scale-90 hover:bg-black hover:text-white"
                >
                  +
                </button>
              </div>
              <button
                @click="cartStore.duplicateWithNewSize(item)"
                :disabled="
                  !!cartStore.committingTempMap[item.id] ||
                  !!cartStore.updatingSizeMap[item.id] ||
                  !!cartStore.qtyQueue[item.id] ||
                  cartStore.hasUnselectedSize
                "
                class="text-[10px] font-medium border border-gray-200 rounded-full px-3 py-1.5 hover:bg-black hover:text-white hover:border-black transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                + Size lain
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="cartStore.items.length"
        class="p-5 border-t border-gray-100 bg-white"
      >
        <div class="flex justify-between text-[13px] mb-3">
          <span class="text-gray-400">Total ({{ cartStore.count }} item)</span>
          <span class="font-bold text-[14px]"
            >Rp {{ Number(cartStore.total).toLocaleString("id-ID") }}</span
          >
        </div>
        <button
          :disabled="cartStore.isCheckoutDisabled"
          @click="$router.push('/checkout')"
          class="w-full bg-[#0F172A] text-white rounded-full py-4 text-[13px] font-semibold disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          <span v-if="cartStore.hasUnselectedSize"
            >Pilih size dulu untuk checkout</span
          >
          <span v-else
            >Checkout • Rp
            {{ Number(cartStore.total).toLocaleString("id-ID") }}</span
          >
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useCartStore } from "@/stores/cart.js";
import { useImage } from "@/composables/useImage.js";
import { ref, watch } from "vue";

const cartStore = useCartStore();
const { getImage } = useImage();
defineProps({ showCartDrawer: Boolean });
const emit = defineEmits(["closeCart"]);

const isTemp = (id) => String(id).startsWith("temp_");
const localSizes = ref({});

watch(
  () => cartStore.items,
  (items) => {
    items.forEach((i) => {
      if (i.size && !isTemp(i.id)) {
        localSizes.value[i.id] = String(i.size);
      }
      // kalau temp lagi committing, keep size nya biar gak kedip kosong
      if (isTemp(i.id) && i.size && cartStore.committingTempMap[i.id]) {
        localSizes.value[i.id] = String(i.size);
      }
    });
  },
  { immediate: true, deep: true },
);

const getStock = (item) => cartStore.getStockForItem(item);
const getDisplaySize = (item) => {
  if (localSizes.value[item.id] !== undefined) return localSizes.value[item.id];
  return item.size ? String(item.size) : "";
};

const onSizeChange = async (item, e) => {
  const v = e.target.value;
  if (!v) return;
  localSizes.value[item.id] = String(v);
  if (isTemp(item.id)) {
    try {
      await cartStore.commitTempWithSize(item.id, v);
    } finally {
      delete localSizes.value[item.id];
    }
  } else {
    cartStore.updateSize(item.id, v);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
