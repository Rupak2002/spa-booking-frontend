<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Services Management</h1>
        <button
          @click="openCreateModal"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Service
        </button>
      </div>

      <!-- Services List -->
      <div v-if="servicesStore.loading" class="text-center py-12">
        <div class="text-gray-600">Loading services...</div>
      </div>

      <div v-else-if="servicesStore.services.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-600 mb-4">No services yet. Add your first service!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="service in servicesStore.services"
          :key="service.id"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
          <img
            v-if="service.image_url"
            :src="service.image_url"
            :alt="service.name"
            class="w-full h-48 object-cover"
          />
          <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-400">No image</span>
          </div>
          
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ service.name }}</h3>
              <span
                :class="service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                class="px-2 py-1 text-xs rounded"
              >
                {{ service.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-2">{{ service.category?.name }}</p>
            <p class="text-gray-700 text-sm mb-3 line-clamp-2">{{ service.description }}</p>
            
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-bold text-indigo-600">${{ service.price }}</span>
              <span class="text-sm text-gray-600">{{ service.duration }} min</span>
            </div>

            <div class="flex space-x-2">
              <button
                @click="openEditModal(service)"
                class="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(service)"
                class="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 class="text-2xl font-bold mb-4">{{ editingService ? 'Edit Service' : 'Create Service' }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ errorMessage }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              v-model="formData.category_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              <option v-for="cat in servicesStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
              <input
                v-model.number="formData.duration"
                type="number"
                min="15"
                step="15"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p class="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            
            <img
              v-if="formData.image_url"
              :src="formData.image_url"
              alt="Preview"
              class="mt-2 h-32 object-cover rounded"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="formData.is_active"
              type="checkbox"
              id="is_active"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-900">
              Active (visible to customers)
            </label>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="submit"
              :disabled="servicesStore.loading || uploading"
              class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ uploading ? 'Uploading...' : servicesStore.loading ? 'Saving...' : editingService ? 'Update Service' : 'Create Service' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useServicesStore } from '@/stores/services'

const servicesStore = useServicesStore()

const showModal = ref(false)
const editingService = ref(null)
const errorMessage = ref('')
const uploading = ref(false)
const selectedFile = ref(null)

const formData = ref({
  name: '',
  category_id: '',
  description: '',
  price: 0,
  duration: 60,
  image_url: '',
  is_active: true
})

onMounted(async () => {
  await servicesStore.fetchCategories()
  await servicesStore.fetchServices()
})

const openCreateModal = () => {
  editingService.value = null
  formData.value = {
    name: '',
    category_id: '',
    description: '',
    price: 0,
    duration: 60,
    image_url: '',
    is_active: true
  }
  showModal.value = true
}

const openEditModal = (service) => {
  editingService.value = service
  formData.value = {
    name: service.name,
    category_id: service.category_id,
    description: service.description,
    price: service.price,
    duration: service.duration,
    image_url: service.image_url,
    is_active: service.is_active
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingService.value = null
  selectedFile.value = null
  errorMessage.value = ''
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 5MB'
      event.target.value = ''
      return
    }
    selectedFile.value = file
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''

  try {
    // Upload image if selected
    if (selectedFile.value) {
      uploading.value = true
      const uploadResult = await servicesStore.uploadServiceImage(selectedFile.value)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error)
      }
      
      formData.value.image_url = uploadResult.url
    }

    // Create or update service
    const result = editingService.value
      ? await servicesStore.updateService(editingService.value.id, formData.value)
      : await servicesStore.createService(formData.value)

    if (result.success) {
      closeModal()
    } else {
      errorMessage.value = result.error
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    uploading.value = false
  }
}

const confirmDelete = async (service) => {
  if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
    const result = await servicesStore.deleteService(service.id)
    
    if (!result.success) {
      alert(`Error: ${result.error}`)
    }
  }
}

</script>