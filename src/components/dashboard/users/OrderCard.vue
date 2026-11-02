<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <!-- Header -->
    <div class="px-6 py-3 bg-gray-50 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="font-bold text-sm text-[#1a2332]">{{
          order.order_code
        }}</span>
        <span class="text-xs text-gray-400">{{
          formatDate(order.created_at)
        }}</span>
      </div>
      <StatusBadge :status="order.status" />
    </div>

    <!-- Items - pakai quantity & variant punya kamu -->
    <div class="p-6 space-y-4">
      <div v-for="item in order.items" :key="item.id" class="flex gap-4">
        <img
          :src="
            item.product?.image_url ||
            item.product?.image ||
            'https://via.placeholder.com/80'
          "
          class="w-20 h-20 rounded-xl object-cover border bg-white"
        />
        <div class="flex-1">
          <p class="font-medium text-sm text-gray-900 line-clamp-1">
            {{ item.product?.name }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Size: {{ item.size }} | Qty: {{ item.quantity }} x Rp
            {{ formatPrice(item.price) }}
          </p>
          <p class="text-xs text-gray-400 mt-1 truncate">
            Variant ID: {{ item.product_variant_id }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t flex justify-between items-center">
      <div>
        <p class="text-xs text-gray-500">Total Pesanan</p>
        <p class="font-bold text-base text-[#1a2332]">
          Rp {{ formatPrice(order.total_price) }}
        </p>
        <p
          v-if="order.shipping_address"
          class="text-[11px] text-gray-400 mt-1 max-w-62.5 truncate"
        >
          {{ order.shipping_address }}
        </p>
      </div>
      <div class="flex gap-2">
        <!-- Jika pending, ada payment_url dari Midtrans kamu -->
        <a
          v-if="order.status === 'pending' && order.payment_url"
          :href="order.payment_url"
          target="_blank"
          class="px-5 py-2 bg-[#1a2332] text-white rounded-xl text-sm font-medium"
        >
          Bayar Sekarang
        </a>
        <button
          v-if="order.status === 'pending'"
          @click="$emit('cancel', order.id)"
          class="px-5 py-2 border border-red-200 text-red-500 rounded-xl text-sm"
        >
          Batalkan
        </button>
        <button
          v-if="order.status === 'shipped'"
          class="px-5 py-2 border rounded-xl text-sm"
        >
          Lacak
        </button>
        <button
          @click="$emit('detail', order.id)"
          class="px-5 py-2 bg-gray-100 rounded-xl text-sm font-medium"
        >
          Detail
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from "./StatusBadge.vue";
defineProps({ order: Object });
defineEmits(["detail", "cancel"]);

const formatPrice = (n) => new Intl.NumberFormat("id-ID").format(n || 0);
const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
</script>
