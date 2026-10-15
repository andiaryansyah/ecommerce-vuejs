<template>
  <div role="status" :class="color">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :class="['shrink-0 animate-spin fill-current', size]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M12.001 5.04a2.32 2.32 0 1 0 0-4.64 2.32 2.32 0 0 0 0 4.64zm0 18.56a2.32 2.32 0 1 0 0-4.64 2.32 2.32 0 0 0 0 4.64zm9.197-14.23a2.32 2.32 0 1 1-2.32-4.02 2.32 2.32 0 0 1 2.32 4.02zM1.956 17.8a2.32 2.32 0 1 0 4.018-2.32 2.32 2.32 0 0 0-4.018 2.32zm16.922.85a2.32 2.32 0 1 1 2.32-4.02 2.32 2.32 0 0 1-2.32 4.02zM1.956 6.2a2.32 2.32 0 1 0 4.018 2.32A2.32 2.32 0 0 0 1.956 6.2z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="sr-only">Loading…</span>
  </div>
</template>

<script setup>
defineProps({
  color: { type: String, default: "text-white" },
  size: { type: String, default: "size-9" }, // pakai tailwind size-4, size-6, size-9 dll
});
</script>
