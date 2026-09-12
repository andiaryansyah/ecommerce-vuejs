<template>
  <section id="categories" class="py-16 scroll-mt-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-heading">
          Explore Our Shoes Collections
        </h2>
        <p class="text-gray-800 max-w-2xl mx-auto">
          Discover Our Stylish Footwear
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div class="h-64 overflow-hidden">
            <img
              :src="category.image"
              :alt="category.alt"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div
            class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
          >
            <div class="absolute bottom-0 left-0 p-6">
              <h3 class="text-xl font-semibold text-white">
                {{ category.title }}
              </h3>
              <p class="text-gray-200 mt-1">{{ category.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from "vue";
import {
  product8,
  product9,
  product10,
  product11,
  product12,
  product13,
  product14,
} from "../../assets/index.js";

const categories = ref([
  {
    title: "Lifestyle",
    description:
      "Casual shoes for everyday activities, featuring a comfortable and modern design",
    image: product8,
    alt: "Lifestyle",
  },
  {
    title: "Running",
    description:
      "Lightweight and responsive shoes for peak performance while running or working out.",
    image: product9,
    alt: "Running",
  },
  {
    title: "Classic",
    description:
      "Timeless models with simple designs that remain elegant in any situation.",
    image: product10,
    alt: "Classic",
  },
  {
    title: "Fashion",
    description:
      "Trendy shoes with a contemporary design touch to complete your look.",
    image: product11,
    alt: "Fashion",
  },
  {
    title: "Outdoor",
    description:
      "Rugged, highly durable shoes suitable for outdoor activities and adventures.",
    image: product12,
    alt: "Outdoor",
  },
  {
    title: "Streetwear",
    description:
      "Urban-style shoes that reflect a free and expressive character on city streets.",
    image: product13,
    alt: "Streetwear",
  },
]);

console.log("categories:", categories);
</script>
