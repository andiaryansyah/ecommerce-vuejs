<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div
      v-for="(stat, i) in stats"
      :key="i"
      class="bg-white rounded-xl border border-gray-100 p-5"
    >
      <div class="flex items-start justify-between">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {{ stat.label }}
        </p>
        <span
          v-if="stat.badge"
          class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium border border-amber-200"
        >
          {{ stat.badge }}
        </span>
      </div>
      <p class="text-2xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
      <p v-if="stat.sub" class="text-xs text-gray-400 mt-1">{{ stat.sub }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: Array,
});
</script>
