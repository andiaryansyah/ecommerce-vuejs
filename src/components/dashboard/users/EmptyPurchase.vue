<template>
  <div
    class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
  >
    <div
      class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-3xl"
    >
      📦
    </div>
    <h3 class="mt-4 font-bold text-gray-900">No orders found</h3>
    <p class="text-sm text-gray-500 mt-1">Belum ada pesanan di status ini</p>
    <router-link
      to="/"
      class="mt-6 inline-block px-6 py-2.5 bg-[#1a2332] text-white rounded-xl text-sm font-medium hover:bg-black transition"
    >
      Belanja Sekarang
    </router-link>
  </div>
</template>
