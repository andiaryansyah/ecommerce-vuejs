<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
        <tr>
          <th class="px-5 py-3 text-left">Customer</th>
          <th class="px-5 py-3 text-left">Joined</th>
          <th class="px-5 py-3 text-left">Orders</th>
          <th class="px-5 py-3 text-left">Total Spent</th>
          <th class="px-5 py-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="customer in customersData"
          :key="customer.id"
          class="border-t border-gray-100 hover:bg-gray-50"
        >
          <td class="px-5 py-4 flex items-center gap-3">
            <img
              v-if="customer.avatar_url"
              :src="customer.avatar_url"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs"
            >
              {{ customer.name?.[0] }}
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ customer.name }}</p>
              <p class="text-xs text-gray-500">{{ customer.email }}</p>
            </div>
          </td>
          <td class="px-5 py-4 text-gray-600">
            {{ formatDate(customer.created_at) }}
          </td>
          <td class="px-5 py-4">
            <span
              class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium"
              >{{ customer.orders_count || 0 }}</span
            >
          </td>
          <td class="px-5 py-4 font-semibold">
            Rp {{ formatPrice(customer.orders_sum_total_price) }}
          </td>
          <td class="px-5 py-4">
            <span
              :class="
                customer.orders_count > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              "
              class="px-2.5 py-1 rounded-full text-xs font-medium"
            >
              {{ customer.orders_count > 0 ? "Active" : "Inactive" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="!customersData.length && !props.loading"
      class="px-5 py-12 text-center text-gray-500"
    >
      No customers found
    </div>
    <div
      v-if="props.loading"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-20 flex justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <Loading class="w-10 h-10" color="text-emerald-500" />
        <span class="text-sm text-gray-500">Loading customers...</span>
      </div>
    </div>
  </div>
  <!-- Pagination  -->
  <div
    class="flex justify-between items-center mt-4 text-xs md:text-sm p-4 md:p-6"
  >
    <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
      <label class="mr-2">Items per page:</label>
      <div class="md:mt-2">
        <select
          v-model.number="itemsPerPage"
          class="border rounded px-2 py-1 bg-white"
        >
          <option v-for="opt in [5, 10, 20]" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex justify-center md:gap-2 items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        :class="[
          'px-3 py-1 border rounded disabled:opacity-50 bg-white',
          currentPage === 1
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:bg-emerald-600 hover:text-white',
        ]"
      >
        <Icon icon="boxicons:arrow-big-left-line-filled" class="w-5 h-5" />
      </button>
      <span class="px-3 py-1 text-center"
        >Page {{ currentPage }} of {{ totalPages || 1 }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages || totalPages === 0"
        :class="[
          'px-3 py-1 border rounded disabled:opacity-50 bg-white',
          currentPage === totalPages || totalPages === 0
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:bg-emerald-600 hover:text-white',
        ]"
      >
        <Icon icon="boxicons:arrow-big-right-line-filled" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Loading from "../shared/Loading.vue";

const props = defineProps({ customers: Array, loading: Boolean });

const itemsPerPage = ref(5);
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.customers.length / itemsPerPage.value),
);

const customersData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.customers.slice(start, end);
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

const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const formatPrice = (v) =>
  new Intl.NumberFormat("id-ID").format(Number(v) || 0);

watch(
  () => props.customers,
  () => {
    currentPage.value = 1;
  },
);
</script>
