<template>
  <div class="flex flex-col items-start justify-start m-10">
    <nav class="text-sm text-gray-600">
      <a href="/" class="text-blue-900 hover:underline">Home</a> >
      <a href="/products" class="text-blue-900 hover:underline">Product List</a>
      >
      <span class="font-medium text-gray-800">
        {{ product?.name }}
      </span>
    </nav>
  </div>
  <div class="flex flex-col md:flex-row m-10 mt-15 gap-12">
    <div class="flex flex-col items-center gap-5">
      <img
        :src="product?.image[index]"
        :alt="product?.name"
        class="w-100 md:w-130 md:h-auto rounded-[15px] bg-[#ebebeb] cursor-pointer transition ease-in-out duration-300 hover:bg-[#f02d34]"
      />
      <div class="flex gap-2.5 mt-5">
        <img
          v-for="(item, i) in product?.image"
          :key="i"
          :src="item"
          :class="
            i === index
              ? 'w-17.5 h-17.5 rounded-lg bg-[#f02d34] cursor-pointer transition ease-in-out duration-300'
              : 'w-17.5 h-17.5 rounded-lg bg-[#ebebeb] cursor-pointer transition ease-in-out duration-300 hover:bg-[#f02d34]'
          "
          @click="index = i"
        />
      </div>
    </div>
    <div class="flex flex-col md:mt-2">
      <h1 class="text-2xl md:text-3xl font-bold">{{ product?.name }}</h1>

      <div class="flex items-center gap-1 mt-2">
        <div class="flex items-center mb-2">
          <Icon
            v-for="i in 5"
            :key="i"
            icon="line-md:star"
            width="24"
            height="24"
            :class="
              i <= Math.floor(product.rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            "
          />
          <span class="text-base text-gray-500 ml-1"
            >({{ product?.rating }})</span
          >
        </div>
      </div>

      <div class="flex flex-col md:flex-row items-center gap-2 my-4">
        <h4 class="text-lg font-semibold md:mr-12">Disc</h4>
        <p class="bg-red-200 text-red-600 px-4 py-1">
          {{ product?.discount }}% OFF
        </p>
      </div>

      <div class="flex flex-col md:flex-row items-start gap-2 my-4">
        <h4 class="mt-2 text-lg font-semibold md:mr-7">Details</h4>
        <p class="md:mt-2 w-auto md:w-100 text-justify">
          {{ product?.description }}
        </p>
      </div>

      <div class="flex flex-col md:flex-row items-start md:items-center my-4">
        <h3 class="text-lg font-semibold md:mr-14">Size</h3>
        <div class="flex gap-2 flex-wrap mt-2">
          <button
            v-for="(size, i) in sizes"
            :key="i"
            @click="selected = i"
            :class="[
              'border border-gray-400 px-4 py-2 cursor-pointer transition-colors duration-200',
              selected === i ? 'bg-primary text-white' : 'hover:bg-gray-200',
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-5 mt-2"
      >
        <h3 class="text-lg font-semibold">Quantity</h3>
        <p class="flex border border-gray-400">
          <span
            class="px-4 py-1 border-r border-gray-400 text-primary cursor-pointer hover:bg-gray-200"
            @click="decQty"
            >-</span
          >
          <span class="px-4 py-1 border-r border-gray-400 text-xl">{{
            qty
          }}</span>
          <span
            class="px-4 py-1 cursor-pointer hover:bg-gray-200"
            @click="incQty"
            >+</span
          >
        </p>
      </div>

      <div class="mt-7 text-3xl">
        <span class="font-bold text-secondary"
          >${{
            (product.price * (1 - product.discount / 100)).toFixed(2)
          }}</span
        >
        <span
          v-if="product.discount > 0"
          class="text-gray-500 line-through ml-2 font-semibold"
          >${{ product.price.toFixed(2) }}</span
        >
      </div>

      <div class="flex gap-7">
        <button
          class="flex items-center gap-2 w-50 px-3 py-2 md:px-5 border border-secondary text-secondary hover:bg-summer font-medium text-sm md:text-lg mt-10 transition transform hover:scale-110"
        >
          <Icon icon="icon-park-solid:shopping" width="18" height="18" />
          Add to Cart
        </button>
        <button
          class="flex flex-col w-50 py-2 px-5 bg-primary hover:bg-primary-hover text-white font-medium text-sm md:text-lg mt-10 transition transform hover:scale-110"
        >
          Buy Now
          <span class="font-bold text-base md:text-xl" v-if="qty > 1"
            >${{ (discountedPrice * qty).toFixed(2) }}</span
          >
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>
<script setup>
import { useRoute } from "vue-router";
import { products } from "../../data/products.js";
import { ref, computed } from "vue";
import Footer from "../../components/landingpage/Footer.vue";

const route = useRoute();
const slug = route.params.slug;

const product = products.find((p) => p.slug === slug);
const sizes = [39, 40, 41, 42, 43];

const index = ref(0);
const selected = ref(null);
const qty = ref(1);

const decQty = () => {
  if (qty.value > 1) {
    qty.value--;
  }
};

const incQty = () => {
  qty.value++;
};

const discountedPrice = computed(() => {
  return product.price * (1 - product.discount / 100);
});
</script>
