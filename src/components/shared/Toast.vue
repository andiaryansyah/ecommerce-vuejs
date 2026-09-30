<template>
  <transition
    enter-active-class="transform ease-out duration-300"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="visible"
      :class="toastClass"
      class="fixed bottom-6 right-6 px-8 py-4 rounded-lg shadow-lg text-white font-medium"
    >
      {{ message }}
    </div>
  </transition>
</template>
<script setup>
import { useToast } from "../../composables/useToast";
const { visible, message, toastClass } = useToast();
</script>
