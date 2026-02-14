<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeslot-modal-title"
      tabindex="-1"
      class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto focus:outline-none"
      @keydown.escape="$emit('close')"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 id="timeslot-modal-title" class="text-2xl font-bold text-gray-800">
          {{ isEditMode ? 'Edit Time Slot' : 'Create Time Slot' }}
        </h2>
        <button @click="$emit('close')" aria-label="Close" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <!-- Date -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            v-model="formData.slot_date"
            type="date"
            required
            :min="today"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- Start Time -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <input
            v-model="formData.start_time"
            type="time"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- End Time -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            End Time *
          </label>
          <input
            v-model="formData.end_time"
            type="time"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p v-if="duration > 0" class="mt-1 text-sm text-gray-500">
            Duration: {{ duration }} minutes
          </p>
          <p v-if="duration < 0" class="mt-1 text-sm text-red-500">
            End time must be after start time
          </p>
        </div>

        <!-- Available Toggle -->
        <div class="mb-6">
          <label class="flex items-center">
            <input
              v-model="formData.is_available"
              type="checkbox"
              class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span class="ml-2 text-sm font-medium text-gray-700">
              Available for booking
            </span>
          </label>
          <p class="mt-1 text-sm text-gray-500">
            Uncheck to block this time without deleting the slot
          </p>
        </div>

        <!-- Quick Time Presets -->
        <div v-if="!isEditMode" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quick Presets
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="setPreset('morning')"
              class="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Morning (9am-12pm)
            </button>
            <button
              type="button"
              @click="setPreset('afternoon')"
              class="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Afternoon (1pm-5pm)
            </button>
            <button
              type="button"
              @click="setPreset('evening')"
              class="px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Evening (5pm-9pm)
            </button>
            <button
              type="button"
              @click="setPreset('fullday')"
              class="px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Full Day (9am-5pm)
            </button>
          </div>
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
            :disabled="loading || duration < 0"
            class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTimeSlotsStore } from '../stores/timeSlots'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const props = defineProps({
  slot: {
    type: Object,
    default: null
  },
  therapistId: {
    type: String,
    required: true
  },
  defaultDate: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const timeSlotsStore = useTimeSlotsStore()

const formData = ref({
  slot_date: '',
  start_time: '',
  end_time: '',
  is_available: true
})

const loading = ref(false)
const error = ref(null)
const dialogRef = ref(null)
onMounted(() => {
  dialogRef.value?.focus()
})

const isEditMode = computed(() => !!props.slot)

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const duration = computed(() => {
  if (!formData.value.start_time || !formData.value.end_time) return 0
  return timeSlotsStore.getSlotDuration(formData.value.start_time, formData.value.end_time)
})

// Initialize form data
watch(() => props.slot, (newSlot) => {
  if (newSlot) {
    formData.value = {
      slot_date: newSlot.slot_date,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      is_available: newSlot.is_available
    }
  } else {
    formData.value = {
      slot_date: props.defaultDate || today.value,
      start_time: '09:00',
      end_time: '17:00',
      is_available: true
    }
  }
}, { immediate: true })

function setPreset(preset) {
  const presets = {
    morning: { start: '09:00', end: '12:00' },
    afternoon: { start: '13:00', end: '17:00' },
    evening: { start: '17:00', end: '21:00' },
    fullday: { start: '09:00', end: '17:00' }
  }

  if (presets[preset]) {
    formData.value.start_time = presets[preset].start
    formData.value.end_time = presets[preset].end
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = null

  try {
    // Validate
    if (duration.value < 0) {
      error.value = 'End time must be after start time'
      loading.value = false
      return
    }

    if (duration.value < 30) {
      error.value = 'Time slot must be at least 30 minutes'
      loading.value = false
      return
    }

    let result

    if (isEditMode.value) {
      // Update existing slot
      result = await timeSlotsStore.updateTimeSlot(props.slot.id, formData.value)
    } else {
      // Create new slot
      result = await timeSlotsStore.createTimeSlot({
        therapist_id: props.therapistId,
        ...formData.value
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
</script>