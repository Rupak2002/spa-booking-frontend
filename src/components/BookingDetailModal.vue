<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/40"
      @click="close"
    ></div>

    <!-- Modal -->
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden flex flex-col">

      <!-- Header -->
      <div class="flex items-start justify-between p-4 sm:p-6 pb-4 flex-shrink-0">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">{{ booking.service_name }}</h2>
          <span
            class="inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold"
            :class="statusClass"
          >
            {{ booking.status.toUpperCase() }}
          </span>
        </div>
        <button
          @click="close"
          class="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors -mr-2 -mt-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto flex-1">
        <!-- Status Timeline -->
        <div class="px-4 sm:px-6 py-4 border-t border-b border-gray-100">
          <div class="flex items-center justify-between">
          <!-- Reserved -->
          <div class="flex flex-col items-center">
            <div :class="timelineNodeClass('reserved')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-xs text-gray-500 mt-1">Reserved</span>
          </div>

          <!-- Connector -->
          <div :class="connectorClass('reserved-confirmed')"></div>

          <!-- Confirmed -->
          <div class="flex flex-col items-center">
            <div :class="timelineNodeClass('confirmed')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-xs text-gray-500 mt-1">Confirmed</span>
          </div>

          <!-- Connector -->
          <div :class="connectorClass('confirmed-completed')"></div>

          <!-- Completed -->
          <div class="flex flex-col items-center">
            <div :class="timelineNodeClass('completed')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-xs text-gray-500 mt-1">Done</span>
          </div>
        </div>
      </div>

        <!-- Booking Details -->
        <div class="p-4 sm:p-6 space-y-3">
        <!-- Therapist -->
        <div class="flex items-center text-sm text-gray-700">
          <svg class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-gray-500 w-20 flex-shrink-0">Therapist</span>
          <span class="font-medium">{{ therapistName }}</span>
        </div>

        <!-- Date -->
        <div class="flex items-center text-sm text-gray-700">
          <svg class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-gray-500 w-20 flex-shrink-0">Date</span>
          <span class="font-medium">{{ formattedDate }}</span>
        </div>

        <!-- Time -->
        <div class="flex items-center text-sm text-gray-700">
          <svg class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-gray-500 w-20 flex-shrink-0">Time</span>
          <span class="font-medium">{{ formattedStartTime }} – {{ formattedEndTime }}</span>
        </div>

        <!-- Duration -->
        <div class="flex items-center text-sm text-gray-700">
          <svg class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="text-gray-500 w-20 flex-shrink-0">Duration</span>
          <span class="font-medium">{{ booking.service_duration }} min</span>
        </div>

        <!-- Price -->
        <div class="flex items-center text-sm text-gray-700">
          <svg class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-gray-500 w-20 flex-shrink-0">Price</span>
          <span class="font-medium">${{ booking.service_price }}</span>
        </div>

        <!-- Notes (only if present) -->
        <div v-if="booking.notes" class="flex items-start text-sm text-gray-700 pt-1">
          <svg class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="text-gray-500 w-20 flex-shrink-0">Notes</span>
          <span class="font-medium">{{ booking.notes }}</span>
        </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div v-if="hasActions" class="px-4 sm:px-6 pb-6 space-y-3 flex-shrink-0">

        <!-- PENDING + EXPIRED: warning, no confirm button -->
        <div v-if="booking.status === 'pending' && isExpired" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800 font-medium">
            This reservation has expired. The time slot has been or will be released automatically.
          </p>
        </div>

        <!-- PENDING + NOT EXPIRED: Confirm button / prompt -->
        <div v-if="booking.status === 'pending' && !isExpired">
          <!-- Default confirm button -->
          <div v-if="activeAction !== 'confirm'">
            <button
              @click="activeAction = 'confirm'"
              class="w-full px-4 py-3 min-h-[44px] bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Confirm Booking
            </button>
          </div>

          <!-- Confirm prompt -->
          <div v-else class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm text-purple-800 font-medium mb-3">
              Confirm this booking? Payment will be simulated for now.
            </p>
            <div class="flex gap-2">
              <button
                @click="handleConfirm"
                :disabled="confirming"
                class="flex-1 px-4 py-3 min-h-[44px] bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {{ confirming ? 'Confirming...' : 'Yes, Confirm' }}
              </button>
              <button
                @click="activeAction = null"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <!-- PENDING or CONFIRMED: Cancel button / prompt -->
        <div v-if="isCancellable">
          <!-- Default cancel button -->
          <div v-if="activeAction !== 'cancel'">
            <button
              @click="activeAction = 'cancel'"
              class="w-full px-4 py-3 min-h-[44px] border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Cancel Booking
            </button>
          </div>

          <!-- Cancel prompt -->
          <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm text-red-800 font-medium mb-3">
              Are you sure you want to cancel this booking? The time slot will be released.
            </p>
            <div class="flex gap-2">
              <button
                @click="handleCancel"
                :disabled="cancelling"
                class="flex-1 px-4 py-3 min-h-[44px] bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {{ cancelling ? 'Cancelling...' : 'Yes, Cancel' }}
              </button>
              <button
                @click="activeAction = null"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingsStore } from '@/stores/bookings'
