<template>
  <div class="p-4 md:p-6 space-y-6 bg-slate-200 min-h-screen">
    <div class="px-2 md:px-6 py-8 bg-slate-100 rounded-2xl shadow-lg">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Orders</h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
      </div>
      <div class="my-6">
        <OrderStatus :stats="statsDisplay" />
      </div>

      <div
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <OrderFilters
          :search="search"
          :status="statusFilter"
          :date="dateFilter"
          @update:search="search = $event"
          @update:status="statusFilter = $event"
          @update:date="dateFilter = $event"
        />
        <TableOrders
          :orders="filteredOrders"
          :loading="loading"
          @view="handleView"
        />
      </div>

      <OrderDetailModal
        :order="selectedOrder"
        @close="selectedOrder = null"
        :loading="isCanceling"
        @cancel_order="handleCancelOrder"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  fetchOrders,
  fetchOrderDetail,
  cancelOrder,
} from "../../api/orders.js";
import OrderStatus from "../../components/dashboard/OrderStatus.vue";
import OrderFilters from "../../components/dashboard/OrderFilters.vue";
import TableOrders from "../../components/dashboard/TableOrders.vue";
import OrderDetailModal from "../../components/dashboard/OrderDetailModal.vue";

const orders = ref([]);
const loading = ref(false);
const isCanceling = ref(false);
const search = ref("");
const statusFilter = ref("");
const dateFilter = ref("");
const selectedOrder = ref(null);

const stats = ref({ total: 0, pending: 0, completed: 0, revenue: 0 });

// Cek apakah sedang difilter
const isFiltered = computed(() => {
  return !!search.value || !!statusFilter.value || !!dateFilter.value;
});

const statsDisplay = computed(() => [
  {
    label: "Total Orders",
    value: stats.value.total,
    sub: isFiltered.value
      ? `Filtered ${dateFilter.value ? `on ${dateFilter.value}` : "results"}`
      : "All orders",
  },
  {
    label: "Pending",
    value: stats.value.pending,
    sub: isFiltered.value ? "In this filter" : "Awaiting payment",
  },
  {
    label: "Completed",
    value: stats.value.completed,
    sub: isFiltered.value ? "In this filter" : "Paid orders",
  },
  {
    label: "Revenue",
    value: `Rp ${new Intl.NumberFormat("id-ID").format(stats.value.revenue)}`,
    sub: isFiltered.value
      ? dateFilter.value
        ? `Revenue on ${dateFilter.value}`
        : "Revenue in filter"
      : "Total revenue",
  },
]);

const filteredOrders = computed(() => orders.value);

const loadOrders = async () => {
  loading.value = true;
  orders.value = [];
  try {
    const res = await fetchOrders({
      search: search.value,
      status: statusFilter.value,
      date: dateFilter.value,
    });

    if (res.data && res.stats) {
      orders.value = res.data;
      stats.value = res.stats;
    } else if (Array.isArray(res)) {
      orders.value = res;
    } else {
      orders.value = res.data || [];
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleView = async (order) => {
  try {
    const detail = await fetchOrderDetail(order.id || order.order_code);
    selectedOrder.value = detail;
    console.log("order modal: ", detail);
  } catch {
    selectedOrder.value = order;
  }
};

const handleCancelOrder = async (id) => {
  if (isCanceling.value) return;
  if (!confirm(`Cancel order ${id} ? Stok akan dikembalikan.`)) return;
  isCanceling.value = true;
  try {
    await cancelOrder(id);
    selectedOrder.value = null; // auto close
    await loadOrders();
  } catch (e) {
    alert(e.response?.data?.message || "Gagal cancel");
  } finally {
    isCanceling.value = false;
  }
};

watch([search, statusFilter, dateFilter], () => {
  loadOrders();
});

onMounted(loadOrders);
</script>
