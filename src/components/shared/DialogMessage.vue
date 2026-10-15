<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-[90%] md:w-96 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ props.title }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ props.text }}
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="emit('cancel')"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="emit('confirm')"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            <Loading v-if="loading" />
            <span v-else>Yes</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Loading from "./Loading.vue";
const props = defineProps({
  isOpen: Boolean,
  text: String,
  title: String,
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["confirm", "cancel"]);
</script>
