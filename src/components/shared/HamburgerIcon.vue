<template>
  <button @click="$emit('toggle')" class="text-gray-700 hover:text-secondary">
    <!-- Hamburger icon -->
    <Icon icon="mdi:menu" class="w-6 h-6 cursor-pointer" />
  </button>
</template>
<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
</script>
