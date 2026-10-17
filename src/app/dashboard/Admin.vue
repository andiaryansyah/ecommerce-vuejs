<template>
  <div class="p-4 md:p-6 bg-slate-200 min-h-screen">
    <div
      class="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#0B132B] to-[#1C2541] md:p-6 text-white shadow-lg"
    >
      <div class="relative p-8">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p class="mt-1 text-sm text-white/70">
          Here's what's happening with your product today.
        </p>
        <div class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card
            v-for="(data, index) in cardDatas"
            :key="index"
            :title="data.title"
            :value="formattedValue(data.title, data.value)"
            :change="data.change"
            :changeType="data.changeType"
            :comparison="data.comparison"
            :icon="data.icon"
          />
        </div>
      </div>
    </div>
    <div class="py-6 grid grid-cols-1 xl:grid-cols-2 gap-2">
      <RevenueChart :orders="allOrders" :loading="isLoading" />
      <RecentOrders :orders="recentOrders" :loading="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Card from "@/components/dashboard/Card.vue";
import RevenueChart from "@/components/dashboard/RevenueChart.vue";
import RecentOrders from "../../components/dashboard/RecentOrders.vue";
import { fetchOrders } from "@/api/orders.js";
import { fetchCustomers } from "@/api/users.js";

const allOrders = ref([]);
const allUsers = ref([]);
const recentOrders = ref([]);
const isLoading = ref(true);

function calcOrdersStats(all) {
  /* fungsi kamu yang lama, biarkan sama */
  const paidOrders = all.filter((o) => o.status === "paid");
  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + Number(o.total_price),
    0,
  );
  const totalOrders = all.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const thisMonthOrders = all.filter((o) => {
    const d = new Date(o.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const lastMonthOrders = all.filter((o) => {
    const d = new Date(o.created_at);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  });
  const thisMonthRevenue = thisMonthOrders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + Number(o.total_price), 0);
  const lastMonthRevenue = lastMonthOrders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + Number(o.total_price), 0);
  const revenueChange =
    lastMonthRevenue === 0
      ? 0
      : (
          ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
          100
        ).toFixed(1);
  const ordersChange =
    lastMonthOrders.length === 0
      ? 0
      : (
          ((thisMonthOrders.length - lastMonthOrders.length) /
            lastMonthOrders.length) *
          100
        ).toFixed(1);
  const thisMonthAOV =
    thisMonthOrders.length > 0 ? thisMonthRevenue / thisMonthOrders.length : 0;
  const lastMonthAOV =
    lastMonthOrders.length > 0 ? lastMonthRevenue / lastMonthOrders.length : 0;
  const aovChange =
    lastMonthAOV === 0
      ? 0
      : (((thisMonthAOV - lastMonthAOV) / lastMonthAOV) * 100).toFixed(1);
  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    revenueChange,
    ordersChange,
    aovChange,
  };
}
function calcUsersStats(all) {
  const totalUsers = all.length;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const thisMonthUsers = all.filter((u) => {
    const d = new Date(u.created_at || u.joined_at || u.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const lastMonthUsers = all.filter((u) => {
    const d = new Date(u.created_at || u.joined_at || u.createdAt);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  });
  const usersChange =
    lastMonthUsers.length === 0
      ? 0
      : (
          ((thisMonthUsers.length - lastMonthUsers.length) /
            lastMonthUsers.length) *
          100
        ).toFixed(1);
  return { totalUsers, thisMonthNew: thisMonthUsers.length, usersChange };
}

// INI YANG KAMU MAU: jadi computed, default 0 pas masih loading
const cardDatas = computed(() => {
  const {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    revenueChange,
    ordersChange,
    aovChange,
  } = calcOrdersStats(allOrders.value);
  const { totalUsers, thisMonthNew, usersChange } = calcUsersStats(
    allUsers.value,
  );
  return [
    {
      title: "revenue",
      value: totalRevenue,
      change: revenueChange,
      changeType: Number(revenueChange) >= 0 ? "increase" : "decrease",
      comparison: "vs last month",
      icon: "iconmind:revenue-duotone-bold",
    },
    {
      title: "users",
      value: totalUsers,
      change: usersChange,
      changeType: Number(usersChange) >= 0 ? "increase" : "decrease",
      comparison: `${thisMonthNew} new this month`,
      icon: "carbon:user-multiple",
    },
    {
      title: "orders",
      value: totalOrders,
      change: ordersChange,
      changeType: Number(ordersChange) >= 0 ? "increase" : "decrease",
      comparison: "vs last month",
      icon: "carbon:order-server",
    },
    {
      title: "avg_order",
      value: avgOrderValue,
      change: aovChange,
      changeType: Number(aovChange) >= 0 ? "increase" : "decrease",
      comparison: "per order",
      icon: "carbon:analytics",
    },
  ];
});

onMounted(async () => {
  isLoading.value = true;
  try {
    const [ordersRes, customersRes] = await Promise.all([
      fetchOrders({ page: 1 }),
      fetchCustomers({ page: 1 }),
    ]);
    const all = ordersRes.data || ordersRes || [];
    allUsers.value =
      customersRes.data || customersRes.users || customersRes || [];
    allOrders.value = all;
    recentOrders.value = [...all]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    console.log("recent orders :", recentOrders.value);
  } finally {
    isLoading.value = false;
  }
});

function formatCurrency(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(v || 0);
}
function formattedValue(title, value) {
  if (title === "revenue" || title === "avg_order")
    return formatCurrency(value);
  return (value || 0).toString();
}
</script>
