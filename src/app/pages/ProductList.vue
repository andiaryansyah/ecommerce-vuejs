<template>
  <div class="mt-2 bg-gray-50 h-screen">
    <div class="p-8">
      <header class="flex justify-between md:items-center mb-8">
        <h2 class="md:text-3xl text-2xl font-bold text-heading">Products</h2>
        <div class="flex flex-col md:flex-row items-end md:gap-4">
          <!-- CATEGORIES -->
          <div class="flex flex-row items-center gap-2 mb-2 md:mb-0">
            <h2 class="text-sm md:text-lg font-semibold">Categories :</h2>
            <select
              v-model="selectedCategory"
              class="px-1 py-1 md:px-5 md:py-2 text-sm md:text-lg font-semibold rounded-lg border border-secondary focus:border-secondary transition"
            >
              <option value="">-- All --</option>
              <option value="sport">Sport</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <!-- SUB CATEGORIES -->
          <div class="flex flex-row items-center gap-2">
            <h2 class="text-sm md:text-lg font-semibold">Sub Categories :</h2>
            <select
              v-model="selectedSubCategory"
              class="px-1 py-1 md:px-5 md:py-2 text-sm md:text-lg font-semibold rounded-lg border border-secondary active:border-secondary transition"
            >
              <option value="">-- All --</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="running">Running</option>
              <option value="classic">Classic</option>
              <option value="fashion">Fashion</option>
              <option value="outdoor">Outdoor</option>
              <option value="streetwear">Streetwear</option>
            </select>
          </div>
        </div>
      </header>
      <div v-if="!visibleProducts.length">
        <NoData />
      </div>
      <div v-if="visibleProducts.length" class="relative overflow-hidden">
        <ul
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <li
            v-for="product in visibleProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div>
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
            </div>
          </li>
        </ul>

        <div class="flex item-center justify-center gap-4 md:gap-12 p-8 mb-4">
          <button
            @click="prevSlide"
            class="p-2 rounded-full bg-white shadow-md hover:bg-secondary text-primary transition-colors"
            aria-label="Previous slide"
          >
            <Icon icon="line-md:arrow-small-left" width="24" height="24" />
          </button>
          <nav
            class="flex justify-center items-center space-x-2"
            aria-label="Carousel pagination"
          >
            <button
              v-for="slide in visiblePages"
              :key="slide"
              @click="slide !== '...' && (currentSlide = slide - 1)"
              :class="[
                'w-6 h-6 md:w-8 md:h-8 rounded-full text-center pb-0.5 pl-0.5 text-white text-semibold text-sm md:text-lg',
                currentSlide === slide - 1 ? 'bg-secondary' : 'bg-gray-400',
              ]"
            >
              {{ slide }}
            </button>
          </nav>

          <button
            @click="nextSlide"
            class="p-2 rounded-full bg-white shadow-md hover:bg-secondary text-primary transition-colors"
            aria-label="Next slide"
          >
            <Icon icon="line-md:arrow-small-right" width="24" height="24" />
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { products } from "@/data/products.js";
import NoData from "@/components/shared/NoData.vue";
import Footer from "@/components/landingpage/Footer.vue";

const currentSlide = ref(0);
const productsPerPage = ref(4);
const selectedCategory = ref("");
const selectedSubCategory = ref("");

// const fetchProducts = async () => {
//   try {
//     const response = await fetch(
//       `http://localhost:8000/api/products?category=${selectedCategory.value}&subcategory=${selectedSubCategory.value}`
//     );
//     const data = await response.json();
//     products.value = data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//   }
// };

const FilteredProducts = computed(() => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter((product) => {
    const matchCategory =
      selectedCategory.value === "" ||
      product.category === selectedCategory.value;
    const matchSubCategory =
      selectedSubCategory.value === "" ||
      product.subCategory === selectedSubCategory.value;

    return matchCategory && matchSubCategory;
  });
});

watch([selectedCategory, selectedSubCategory], () => {
  currentSlide.value = 0;
});

const totalSlides = computed(() =>
  Math.ceil(FilteredProducts.value.length / productsPerPage.value),
);

const visibleProducts = computed(() => {
  const start = currentSlide.value * productsPerPage.value;
  return FilteredProducts.value.slice(start, start + productsPerPage.value);
});

const visiblePages = computed(() => {
  const pages = [];
  if (totalSlides.value <= 4) {
    for (let i = 1; i <= totalSlides.value; i++) pages.push(i);
  } else {
    if (currentSlide.value <= 2) {
      pages.push(1, 2, 3, "...", totalSlides.value);
    } else if (currentSlide.value >= totalSlides.value - 1) {
      pages.push(
        1,
        "...",
        totalSlides.value - 2,
        totalSlides.value - 1,
        totalSlides.value,
      );
    } else {
      pages.push(
        1,
        "...",
        currentSlide.value,
        currentSlide.value + 1,
        "...",
        totalSlides.value,
      );
    }
  }
  return pages;
});

const nextSlide = () => {
  currentSlide.value =
    currentSlide.value === totalSlides.value - 1 ? 0 : currentSlide.value + 1;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleResize = () => {
  if (window.innerWidth < 640) {
    productsPerPage.value = 4;
    currentSlide.value = 0;
  } else if (window.innerWidth < 768) {
    productsPerPage.value = 4;
    currentSlide.value = 0;
  } else if (window.innerWidth < 1024) {
    productsPerPage.value = 6;
    currentSlide.value = 0;
  } else {
    productsPerPage.value = 8;
    currentSlide.value = 0;
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
