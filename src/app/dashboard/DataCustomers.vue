<template>
  <div class="p-4 md:p-6 bg-slate-200 min-h-screen">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold p-6">Customers</h1>
    </div>
    <div class="px-2 md:px-6 py-8 bg-slate-100 rounded-2xl shadow-lg">
      <TableCustomers :users="getUsers" />
    </div>
  </div>
</template>
<script setup>
import TableCustomers from "@/components/dashboard/TableCustomers.vue";
import { users } from "../../data/users";

const getUsers = users.filter((u) => u.role === "user");

const userOrdersCount = getUsers.map((u) => ({
  name: u.name,
  totalOrders: u.account.orders.length,
}));

console.log("users :", getUsers);
console.log("order per user :", userOrdersCount);
</script>
