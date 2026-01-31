<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      Welcome, {{ authStore.profile?.full_name }}!
    </h1>

    <!-- Customer Dashboard -->
    <div v-if="authStore.profile?.role === 'customer'" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Upcoming Bookings -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-700">Upcoming Bookings</h3>
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ upcomingCount }}</p>
          <p class="text-sm text-gray-500 mt-1">Confirmed appointments</p>
        </div>

        <!-- Total Bookings -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-700">Total Bookings</h3>
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ totalCount }}</p>
          <p class="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <!-- Pending Bookings -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-700">Pending</h3>
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ pendingCount }}</p>
          <p class="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
        </div>
      </div>

      <!-- My Bookings Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">My Bookings</h2>
          <router-link
            to="/services"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Book New Service
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="bookingsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading your bookings...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="bookingsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">{{ bookingsStore.error }}</p>
          <button 
            @click="loadBookings" 
            class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>

        <!-- No Bookings -->
        <div v-else-if="bookingsStore.myBookings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
          <p class="text-gray-500 mb-4">Book your first service to get started</p>
          <router-link
            to="/services"
            class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Browse Services
          </router-link>
        </div>

        <!-- Bookings List -->
        <div v-else class="space-y-4">
          <!-- Upcoming Bookings -->
          <div v-if="upcomingBookings.length > 0">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Upcoming</h3>
            <div class="space-y-3">
              <div
                v-for="booking in upcomingBookings"
                :key="booking.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-lg font-semibold text-gray-900">{{ booking.service_name }}</h4>
                      <span 
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                        :class="getStatusClass(booking.status)"
                      >
                        {{ booking.status.toUpperCase() }}
                      </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(booking.booking_date) }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatTime(booking.start_time) }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${{ booking.service_price }}
                      </div>
                    </div>
                  </div>
                  <button
                    @click="viewBookingDetails(booking)"
                    class="ml-4 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Bookings -->
          <div v-if="pastBookings.length > 0" class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Past Bookings</h3>
            <div class="space-y-3">
              <div
                v-for="booking in pastBookings.slice(0, 3)"
                :key="booking.id"
                class="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-700">{{ booking.service_name }}</h4>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ formatDate(booking.booking_date) }} at {{ formatTime(booking.start_time) }}
                    </p>
                  </div>
                  <span class="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                    COMPLETED
                  </span>
                </div>
              </div>
            </div>
            <button
              v-if="pastBookings.length > 3"
              class="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View all {{ pastBookings.length }} past bookings →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else-if="authStore.profile?.role === 'admin'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Admin Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            to="/admin/services"
            class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200"
          >
            <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Manage Services</h3>
              <p class="text-sm text-gray-600">Add, edit, or remove services</p>
            </div>
          </router-link>

          <router-link
            to="/admin/therapists"
            class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200"
          >
            <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Manage Therapists</h3>
              <p class="text-sm text-gray-600">Add and manage therapist profiles</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Therapist Dashboard -->
    <div v-else-if="authStore.profile?.role === 'therapist'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Therapist Actions</h2>
        <router-link
          to="/therapist/availability"
          class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border-2 border-green-200"
        >
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <h3 class="font-semibold text-gray-800">Manage Availability</h3>
            <p class="text-sm text-gray-600">Set your working hours and schedule</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

// Computed - Filter bookings
const upcomingBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return bookingsStore.myBookings.filter(b => {
    if (b.status !== 'confirmed') return false
    const bookingDate = new Date(b.booking_date + 'T00:00:00')
    return bookingDate >= today
  }).sort((a, b) => {
    if (a.booking_date !== b.booking_date) {
      return a.booking_date.localeCompare(b.booking_date)
    }
    return a.start_time.localeCompare(b.start_time)
  })
})

const pastBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return bookingsStore.myBookings.filter(b => {
    const bookingDate = new Date(b.booking_date + 'T00:00:00')
    return bookingDate < today && ['confirmed', 'completed'].includes(b.status)
  }).sort((a, b) => {
    if (a.booking_date !== b.booking_date) {
      return b.booking_date.localeCompare(a.booking_date)
    }
    return b.start_time.localeCompare(a.start_time)
  })
})

const upcomingCount = computed(() => upcomingBookings.value.length)
const totalCount = computed(() => bookingsStore.myBookings.length)
const pendingCount = computed(() => 
  bookingsStore.myBookings.filter(b => b.status === 'pending').length
)

// Methods
function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.getTime() === today.getTime()) {
    return 'Today'
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

function viewBookingDetails(booking) {
  alert(`Booking Details:\n\nService: ${booking.service_name}\nDate: ${booking.booking_date}\nTime: ${booking.start_time}\nPrice: $${booking.service_price}`)
}

async function loadBookings() {
  if (authStore.profile?.role !== 'customer') return
  
  try {
    await bookingsStore.fetchMyBookings()
  } catch (error) {
    console.error('Failed to load bookings:', error)
  }
}

onMounted(() => {
  // Load bookings if customer
  if (authStore.profile?.role === 'customer') {
    loadBookings()
  }
})
</script>