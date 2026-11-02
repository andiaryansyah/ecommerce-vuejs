<template>
  <span
    :class="style.cls"
    class="px-3 py-1 rounded-full text-xs font-bold capitalize tracking-wide"
  >
    {{ style.label }}
  </span>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ status: String });

const style = computed(() => {
  const map = {
    pending: { cls: "bg-orange-100 text-orange-600", label: "To Pay" },
    paid: { cls: "bg-blue-100 text-blue-600", label: "To Ship" },
    shipped: { cls: "bg-yellow-100 text-yellow-700", label: "To Receive" },
    completed: { cls: "bg-green-100 text-green-600", label: "Completed" },
    canceled: { cls: "bg-gray-100 text-gray-500", label: "Cancelled" },
    cancelled: { cls: "bg-gray-100 text-gray-500", label: "Cancelled" },
  };
  return (
    map[props.status] || {
      cls: "bg-gray-100 text-gray-600",
      label: props.status,
    }
  );
});
</script>
