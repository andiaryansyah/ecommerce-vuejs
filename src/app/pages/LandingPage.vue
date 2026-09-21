<template>
  <div>
    <Header />
    <Hero />
    <Products />
    <Categories />
    <Offers />
    <About />
    <Contact />
    <Footer />
  </div>
</template>
<script setup>
import Hero from "@/components/landingpage/Hero.vue";
import Products from "@/components/landingpage/Products.vue";
import Categories from "@/components/landingpage/Categories.vue";
import Offers from "@/components/landingpage/Offers.vue";
import About from "@/components/landingpage/About.vue";
import Contact from "@/components/landingpage/Contact.vue";
import Footer from "@/components/landingpage/Footer.vue";
import Header from "@/components/shared/Header.vue";
</script>
