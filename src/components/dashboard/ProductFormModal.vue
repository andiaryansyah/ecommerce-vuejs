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
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg w-[90%] md:w-150 relative max-h-[90vh] overflow-y-auto"
      >
        <!-- Header -->
        <div
          class="sticky top-0 bg-white z-10 flex justify-between items-center mb-4 border-b border-gray-200 pb-2 shadow-sm p-6"
        >
          <h2 class="text-xl font-semibold text-gray-800">
            {{ mode === "add" ? "Add New Product" : "Edit Product" }}
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 p-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter product name"
              required
            />
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Price</label
              >
              <input
                v-model="form.price"
                type="number"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 49.99"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Disc (%)</label
              >
              <input
                v-model="form.discount"
                type="number"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Rating</label
              >
              <input
                v-model="form.rating"
                type="number"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 5"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Category</label
              >
              <input
                v-model="form.category"
                type="text"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Sport"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Sub Category</label
              >
              <input
                v-model="form.subCategory"
                type="text"
                class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Running"
              />
            </div>
          </div>
          <div></div>
          <div class="grid grid-cols-2 items-center gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Images</label
              >
              <input
                type="file"
                @change="handleImageUpload"
                :disabled="form.image.length >= 5"
                :class="[
                  'mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500',
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

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="form.description"
              type="text"
              rows="5"
              class="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              placeholder="Description"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end mt-6">
            <button
              type="submit"
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition cursor-pointer"
            >
              {{ mode === "add" ? "Save Product" : "Update Product" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: "add" },
  product: { type: Object, default: null },
});
const emit = defineEmits(["close", "saved"]);

const form = ref({
  id: "",
  name: "",
  price: "",
  rating: "",
  image: [],
  discount: "",
  category: "",
  subCategory: "",
  slug: "",
  description: "",
});

// isi form otomatis saat edit
watch(
  () => props.product,
  (newVal) => {
    if (props.mode === "edit" && newVal) {
      form.value = { ...newVal };
    } else {
      form.value = {
        id: "",
        name: "",
        price: "",
        rating: "",
        image: [],
        discount: "",
        category: "",
        subCategory: "",
        slug: "",
        description: "",
      };
    }
  },
  { immediate: true },
);

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    if (form.value.image.length < 5) {
      form.value.image.push(URL.createObjectURL(file));
    }
  });
  event.target.value = "";
};

const removeImage = (index) => {
  form.value.image.splice(index, 1);
};

const handleSubmit = () => {
  emit("saved", { ...form.value, mode: props.mode });
  emit("close");
};
</script>
