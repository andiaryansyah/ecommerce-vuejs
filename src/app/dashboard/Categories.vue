<template>
  <div class="p-4 md:p-6 bg-slate-200 min-h-screen">
    <div class="px-2 md:px-6 py-8 bg-slate-100 rounded-2xl shadow-lg">
      <TableCategories
        :categories="filteredCategories"
        :loading="isLoadingData"
        @add-parent="openAdd"
        @add-sub="openAddSub"
        @edit="openEdit"
        @delete="toastDelete"
        @search="onSearch"
      />
    </div>

    <!-- Modal Add / Edit - tetap di parent -->
    <CategoryModal
      :is-open="showModal"
      :is-edit="isEdit"
      :modal-type="modalType"
      :form="form"
      :parent-categories="parentCategories"
      :saving="isSaving"
      @close="showModal = false"
      @save="handleSave"
      @update:form="form = $event"
    />

    <DialogMessage
      :isOpen="toastOpen"
      title="Confirm"
      text="Are you sure you want to delete this category?"
      @confirm="handleDelete"
      @cancel="toastOpen = false"
      :loading="isDeleted"
    />

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TableCategories from "../../components/dashboard/TableCategories.vue";
import CategoryModal from "../../components/dashboard/CategoryModal.vue";
import DialogMessage from "../../components/shared/DialogMessage.vue";
import { useToast } from "../../composables/useToast.js";
import Toast from "../../components/shared/Toast.vue";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/products.js";

const { showToast } = useToast();
const toastOpen = ref(false);

const dataCategories = ref([]);
const isLoadingData = ref(true);
const isSaving = ref(false);
const selectToDeleted = ref(null);
const isDeleted = ref(false);
const showModal = ref(false);
const modalType = ref("parent");
const isEdit = ref(false);
const editId = ref(null);
const form = ref({ name: "", parent_id: null });

// SEARCH STATE - DARI CHILD
const searchQuery = ref("");
const onSearch = (val) => {
  searchQuery.value = val;
};

const parentCategories = computed(() =>
  dataCategories.value.filter((c) => !c.parent_id),
);

// FILTER LOGIC PINDAH KE PARENT
const filteredCategories = computed(() => {
  if (!searchQuery.value) return dataCategories.value;
  const q = searchQuery.value.toLowerCase();
  // ambil parent yang namanya cocok ATAU punya sub yang cocok
  const matchingParentIds = new Set();
  dataCategories.value.forEach((c) => {
    if (c.name.toLowerCase().includes(q)) {
      if (!c.parent_id) matchingParentIds.add(c.id);
      else matchingParentIds.add(c.parent_id);
    }
  });
  // kembalikan parent yang match + semua sub nya
  return dataCategories.value.filter((c) => {
    if (!c.parent_id)
      return matchingParentIds.has(c.id) || c.name.toLowerCase().includes(q);
    return (
      matchingParentIds.has(c.parent_id) || c.name.toLowerCase().includes(q)
    );
  });
});

const fetchCategories = async () => {
  isLoadingData.value = true;
  try {
    dataCategories.value = await getCategories();
  } finally {
    isLoadingData.value = false;
  }
};

const openAdd = () => {
  isEdit.value = false;
  modalType.value = "parent";
  form.value = { name: "", parent_id: null };
  showModal.value = true;
};
const openAddSub = (parentId) => {
  isEdit.value = false;
  modalType.value = "sub";
  form.value = { name: "", parent_id: parentId };
  showModal.value = true;
};
const openEdit = (cat) => {
  isEdit.value = true;
  editId.value = cat.id;
  modalType.value = cat.parent_id ? "sub" : "parent";
  form.value = { name: cat.name, parent_id: cat.parent_id };
  showModal.value = true;
};

const handleSave = async () => {
  if (!form.value.name.trim()) return;
  isSaving.value = true;
  try {
    if (isEdit.value) await updateCategory(editId.value, form.value);
    else await createCategory(form.value);
    showModal.value = false;
    await fetchCategories();
  } catch (e) {
    alert(e.response?.data?.message || "Failed");
  } finally {
    isSaving.value = false;
  }
};

const toastDelete = (id) => {
  selectToDeleted.value = id;
  toastOpen.value = true;
};

const handleDelete = async () => {
  if (isDeleted.value) return;
  isDeleted.value = true;
  try {
    await deleteCategory(selectToDeleted.value);
    toastOpen.value = false;
    await fetchCategories();
    showToast("Category deleted successfully!", "success");
  } catch (e) {
    showToast(
      error.response?.data?.message || "Failed to delete product",
      "error",
    );
  } finally {
    isDeleted.value = false;
  }
};

onMounted(fetchCategories);
</script>
