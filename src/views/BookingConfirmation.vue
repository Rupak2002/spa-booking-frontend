<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading booking details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <h2 class="text-2xl font-bold text-red-800 mb-2">Error</h2>
      <p class="text-red-700">{{ error }}</p>
      <router-link 
        to="/services" 
        class="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Back to Services
      </router-link>
    </div>

    <!-- Success State - PENDING Booking -->
    <div v-else-if="booking?.status === 'pending'" class="space-y-6">
      <!-- Countdown Timer -->
      <CountdownTimer 
        :expires-at="booking.reservation_expires_at"
        @expired="handleExpired"
      />

      <!-- Success Message -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <div class="flex items-start gap-4">
          <svg class="w-12 h-12 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h2 class="text-2xl font-bold text-green-800">Reservation Created!</h2>
            <p class="text-green-700 mt-2">
              Your time slot is reserved. Please confirm your booking within the time limit.
            </p>
          </div>
        </div>
      </div>

      <!-- Booking Details -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-4">Booking Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Booking ID</p>
            <p class="font-mono text-sm">{{ booking.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {{ booking.status.toUpperCase() }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Service</p>
            <p class="font-semibold">{{ booking.service_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Price</p>
            <p class="font-semibold text-purple-600">${{ booking.service_price }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Date</p>
            <p class="font-semibold">{{ formatDate(booking.booking_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Time</p>
            <p class="font-semibold">{{ formatTime(booking.start_time) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Duration</p>
            <p class="font-semibold">{{ booking.service_duration }} minutes</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Payment Status</p>
            <span class="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
              {{ booking.payment_status.toUpperCase() }}
            </span>
          </div>
        </div>

        <div v-if="booking.notes" class="mt-6 pt-6 border-t">
          <p class="text-sm text-gray-600">Your Notes</p>
          <p class="mt-1">{{ booking.notes }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button
          @click="confirmBooking"
          :disabled="confirming"
          class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span v-if="confirming">Confirming...</span>
          <span v-else>✓ Confirm Booking (Simulate Payment)</span>
        </button>
        <router-link
          to="/services"
          class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          Cancel & Browse Services
        </router-link>
      </div>

      <!-- Info Notice -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          ℹ️ <strong>Note:</strong> Payment integration will be added in Phase 2. 
          For now, clicking "Confirm Booking" will simulate a successful payment.
        </p>
      </div>
    </div>

    <!-- Success State - CONFIRMED Booking -->
    <div v-else-if="booking?.status === 'confirmed'" class="space-y-6">
      <!-- Success Message -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6">
        <div class="flex items-start gap-4">
          <svg class="w-12 h-12 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h2 class="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
            <p class="text-green-700 mt-2">
              Your appointment is confirmed. We've sent a confirmation email to your registered address.
            </p>
          </div>
        </div>
      </div>

      <!-- Booking Details -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold mb-4">Appointment Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Service</p>
            <p class="font-semibold">{{ booking.service_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Price</p>
            <p class="font-semibold text-purple-600">${{ booking.service_price }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Date</p>
            <p class="font-semibold">{{ formatDate(booking.booking_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Time</p>
            <p class="font-semibold">{{ formatTime(booking.start_time) }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4">
        <router-link
          to="/dashboard"
          class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-center"
        >
          View My Bookings
        </router-link>
        <router-link
          to="/services"
          class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          Browse More Services
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import CountdownTimer from '@/components/CountdownTimer.vue'
import { formatTime, formatFullDate as formatDate } from '@/lib/dateUtils'

const route = useRoute()
const router = useRouter()
const bookingsStore = useBookingsStore()

const bookingId = ref(route.params.bookingId)
const booking = ref(null)
const loading = ref(true)
const error = ref(null)
const confirming = ref(false)

async function loadBooking() {
  // For now, use the current booking from store
  // In production, you'd fetch from API by ID
  booking.value = bookingsStore.currentBooking
  
  if (!booking.value) {
    error.value = 'Booking not found. It may have expired.'
  }
  
  loading.value = false
}

async function confirmBooking() {
  if (confirming.value) return
  
  confirming.value = true
  
  try {
    await bookingsStore.confirmReservation(bookingId.value)
    // Update local booking
    booking.value = bookingsStore.currentBooking
  } catch (err) {
    error.value = err.message || 'Failed to confirm booking. Please try again.'
  } finally {
    confirming.value = false
  }
}

function handleExpired() {
  error.value = 'Your reservation has expired. The time slot has been released. Please create a new booking.'
  // Clear the booking
  bookingsStore.clearCurrentBooking()
}

// Formatting helpers imported from @/lib/dateUtils

onMounted(() => {
  loadBooking()
})
</script>