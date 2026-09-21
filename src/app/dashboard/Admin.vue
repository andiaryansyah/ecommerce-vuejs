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
      <RevenueChart />
      <RecentOrders :orders="orders" />
    </div>
  </div>
</template>
<script setup>
import Card from "@/components/dashboard/Card.vue";
import RevenueChart from "@/components/dashboard/RevenueChart.vue";
import RecentOrders from "../../components/dashboard/RecentOrders.vue";
import { orders } from "../../data/orders.js";

const cardDatas = [
  {
    title: "revenue",
    value: 48223,
    change: "12.5",
    changeType: "increase",
    comparison: "vs last month",
    icon: "iconmind:revenue-duotone-bold",
  },
  {
    title: "users",
    value: 12874,
    change: "8.2",
    changeType: "increase",
    comparison: "vs last month",
    icon: "carbon:user-multiple",
  },
  {
    title: "orders",
    value: 1200,
    change: "4.1",
    changeType: "decrease",
    comparison: "vs last month",
    icon: "carbon:order-server",
  },
  {
    title: "views",
    value: 224000,
    change: "22.4",
    changeType: "increase",
    comparison: "vs last month",
    icon: "carbon:view",
  },
];

function formatNumber(value) {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(0) + "K";
  } else {
    return value.toString();
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
  })
    .format(value)
    .replace("US$", "$");
}

function formattedValue(title, value) {
  switch (title) {
    case "revenue":
      return formatCurrency(value);
    case "views":
      return formatNumber(value);
    default:
      return value.toString();
  }
}
</script>
