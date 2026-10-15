<template>
  <div class="rounded-xl md:p-6 text-white">
    <VueApexCharts
      ref="chartRef"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
import { ref, computed, watch, toRef, nextTick } from "vue";

const props = defineProps({
  selected: { type: String, required: true },
  orders: { type: Array, default: () => [] },
});

const selected = toRef(props, "selected");
const chartRef = ref(null);

function formatIDRShort(val) {
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
  if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}rb`;
  if (val === 0) return `Rp 0`;
  return `Rp ${val}`;
}

const weeklyData = computed(() => {
  const paid = props.orders.filter((o) => o.status === "paid");
  const days = Array(7).fill(0);
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  paid.forEach((o) => {
    const od = new Date(o.created_at);
    od.setHours(0, 0, 0, 0);
    const idx = dates.findIndex((ld) => ld.getTime() === od.getTime());
    if (idx !== -1) days[idx] += Number(o.total_price);
  });
  return days;
});

const monthlyData = computed(() => {
  const paid = props.orders.filter((o) => o.status === "paid");
  const months = Array(11).fill(0);
  const now = new Date();
  paid.forEach((o) => {
    const d = new Date(o.created_at);
    // ambil 11 bulan terakhir biar chart gak kosong
    const diff =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth());
    if (diff >= 0 && diff < 11) {
      months[10 - diff] += Number(o.total_price);
    }
  });
  return months;
});

const series = computed(() => [
  {
    name: "Revenue",
    data: selected.value === "Weekly" ? weeklyData.value : monthlyData.value,
  },
]);

const categories = computed(() => {
  if (selected.value === "Weekly") {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    });
  }
  const now = new Date();
  return Array.from({ length: 11 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (10 - i), 1);
    return d.toLocaleDateString("id-ID", { month: "short" });
  });
});

const chartOptions = ref({
  chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
  plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: categories.value,
    labels: { style: { colors: "#94a3b8" } },
  },
  yaxis: {
    labels: {
      style: { colors: "#94a3b8" },
      formatter: (val) => formatIDRShort(val),
    },
  },
  grid: { borderColor: "#e5e7eb" },
  colors: ["#172033"],
  tooltip: {
    y: {
      formatter: (val) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(val),
    },
  },
  noData: { text: "Belum ada revenue minggu ini" },
});

watch(categories, async (newCats) => {
  await nextTick();
  chartRef.value?.updateOptions({ xaxis: { categories: newCats } });
});
</script>
