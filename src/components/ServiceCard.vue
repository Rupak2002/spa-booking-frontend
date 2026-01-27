<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
    <!-- Service Image -->
    <div class="relative h-48 bg-gray-200 overflow-hidden">
      <img 
        v-if="service.image_url" 
        :src="service.image_url" 
        :alt="service.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-400">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-2 left-2">
        <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {{ service.category?.name || 'Service' }}
        </span>
      </div>
    </div>

    <!-- Service Details -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate">
        {{ service.name }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ service.description || 'Relax and rejuvenate with this amazing service.' }}
      </p>

      <!-- Price and Duration -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center text-purple-600">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-bold text-lg">${{ formatPrice(service.price) }}</span>
          </div>

          <div class="flex items-center text-gray-600 text-sm">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ service.duration }} min</span>
          </div>
        </div>
      </div>

      <!-- Book Now Button -->
      <button 
        @click.stop="$emit('book', service)"
        class="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        View Details
      </button>
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

defineEmits(['book'])

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>