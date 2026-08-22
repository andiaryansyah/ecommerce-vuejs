<template>
  <div
    id="about"
    class="min-h-screen scroll-mt-20 bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-12 mb-20">
        <!-- Image Section -->
        <div class="lg:w-1/2">
          <div class="relative rounded-2xl overflow-hidden h-96 shadow-xl">
            <img
              :src="product"
              alt="Luxury Perfumes"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-50"
            ></div>
            <div class="absolute bottom-0 left-0 p-6 text-white">
              <h3 class="text-2xl font-bold">Since 2021</h3>
              <p class="mt-2">Designing footwear with passion</p>
            </div>
          </div>
        </div>

        <!-- Text Content -->
        <div class="lg:w-1/2 flex flex-col justify-center">
          <h2 class="text-4xl font-bold text-primary mb-6">About Us</h2>
          <p class="text-lg text-gray-600 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            inventore, nemo explicabo molestiae sint non sequi illo, saepe ut
            est odio corporis, quae ea! Sint odit consequuntur illum saepe
            obcaecati.
          </p>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div
              class="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <h4 class="font font-semibold text-secondary">500+</h4>
              <p class="text-gray-600">Unique designs</p>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <h4 class="font font-semibold text-secondary">50+</h4>
              <p class="text-gray-600">Countries worldwide</p>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <h4 class="font font-semibold text-secondary">100+</h4>
              <p class="text-gray-600">Customer satisfaction</p>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <h4 class="font font-semibold text-secondary">24/7</h4>
              <p class="text-gray-600">Customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { product } from "../assets";
</script>
