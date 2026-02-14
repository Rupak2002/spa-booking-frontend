<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Therapist Management</h1>
        <p class="text-gray-600 mt-2">Manage therapist profiles and availability</p>
      </div>

      <!-- Create Therapist Button -->
      <div class="mb-6 flex items-center gap-4">
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Add New Therapist
        </button>
      </div>

      <!-- Status Notification -->
      <div v-if="statusMessage.text" :class="statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'" class="mb-4 border rounded-lg p-4 flex items-center justify-between">
        <p class="text-sm">{{ statusMessage.text }}</p>
        <button @click="statusMessage.text = ''" class="ml-4 font-bold opacity-70 hover:opacity-100">&times;</button>
      </div>

      <!-- Loading State -->
      <div v-if="therapistsStore.loading" class="py-12">
        <LoadingSpinner size="md" message="Loading therapists..." />
      </div>

      <!-- Error State -->
      <ErrorAlert v-else-if="therapistsStore.error" :message="therapistsStore.error" />

      <!-- Therapists List -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">

        <!-- Empty State -->
        <EmptyState
          v-if="therapistsStore.therapists.length === 0"
          icon="user"
          title="No therapists"
          message="Get started by creating a new therapist profile."
          action-label="Add New Therapist"
          @action="showCreateModal = true"
        />

        <template v-else>
          <!-- Mobile: card list -->
          <div class="sm:hidden divide-y divide-gray-200">
            <div
              v-for="therapist in therapistsStore.therapists"
              :key="therapist.id"
              class="p-4 space-y-3"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ therapist.user?.full_name || 'Unknown' }}</p>
                  <p class="text-sm text-gray-500">{{ therapist.user?.email }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ therapist.specialization || 'No specialization' }}</p>
                </div>
                <span
                  class="shrink-0 px-2 py-1 text-xs font-semibold rounded-full"
                  :class="therapist.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ therapist.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex gap-3">
                <button
                  @click="editTherapist(therapist)"
                  class="px-3 py-1.5 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="toggleStatus(therapist)"
                  class="px-3 py-1.5 text-sm border rounded-lg transition-colors"
                  :class="therapist.is_active ? 'text-red-600 border-red-300 hover:bg-red-50' : 'text-green-600 border-green-300 hover:bg-green-50'"
                >
                  {{ therapist.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop: table -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Therapist</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="therapist in therapistsStore.therapists" :key="therapist.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ therapist.user?.full_name || 'Unknown' }}</div>
                    <div class="text-sm text-gray-500">{{ therapist.user?.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ therapist.specialization || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="therapist.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ therapist.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="editTherapist(therapist)" class="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                    <button
                      @click="toggleStatus(therapist)"
                      :class="['hover:underline', therapist.is_active ? 'text-red-600' : 'text-green-600']"
                    >
                      {{ therapist.is_active ? 'Deactivate' : 'Activate' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
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
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const therapistsStore = useTherapistsStore()

const showCreateModal = ref(false)
const editingTherapist = ref(null)
const statusMessage = ref({ text: '', type: 'success' })

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
      statusMessage.value = { text: 'Therapist status updated successfully.', type: 'success' }
    } else {
      statusMessage.value = { text: 'Error updating status: ' + result.error, type: 'error' }
    }
  }
}

onMounted(() => {
  therapistsStore.fetchTherapists()
})
</script>