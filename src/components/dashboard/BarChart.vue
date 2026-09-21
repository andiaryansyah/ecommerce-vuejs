<template>
  <div class="rounded-xl md:p-6 text-white">
    <h2 class="text-xl font-bold mb-4">Revenue Chart</h2>
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
import { ref, watch, toRef, nextTick } from "vue";

const props = defineProps({
  selected: {
    type: String,
    required: true,
  },
});

const selected = toRef(props, "selected");
const chartRef = ref(null);

const datasets = {
  Monthly: [150, 370, 190, 280, 170, 180, 290, 90, 200, 370, 270],
  Weekly: [40, 60, 80, 100, 120, 90, 70],
  Daily: [10, 20, 15, 25, 30, 18, 22],
};

const series = ref([
  {
    name: "Revenue",
    data: datasets[selected.value],
  },
]);

const chartOptions = ref({
  chart: {
    type: "bar",
    toolbar: { show: false },
    background: "transparent",
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "50%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    labels: { style: { colors: "#94a3b8" } },
  },
  yaxis: {
    labels: { style: { colors: "#94a3b8" } },
  },
  grid: { borderColor: "#1e293b" },
  colors: ["#172033"],
});

// update chart saat toggle berubah
watch(selected, async (newVal) => {
  series.value = [
    {
      name: "Revenue",
      data: datasets[newVal],
    },
  ];

  let newCategories = [];
  if (newVal === "Weekly") {
    newCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else {
    newCategories = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ];
  }

  await nextTick();

  chartRef.value?.updateOptions({
    xaxis: { categories: newCategories },
  });
});
</script>
