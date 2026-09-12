<template>
  <section class="py-12 scroll-mt-20 bg-gray-50" id="products">
    <main class="container mx-auto px-4">
      <header class="flex justify-between items-center mb-8">
        <div
          class="flex flex-col md:flex-row md:items-center items-start space-x-4"
        >
          <h2 class="md:text-3xl text-2xl font-bold text-heading">
            Featured Products
          </h2>
          <RouterLink
            to="/products"
            class="md:text-xl text-sm font-semibold text-secondary hover:text-secondary-hover transition md:mt-1"
          >
            View All →
          </RouterLink>
        </div>
        <nav class="flex space-x-4" aria-label="Product carousel controls">
          <button
            @click="prevSlide"
            class="p-2 rounded-full bg-white shadow-md hover:bg-secondary text-primary transition-colors"
            aria-label="Previous slide"
          >
            <Icon icon="line-md:arrow-small-left" width="24" height="24" />
          </button>
          <button
            @click="nextSlide"
            class="p-2 rounded-full bg-white shadow-md hover:bg-secondary text-primary transition-colors"
            aria-label="Next slide"
          >
            <Icon icon="line-md:arrow-small-right" width="24" height="24" />
          </button>
        </nav>
      </header>

      <section class="relative overflow-hidden">
        <ul
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <li
            v-for="product in visibleProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <article>
              <figure class="relative">
                <router-link :to="`/products/${product.slug}`">
                  <img
                    :src="product.image[0]"
                    :alt="product.name"
                    class="w-full h-64 object-cover"
                  />
                </router-link>
                <figcaption
                  v-if="product.discount > 0"
                  class="absolute top-3 right-3 bg-danger text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  -{{ product.discount }}%
                </figcaption>

                <button
                  class="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-secondary text-primary"
                  aria-label="Add to wishlist"
                >
                  <Icon icon="line-md:heart" width="18" height="18" />
                </button>
              </figure>

              <section class="p-4">
                <div class="flex items-center mb-2">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    icon="line-md:star"
                    width="16"
                    height="16"
                    :class="
                      i <= Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                  />
                  <span class="text-sm text-gray-500 ml-1"
                    >({{ product.rating }})</span
                  >
                </div>
                <h3 class="text-lg font-semibold text-heading mb-1">
                  {{ product.name }}
                </h3>
                <footer class="flex items-center justify-between">
                  <div>
                    <span class="text-lg font-bold text-secondary"
                      >${{
                        (product.price * (1 - product.discount / 100)).toFixed(
                          2,
                        )
                      }}</span
                    >
                    <span
                      v-if="product.discount > 0"
                      class="text-sm text-gray-500 line-through ml-2"
                      >${{ product.price.toFixed(2) }}</span
                    >
                  </div>
                  <button
                    class="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
                    aria-label="Add to cart"
                  >
                    <Icon
                      icon="icon-park-solid:shopping"
                      width="18"
                      height="18"
                    />
                  </button>
                </footer>
              </section>
            </article>
          </li>
        </ul>
      </section>

      <nav
        class="flex justify-center mt-6 space-x-2"
        aria-label="Carousel pagination"
      >
        <button
          v-for="index in totalSlides"
          :key="index"
          @click="currentSlide = index - 1"
          :class="[
            'w-3 h-3 rounded-full',
            currentSlide === index - 1 ? 'bg-secondary' : 'bg-gray-400',
          ]"
        />
      </nav>
    </main>
  </section>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { products } from "../../data/products.js";

const currentSlide = ref(0);
const productsPerPage = ref(4);

const limitedProducts = products.slice(0, 8);

const totalSlides = computed(() =>
  Math.ceil(limitedProducts.length / productsPerPage.value),
);

const visibleProducts = computed(() => {
  const start = currentSlide.value * productsPerPage.value;
  return limitedProducts.slice(start, start + productsPerPage.value);
});

const nextSlide = () => {
  currentSlide.value =
    currentSlide.value === totalSlides.value - 1 ? 0 : currentSlide.value + 1;
};

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1;
};

const handleResize = () => {
  if (window.innerWidth < 640) {
    productsPerPage.value = 1;
  } else if (window.innerWidth < 768) {
    productsPerPage.value = 2;
  } else if (window.innerWidth < 1024) {
    productsPerPage.value = 3;
  } else {
    productsPerPage.value = 4;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
