<template>
  <div
    class="bg-white rounded-2xl p-2 shadow-sm border flex gap-1 overflow-x-auto"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('update:modelValue', tab.key)"
      :class="[
        'px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition',
        modelValue === tab.key
          ? 'bg-[#1a2332] text-white'
          : 'text-gray-500 hover:bg-gray-100',
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
<script setup>
defineProps({ modelValue: String, tabs: Array });
defineEmits(["update:modelValue"]);
</script>
