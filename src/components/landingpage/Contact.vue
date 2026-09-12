<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <div
    id="contact"
    class="min-h-screen scroll-mt-20 contact-section py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <div>
          <h1 class="text-4xl font-serif font-bold text-background mb-4">
            Contact Us
          </h1>
        </div>
        <p class="text-lg text-slate-300 max-w-2xl mx-auto">
          Have questions about our products or orders? Our team is here to help.
          you.
        </p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div
          class="bg-surface p-8 rounded-lg shadow-xl border border-paleSilver hover:border-border-hover"
        >
          <h2 class="text-2xl font-serif font-semibold text-primary mb-6">
            Send Us Message
          </h2>
          <form class="space-y-6">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-primary mb-1"
                >Your Name</label
              >
              <input
                type="text"
                id="name"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-medium text-primary mb-1"
                >Email Address</label
              >
              <input
                type="text"
                id="email"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="email@yahoo.com"
              />
            </div>

            <div>
              <label
                for="message"
                class="block text-sm font-medium text-primary mb-1"
                >Your Message</label
              >
              <textarea
                rows="5"
                id="message"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Tell us how we can help..."
              ></textarea>
            </div>
            <button
              class="w-full bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-lg transition duration-300 font-medium shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>

        <div class="space-y-8">
          <div
            class="bg-surface p-8 rounded-lg shadow-xl border border-paleSilver hover:border-border-hover"
          >
            <h2 class="text-2xl font-serif font-semibold text-heading mb-6">
              Contact Informations
            </h2>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="bg-summer p-3 rounded-full mr-4">
                  <Icon
                    icon="fa-solid:phone"
                    class="text-summer-text text-lg"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Phone</h3>
                  <p class="text-gray-800">+62 812 3450 6700</p>
                  <p class="text-gray-600">Mon-Fri:9am-10pm</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="bg-summer p-3 rounded-full mr-4">
                  <Icon
                    icon="fa-solid:envelope"
                    class="text-summer-text text-lg"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Email</h3>
                  <p class="text-gray-800">contact@havenkicks.com</p>
                  <p class="text-gray-600">support@havenkicks.com</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="bg-summer p-3 rounded-full mr-4">
                  <Icon
                    icon="fa-solid:map-marker-alt"
                    class="text-summer-text text-lg"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Our Outlet</h3>
                  <p class="text-gray-800">Haven Kicks Store</p>
                  <p class="text-gray-600">
                    Tamalanrea, Makassar Sulawesi Selatan
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-24">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
              <div class="flex space-x-4">
                <a
                  href="#"
                  class="bg-summer hover:bg-gray-200 p-3 rounded-full transition duration-300"
                >
                  <Icon icon="fa-brands:instagram" class="text-summer-text" />
                </a>
                <a
                  href="#"
                  class="bg-summer hover:bg-gray-200 p-3 rounded-full transition duration-300"
                >
                  <Icon icon="fa-brands:facebook-f" class="text-summer-text" />
                </a>
                <a
                  href="#"
                  class="bg-summer hover:bg-gray-200 p-3 rounded-full transition duration-300"
                >
                  <Icon icon="fa6-brands:x-twitter" class="text-summer-text" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
