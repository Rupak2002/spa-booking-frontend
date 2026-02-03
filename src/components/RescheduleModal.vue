<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/40" @click="close"></div>
    
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">Reschedule Booking</h3>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Current Booking Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3">Current Booking</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500">Customer:</span>
              <p class="font-medium">{{ booking.customer.full_name }}</p>
            </div>
            <div>
              <span class="text-gray-500">Service:</span>
              <p class="font-medium">{{ booking.service_name }}</p>
            </div>
            <div>
              <span class="text-gray-500">Therapist:</span>
              <p class="font-medium">{{ booking.therapist.user.full_name }}</p>
            </div>
            <div>
              <span class="text-gray-500">Duration:</span>
              <p class="font-medium">{{ booking.service_duration }} min</p>
            </div>
            <div class="col-span-2">
              <span class="text-gray-500">Current Time:</span>
              <p class="font-medium">
                {{ formatDate(booking.booking_date) }} at {{ formatTime(booking.start_time) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Date Picker -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select New Date
          </label>
          <input
            type="date"
            v-model="selectedDate"
            :min="minDate"
            @change="loadAvailableSlots"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- Available Slots -->
        <div v-if="selectedDate">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Available Time Slots
          </label>

          <!-- Loading -->
          <div v-if="loadingSlots" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600">Loading available slots...</p>
          </div>

          <!-- No slots -->
          <div v-else-if="availableSlots.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
            <p class="text-gray-600">No available slots on this date</p>
            <p class="text-sm text-gray-500 mt-1">Try a different date</p>
          </div>

          <!-- Slots list -->
          <div v-else class="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
            <label
              v-for="slot in availableSlots"
              :key="slot.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
              :class="selectedSlotId === slot.id ? 'border-purple-500 bg-purple-50' : 'bg-white'"
            >
              <div class="flex items-center gap-3">
                <input
                  type="radio"
                  :value="slot.id"
                  v-model="selectedSlotId"
                  class="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p class="font-medium text-gray-900">
                    {{ formatTime(slot.start_time) }} – {{ formatTime(slot.end_time) }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ getSlotDuration(slot) }} min slot
                  </p>
                </div>
              </div>
              <span
                v-if="selectedSlotId === slot.id"
                class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
              >
                Selected
              </span>
            </label>
          </div>
        </div>

        <!-- Comparison (if slot selected) -->
        <div v-if="selectedSlotId" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reschedule Summary
          </h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-blue-700 font-medium">From:</p>
              <p class="text-blue-900">{{ formatDate(booking.booking_date) }}</p>
              <p class="text-blue-900">{{ formatTime(booking.start_time) }}</p>
            </div>
            <div>
              <p class="text-blue-700 font-medium">To:</p>
              <p class="text-blue-900">{{ formatDate(selectedDate) }}</p>
              <p class="text-blue-900">{{ formatTime(selectedSlot?.start_time) }}</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
        <button
          @click="close"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="handleReschedule"
          :disabled="!selectedSlotId || rescheduling"
          class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {{ rescheduling ? 'Rescheduling...' : 'Confirm Reschedule' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { bookingAPI } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { formatDate, formatTime } from '@/lib/dateUtils'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  booking: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

// State
const selectedDate = ref('')
const selectedSlotId = ref(null)
const availableSlots = ref([])
const loadingSlots = ref(false)
const rescheduling = ref(false)
const error = ref(null)

// Computed
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const selectedSlot = computed(() => {
  return availableSlots.value.find(s => s.id === selectedSlotId.value)
})

// Methods
async function loadAvailableSlots() {
  if (!selectedDate.value) return

  loadingSlots.value = true
  error.value = null
  selectedSlotId.value = null

  try {
    // Fetch slots for the selected date, same therapist, that can fit the service
    const { data, error: fetchError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('therapist_id', props.booking.therapist_id)
      .eq('slot_date', selectedDate.value)
      .eq('is_available', true)
      .order('start_time')

    if (fetchError) throw fetchError

    // Filter by duration (client-side to keep it simple)
    availableSlots.value = (data || []).filter(slot => {
      const duration = getSlotDuration(slot)
      return duration >= props.booking.service_duration
    })

  } catch (err) {
    error.value = 'Failed to load available slots'
    console.error('Load slots error:', err)
  } finally {
    loadingSlots.value = false
  }
}

function getSlotDuration(slot) {
  const [startHour, startMin] = slot.start_time.split(':').map(Number)
  const [endHour, endMin] = slot.end_time.split(':').map(Number)
  return (endHour * 60 + endMin) - (startHour * 60 + startMin)
}

async function handleReschedule() {
  if (!selectedSlotId.value) return

  rescheduling.value = true
  error.value = null

  try {
    await bookingAPI.adminRescheduleBooking(props.booking.id, selectedSlotId.value)
    emit('success', {
      bookingId: props.booking.id,
      newDate: selectedDate.value,
      newSlot: selectedSlot.value
    })
    close()
  } catch (err) {
    error.value = err.message || 'Failed to reschedule booking'
    console.error('Reschedule error:', err)
  } finally {
    rescheduling.value = false
  }
}

function close() {
  selectedDate.value = ''
  selectedSlotId.value = null
  availableSlots.value = []
  error.value = null
  emit('close')
}

// Reset when booking changes
watch(() => props.booking, () => {
  selectedDate.value = ''
  selectedSlotId.value = null
  availableSlots.value = []
  error.value = null
})
</script>