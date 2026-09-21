<template>
  <div
    class="gap-2 rounded-xl text-white bg-[#1E293B] p-4 backdrop-blur-sm transition-colors hover:bg-white/15 shadow-lg border border-slate-700"
  >
    <!-- rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-colors
    hover:bg-white/15 -->
    <div class="flex items-center gap-2 mb-4">
      <Icon :icon="icon" class="w-5 h-5" />
      <h1 class="text-base capitalize">{{ title }}</h1>
    </div>

    <p class="font-bold text-xl md:text-4xl mb-2">
      {{ value }}
    </p>
    <div class="flex items-center gap-1">
      <Icon
        icon="mdi:trending-up"
        :class="[
          'w-5 h-5',
          changeType === 'increase' ? ' text-emerald-400' : 'text-red-400',
        ]"
      />
      <p
        :class="[
          'text-xs md:text-base',
          changeType === 'increase' ? ' text-emerald-400' : 'text-red-400',
        ]"
      >
        <span>{{ changeType === "increase" ? "+" : "-" }}</span
        >{{ change }}%
      </p>
      <div class="items-center text-xs md:text-base">
        <p>{{ comparison }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  change: {
    type: String,
    required: true,
  },
  changeType: {
    type: String,
    required: true,
  },
  comparison: {
    type: String,
  },
  icon: {
    type: String,
  },
});
</script>
