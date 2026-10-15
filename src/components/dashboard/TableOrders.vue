<template>
  <div class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead
          class="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs uppercase"
        >
          <tr class="bg-gray-50 text-left text-gray-500">
            <th class="px-5 py-3 font-medium">Order ID</th>
            <th class="px-5 py-3 font-medium">Customer</th>
            <th class="px-5 py-3 font-medium">Date</th>
            <th class="px-5 py-3 font-medium">Items</th>
            <th class="px-5 py-3 font-medium">Total</th>
            <th class="px-5 py-3 font-medium">Status</th>
            <th class="px-5 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="order in ordersData"
            :key="order.id"
            class="hover:bg-gray-50/70 transition"
          >
            <td class="px-5 py-4 font-medium text-gray-900">
              #{{ order.order_number || order.id }}
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-medium text-xs"
                >
                  {{ order.user?.name?.charAt(0) || "U" }}
                </div>
                <div>
                  <p class="font-medium text-gray-800 leading-none">
                    {{ order.user?.name || order.customer_name }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ order.user?.email || "" }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-gray-600">
              {{ formatDate(order.created_at) }}
            </td>
            <td class="px-5 py-4 text-gray-600">
              {{ order.items?.length || order.order_items?.length || 0 }} items
            </td>
            <td class="px-5 py-4 font-semibold">
              Rp
              {{
                formatPrice(
                  order.total_price ?? order.total ?? order.grand_total ?? 0,
                )
              }}
            </td>
            <td class="px-5 py-4">
              <span
                :class="statusClass(order.status)"
                class="px-2.5 py-1 rounded-full text-xs font-medium capitalize border"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click="$emit('view', order)"
                  class="cursor-pointer w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
                >
                  <Icon icon="lucide:eye" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="!orders.length && !loading"
      class="px-5 py-12 text-center text-gray-500"
    >
      No orders found
    </div>
    <div
      v-if="loading"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-20 flex justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <Loading class="w-10 h-10" color="text-emerald-500" />
        <span class="text-sm text-gray-500">Loading orders...</span>
      </div>
    </div>

    <!-- Pagination  -->
    <div
      class="flex justify-between items-center mt-4 text-xs md:text-sm px-2 md:px-0"
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Loading from "../shared/Loading.vue";

const props = defineProps({
  orders: { type: Array, default: () => [] },
  loading: Boolean,
});
defineEmits(["view"]);

const itemsPerPage = ref(5);
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.orders.length / itemsPerPage.value),
);

const ordersData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.orders.slice(start, end);
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

const formatPrice = (v) => {
  const num = Number(v) || 0;
  return new Intl.NumberFormat("id-ID").format(num);
};

const formatDate = (d) => {
  if (!d) return "-";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "-";
  // Jangan pakai options complex, cukup ini biar gak RangeError lagi
  return date.toLocaleDateString("id-ID");
};

const statusClass = (s) =>
  ({
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    paid: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  })[s] || "bg-gray-50 text-gray-600 border-gray-200";

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

watch(
  () => props.orders,
  () => {
    currentPage.value = 1;
  },
);
</script>
