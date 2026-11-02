<template>
  <div>
    <Navbar
      :isLoggedIn="!!auth.token"
      :user="auth.user"
      :cartCount="cartItems.length"
      :wishlistCount="wishlistStore.count"
      @wishlist="handleWishlist"
      @cart="showCartDrawer = true"
      @logout="handleLogout"
    />
    <Hero />
    <Products :products="featuredProducts" @add-to-cart="handleAddToCart" />
    <Categories />
    <Offers />
    <About />
    <Contact />
    <Footer />
  </div>
  <Cart
    :cartItems="cartItems"
    :showCartDrawer="showCartDrawer"
    @closeCart="showCartDrawer = false"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useWishlistStore } from "@/stores/wishlist.js";
import { cartByUser } from "@/api/cart.js";
import { getProducts } from "@/api/products.js";

import Hero from "@/components/landingpage/Hero.vue";
import Products from "@/components/landingpage/Products.vue";
import Categories from "@/components/landingpage/Categories.vue";
import Offers from "@/components/landingpage/Offers.vue";
import About from "@/components/landingpage/About.vue";
import Contact from "@/components/landingpage/Contact.vue";
import Footer from "@/components/landingpage/Footer.vue";
import Cart from "@/components/shared/Cart.vue";
import Navbar from "@/components/shared/Navbar.vue";

const router = useRouter();
const auth = useAuthStore();
const wishlistStore = useWishlistStore();

const cartItems = ref([]);
const showCartDrawer = ref(false);
const featuredProducts = ref([]);

const fetchCart = async () => {
  if (!auth.token) {
    cartItems.value = [];
    return;
  }
  try {
    const result = await cartByUser.getAll();
    cartItems.value = result.items || [];
  } catch {
    cartItems.value = [];
  }
};

const fetchFeaturedProducts = async () => {
  try {
    const res = await getProducts();
    const raw = Array.isArray(res) ? res : res.data || [];
    featuredProducts.value = raw.slice(0, 8).map((p) => ({
      ...p,
      price: Number(p.price),
      image_url: p.image_url || p.image || "/placeholder.png",
      rating: Number(p.rating || 5),
    }));
  } catch (e) {
    console.error(e);
  }
};

const handleWishlist = () => {
  if (!auth.token) return router.push("/login");
  router.push("/user/shopping/wishlist");
};
const handleAddToCart = async (product) => {
  if (!auth.token) return router.push("/login");
  await cartByUser.add(product.id, 1);
  await fetchCart();
  showCartDrawer.value = true;
};
const handleLogout = async () => {
  await auth.logout();
  cartItems.value = [];
  router.push("/login");
};

onMounted(() => {
  fetchCart();
  wishlistStore.fetch(true);
  fetchFeaturedProducts();
});
</script>
