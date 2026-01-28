<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Availability</h1>
        <p class="text-gray-600 mt-2">Manage your available time slots for bookings</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Loading your schedule...</p>
      </div>

      <!-- Not a Therapist Error -->
      <div v-else-if="!therapistProfile" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p class="text-yellow-800">You don't have a therapist profile. Please contact an administrator.</p>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Week Navigation -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between">
            <button
              @click="previousWeek"
              class="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous Week
            </button>

            <div class="text-center">
              <h2 class="text-xl font-semibold text-gray-800">
                {{ formatWeekRange(currentWeekStart) }}
              </h2>
              <button
                @click="goToToday"
                class="text-sm text-purple-600 hover:text-purple-700 mt-1"
              >
                Today
              </button>
            </div>

            <button
              @click="nextWeek"
              class="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Next Week
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mb-6">
          <button
            @click="showCreateSlotModal = true"
            class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add Time Slot
          </button>
          
          <button
            @click="showBulkCreateModal = true"
            class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            📅 Bulk Create (Copy to Multiple Days)
          </button>
        </div>

        <!-- Weekly Calendar Grid -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Days of Week Header -->
          <div class="grid grid-cols-7 border-b border-gray-200">
            <div
              v-for="day in weekDays"
              :key="day.date"
              class="p-4 text-center border-r border-gray-200 last:border-r-0"
              :class="{ 'bg-purple-50': isToday(day.date) }"
            >
              <div class="text-sm font-semibold text-gray-600">
                {{ formatDayName(day.date) }}
              </div>
              <div class="text-2xl font-bold mt-1" :class="isToday(day.date) ? 'text-purple-600' : 'text-gray-800'">
                {{ formatDayNumber(day.date) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatMonthName(day.date) }}
              </div>
            </div>
          </div>

          <!-- Time Slots Grid -->
          <div class="grid grid-cols-7">
            <div
              v-for="day in weekDays"
              :key="day.date"
              class="min-h-[400px] p-3 border-r border-gray-100 last:border-r-0"
              :class="{ 'bg-purple-50/30': isToday(day.date) }"
            >
              <!-- Time Slots for This Day -->
              <div class="space-y-2">
                <div
                  v-for="slot in getTimeSlotsForDay(day.date)"
                  :key="slot.id"
                  class="p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md"
                  :class="[
                    slot.is_available 
                      ? 'bg-green-50 border-green-500 hover:bg-green-100' 
                      : 'bg-gray-50 border-gray-400 hover:bg-gray-100'
                  ]"
                  @click="editSlot(slot)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="font-semibold text-sm text-gray-800">
                        {{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time) }}
                      </div>
                      <div class="text-xs text-gray-600 mt-1">
                        {{ calculateDuration(slot.start_time, slot.end_time) }} min
                      </div>
                      <div class="mt-1">
                        <span 
                          class="text-xs px-2 py-1 rounded-full"
                          :class="slot.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'"
                        >
                          {{ slot.is_available ? 'Available' : 'Unavailable' }}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      @click.stop="deleteSlot(slot)"
                      class="text-red-500 hover:text-red-700 ml-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Empty State for Day -->
                <div v-if="getTimeSlotsForDay(day.date).length === 0" class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p class="text-sm text-gray-400 mt-2">No slots</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Slots This Week</p>
                <p class="text-2xl font-bold text-gray-900">{{ weekSlots.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Available Slots</p>
                <p class="text-2xl font-bold text-gray-900">{{ availableSlotsCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Hours</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalHours }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Time Slot Modal -->
    <TimeSlotFormModal
      v-if="showCreateSlotModal || editingSlot"
      :slot="editingSlot"
      :therapist-id="therapistProfile?.id"
      :default-date="selectedDate"
      @close="closeSlotModal"
      @save="handleSlotSaved"
    />

    <!-- Bulk Create Modal -->
    <BulkCreateModal
      v-if="showBulkCreateModal"
      :therapist-id="therapistProfile?.id"
      @close="showBulkCreateModal = false"
      @save="handleBulkCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTherapistsStore } from '../../stores/therapists'
import { useTimeSlotsStore } from '../../stores/timeSlots'
import TimeSlotFormModal from '../../components/TimeSlotFormModal.vue'
import BulkCreateModal from '../../components/BulkCreateModal.vue'

const therapistsStore = useTherapistsStore()
const timeSlotsStore = useTimeSlotsStore()

const loading = ref(true)
const therapistProfile = ref(null)
const currentWeekStart = ref(getMonday(new Date()))
const showCreateSlotModal = ref(false)
const showBulkCreateModal = ref(false)
const editingSlot = ref(null)
const selectedDate = ref(null)

// Computed
const weekDays = computed(() => {
  const days = []
  const start = new Date(currentWeekStart.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({ date: formatDate(date) })
  }
  
  return days
})

const weekSlots = computed(() => timeSlotsStore.timeSlots)

const availableSlotsCount = computed(() => {
  return weekSlots.value.filter(slot => slot.is_available).length
})

const totalHours = computed(() => {
  let minutes = 0
  weekSlots.value.forEach(slot => {
    minutes += timeSlotsStore.getSlotDuration(slot.start_time, slot.end_time)
  })
  return (minutes / 60).toFixed(1)
})

// Methods
function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

function formatWeekRange(startDate) {
  const start = new Date(startDate)
  const end = new Date(startDate)
  end.setDate(start.getDate() + 6)
  
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function formatDayName(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
}

function formatDayNumber(date) {
  return new Date(date).getDate()
}

function formatMonthName(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short' })
}

function isToday(date) {
  const today = new Date()
  const checkDate = new Date(date)
  return today.toDateString() === checkDate.toDateString()
}

function formatTime(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

function calculateDuration(startTime, endTime) {
  return timeSlotsStore.getSlotDuration(startTime, endTime)
}

function getTimeSlotsForDay(date) {
  return weekSlots.value.filter(slot => slot.slot_date === date)
}

function previousWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
  loadWeekSlots()
}

function nextWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
  loadWeekSlots()
}

function goToToday() {
  currentWeekStart.value = getMonday(new Date())
  loadWeekSlots()
}

function editSlot(slot) {
  editingSlot.value = slot
}

function closeSlotModal() {
  showCreateSlotModal.value = false
  editingSlot.value = null
  selectedDate.value = null
}

async function handleSlotSaved() {
  await loadWeekSlots()
  closeSlotModal()
}

async function handleBulkCreated() {
  await loadWeekSlots()
  showBulkCreateModal.value = false
}

async function deleteSlot(slot) {
  const confirmed = confirm(
    `Delete time slot ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)} on ${new Date(slot.slot_date).toLocaleDateString()}?`
  )

  if (confirmed) {
    const result = await timeSlotsStore.deleteTimeSlot(slot.id)
    if (result.success) {
      alert('Time slot deleted successfully!')
      await loadWeekSlots()
    } else {
      alert('Error deleting slot: ' + result.error)
    }
  }
}

async function loadWeekSlots() {
  if (!therapistProfile.value) return

  const startDate = formatDate(currentWeekStart.value)
  const endDate = formatDate(new Date(new Date(currentWeekStart.value).setDate(currentWeekStart.value.getDate() + 6)))

  await timeSlotsStore.fetchTimeSlots(therapistProfile.value.id, startDate, endDate)
}

async function initialize() {
  loading.value = true

  try {
    // Get therapist profile for current user
    therapistProfile.value = await therapistsStore.fetchMyTherapistProfile()

    if (therapistProfile.value) {
      await loadWeekSlots()
    }
  } catch (error) {
    console.error('Error initializing:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initialize()
})
</script>