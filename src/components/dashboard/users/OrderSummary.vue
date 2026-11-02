<template>
  <div class="bg-white rounded-3xl p-6 border sticky top-6">
    <h3 class="font-semibold text-sm mb-4">Ringkasan ({{ items.length }})</h3>
    <div class="space-y-3">
      <div v-for="c in items" :key="c.id" class="flex gap-3 text-sm">
        <img
          :src="c.product?.image"
          class="w-12 h-12 rounded-lg bg-slate-100 object-cover"
        />
        <div class="flex-1">
          <p class="text-xs font-medium line-clamp-1">
            {{ c.product?.name }} - {{ c.size }}
          </p>
          <p class="text-[11px] text-gray-400">x{{ c.quantity }}</p>
        </div>
        <span class="text-xs font-semibold"
          >Rp
          {{
            ((c.product?.price || 0) * c.quantity).toLocaleString("id-ID")
          }}</span
        >
      </div>
    </div>
    <div class="border-t mt-4 pt-4 flex justify-between font-bold">
      <span>Total</span><span>Rp {{ total.toLocaleString("id-ID") }}</span>
    </div>
    <slot name="action"></slot>
  </div>
</template>
<script setup>
defineProps({ items: Array, total: Number });
</script>
