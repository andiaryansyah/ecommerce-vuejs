<template>
  <div class="p-4 md:p-6 space-y-6 bg-slate-200 min-h-screen">
    <div class="px-2 md:px-6 py-8 bg-slate-100 rounded-2xl shadow-lg">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Customers</h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage and track all your customers
          </p>
        </div>
      </div>

      <div class="my-6">
        <CustomerStatus :stats="statsDisplay" />
      </div>

      <div
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <CustomerFilters
          :search="search"
          :filter="filter"
          :date="dateFilter"
          @update:search="search = $event"
          @update:filter="filter = $event"
          @update:date="dateFilter = $event"
        />
        <TableCustomers :customers="customers" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { fetchCustomers } from "../../api/users.js";
import CustomerStatus from "../../components/dashboard/CustomerStatus.vue";
import CustomerFilters from "../../components/dashboard/CustomerFilters.vue";
import TableCustomers from "../../components/dashboard/TableCustomers.vue";

const customers = ref([]);
const loading = ref(false);
const search = ref("");
const filter = ref("");
const dateFilter = ref("");

const stats = ref({ total: 0, active: 0, new: 0, total_orders: 0 });

const isFiltered = computed(
  () => !!search.value || !!filter.value || !!dateFilter.value,
);

const statsDisplay = computed(() => [
  {
    label: "Total Customers",
    value: stats.value.total,
    sub: isFiltered.value ? "Filtered results" : "All customers",
  },
  { label: "Active Customers", value: stats.value.active, sub: "Has orders" },
  { label: "New (7 days)", value: stats.value.new, sub: "Recently joined" },
  {
    label: "Total Orders",
    value: stats.value.total_orders,
    sub: isFiltered.value ? "From filtered customers" : "From all customers",
  },
]);

const loadCustomers = async () => {
  loading.value = true;
  customers.value = [];
  try {
    const res = await fetchCustomers({
      search: search.value,
      filter: filter.value,
      date: dateFilter.value,
    });
    customers.value = res.data || [];
    stats.value = res.stats || stats.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch([search, filter, dateFilter], loadCustomers);
onMounted(loadCustomers);
</script>
