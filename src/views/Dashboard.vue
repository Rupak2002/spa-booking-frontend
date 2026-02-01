<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      Welcome, {{ authStore.profile?.full_name }}!
    </h1>

    <!-- Customer Dashboard -->
    <div v-if="authStore.profile?.role === 'customer'" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <!-- Status Filter Tabs -->
        <div class="flex gap-2 mb-6 flex-wrap">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            @click="activeFilter = tab.key"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
            :class="activeFilter === tab.key
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ tab.label }}
            <span class="ml-1 text-xs opacity-75">({{ tab.count }})</span>
          </button>
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

        <!-- No Bookings (empty state) -->
        <div v-else-if="filteredBookings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ activeFilter === 'all' ? 'No bookings yet' : `No ${activeFilter} bookings` }}
          </h3>
          <p class="text-gray-500 mb-4">
            {{ activeFilter === 'all' ? 'Book your first service to get started' : 'Nothing to show here' }}
          </p>
          <router-link
            v-if="activeFilter === 'all'"
            to="/services"
            class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Browse Services
          </router-link>
        </div>

        <!-- Bookings List -->
        <div v-else class="space-y-4">

          <!-- "All" view: grouped by Upcoming / Past / Cancelled -->
          <template v-if="activeFilter === 'all'">
            <!-- Upcoming -->
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
                      @click="openModal(booking)"
                      class="ml-4 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Past -->
            <div v-if="pastBookings.length > 0" class="mt-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Past Bookings</h3>
              <div class="space-y-3">
                <div
                  v-for="booking in pastBookings"
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
                    <div class="flex items-center gap-3">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                        :class="getStatusClass(booking.status)"
                      >
                        {{ booking.status.toUpperCase() }}
                      </span>
                      <button
                        @click="openModal(booking)"
                        class="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cancelled -->
            <div v-if="cancelledBookings.length > 0" class="mt-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Cancelled</h3>
              <div class="space-y-3">
                <div
                  v-for="booking in cancelledBookings"
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
                    <div class="flex items-center gap-3">
                      <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        CANCELLED
                      </span>
                      <button
                        @click="openModal(booking)"
                        class="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Filtered view (non-"all" tabs) — flat list -->
          <template v-else>
            <div class="space-y-3">
              <div
                v-for="booking in filteredBookings"
                :key="booking.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                :class="['cancelled', 'completed'].includes(booking.status) ? 'bg-gray-50' : ''"
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
                    @click="openModal(booking)"
                    class="ml-4 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard (unchanged) -->
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

    <!-- Therapist Dashboard (unchanged) -->
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

  <!-- Booking Detail Modal (rendered outside the main div so z-index works cleanly) -->
  <BookingDetailModal
    v-if="modalOpen"
    :is-open="modalOpen"
    :booking="selectedBooking"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'
import BookingDetailModal from '@/components/BookingDetailModal.vue'
import { formatDate, formatTime, getStatusClass } from '@/lib/dateUtils'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

// --- Modal state ---
const modalOpen = ref(false)
const selectedBooking = ref({})

function openModal(booking) {
  selectedBooking.value = booking
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

// --- Filter state ---
const activeFilter = ref('all')

// --- Computed: booking categories (single pass optimization) ---
const categorizedBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()

  const result = {
    upcoming: [],
    past: [],
    pending: [],
    cancelled: []
  }

  bookingsStore.myBookings.forEach(b => {
    const bookingDate = new Date(b.booking_date + 'T00:00:00')
    const isInFuture = bookingDate.getTime() >= todayTime

    if (b.status === 'cancelled') {
      result.cancelled.push(b)
    } else if (b.status === 'pending') {
      result.pending.push(b)
    } else if (isInFuture && b.status === 'confirmed') {
      result.upcoming.push(b)
    } else if (!isInFuture && ['confirmed', 'completed'].includes(b.status)) {
      result.past.push(b)
    }
  })

  // Sort each category
  result.upcoming.sort((a, b) => a.booking_date.localeCompare(b.booking_date) || a.start_time.localeCompare(b.start_time))
  result.past.sort((a, b) => b.booking_date.localeCompare(a.booking_date) || b.start_time.localeCompare(a.start_time))
  result.pending.sort((a, b) => a.booking_date.localeCompare(b.booking_date))
  result.cancelled.sort((a, b) => b.booking_date.localeCompare(a.booking_date))

  return result
})

const upcomingBookings = computed(() => categorizedBookings.value.upcoming)
const pastBookings = computed(() => categorizedBookings.value.past)
const pendingBookings = computed(() => categorizedBookings.value.pending)
const cancelledBookings = computed(() => categorizedBookings.value.cancelled)

// --- Filter tabs ---
const filterTabs = computed(() => [
  { key: 'all',        label: 'All',        count: bookingsStore.myBookings.length },
  { key: 'upcoming',   label: 'Upcoming',   count: upcomingBookings.value.length },
  { key: 'pending',    label: 'Pending',    count: pendingBookings.value.length },
  { key: 'past',       label: 'Past',       count: pastBookings.value.length },
  { key: 'cancelled',  label: 'Cancelled',  count: cancelledBookings.value.length }
])

// What the current filter tab resolves to (used for empty-state check + filtered view)
const filteredBookings = computed(() => {
  switch (activeFilter.value) {
    case 'upcoming':  return upcomingBookings.value
    case 'pending':   return pendingBookings.value
    case 'past':      return pastBookings.value
    case 'cancelled': return cancelledBookings.value
    default:          return bookingsStore.myBookings
  }
})

// --- Stats card counts ---
const upcomingCount = computed(() => upcomingBookings.value.length)
const totalCount    = computed(() => bookingsStore.myBookings.length)
const pendingCount  = computed(() => pendingBookings.value.length)

// Helpers imported from @/lib/dateUtils

// --- Data loading ---
async function loadBookings() {
  if (authStore.profile?.role !== 'customer') return
  try {
    await bookingsStore.fetchMyBookings()
  } catch (error) {
    console.error('Failed to load bookings:', error)
  }
}

onMounted(() => {
  if (authStore.profile?.role === 'customer') {
    loadBookings()
  }
})
</script>