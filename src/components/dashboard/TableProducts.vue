<template>
  <div class="px-2 md:p-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Products</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your products</p>
      </div>
      <button
        @click="emit('openAdd')"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 w-[50%] md:w-auto"
      >
        <Icon icon="mdi:cart-plus" class="w-5 h-5" />
        <span class="block">Add Product</span>
      </button>
    </div>

    <!-- Search + Filter - sekarang jadi satu di dalam tabel -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="flex flex-col lg:flex-row gap-3">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="search"
            placeholder="Search Products..."
            class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          v-model="filterCategory"
          class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white min-w-45"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select
          v-model="filterStock"
          class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white min-w-35"
        >
          <option value="">All Stock</option>
          <option value="low">Low Stock &lt; 10</option>
          <option value="out">Out of Stock</option>
          <option value="available">Available</option>
        </select>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="hidden md:table w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs uppercase text-center"
            >
              <th class="px-4 py-2 text-left font-medium">Products</th>
              <th class="py-2 font-medium">Price</th>
              <th class="py-2 font-medium">Rating</th>
              <th class="py-2 font-medium">Discount</th>
              <th class="py-2 font-medium">Stock</th>
              <th class="hidden lg:table-cell py-2 font-medium">Category</th>
              <th class="hidden lg:table-cell py-2 font-medium">
                Sub Category
              </th>
              <th class="py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginatedProducts"
              :key="index"
              class="border-b border-gray-400 hover:bg-gray-400/40 transition-colors duration-200 text-center"
            >
              <td class="px-4 py-3 flex items-center gap-3 text-start">
                <img
                  :src="item.image_url"
                  alt="product"
                  class="w-12 h-12 rounded-lg bg-white p-1"
                />
                <p class="font-semibold">{{ item.name }}</p>
              </td>
              <td class="py-3 text-primary">
                <p class="font-semibold">Rp.{{ formatPrice(item.price) }}</p>
                <p
                  v-if="item.discount_percent > 0"
                  class="text-gray-500 line-through"
                >
                  Rp.{{ formatPrice(item.original_price) }}
                </p>
              </td>
              <td class="py-3 text-primary">
                <div class="flex gap-1 justify-center items-center">
                  <Icon
                    icon="ant-design:star-filled"
                    class="w-5 h-5 text-gray-700"
                  />
                  <p class="text-center">{{ item.rating }}</p>
                </div>
              </td>
              <td class="py-3 text-primary">
                <div class="flex justify-center">
                  <p
                    class="p-2 bg-white w-[50%] text-center rounded-md shadow-lg font-semibold"
                  >
                    {{ item.discount_percent }} %
                  </p>
                </div>
              </td>
              <td class="py-3 text-primary lg:table-cell capitalize">
                {{ item.stock }}
              </td>
              <td class="py-3 text-primary hidden lg:table-cell capitalize">
                {{ item.category.parent.name }}
              </td>
              <td class="py-3 text-primary hidden lg:table-cell capitalize">
                {{ item.category.name }}
              </td>
              <td class="py-3">
                <div class="flex justify-center items-center gap-3">
                  <button
                    class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
                    @click="emit('edit', item)"
                  >
                    <Icon
                      icon="akar-icons:edit"
                      class="w-5 h-5 text-blue-400"
                    />
                  </button>
                  <button
                    class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
                    @click="emit('delete', item.id)"
                  >
                    <Icon
                      icon="ep:delete-filled"
                      class="w-5 h-5 text-red-500"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!paginatedProducts.length && !loading"
        class="px-5 py-12 text-center text-gray-500"
      >
        No products found
      </div>
    </div>

    <div
      v-if="loading"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-20 flex justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <Loading class="w-10 h-10" color="text-emerald-500" />
        <span class="text-sm text-gray-500">Loading products...</span>
      </div>
    </div>
    <!-- Mobile Card View -->
    <div class="md:hidden space-y-4 px-2">
      <div
        v-for="(item, index) in paginatedProducts"
        :key="index"
        class="flex items-center gap-4 p-3 rounded-xl bg-white shadow-md"
      >
        <img
          :src="item.image_url"
          alt="product"
          class="w-14 h-14 rounded-lg bg-white p-1"
        />
        <div class="flex-1">
          <p class="font-semibold text-sm">{{ item.name }}</p>
          <div class="flex items-center gap-2 text-xs">
            <p class="font-semibold">Rp.{{ formatPrice(item.price) }}</p>
            <p
              v-if="item.discount_percent > 0"
              class="text-gray-500 line-through"
            >
              Rp.{{ formatPrice(item.original_price) }}
            </p>
          </div>
          <div class="text-sm text-gray-400 flex items-start gap-2">
            <p class="text-center text-sm">Stock: {{ item.stock }}</p>
            |
            <div class="flex gap-1 justify-center items-center">
              <Icon
                icon="ant-design:star-filled"
                class="w-3 h-3 text-gray-700"
              />
              <p class="text-center text-sm">{{ item.rating }}</p>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="cursor-pointer" @click="emit('edit', item)">
            <Icon icon="akar-icons:edit" class="w-5 h-5 text-blue-400" />
          </button>
          <button class="cursor-pointer" @click="emit('delete', item)">
            <Icon icon="ep:delete-filled" class="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>

    <div
      class="flex justify-between items-center mt-4 text-xs md:text-sm px-2 md:px-0"
    >
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <label class="mr-2">Items per page:</label>
        <div class="md:mt-2">
          <select
            v-model.number="itemsPerPage"
            class="border rounded px-2 py-1"
          >
            <option v-for="opt in [5, 10, 20]" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-center gap-2 mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 border rounded disabled:opacity-50',
            currentPage === 1
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:bg-primary-hover hover:text-white',
          ]"
        >
          <Icon icon="boxicons:arrow-big-left-line-filled" class="w-5 h-5" />
        </button>
        <span class="px-3 py-1 text-center"
          >Page {{ currentPage }} of {{ totalPages || 1 }}</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-1 border rounded disabled:opacity-50',
            currentPage === totalPages
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:bg-primary-hover hover:text-white',
          ]"
        >
          <Icon icon="boxicons:arrow-big-right-line-filled" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Loading from "../shared/Loading.vue";

const props = defineProps({
  products: { type: Array, required: true },
  categories: { type: Array, default: () => [] }, // untuk dropdown filter category
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["edit", "delete", "openAdd", "search", "filter"]);

const search = ref("");
const filterCategory = ref("");
const filterStock = ref("");

const itemsPerPage = ref(5);
const currentPage = ref(1);

const formatPrice = (v) =>
  new Intl.NumberFormat("id-ID").format(Number(v) || 0);

const totalPages = computed(() =>
  Math.ceil(props.products.length / itemsPerPage.value),
);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return props.products.slice(start, start + itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});
watch(
  () => props.products,
  () => {
    currentPage.value = 1;
  },
);

// emit ke parent setiap ada perubahan search / filter
watch(search, (val) => emit("search", val));
watch([filterCategory, filterStock], ([cat, stock]) => {
  emit("filter", { category: cat, stock: stock });
});
</script>
