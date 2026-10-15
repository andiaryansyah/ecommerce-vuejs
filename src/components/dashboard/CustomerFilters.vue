<template>
  <div
    class="p-4 flex flex-col md:flex-row gap-3 items-center justify-between border-b border-gray-100"
  >
    <div class="relative w-full md:w-72">
      <input
        v-model="searchModel"
        type="text"
        placeholder="Search name or email..."
        class="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <span class="absolute left-3 top-2.5 text-gray-400">⌕</span>
    </div>
    <div class="flex gap-2 w-full md:w-auto">
      <select
        v-model="filterModel"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white"
      >
        <option value="">All Customers</option>
        <option value="active">Active (has orders)</option>
        <option value="inactive">Inactive</option>
        <option value="new">New (7 days)</option>
      </select>
      <input
        v-model="dateModel"
        type="date"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ search: String, filter: String, date: String });
const emit = defineEmits(["update:search", "update:filter", "update:date"]);

const searchModel = computed({
  get: () => props.search,
  set: (v) => emit("update:search", v),
});
const filterModel = computed({
  get: () => props.filter,
  set: (v) => emit("update:filter", v),
});
const dateModel = computed({
  get: () => props.date,
  set: (v) => emit("update:date", v),
});
</script>
