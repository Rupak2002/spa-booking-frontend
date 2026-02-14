<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-create-modal-title"
      tabindex="-1"
      class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto focus:outline-none"
      @keydown.escape="$emit('close')"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 id="bulk-create-modal-title" class="text-2xl font-bold text-gray-800">Bulk Create Time Slots</h2>
        <button @click="$emit('close')" aria-label="Close" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <p class="text-gray-600 mb-6">
          Create the same time slot across multiple days. Perfect for setting up a recurring weekly schedule.
        </p>

        <!-- Template Slot -->
        <div class="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-gray-800 mb-3">Template Time Slot</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
              <input
                v-model="template.start_time"
                type="time"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
              <input
                v-model="template.end_time"
                type="time"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <p v-if="templateDuration > 0" class="mt-2 text-sm text-gray-600">
            Duration: {{ templateDuration }} minutes
          </p>
        </div>

        <!-- Date Range -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-800 mb-3">Date Range</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
              <input
                v-model="dateRange.start"
                type="date"
                required
                :min="today"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">To Date *</label>
              <input
                v-model="dateRange.end"
                type="date"
                required
                :min="dateRange.start || today"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <!-- Days of Week Selection -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-800 mb-3">Select Days of Week</h3>
          
          <div class="grid grid-cols-7 gap-2">
            <label
              v-for="day in daysOfWeek"
              :key="day.value"
              class="flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
              :class="selectedDays.includes(day.value) 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'"
            >
              <input
                type="checkbox"
                :value="day.value"
                v-model="selectedDays"
                class="sr-only"
              />
              <span class="text-xs font-medium" :class="selectedDays.includes(day.value) ? 'text-purple-700' : 'text-gray-600'">
                {{ day.short }}
              </span>
              <span class="text-lg font-bold mt-1" :class="selectedDays.includes(day.value) ? 'text-purple-600' : 'text-gray-800'">
                {{ day.initial }}
              </span>
            </label>
          </div>

          <div class="mt-3 flex gap-2">
            <button
              type="button"
              @click="selectWeekdays"
              class="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              Weekdays Only
            </button>
            <button
              type="button"
              @click="selectWeekend"
              class="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
            >
              Weekend Only
            </button>
            <button
              type="button"
              @click="selectAll"
              class="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
            >
              All Days
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="previewSlots.length > 0" class="mb-6 bg-blue-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-2">Preview</h3>
          <p class="text-sm text-gray-600 mb-2">
            This will create <strong>{{ previewSlots.length }} time slots</strong>:
          </p>
          <div class="max-h-40 overflow-y-auto space-y-1">
            <div
              v-for="(slot, index) in previewSlots.slice(0, 10)"
              :key="index"
              class="text-xs text-gray-600"
            >
              {{ formatPreviewDate(slot.date) }} - {{ formatTime(template.start_time) }} to {{ formatTime(template.end_time) }}
            </div>
            <p v-if="previewSlots.length > 10" class="text-xs text-gray-500 italic">
              ...and {{ previewSlots.length - 10 }} more
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <ErrorAlert v-if="error" :message="error" class="mb-6" />

        <!-- Success Message -->
        <div v-if="successCount > 0" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-800 text-sm">
            ✓ Successfully created {{ successCount }} time slots!
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || previewSlots.length === 0"
            class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {{ loading ? 'Creating...' : `Create ${previewSlots.length} Slots` }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTimeSlotsStore } from '../stores/timeSlots'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const props = defineProps({
  therapistId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const timeSlotsStore = useTimeSlotsStore()

const template = ref({
  start_time: '09:00',
  end_time: '17:00'
})

const dateRange = ref({
  start: '',
  end: ''
})

const selectedDays = ref([1, 2, 3, 4, 5]) // Monday-Friday by default

const daysOfWeek = [
  { value: 1, short: 'Mon', initial: 'M' },
  { value: 2, short: 'Tue', initial: 'T' },
  { value: 3, short: 'Wed', initial: 'W' },
  { value: 4, short: 'Thu', initial: 'T' },
  { value: 5, short: 'Fri', initial: 'F' },
  { value: 6, short: 'Sat', initial: 'S' },
  { value: 0, short: 'Sun', initial: 'S' }
]

const loading = ref(false)
const error = ref(null)
const successCount = ref(0)
const dialogRef = ref(null)
onMounted(() => {
  dialogRef.value?.focus()
})

const today = computed(() => new Date().toISOString().split('T')[0])

const templateDuration = computed(() => {
  if (!template.value.start_time || !template.value.end_time) return 0
  return timeSlotsStore.getSlotDuration(template.value.start_time, template.value.end_time)
})

const previewSlots = computed(() => {
  if (!dateRange.value.start || !dateRange.value.end || selectedDays.value.length === 0) {
    return []
  }

  const slots = []
  const start = new Date(dateRange.value.start)
  const end = new Date(dateRange.value.end)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    if (selectedDays.value.includes(dayOfWeek)) {
      slots.push({
        date: new Date(d).toISOString().split('T')[0]
      })
    }
  }

  return slots
})

function selectWeekdays() {
  selectedDays.value = [1, 2, 3, 4, 5]
}

function selectWeekend() {
  selectedDays.value = [0, 6]
}

function selectAll() {
  selectedDays.value = [0, 1, 2, 3, 4, 5, 6]
}

function formatTime(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function formatPreviewDate(date) {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

async function handleSubmit() {
  loading.value = true
  error.value = null
  successCount.value = 0

  try {
    // Validate
    if (templateDuration.value < 30) {
      error.value = 'Time slot must be at least 30 minutes'
      loading.value = false
      return
    }

    if (previewSlots.value.length === 0) {
      error.value = 'No dates selected'
      loading.value = false
      return
    }

    // Create slots array
    const slots = previewSlots.value.map(slot => ({
      therapist_id: props.therapistId,
      slot_date: slot.date,
      start_time: template.value.start_time,
      end_time: template.value.end_time,
      is_available: true
    }))

    // Bulk create
    const result = await timeSlotsStore.createBulkTimeSlots(slots)

    if (result.success) {
      successCount.value = result.count
      setTimeout(() => {
        emit('save')
      }, 1500)
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