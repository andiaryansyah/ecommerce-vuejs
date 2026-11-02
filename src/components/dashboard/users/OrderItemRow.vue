<template>
  <div class="flex gap-4">
    <img
      :src="item.product?.image || item.image"
      class="w-20 h-20 rounded-xl object-cover border"
    />
    <div class="flex-1">
      <p class="font-medium text-sm line-clamp-1">
        {{ item.product?.name || item.product_name }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        Size: {{ item.size }} | Qty: {{ item.qty }}
      </p>
      <p class="text-sm font-bold mt-2">
        Rp {{ new Intl.NumberFormat("id-ID").format(item.price) }}
      </p>
    </div>
  </div>
</template>
<script setup>
defineProps({ item: Object });
</script>
