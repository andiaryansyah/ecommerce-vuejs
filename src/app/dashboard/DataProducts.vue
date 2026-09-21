<template>
  <ProductFormModal ref="productModal" />
  <div class="p-4 md:p-6 bg-slate-200 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold p-6">Products</h1>
      <div class="flex items-center">
        <button
          class="flex items-center gap-2 p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-200 cursor-pointer"
          @click="openAdd"
        >
          <Icon icon="mdi:cart-plus" class="w-5 h-5" />
          <span class="hidden md:block">Add Product</span>
        </button>
      </div>
    </div>
    <div class="px-2 md:px-6 py-8 bg-slate-100 rounded-2xl shadow-lg">
      <TableProducts
        :products="initialProducts"
        @edit="openEdit"
        @delete="deleteProduct"
      />
    </div>
  </div>

  <!-- Modal -->
  <ProductFormModal
    :isOpen="isOpen"
    :mode="mode"
    :product="selectedProduct"
    @close="isOpen = false"
    @saved="handleSaved"
  />
</template>
<script setup>
import ProductFormModal from "../../components/dashboard/ProductFormModal.vue";
import TableProducts from "../../components/dashboard/TableProducts.vue";
import { products } from "../../data/products.js";
import { ref } from "vue";

const initialProducts = ref([...products]);
const isOpen = ref(false);
const mode = ref("add");
const selectedProduct = ref(null);

const openAdd = () => {
  mode.value = "add";
  selectedProduct.value = null;
  isOpen.value = true;
};

const openEdit = (item) => {
  mode.value = "edit";
  selectedProduct.value = item;
  isOpen.value = true;
};

const handleSaved = (product) => {
  if (product.mode === "add") {
    initialProducts.value.push(product);
  } else {
    const idx = initialProducts.value.findIndex((p) => p.name === product.name);
    if (idx !== -1) initialProducts.value[idx] = product;
  }
};

const deleteProduct = (item) => {
  initialProducts.value = initialProducts.value.filter(
    (p) => p.name !== item.name,
  );
};
</script>
