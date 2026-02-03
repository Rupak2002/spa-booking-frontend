<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Bookings Management</h1>
      <button
        @click="exportToCSV"
        :disabled="filteredBookings.length === 0"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">Total Bookings</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">Pending</h3>
        <p class="text-3xl font-bold text-yellow-600">{{ stats.by_status.pending }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">Confirmed</h3>
        <p class="text-3xl font-bold text-green-600">{{ stats.by_status.confirmed }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">Revenue</h3>
        <p class="text-3xl font-bold text-purple-600">${{ stats.total_revenue.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Therapist Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Therapist</label>
          <select
            v-model="filters.therapist_id"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Therapists</option>
            <option
              v-for="therapist in therapists"
              :key="therapist.id"
              :value="therapist.id"
            >
              {{ therapist.user.full_name }}
            </option>
          </select>
        </div>

        <!-- Start Date Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            type="date"
            v-model="filters.start_date"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- End Date Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            type="date"
            v-model="filters.end_date"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Clear Filters
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="bg-white rounded-lg shadow-md mb-8">
      <div class="border-b border-gray-200 px-6 py-4">
        <div class="flex gap-2">
          <button
            @click="viewMode = 'list'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="viewMode === 'list' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List View
            </span>
          </button>
          <button
            @click="viewMode = 'calendar'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="viewMode === 'calendar' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar View
            </span>
          </button>
        </div>
      </div>

      <!-- LIST VIEW -->
      <div v-if="viewMode === 'list'">
        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading bookings...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-6">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800">{{ error }}</p>
            <button
              @click="loadBookings"
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredBookings.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
          <p class="text-gray-500">Try adjusting your filters</p>
        </div>

        <!-- Bookings Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Therapist</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="booking in filteredBookings"
                :key="booking.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatDate(booking.booking_date) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatTime(booking.start_time) }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ booking.customer.full_name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ booking.customer.email }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ booking.service_name }}</div>
                  <div class="text-sm text-gray-500">{{ booking.service_duration }} min</div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    {{ booking.therapist.user.full_name }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    ${{ booking.service_price }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="getStatusClass(booking.status)"
                  >
                    {{ booking.status.toUpperCase() }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div v-if="['pending', 'confirmed'].includes(booking.status)" class="flex gap-2">
                    <button
                      @click="openRescheduleModal(booking)"
                      class="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Reschedule
                    </button>
                    <span class="text-gray-300">|</span>
                    <button
                      @click="confirmCancel(booking)"
                      class="text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                  <span v-else class="text-gray-400">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CALENDAR VIEW -->
      <div v-else-if="viewMode === 'calendar'" class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading bookings...</p>
        </div>

        <!-- Calendar -->
        <div v-else>
          <!-- Month Navigation -->
          <div class="flex items-center justify-between mb-6">
            <button
              @click="previousMonth"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 class="text-xl font-bold text-gray-900">
              {{ monthNames[currentMonth] }} {{ currentYear }}
            </h2>

            <button
              @click="nextMonth"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Day Headers -->
          <div class="grid grid-cols-7 gap-2 mb-2">
            <div
              v-for="day in dayNames"
              :key="day"
              class="text-center text-xs font-semibold text-gray-600 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in calendarDays"
              :key="day.dateString"
              class="min-h-24 border border-gray-200 rounded-lg p-2"
              :class="{
                'bg-gray-50': !day.isCurrentMonth,
                'bg-white': day.isCurrentMonth,
                'ring-2 ring-purple-500': day.isToday
              }"
            >
              <!-- Date Number -->
              <div
                class="text-sm font-medium mb-1"
                :class="day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'"
              >
                {{ day.date }}
              </div>

              <!-- Bookings on this date -->
              <div class="space-y-1">
                <div
                  v-for="booking in bookingsByDate[day.dateString] || []"
                  :key="booking.id"
                  @click="showBookingDetail(booking)"
                  class="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  :class="getCalendarEventClass(booking.status)"
                >
                  <div class="font-medium truncate">{{ booking.service_name }}</div>
                  <div class="truncate">{{ formatTime(booking.start_time) }}</div>
                  <div class="truncate text-gray-600">{{ booking.customer.full_name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Booking Detail Modal -->
  <div
    v-if="showDetailModal"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/40" @click="showDetailModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Booking Details</h3>
        <button
          @click="showDetailModal = false"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="selectedBooking" class="space-y-3">
        <div>
          <span class="text-sm text-gray-500">Service:</span>
          <p class="font-medium">{{ selectedBooking.service_name }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Customer:</span>
          <p class="font-medium">{{ selectedBooking.customer.full_name }}</p>
          <p class="text-sm text-gray-600">{{ selectedBooking.customer.email }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Therapist:</span>
          <p class="font-medium">{{ selectedBooking.therapist.user.full_name }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Date & Time:</span>
          <p class="font-medium">{{ formatDate(selectedBooking.booking_date) }} at {{ formatTime(selectedBooking.start_time) }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Duration:</span>
          <p class="font-medium">{{ selectedBooking.service_duration }} minutes</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Price:</span>
          <p class="font-medium">${{ selectedBooking.service_price }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Status:</span>
          <span
            class="ml-2 px-2 py-1 rounded-full text-xs font-semibold"
            :class="getStatusClass(selectedBooking.status)"
          >
            {{ selectedBooking.status.toUpperCase() }}
          </span>
        </div>
        <div v-if="selectedBooking.notes">
          <span class="text-sm text-gray-500">Notes:</span>
          <p class="font-medium">{{ selectedBooking.notes }}</p>
        </div>

        <div v-if="['pending', 'confirmed'].includes(selectedBooking.status)" class="pt-4 space-y-2">
          <button
            @click="openRescheduleModal(selectedBooking)"
            class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Reschedule Booking
          </button>
          <button
            @click="confirmCancel(selectedBooking)"
            class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Cancel Confirmation Modal -->
  <div
    v-if="showCancelModal"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/40" @click="showCancelModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Cancel Booking</h3>
      <p class="text-gray-700 mb-2">
        Are you sure you want to cancel this booking?
      </p>
      <div class="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
        <p><strong>Customer:</strong> {{ bookingToCancel?.customer.full_name }}</p>
        <p><strong>Service:</strong> {{ bookingToCancel?.service_name }}</p>
        <p><strong>Date:</strong> {{ formatDate(bookingToCancel?.booking_date) }} at {{ formatTime(bookingToCancel?.start_time) }}</p>
      </div>
      <p class="text-sm text-gray-600 mb-6">
        The time slot will be released and the customer will be notified.
      </p>
      <div class="flex gap-3">
        <button
          @click="handleAdminCancel"
          :disabled="cancelling"
          class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
        >
          {{ cancelling ? 'Cancelling...' : 'Yes, Cancel Booking' }}
        </button>
        <button
          @click="showCancelModal = false"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  </div>
    <!-- Reschedule Modal -->
  <RescheduleModal
      v-if="showRescheduleModal"
      :is-open="showRescheduleModal"
      :booking="bookingToReschedule"
      @close="showRescheduleModal = false"
      @success="handleRescheduleSuccess"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { bookingAPI } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { formatDate, formatTime, getStatusClass } from '@/lib/dateUtils'
import RescheduleModal from '@/components/RescheduleModal.vue'
// State
const bookings = ref([])
const therapists = ref([])
const stats = ref({
  total: 0,
  by_status: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  total_revenue: 0
})
const loading = ref(false)
const error = ref(null)

// View mode
const viewMode = ref('list') // 'list' | 'calendar'

// Calendar state
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Filters
const filters = ref({
  status: '',
  therapist_id: '',
  start_date: '',
  end_date: ''
})

// Modals
const showCancelModal = ref(false)
const showDetailModal = ref(false)
const showRescheduleModal = ref(false)  
const bookingToCancel = ref(null)
const bookingToReschedule = ref(null)   
const selectedBooking = ref(null)
const cancelling = ref(false)

// Computed
const filteredBookings = computed(() => bookings.value)

// Calendar computed
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  
  // Start from Sunday before the first day
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    const isToday = date.getTime() === today.getTime()
    const isCurrentMonth = date.getMonth() === currentMonth.value
    
    days.push({
      date: date.getDate(),
      dateString: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      isCurrentMonth,
      isToday
    })
  }
  
  return days
})

const bookingsByDate = computed(() => {
  const grouped = {}
  
  filteredBookings.value.forEach(booking => {
    const date = booking.booking_date
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(booking)
  })
  
  // Sort bookings within each date by start time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time))
  })
  
  return grouped
})

// Methods
function openRescheduleModal(booking) {
  bookingToReschedule.value = booking
  showRescheduleModal.value = true
  showDetailModal.value = false
  showCancelModal.value = false
}

function handleRescheduleSuccess(payload) {
  // Update the booking in local state
  const index = bookings.value.findIndex(b => b.id === payload.bookingId)
  if (index !== -1) {
    bookings.value[index].booking_date = payload.newDate
    bookings.value[index].start_time = payload.newSlot.start_time
    bookings.value[index].end_time = payload.newSlot.end_time
    bookings.value[index].time_slot_id = payload.newSlot.id
  }
  
  showRescheduleModal.value = false
  bookingToReschedule.value = null
}
async function loadBookings() {
  loading.value = true
  error.value = null

  try {
    const data = await bookingAPI.getAllBookings(filters.value)
    bookings.value = data.bookings
    stats.value = data.stats
  } catch (err) {
    error.value = err.message
    console.error('Load bookings error:', err)
  } finally {
    loading.value = false
  }
}

async function loadTherapists() {
  try {
    const { data } = await supabase
      .from('therapists')
      .select(`
        id,
        user:profiles!therapists_user_id_fkey(
          full_name
        )
      `)
      .eq('is_active', true)

    therapists.value = data || []
  } catch (err) {
    console.error('Load therapists error:', err)
  }
}

function applyFilters() {
  loadBookings()
}

function clearFilters() {
  filters.value = {
    status: '',
    therapist_id: '',
    start_date: '',
    end_date: ''
  }
  loadBookings()
}

function confirmCancel(booking) {
  bookingToCancel.value = booking
  showCancelModal.value = true
  showDetailModal.value = false
}

function showBookingDetail(booking) {
  selectedBooking.value = booking
  showDetailModal.value = true
}

async function handleAdminCancel() {
  if (!bookingToCancel.value) return

  cancelling.value = true
  try {
    await bookingAPI.adminCancelBooking(bookingToCancel.value.id)
    
    // Update local state
    const index = bookings.value.findIndex(b => b.id === bookingToCancel.value.id)
    if (index !== -1) {
      bookings.value[index].status = 'cancelled'
      bookings.value[index].reservation_expires_at = null
    }

    // Recalculate stats
    stats.value.by_status.cancelled++
    if (bookingToCancel.value.status === 'pending') {
      stats.value.by_status.pending--
    } else if (bookingToCancel.value.status === 'confirmed') {
      stats.value.by_status.confirmed--
      stats.value.total_revenue -= parseFloat(bookingToCancel.value.service_price)
    }

    showCancelModal.value = false
    bookingToCancel.value = null
  } catch (err) {
    console.error('Cancel booking error:', err)
    error.value = err.message
  } finally {
    cancelling.value = false
  }
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function getCalendarEventClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border border-green-200',
    completed: 'bg-gray-100 text-gray-800 border border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border border-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function exportToCSV() {
  const headers = ['Date', 'Time', 'Customer', 'Email', 'Service', 'Therapist', 'Price', 'Status']
  const rows = filteredBookings.value.map(b => [
    b.booking_date,
    b.start_time,
    b.customer.full_name,
    b.customer.email,
    b.service_name,
    b.therapist.user.full_name,
    b.service_price,
    b.status
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadBookings()
  loadTherapists()
})
</script>