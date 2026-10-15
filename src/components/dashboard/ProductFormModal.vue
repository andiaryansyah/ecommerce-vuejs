<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-xl shadow-lg w-[90%] md:w-150 relative max-h-[90vh] overflow-y-auto"
      >
        <div
          class="sticky top-0 bg-white z-10 flex justify-between items-center mb-4 border-b border-gray-200 pb-2 shadow-sm p-6"
        >
          <h2 class="text-xl font-semibold">
            {{ mode === "edit" ? "Edit" : "Add New" }} Product
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-black text-2xl cursor-pointer transition duration-200"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
          <!-- Name -->
          <div class="text-sm">
            <label class="block font-medium">Name</label>
            <input
              v-model="form.name"
              placeholder="Nike Air Force White"
              class="mt-1 w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <!-- Price + Disc -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-sm">
              <label class="block font-medium">Price</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                placeholder="e.g. 49.99"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div class="text-sm">
              <label class="block font-medium">Disc (%)</label>
              <input
                v-model.number="form.discount_percent"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 10"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- Brand + Category -->
          <div class="grid grid-cols-3 gap-4">
            <div class="text-sm">
              <label class="block font-medium">Brand</label>
              <input
                v-model="form.brand"
                placeholder="e.g. Nike"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div class="text-sm">
              <label class="block font-medium">Category</label>
              <select
                v-model="selectedParentId"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" class="text-gray-300" hidden selected>
                  -- Choose --
                </option>
                <option
                  v-for="cat in parentCategories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ capitalizeFirstLetter(cat.name) }}
                </option>
              </select>
            </div>
            <div class="text-sm">
              <label class="hidden md:block font-medium">Sub Category</label>
              <label class="block md:hidden font-medium">Sub</label>
              <select
                v-model="form.category_id"
                :disabled="!selectedParentId"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" hidden selected>-- Choose --</option>
                <option
                  v-for="sub in filteredSubs"
                  :key="sub.id"
                  :value="sub.id"
                >
                  {{ capitalizeFirstLetter(sub.name) }}
                </option>
              </select>
            </div>
          </div>

          <!-- VARIANTS - INI YANG KURANG TADI -->
          <div class="border rounded-lg border-gray-300 p-3 bg-gray-50 text-sm">
            <div class="flex justify-between items-center mb-2">
              <label class="font-medium">Variants (Size & Stock)</label>
              <button
                type="button"
                @click="addVariant"
                class="bg-white border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-emerald-500"
              >
                + Add Size
              </button>
            </div>
            <div
              v-for="(v, i) in form.variants"
              :key="i"
              class="grid grid-cols-12 gap-2 mb-2"
            >
              <input
                v-model="v.size"
                placeholder="Size 40"
                class="col-span-5 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                v-model.number="v.stock"
                type="number"
                min="0"
                placeholder="Stock 5"
                class="col-span-5 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                @click="removeVariant(i)"
                class="col-span-2 bg-red-50 text-red-600 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                X
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Total Stock: {{ totalStock }} (otomatis dihitung backend)
            </p>
          </div>

          <div class="grid grid-cols-2 items-center gap-4 text-sm">
            <div>
              <label class="block font-medium text-gray-700">Images</label>
              <input
                type="file"
                @change="handleImageUpload"
                :disabled="form.image.length >= 5"
                :class="[
                  'text-sm mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500',
                  form.image.length >= 5
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer',
                ]"
                accept="image/*"
              />
            </div>
            <div v-if="form.image.length > 0">
              <p class="text-sm text-gray-600 mt-1">
                {{ form.image.length }}/5 images uploaded
              </p>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <div
                v-for="(img, idx) in form.image"
                :key="idx"
                class="relative w-12 h-12 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  :src="img"
                  class="w-12 h-12 object-cover rounded-lg border shadow-sm"
                />
                <button
                  type="button"
                  @click="removeImage(idx)"
                  class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-700 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="text-sm">
            <label class="block font-medium">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Deskripsi produk..."
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border rounded-lg text-sm"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span
                v-if="loading"
                class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{ loading ? "Saving..." : isEdit ? "Update" : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  product: Object,
  categories: { type: Array, default: () => [] }, // <-- terima dari parent
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "saved"]);

const selectedParentId = ref("");
const imageFiles = ref([]);

const form = ref({
  name: "",
  price: "",
  image: [],
  discount_percent: 0,
  brand: "",
  category_id: "",
  description: "",
  variants: [{ size: "40", stock: 5 }],
});

// INI TIDAK FETCH LAGI, PAKAI PROPS
const parentCategories = computed(() =>
  props.categories.filter((c) => !c.parent_id),
);
const filteredSubs = computed(() =>
  props.categories.filter((c) => c.parent_id === selectedParentId.value),
);
const totalStock = computed(() =>
  form.value.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0),
);

const addVariant = () => form.value.variants.push({ size: "", stock: 0 });
const removeVariant = (i) => form.value.variants.splice(i, 1);

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    if (imageFiles.value.length < 5) {
      imageFiles.value.push(file);
      form.value.image.push(URL.createObjectURL(file));
    }
  });
  event.target.value = "";
};
const removeImage = (index) => {
  form.value.image.splice(index, 1);
  imageFiles.value.splice(index, 1);
};

// watch edit tetap sama
watch(
  () => props.product,
  (p) => {
    if (props.mode === "edit" && p) {
      form.value.name = p.name;
      form.value.price = p.price;
      form.value.discount_percent = p.discount_percent;
      form.value.brand = p.brand;
      form.value.description = p.description;
      form.value.category_id = p.category?.id || p.category_id || "";
      selectedParentId.value = p.category?.parent_id || "";
      form.value.variants = p.variants?.length
        ? p.variants.map((v) => ({ size: v.size, stock: v.stock }))
        : [{ size: "40", stock: 5 }];
    }
  },

  { immediate: true },
);

watch(
  () => props.isOpen,
  (val) => {
    if (val && props.mode === "add") {
      // reset form pas buka add
      form.value = {
        name: "",
        price: "",
        image: [],
        discount_percent: 0,
        brand: "",
        category_id: "",
        description: "",
        variants: [{ size: "40", stock: 5 }],
      };
      imageFiles.value = [];
      selectedParentId.value = "";
    }
  },
);

const handleSubmit = () => {
  const fd = new FormData();
  fd.append("name", form.value.name);
  fd.append("price", form.value.price);
  fd.append("discount_percent", form.value.discount_percent || 0);
  fd.append("brand", form.value.brand || "");
  fd.append("description", form.value.description || "");
  fd.append("category_id", form.value.category_id);
  fd.append("variants", JSON.stringify(form.value.variants));
  imageFiles.value.forEach((f, i) => {
    if (i === 0) fd.append("image", f);
    else fd.append("gallery[]", f);
  });
  emit("saved", fd);
};

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
</script>
