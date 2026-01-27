<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold mb-2">Our Services</h1>
        <p class="text-purple-100">Discover the perfect treatment for your wellness journey</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Search Bar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or description..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="searchQuery || selectedCategory" class="mt-4 flex items-center gap-2">
          <span class="text-sm text-gray-600">Active filters:</span>
          <span v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            Search: "{{ searchQuery }}"
            <button @click="searchQuery = ''" class="ml-2 focus:outline-none">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
          <span v-if="selectedCategory" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            Category: {{ getCategoryName(selectedCategory) }}
            <button @click="selectedCategory = ''" class="ml-2 focus:outline-none">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="servicesStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Loading services...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="servicesStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800">{{ servicesStore.error }}</p>
        <button @click="loadServices" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Try Again
        </button>
      </div>

      <!-- No Results -->
      <div v-else-if="filteredServices.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
        <p class="text-gray-500 mb-4">Try adjusting your search or filters</p>
        <button @click="clearFilters" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Clear Filters
        </button>
      </div>

      <!-- Services Grid -->
      <div v-else>
        <div class="mb-4 text-sm text-gray-600">
          Showing {{ filteredServices.length }} {{ filteredServices.length === 1 ? 'service' : 'services' }}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            v-for="service in filteredServices"
            :key="service.id"
            :service="service"
            @book="openServiceDetails"
          />
        </div>
      </div>
    </div>

    <!-- Service Details Modal -->
    <ServiceDetailsModal
      v-if="selectedService"
      :service="selectedService"
      @close="selectedService = null"
      @book="handleBooking"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useServicesStore } from '../stores/services'
import ServiceCard from '../components/ServiceCard.vue'
import ServiceDetailsModal from '../components/ServiceDetailsModal.vue'

const servicesStore = useServicesStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedService = ref(null)

// Use categories from the store
const categories = computed(() => servicesStore.categories)

const filteredServices = computed(() => {
  let services = servicesStore.services

  // Filter by category
  if (selectedCategory.value) {
    services = services.filter(s => s.category_id === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    services = services.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query)
    )
  }

  return services
})

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Unknown'
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const openServiceDetails = (service) => {
  selectedService.value = service
}

const handleBooking = (service) => {
  // TODO: Navigate to booking page (Milestone 6)
  console.log('Booking service:', service)
  alert('Booking feature coming in Milestone 6!')
}

const loadServices = async () => {
  // Prevent duplicate fetches
  if (servicesStore.loading) return

  await Promise.all([
    servicesStore.fetchActiveServices(),
    servicesStore.fetchCategories()
  ])
}

onMounted(() => {
  loadServices()
})
</script>