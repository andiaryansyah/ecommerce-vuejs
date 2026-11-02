<template>
  <RouterView />
</template>
<script setup>
import { onMounted } from "vue";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetch();
});
</script>
