<template>
  <div
    class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 justify-between"
  >
    <div class="flex items-center gap-3 flex-1">
      <div class="relative flex-1 max-w-sm">
        <Icon
          icon="lucide:search"
          class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="Search order ID, customer..."
          class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <select
        :value="status"
        @change="$emit('update:status', $event.target.value)"
        class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="canceled">Canceled</option>
        <option value="failed">Failed</option>
        <option value="expired">Expired</option>
      </select>
    </div>
    <input
      type="date"
      :value="date"
      @change="$emit('update:date', $event.target.value)"
      class="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
    />
  </div>
</template>

<script setup>
defineProps({ search: String, status: String, date: String });
defineEmits(["update:search", "update:status", "update:date"]);
</script>
