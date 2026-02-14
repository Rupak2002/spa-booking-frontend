<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="therapist-modal-title"
      tabindex="-1"
      class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto focus:outline-none"
      @keydown.escape="$emit('close')"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 id="therapist-modal-title" class="text-2xl font-bold text-gray-800">
          {{ isEditMode ? 'Edit Therapist' : 'Create New Therapist' }}
        </h2>
        <button @click="$emit('close')" aria-label="Close" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <!-- User Selection (Create Mode Only) -->
        <div v-if="!isEditMode" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select User Account *
          </label>
          <select
            v-model="formData.user_id"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">-- Select a user --</option>
            <option 
              v-for="user in availableUsers" 
              :key="user.id" 
              :value="user.id"
            >
              {{ user.full_name || user.email }} ({{ user.email }})
            </option>
          </select>
          <p class="mt-1 text-sm text-gray-500">
            Only users with 'therapist' role are shown. Create users first in Authentication.
          </p>
        </div>

        <!-- Email (Edit Mode - Read Only) -->
        <div v-else class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="text"
            :value="therapist?.user?.email"
            disabled
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <!-- Specialization -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <input
            v-model="formData.specialization"
            type="text"
            placeholder="e.g., Swedish Massage, Deep Tissue, Aromatherapy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p class="mt-1 text-sm text-gray-500">
            What type of treatments does this therapist specialize in?
          </p>
        </div>

        <!-- Bio -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bio / Description
          </label>
          <textarea
            v-model="formData.bio"
            rows="4"
            placeholder="Brief description of the therapist's experience and expertise..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Active Status (Edit Mode Only) -->
        <div v-if="isEditMode" class="mb-6">
          <label class="flex items-center">
            <input
              v-model="formData.is_active"
              type="checkbox"
              class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span class="ml-2 text-sm font-medium text-gray-700">
              Active (Visible to customers)
            </span>
          </label>
        </div>

        <!-- Error Message -->
        <ErrorAlert v-if="error" :message="error" class="mb-6" />

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEditMode ? 'Update Therapist' : 'Create Therapist') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTherapistsStore } from '../stores/therapists'
import { supabase } from '../lib/supabase'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const props = defineProps({
  therapist: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const therapistsStore = useTherapistsStore()

const formData = ref({
  user_id: '',
  specialization: '',
  bio: '',
  is_active: true
})

const availableUsers = ref([])
const loading = ref(false)
const error = ref(null)
const dialogRef = ref(null)
onMounted(() => {
  dialogRef.value?.focus()
})

const isEditMode = computed(() => !!props.therapist)

// Initialize form data for edit mode
watch(() => props.therapist, (newTherapist) => {
  if (newTherapist) {
    formData.value = {
      user_id: newTherapist.user_id,
      specialization: newTherapist.specialization || '',
      bio: newTherapist.bio || '',
      is_active: newTherapist.is_active
    }
  }
}, { immediate: true })

// Fetch users with therapist role (for create mode)
const fetchAvailableUsers = async () => {
  try {
    // Get all profiles with therapist role
    const { data: therapistProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('role', 'therapist')

    if (fetchError) throw fetchError

    if (!therapistProfiles || therapistProfiles.length === 0) {
      availableUsers.value = []
      return
    }

    // Get existing therapist user_ids
    const { data: existingTherapists } = await supabase
      .from('therapists')
      .select('user_id')

    const existingUserIds = existingTherapists?.map(t => t.user_id) || []

    // Filter out users who already have therapist profiles
    availableUsers.value = therapistProfiles.filter(
      profile => !existingUserIds.includes(profile.id)
    )
  } catch (err) {
    error.value = 'Failed to load available users'
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    let result

    if (isEditMode.value) {
      // Update existing therapist
      result = await therapistsStore.updateTherapist(
        props.therapist.id,
        {
          specialization: formData.value.specialization,
          bio: formData.value.bio,
          is_active: formData.value.is_active
        }
      )
    } else {
      // Create new therapist
      if (!formData.value.user_id) {
        error.value = 'Please select a user account'
        loading.value = false
        return
      }

      result = await therapistsStore.createTherapist({
        user_id: formData.value.user_id,
        specialization: formData.value.specialization,
        bio: formData.value.bio,
        is_active: true
      })
    }

    if (result.success) {
      emit('save')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isEditMode.value) {
    fetchAvailableUsers()
  }
})
</script>