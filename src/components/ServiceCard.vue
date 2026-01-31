<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
    <!-- Service Image -->
    <div class="h-48 bg-gray-200 relative overflow-hidden">
      <img 
        v-if="service.image_url"
        :src="service.image_url" 
        :alt="service.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
        <svg class="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Service Info -->
    <div class="p-6">
      <!-- Category Badge -->
      <span class="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold mb-2">
        {{ service.category?.name || 'Service' }}
      </span>

      <!-- Service Name -->
      <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {{ service.name }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ service.description || 'No description available' }}
      </p>

      <!-- Price and Duration -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-2xl font-bold text-purple-600">
          ${{ formatPrice(service.price) }}
        </span>
        <span class="text-gray-600 text-sm">
          {{ service.duration }} min
        </span>
      </div>

      <!-- View Details Button -->
      <button
        @click="$emit('view-details', service)"
        class="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  service: {
    type: Object,
    required: true
  }
})

defineEmits(['view-details'])

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