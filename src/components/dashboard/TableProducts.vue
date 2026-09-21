<template>
  <table class="hidden md:table w-full text-left">
    <thead>
      <tr class="border-b border-gray-400 text-primary text-center">
        <th class="py-2 text-start">Products</th>
        <th class="py-2">Price</th>
        <th class="py-2">Rating</th>
        <th class="py-2">Discount</th>
        <th class="hidden lg:table-cell py-2">Category</th>
        <th class="hidden lg:table-cell py-2">Sub Category</th>
        <th class="py-2">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in paginatedProducts"
        :key="index"
        class="border-b border-gray-400 hover:bg-gray-400/40 transition-colors duration-200 text-center"
      >
        <td class="py-3 flex items-center gap-3 text-start">
          <img
            :src="item.image[0]"
            alt="product"
            class="w-12 h-12 rounded-lg bg-white p-1"
          />
          <p class="font-semibold">{{ item.name }}</p>
        </td>
        <td class="py-3 text-primary">{{ item.price }}</td>
        <td class="py-3 text-primary">
          <div class="flex gap-1 justify-center items-center">
            <Icon icon="ant-design:star-filled" class="w-5 h-5 text-gray-700" />
            <p class="text-center">{{ item.rating }}</p>
          </div>
        </td>
        <td class="py-3 text-primary">
          <div class="flex justify-center">
            <p
              class="p-2 bg-white w-[50%] text-center rounded-md shadow-lg font-semibold"
            >
              {{ item.discount }} %
            </p>
          </div>
        </td>
        <td class="py-3 text-primary hidden lg:table-cell capitalize">
          {{ item.category }}
        </td>
        <td class="py-3 text-primary hidden lg:table-cell capitalize">
          {{ item.subCategory }}
        </td>
        <td class="py-3">
          <div class="flex justify-center items-center gap-3">
            <button
              class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
              @click="emit('edit', item)"
            >
              <Icon icon="akar-icons:edit" class="w-5 h-5 text-blue-400" />
            </button>
            <button
              class="p-2 cursor-pointer rounded-md shadow-lg bg-white hover:bg-gray-200"
              @click="emit('delete', item)"
            >
              <Icon icon="ep:delete-filled" class="w-5 h-5 text-red-500" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Mobile Card View -->
  <div class="md:hidden space-y-4">
    <div
      v-for="(item, index) in paginatedProducts"
      :key="index"
      class="flex items-center gap-4 p-3 rounded-xl bg-white shadow-md"
    >
      <img
        :src="item.image[0]"
        alt="product"
        class="w-14 h-14 rounded-lg bg-white p-1"
      />
      <div class="flex-1">
        <p class="font-semibold">{{ item.name }}</p>
        <p class="text-sm text-gray-400">
          Price: {{ item.price }} | Rating: {{ item.rating }}
        </p>
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
  <div class="flex justify-between items-center mt-4 text-xs md:text-base">
    <!-- Dropdown untuk memilih jumlah item per halaman -->
    <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
      <label class="mr-2">Items per page:</label>
      <div class="md:mt-2">
        <select v-model.number="itemsPerPage" class="border rounded px-2 py-1">
          <option v-for="opt in [5, 10, 20]" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>
    </div>
    <!-- Pagination controls -->
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
        >Page {{ currentPage }} of {{ totalPages }}</span
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
</template>
<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);

const itemsPerPage = ref(5);
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.products.length / itemsPerPage.value),
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return props.products.slice(start, start + itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
});
</script>
