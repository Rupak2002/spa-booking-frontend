<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div class="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h1 class="text-3xl sm:text-4xl font-bold mb-2">Our Services</h1>
        <p class="text-purple-100 text-sm sm:text-base">Discover the perfect treatment for your wellness journey</p>
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
            <button @click="searchQuery = ''" class="ml-2 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center hover:bg-purple-200 rounded-full focus:outline-none transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
          <span v-if="selectedCategory" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            Category: {{ getCategoryName(selectedCategory) }}
            <button @click="selectedCategory = ''" class="ml-2 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center hover:bg-purple-200 rounded-full focus:outline-none transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="servicesStore.loading" class="py-12">
        <LoadingSpinner size="md" message="Loading services..." />
      </div>

      <!-- Error State -->
      <ErrorAlert
        v-else-if="servicesStore.error"
        :message="servicesStore.error"
        :show-retry="true"
        @retry="loadServices"
      />

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
            @view-details="openServiceDetails"
          />
        </div>
      </div>
    </div>

    <!-- Role Error Banner -->
    <div v-if="roleError" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-300 text-red-800 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <span>{{ roleError }}</span>
      <button @click="roleError = ''" class="ml-2 text-red-600 hover:text-red-800 font-bold">&times;</button>
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
import { useRouter } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import ServiceCard from '@/components/ServiceCard.vue'
import ServiceDetailsModal from '@/components/ServiceDetailsModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const router = useRouter()
const servicesStore = useServicesStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedService = ref(null)
const roleError = ref('')

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
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    // Redirect to login
    router.push({
      path: '/login',
      query: { redirect: `/book/${service.id}` }
    })
    return
  }

  // Check if user is a customer
  if (authStore.profile?.role !== 'customer') {
    roleError.value = 'Only customers can book services. Please contact an administrator to change your role.'
    return
  }

  // Navigate to booking page
  router.push(`/book/${service.id}`)
  selectedService.value = null // Close modal
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