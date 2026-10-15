<template>
  <div
    v-if="order"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl"
    >
      <div
        class="p-5 border-b flex justify-between items-center sticky top-0 bg-white"
      >
        <h3 class="font-semibold">
          Order #{{ order.order_number || order.id }}
        </h3>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div class="p-5 space-y-3">
        <div class="text-sm space-y-1 pb-4 border-b">
          <p>
            <span class="text-gray-500">Customer:</span>
            {{ order.user?.name }} - {{ order.user?.email }}
          </p>
          <p><span class="text-gray-500">Status:</span> {{ order.status }}</p>
          <p>
            <span class="text-gray-500">Total:</span> Rp
            {{
              new Intl.NumberFormat("id-ID").format(
                order.total_amount || order.total || 0,
              )
            }}
          </p>
        </div>
        <div
          v-for="item in order.items || order.order_items || []"
          :key="item.id"
          class="flex gap-3"
        >
          <img
            :src="item.product?.image ? `/storage/${item.product.image}` : ''"
            class="w-14 h-14 rounded-lg object-cover bg-gray-100"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">
              {{ item.product?.name || item.name }}
            </p>
            <p class="text-xs text-gray-500">
              Qty: {{ item.quantity }} | Size: {{ item.variant?.size || "-" }}
            </p>
          </div>
          <p class="text-sm font-medium">
            Rp {{ new Intl.NumberFormat("id-ID").format(item.price || 0) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ order: Object });
defineEmits(["close"]);
</script>
