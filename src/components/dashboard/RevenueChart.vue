<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-5 shadow-lg"
  >
    <div class="flex items-center justify-between px-4">
      <p class="text-base md:text-lg lg:text-2xl font-bold text-gray-800">
        Total Revenue
      </p>
      <div class="text-xs md:text-sm lg:text-lg grid grid-cols-2">
        <button
          v-for="(label, i) in buttons"
          :key="i"
          @click="selected = label"
          :class="[
            'border p-2 cursor-pointer font-semibold transition-colors ',
            selected === label
              ? 'bg-primary text-white'
              : 'hover:bg-primary-hover hover:text-white',
            i === 0 ? 'rounded-l-xl ' : 'rounded-r-xl',
          ]"
        >
          {{ label }}
        </button>
      </div>
    </div>
    <BarChart :selected="selected" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import BarChart from "./BarChart.vue";

const buttons = ["Weekly", "Monthly"];
const selected = ref("Monthly");
</script>