import { formatDate, formatTime, getStatusClass } from '@/lib/dateUtils'

// Props
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

// Emits
const emit = defineEmits(['close'])

// Store
const bookingsStore = useBookingsStore()

// Local state
const activeAction = ref(null) // null | 'confirm' | 'cancel'
const confirming = ref(false)
const cancelling = ref(false)

// Computed
const isCancellable = computed(() => {
  return ['pending', 'confirmed'].includes(props.booking.status)
})

// Has the 5-min reservation window passed?
const isExpired = computed(() => {
  if (props.booking.status !== 'pending') return false
  if (!props.booking.reservation_expires_at) return false
  return new Date(props.booking.reservation_expires_at) < new Date()
})

// Show actions section at all?
const hasActions = computed(() => {
  return props.booking.status === 'pending' || props.booking.status === 'confirmed'
})

const therapistName = computed(() => {
  return props.booking.therapist?.user?.full_name || 'Unknown'
})

const statusClass = computed(() => getStatusClass(props.booking.status))

// Timeline helpers
function timelineNodeClass(stage) {
  const status = props.booking.status

  let reached = []

  if (status === 'pending') {
    reached = ['reserved']
  } else if (status === 'confirmed') {
    reached = ['reserved', 'confirmed']
  } else if (status === 'completed') {
    reached = ['reserved', 'confirmed', 'completed']
  } else if (status === 'cancelled') {
    if (props.booking.payment_status === 'paid') {
      reached = ['reserved', 'confirmed']
    } else {
      reached = ['reserved']
    }
  }

  const isReached = reached.includes(stage)

  if (isReached) {
    return 'w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center'
  }
  return 'w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center'
}

function connectorClass(segment) {
  const status = props.booking.status

  let activeConnectors = []

  if (status === 'confirmed' || status === 'completed') {
    activeConnectors.push('reserved-confirmed')
  }
  if (status === 'completed') {
    activeConnectors.push('confirmed-completed')
  }
  if (status === 'cancelled' && props.booking.payment_status === 'paid') {
    activeConnectors.push('reserved-confirmed')
  }

  const isActive = activeConnectors.includes(segment)
  return isActive
    ? 'flex-1 h-0.5 bg-purple-600 mx-1'
    : 'flex-1 h-0.5 bg-gray-200 mx-1'
}

// Formatting
const formattedDate = computed(() => formatDate(props.booking.booking_date))
const formattedStartTime = computed(() => formatTime(props.booking.start_time))
const formattedEndTime = computed(() => formatTime(props.booking.end_time))

// Confirm handler
async function handleConfirm() {
  confirming.value = true
  try {
    await bookingsStore.confirmReservation(props.booking.id)
    close()
  } catch (err) {
    console.error('Confirm failed:', err)
    activeAction.value = null
  } finally {
    confirming.value = false
  }
}

// Cancel handler
async function handleCancel() {
  cancelling.value = true
  try {
    await bookingsStore.cancelBooking(props.booking.id)
    close()
  } catch (err) {
    console.error('Cancel failed:', err)
    activeAction.value = null
  } finally {
    cancelling.value = false
  }
}

// Close
function close() {
  activeAction.value = null
  emit('close')
}
</script>