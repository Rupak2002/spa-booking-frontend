<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Therapist Management</h1>
        <p class="text-gray-600 mt-2">Manage therapist profiles and availability</p>
      </div>

      <!-- Create Therapist Button -->
      <div class="mb-6">
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Add New Therapist
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="therapistsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Loading therapists...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="therapistsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <p class="text-red-800">{{ therapistsStore.error }}</p>
      </div>

      <!-- Therapists List -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Therapist
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="therapist in therapistsStore.therapists" :key="therapist.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ therapist.user?.full_name || 'Unknown' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ therapist.user?.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ therapist.specialization || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    therapist.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ therapist.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editTherapist(therapist)"
                  class="text-purple-600 hover:text-purple-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="toggleStatus(therapist)"
                  :class="[
                    'hover:underline',
                    therapist.is_active ? 'text-red-600' : 'text-green-600'
                  ]"
                >
                  {{ therapist.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="therapistsStore.therapists.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No therapists</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new therapist profile.</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <TherapistFormModal
      v-if="showCreateModal || editingTherapist"
      :therapist="editingTherapist"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTherapistsStore } from '../../stores/therapists'
import TherapistFormModal from '../../components/TherapistFormModal.vue'

const therapistsStore = useTherapistsStore()

const showCreateModal = ref(false)
const editingTherapist = ref(null)

const editTherapist = (therapist) => {
  editingTherapist.value = therapist
}

const closeModal = () => {
  showCreateModal.value = false
  editingTherapist.value = null
}

const handleSave = async () => {
  await therapistsStore.fetchTherapists()
  closeModal()
}

const toggleStatus = async (therapist) => {
  const confirmed = confirm(
    `Are you sure you want to ${therapist.is_active ? 'deactivate' : 'activate'} ${therapist.user?.full_name}?`
  )

  if (confirmed) {
    const result = await therapistsStore.toggleTherapistStatus(
      therapist.id,
      !therapist.is_active
    )

    if (result.success) {
      alert('Therapist status updated successfully!')
    } else {
      alert('Error updating status: ' + result.error)
    }
  }
}

onMounted(() => {
  therapistsStore.fetchTherapists()
})
</script>