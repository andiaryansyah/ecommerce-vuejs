<template>
  <div class="p-4 md:p-6 bg-slate-200 min-h-screen">
    <div class="px-2 md:px-6 py-8 bg-slate-100 rounded-2xl shadow-lg">
      <TableProducts
        :products="filteredProducts"
        :categories="parentCategories"
        :loading="isLoadingData"
        @edit="openEdit"
        @delete="toastDelete"
        @openAdd="openAdd"
        @search="onSearch"
        @filter="onFilter"
      />
    </div>
  </div>

  <ProductFormModal
    :isOpen="isOpen"
    :mode="mode"
    :product="selectedProduct"
    :categories="categories"
    :loading="isSaving"
    @close="isOpen = false"
    @saved="handleSaved"
  />
  <DialogMessage
    :isOpen="toastOpen"
    title="Confirm"
    text="Are you sure you want to delete this product?"
    @confirm="deleteProductById"
    @cancel="toastOpen = false"
    :loading="isDeleted"
  />
  <Toast />
</template>

<script setup>
import ProductFormModal from "../../components/dashboard/ProductFormModal.vue";
import TableProducts from "../../components/dashboard/TableProducts.vue";
import Toast from "../../components/shared/Toast.vue";
import DialogMessage from "../../components/shared/DialogMessage.vue";
import { useToast } from "../../composables/useToast.js";
import { ref, onMounted, computed } from "vue";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products.js";

const isOpen = ref(false);
const mode = ref("add");
const selectedProduct = ref(null);
const selectToDeleted = ref(null);
const categories = ref([]);
const dataProducts = ref([]);
const isSaving = ref(false);
const isDeleted = ref(false);
const isLoadingData = ref(false);
const toastOpen = ref(false);
const { showToast } = useToast();

// INI STATE UNTUK SEARCH & FILTER - TAMBAHIN DISINI
const searchQuery = ref("");
const filterCategory = ref("");
const filterStock = ref("");

const parentCategories = computed(() =>
  categories.value.filter((c) => !c.parent_id),
);

// INI LOGIC FILTER NYA - TAMBAHIN DISINI
const filteredProducts = computed(() => {
  let result = [...dataProducts.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (filterCategory.value) {
    result = result.filter(
      (p) =>
        p.category?.parent?.id == filterCategory.value ||
        p.category?.parent_id == filterCategory.value,
    );
  }
  if (filterStock.value === "low")
    result = result.filter((p) => p.stock > 0 && p.stock < 10);
  if (filterStock.value === "out") result = result.filter((p) => p.stock == 0);
  if (filterStock.value === "available")
    result = result.filter((p) => p.stock > 0);
  return result;
});

// INI 2 FUNGSI YANG KAMU TANYA - TARUH DISINI, SEJAJAR SAMA openAdd
const onSearch = (val) => {
  searchQuery.value = val;
};

const onFilter = ({ category, stock }) => {
  filterCategory.value = category;
  filterStock.value = stock;
};

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

const handleSaved = async (formData) => {
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    if (mode.value === "add") {
      await createProduct(formData);
      showToast("Product saved successfully!", "success");
    } else {
      await updateProduct(selectedProduct.value.id, formData);
      showToast("Product updated successfully!", "info");
    }
    dataProducts.value = await getProducts();
    isOpen.value = false;
  } catch (err) {
    showToast(err.response?.data?.message || "Gagal save product", "error");
  } finally {
    isSaving.value = false;
  }
};

const toastDelete = (id) => {
  selectToDeleted.value = id;
  toastOpen.value = true;
};
const deleteProductById = async () => {
  if (isDeleted.value) return;
  isDeleted.value = true;
  try {
    await deleteProduct(selectToDeleted.value);
    toastOpen.value = false;
    dataProducts.value = await getProducts();
    showToast("Product deleted successfully!", "success");
  } catch (error) {
    showToast(
      error.response?.data?.message || "Failed to delete product",
      "error",
    );
  } finally {
    isDeleted.value = false;
  }
};

onMounted(async () => {
  isLoadingData.value = true;
  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    dataProducts.value = productsData;
    console.log("productsData : ", productsData);
    categories.value = categoriesData;
  } finally {
    isLoadingData.value = false;
  }
});
</script>
