<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-5 shadow-lg"
  >
    <div class="flex flex-col md:flex-row justify-between gap-2">
      <p class="font-bold text-2xl">Recent Orders</p>
      <div class="flex items-start gap-2">
        <button
          class="flex items-center gap-2 border rounded px-4 py-2 cursor-pointer"
        >
          <Icon icon="akar-icons:settings-horizontal" />
          <p class="text-xs md:text-sm">Filter</p>
        </button>
        <button class="text-xs md:text-sm border rounded p-2 cursor-pointer">
          See All
        </button>
      </div>
    </div>
    <div class="py-4">
      <table class="w-full text-left">
        <thead>
          <tr
            class="border-b border-gray-700 text-primary text-center text-sm md:text-base"
          >
            <th class="text-start py-2">Products</th>
            <th class="py-2">Category</th>
            <th class="py-2">Price</th>
            <th class="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in orders"
            :key="index"
            class="border-b border-gray-800 hover:bg-gray-800/40 transition text-center"
          >
            <td
              class="py-3 flex items-center gap-3 text-start text-xs md:text-sm"
            >
              <img
                :src="item.image"
                alt="product"
                class="w-12 h-12 rounded-lg bg-white p-1"
              />
              <p class="font-semibold">{{ item.name }}</p>
            </td>
            <td class="py-3 text-primary capitalize text-xs md:text-sm">
              <p>{{ item.category }}</p>
              <p>{{ item.subCategory }}</p>
            </td>
            <td class="py-3 text-primary text-xs md:text-sm">
              <p class="font-semibold">
                ${{ (item.price * (1 - item.discount / 100)).toFixed(2) }}
              </p>
              <p
                v-if="item.discount > 0"
                class="text-gray-500 line-through ml-2"
              >
                ${{ item.price.toFixed(2) }}
              </p>
            </td>
            <td class="py-3 text-xs md:text-sm">
              <span
                :class="[
                  'px-3 py-1 rounded-full font-semibold',
                  item.status === 'Delivered'
                    ? 'bg-emerald-600 text-white'
                    : item.status === 'Pending'
                      ? 'bg-orange-600 text-white'
                      : 'bg-red-700 text-white',
                ]"
              >
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  orders: Array,
  required: true,
});

// import { ref, onMounted } from "vue";
// import axios from "axios";

// const orders = ref([]);
// const loading = ref(true);

// onMounted(async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/api/orders");
//     orders.value = response.data; // pastikan API mengembalikan array of orders
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//   } finally {
//     loading.value = false;
//   }
// });
</script>
