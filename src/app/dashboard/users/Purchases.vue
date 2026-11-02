<template>
  <div class="w-full">
    <PurchaseTabs v-model="activeTab" :tabs="tabs" />
    <PurchaseSearch v-model="search" class="mt-4" />

    <div v-if="loading" class="mt-4 space-y-4">
      <OrderSkeleton v-for="i in 3" :key="i" />
    </div>

    <div v-else class="mt-4 space-y-4">
      <EmptyPurchase v-if="filteredOrders.length === 0" />
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @detail="goDetail"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { fetchPurchases } from "../../../api/users";
import { userCancelOrder } from "../../../api/orders";
import PurchaseTabs from "../../../components/dashboard/users/PurchaseTabs.vue";
import PurchaseSearch from "../../../components/dashboard/users/PurchaseSearch.vue";
import OrderCard from "../../../components/dashboard/users/OrderCard.vue";
import EmptyPurchase from "../../../components/dashboard/users/EmptyPurchase.vue";
import OrderSkeleton from "../../../components/dashboard/users/OrderSkeleton.vue";

const router = useRouter();
const tabs = [
  { key: "all", label: "All" },
  { key: "to_pay", label: "To Pay" },
  { key: "to_ship", label: "To Ship" },
  { key: "to_receive", label: "To Receive" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const activeTab = ref("all");
const search = ref("");
const loading = ref(false);
const orders = ref([]);

const loadOrders = async () => {
  loading.value = true;
  try {
    const data = await fetchPurchases({ status: activeTab.value });
    orders.value = data.data || data || [];
  } catch {
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const handleCancel = async (id) => {
  if (!confirm("Batalkan order ini? Stok akan dikembalikan.")) return;
  await userCancelOrder(id);
  await loadOrders();
};

const filteredOrders = computed(() => {
  let list =
    activeTab.value === "all"
      ? orders.value
      : orders.value.filter((o) => o.status === activeTab.value);
  if (search.value)
    list = list.filter((o) =>
      o.order_number?.toLowerCase().includes(search.value.toLowerCase()),
    );
  return list;
});

const goDetail = (id) => router.push(`/user/shopping/purchases/${id}`);
onMounted(loadOrders);
watch(activeTab, loadOrders);
</script>
