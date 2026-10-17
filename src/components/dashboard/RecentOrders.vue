<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-5 shadow-lg"
  >
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2"
    >
      <p class="font-bold text-2xl">Recent Orders</p>
      <div class="flex items-start gap-2 relative">
        <button
          @click="showFilter = !showFilter"
          class="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
        >
          <Icon icon="akar-icons:settings-horizontal" class="w-4 h-4" />
          <p class="text-xs md:text-sm capitalize">
            Filter: {{ activeFilter }}
          </p>
        </button>
        <div
          v-if="showFilter"
          class="absolute top-11 right-20 z-20 bg-white border border-gray-200 rounded-xl shadow-xl py-1 w-36 overflow-hidden"
        >
          <button
            v-for="f in filters"
            :key="f"
            @click="
              activeFilter = f;
              showFilter = false;
            "
            class="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 capitalize transition"
          >
            {{ f }}
          </button>
        </div>
        <button
          @click="$router.push('/orders')"
          class="text-xs md:text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
        >
          See All
        </button>
      </div>
    </div>

    <div class="py-2 overflow-x-auto -mx-6 px-6">
      <div v-if="loading" class="w-full min-w-140">
        <div class="border-b border-gray-200 py-3 flex gap-2">
          <div class="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-3 w-20 bg-gray-100 rounded animate-pulse ml-auto"></div>
          <div class="h-3 w-12 bg-gray-100 rounded animate-pulse"></div>
          <div class="h-3 w-12 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div
          v-for="i in 5"
          :key="i"
          class="py-4 px-2 flex items-center gap-3.5 border-b border-gray-100 animate-pulse"
        >
          <div class="w-11 h-11 rounded-xl bg-gray-200 shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 w-32 bg-gray-200 rounded"></div>
            <div class="h-2 w-12 bg-gray-100 rounded"></div>
          </div>
          <div class="h-3 w-16 bg-gray-100 rounded"></div>
          <div class="h-3 w-20 bg-gray-200 rounded"></div>
          <div class="h-5 w-19.5 bg-gray-200 rounded-full ml-4"></div>
        </div>
      </div>

      <table v-else class="w-full text-left min-w-120">
        <thead>
          <tr
            class="border-b border-gray-200 text-gray-500 text-center text-xs md:text-sm font-medium"
          >
            <th class="text-start py-3 px-2 font-semibold">Products</th>
            <th class="py-3 px-2 font-semibold">Category</th>
            <th class="py-3 px-2 font-semibold">Price</th>
            <th class="py-3 px-2 font-semibold text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="4" class="py-10 text-center text-sm text-gray-400">
              No {{ activeFilter }} orders
            </td>
          </tr>
          <tr
            v-for="item in filteredOrders"
            :key="item.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition text-center group"
          >
            <td class="py-4 px-2 flex items-center gap-3.5 text-start">
              <img
                :src="item.image"
                alt="product"
                class="w-11 h-11 rounded-xl bg-gray-50 object-cover border border-gray-100 shrink-0"
              />
              <div class="min-w-0">
                <p
                  class="font-semibold text-sm text-gray-900 truncate max-w-35 leading-tight"
                >
                  {{ item.name }}
                </p>
                <p class="text-[11px] text-gray-400 mt-0.5">
                  #{{ item.rawId }}
                </p>
              </div>
            </td>
            <td class="py-4 px-2 text-xs md:text-sm">
              <p class="font-medium text-gray-700 capitalize leading-tight">
                {{ item.category }}
              </p>
              <p class="text-[11px] text-gray-400 capitalize mt-0.5">
                {{ item.subCategory }}
              </p>
            </td>
            <td class="py-4 px-2 text-xs md:text-sm">
              <p class="font-semibold text-gray-900 whitespace-nowrap">
                Rp {{ Number(item.price).toLocaleString("id-ID") }}
              </p>
            </td>
            <td class="py-4 px-2 text-center">
              <span
                :class="[
                  'inline-flex justify-center min-w-19.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold capitalize leading-none',
                  item.status === 'paid' || item.status === 'Delivered'
                    ? 'bg-emerald-200 text-emerald-700 border border-emerald-300'
                    : item.status === 'pending' || item.status === 'Pending'
                      ? 'bg-orange-200 text-orange-700 border border-orange-300'
                      : 'bg-red-200 text-red-700 border border-red-300',
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
import { ref, computed } from "vue";
const props = defineProps({
  orders: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});
const activeFilter = ref("all");
const showFilter = ref(false);
const filters = ["all", "paid", "pending", "canceled"];
const mappedOrders = computed(() => {
  return props.orders.map((order) => ({
    id: order.id,
    rawId: String(order.id).slice(0, 8),
    image:
      order.items?.[0]?.image ||
      order.product_image ||
      `https://placehold.co/100?text=${order.id}`,
    name:
      order.items?.[0]?.name ||
      order.customer_name ||
      `Order ${String(order.id).slice(0, 4)}`,
    category: order.items?.[0]?.category || order.payment_method || "order",
    subCategory: order.items?.[0]?.sub_category || order.status,
    price: order.total_price || 0,
    status: order.status || "pending",
  }));
});
const filteredOrders = computed(() => {
  if (activeFilter.value === "all") return mappedOrders.value;
  return mappedOrders.value.filter((i) => i.status === activeFilter.value);
});
</script>
