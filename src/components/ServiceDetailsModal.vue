<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Close Button -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Service Details</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Service Image -->
        <div v-if="service.image_url" class="mb-6 rounded-lg overflow-hidden">
          <img :src="service.image_url" :alt="service.name" class="w-full h-64 object-cover" />
        </div>

        <!-- Service Info -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-bold text-gray-800">{{ service.name }}</h3>
            <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              {{ service.category?.name }}
            </span>
          </div>

          <p class="text-gray-600 leading-relaxed mb-6">
            {{ service.description || 'Experience ultimate relaxation and rejuvenation with this premium service.' }}
          </p>

          <!-- Price and Duration Cards -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="flex items-center text-purple-600 mb-1">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">Price</span>
              </div>
              <p class="text-2xl font-bold text-gray-800">${{ formatPrice(service.price) }}</p>
            </div>

            <div class="bg-purple-50 rounded-lg p-4">
              <div class="flex items-center text-purple-600 mb-1">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">Duration</span>
              </div>
              <p class="text-2xl font-bold text-gray-800">{{ service.duration }} min</p>
            </div>
          </div>

          <!-- Benefits Section (Optional Enhancement) -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-gray-800 mb-2">What to Expect</h4>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Professional service by certified therapists
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Premium products and equipment
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Relaxing and comfortable environment
              </li>
            </ul>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            @click="$emit('book', service)"
            class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  service: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'book'])

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}
</script>