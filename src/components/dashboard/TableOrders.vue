<template>
  <div class="overflow-x-auto md:p-6">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
        <tr>
          <th class="px-5 py-3 text-left">Order</th>
          <th class="px-5 py-3 text-left">Customer</th>
          <th class="px-5 py-3 text-left">Payment</th>
          <th class="px-5 py-3 text-left">Amount</th>
          <th class="px-5 py-3 text-left">Status</th>
          <th class="px-5 py-3 text-left">Date</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="o in ordersData"
          :key="o.id"
          class="hover:bg-gray-50/70 transition"
        >
          <td class="px-5 py-4">
            <p class="font-mono font-bold text-gray-900 text-[13px]">
              {{ o.order_code }}
            </p>
            <p class="text-[11px] text-gray-400 mt-0.5 truncate max-w-40">
              ID: {{ o.transaction_id || o.snap_token?.slice(0, 8) || "-" }}
            </p>
          </td>
          <td class="px-5 py-4">
            <p class="font-medium text-gray-900">
              {{ o.user?.name || "Guest" }}
            </p>
            <p class="text-xs text-gray-500 truncate max-w-45">
              {{ o.user?.email }}
            </p>
            <p class="text-[11px] text-gray-400 mt-1 truncate max-w-50">
              {{ o.shipping_address }}
            </p>
          </td>
          <td class="px-5 py-4">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border"
              :class="channelClass(o.payment_type)"
            >
              {{ formatChannel(o.payment_type) }}
            </span>
            <p
              v-if="o.paid_at"
              class="text-[10px] text-emerald-600 mt-1 font-medium"
            >
              {{ timeAgo(o.paid_at) }} paid
            </p>
            <p v-else class="text-[10px] text-gray-400 mt-1">unpaid</p>
          </td>
          <td class="px-5 py-4 font-bold text-gray-900">
            Rp {{ format(o.total_price) }}
          </td>
          <td class="px-5 py-4">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-semibold border"
              :class="statusClass(o.status)"
            >
              {{ o.status }}
            </span>
          </td>
          <td class="px-5 py-4 text-xs text-gray-600">
            {{ formatDate(o.created_at) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    v-if="!ordersData.length && !loading"
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

const format = (v) => new Intl.NumberFormat("id-ID").format(Number(v) || 0);
const formatDate = (d) =>
  new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatChannel = (type) => {
  if (!type) return "—";
  const map = {
    bca_va: "BCA VA",
    bni_va: "BNI VA",
    bri_va: "BRI VA",
    permata_va: "Permata VA",
    gopay: "GoPay",
    qris: "QRIS",
    shopeepay: "SPay",
    credit_card: "Credit Card",
  };
  return map[type] || type.replace("_", " ").toUpperCase();
};

const channelClass = (type) => {
  if (!type) return "bg-gray-100 text-gray-500 border-gray-200";
  if (type.includes("va")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (["gopay", "qris", "shopeepay"].includes(type))
    return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

const statusClass = (s) => ({
  "bg-emerald-50 text-emerald-700 border-emerald-200": s === "paid",
  "bg-amber-50 text-amber-700 border-amber-200": s === "pending",
  "bg-red-50 text-red-700 border-red-200": [
    "failed",
    "expired",
    "canceled",
    "cancelled",
  ].includes(s),
  "bg-gray-50 text-gray-600 border-gray-200": ![
    "paid",
    "pending",
    "failed",
    "expired",
    "canceled",
  ].includes(s),
});

const timeAgo = (d) => {
  const diff = Math.floor((new Date() - new Date(d)) / 1000 / 60);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};
</script>
