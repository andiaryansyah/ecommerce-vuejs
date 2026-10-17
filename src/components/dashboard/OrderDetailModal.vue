<template>
  <div
    v-if="order"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl flex flex-col"
    >
      <!-- Header -->
      <div
        class="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10"
      >
        <div>
          <h3 class="font-semibold text-[15px]">
            Order #{{ order.order_code || order.id }}
          </h3>
          <p class="text-[11px] text-gray-400 mt-0.5">
            {{ new Date(order.created_at).toLocaleString("id-ID") }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
            :class="statusClass(order.status)"
          >
            {{ order.status }}
          </span>
          <button
            @click="$emit('close')"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-5">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="space-y-1">
            <p class="text-[11px] text-gray-400 uppercase tracking-wider">
              Customer
            </p>
            <p class="font-medium">{{ order.user?.name }}</p>
            <p class="text-xs text-gray-500 truncate">
              {{ order.user?.email }}
            </p>
          </div>
          <div class="space-y-1">
            <p class="text-[11px] text-gray-400 uppercase tracking-wider">
              Shipping & Payment
            </p>
            <p class="text-xs text-gray-600 line-clamp-2">
              {{ order.shipping_address }}
            </p>
            <p class="text-xs mt-1">
              <span class="text-gray-400">Payment:</span>
              {{ order.payment_type || "-" }}
            </p>
          </div>
        </div>

        <div class="border-t pt-4 space-y-3">
          <p class="text-[11px] text-gray-400 uppercase tracking-wider">
            Items ({{ order.items?.length || 0 }})
          </p>
          <div
            v-for="item in order.items || []"
            :key="item.id"
            class="flex gap-3"
          >
            <img
              :src="item.product ? item.product?.image_url : ''"
              class="w-14 h-14 rounded-xl object-cover bg-gray-100 border"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">
                {{ item.product?.name || item.name }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">
                Qty: {{ item.quantity }} | Size: {{ item.size || "-" }}
              </p>
            </div>
            <p class="text-sm font-semibold shrink-0">
              Rp {{ new Intl.NumberFormat("id-ID").format(item.price || 0) }}
            </p>
          </div>
        </div>

        <div class="border-t pt-4 flex justify-between text-sm">
          <p class="text-gray-500">Total</p>
          <p class="font-bold">
            Rp
            {{ new Intl.NumberFormat("id-ID").format(order.total_price || 0) }}
          </p>
        </div>

        <!-- DANGER ZONE -->
        <div v-if="order.status === 'pending'" class="mt-2 pt-5 border-t">
          <div
            class="bg-red-50/70 border border-red-100 rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p class="text-sm font-medium text-red-900">Danger Zone</p>
              <p class="text-xs text-red-700/70 mt-0.5 leading-relaxed">
                Cancel order & kembalikan stok.
              </p>
            </div>
            <button
              @click="$emit('cancel_order', order.id)"
              :disabled="loading"
              class="shrink-0 px-4 py-2 text-xs font-medium bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-27.5 justify-center"
            >
              <span
                v-if="loading"
                class="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"
              ></span>
              {{ loading ? "Canceling..." : "Cancel Order" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: Object,
  loading: { type: Boolean, default: false }, // loading dari parent
});
const emit = defineEmits(["close", "cancel_order"]);

const statusClass = (s) => ({
  "bg-emerald-50 text-emerald-700 border-emerald-200": s === "paid",
  "bg-amber-50 text-amber-700 border-amber-200": s === "pending",
  "bg-red-50 text-red-700 border-red-200": [
    "failed",
    "expired",
    "canceled",
    "cancelled",
  ].includes(s),
  "bg-gray-50 text-gray-600 border-gray-200": ![
    "paid",
    "pending",
    "failed",
    "expired",
    "canceled",
  ].includes(s),
});
</script>
