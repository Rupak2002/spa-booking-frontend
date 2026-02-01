<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header with Service Info -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-start gap-6">
        <img 
          v-if="service?.image_url" 
          :src="service.image_url" 
          :alt="service.name"
          class="w-24 h-24 object-cover rounded-lg"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900">{{ service?.name }}</h1>
          <p class="text-gray-600 mt-2">{{ service?.description }}</p>
          <div class="flex gap-4 mt-4">
            <span class="text-lg font-semibold text-purple-600">
              ${{ service?.price }}
            </span>
            <span class="text-gray-600">
              {{ service?.duration }} minutes
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Booking Steps -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex-1 flex items-center"
          >
            <div class="flex items-center gap-2">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                :class="currentStep >= index + 1 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'"
              >
                {{ index + 1 }}
              </div>
              <span 
                class="text-sm font-medium hidden md:inline"
                :class="currentStep >= index + 1 ? 'text-purple-600' : 'text-gray-600'"
              >
                {{ step }}
              </span>
            </div>
            <div 
              v-if="index < steps.length - 1" 
              class="flex-1 h-1 mx-4"
              :class="currentStep > index + 1 ? 'bg-purple-600' : 'bg-gray-200'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step 1: Select Therapist -->
      <div v-show="currentStep === 1" class="mb-8">
        <TherapistSelector
          :slots-by-therapist="bookingsStore.slotsByTherapist"
          :selected-therapist-id="selectedTherapistId"
          :loading="bookingsStore.loading"
          @select="handleTherapistSelect"
        />
      </div>

      <!-- Step 2: Select Date -->
      <div v-show="currentStep === 2" class="mb-8">
        <DateSelector
          :available-dates="therapistAvailableDates"
          :selected-date="selectedDate"
          :slots-by-date="therapistSlotsByDate"
          @select="handleDateSelect"
        />
      </div>

      <!-- Step 3: Select Time -->
      <div v-show="currentStep === 3" class="mb-8">
        <TimeSlotSelector
          :time-slots="availableTimeSlotsForDate"
          :selected-slot-id="selectedSlot?.id"
          @select="handleSlotSelect"
        />
      </div>

      <!-- Step 4: Booking Details -->
      <div v-show="currentStep === 4" class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Booking Details</h3>
        
        <!-- Summary -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Service</p>
              <p class="font-semibold">{{ service?.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Therapist</p>
              <p class="font-semibold">{{ selectedTherapist?.user?.full_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Date</p>
              <p class="font-semibold">{{ formatFullDate(selectedDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Time</p>
              <p class="font-semibold">{{ formatTime(selectedSlot?.start_time) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Duration</p>
              <p class="font-semibold">{{ service?.duration }} minutes</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Price</p>
              <p class="font-semibold text-purple-600">${{ service?.price }}</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Special Requests or Notes (Optional)
          </label>
          <textarea
            v-model="notes"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Any special requests, preferences, or health considerations..."
          ></textarea>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between pt-6 border-t">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < 4"
          @click="nextStep"
          :disabled="!canProceed"
          class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue →
        </button>

        <button
          v-else
          @click="createReservation"
          :disabled="submitting"
          class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span v-if="submitting">Creating Reservation...</span>
          <span v-else>Confirm Booking</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { useBookingsStore } from '@/stores/bookings'
import TherapistSelector from '@/components/TherapistSelector.vue'
import DateSelector from '@/components/DateSelector.vue'
import TimeSlotSelector from '@/components/TimeSlotSelector.vue'
import { formatTime, formatFullDate } from '@/lib/dateUtils'

const route = useRoute()
const router = useRouter()
const servicesStore = useServicesStore()
const bookingsStore = useBookingsStore()

// State
const serviceId = ref(route.params.serviceId)
const service = ref(null)
const currentStep = ref(1)
const selectedTherapistId = ref(null)
const selectedDate = ref(null)
const selectedSlot = ref(null)
const notes = ref('')
const submitting = ref(false)
const error = ref(null)

const steps = ['Therapist', 'Date', 'Time', 'Confirm']

// Computed - Selected therapist object
const selectedTherapist = computed(() => {
  if (!selectedTherapistId.value) return null
  const therapistData = bookingsStore.slotsByTherapist[selectedTherapistId.value]
  return therapistData?.therapist || null
})

// Computed - Available dates for selected therapist
const therapistAvailableDates = computed(() => {
  if (!selectedTherapistId.value) return []
  const slots = bookingsStore.getSlotsByTherapist(selectedTherapistId.value)
  return [...new Set(slots.map(slot => slot.slot_date))].sort()
})

// Computed - Slots grouped by date for selected therapist
const therapistSlotsByDate = computed(() => {
  if (!selectedTherapistId.value) return {}
  const slots = bookingsStore.getSlotsByTherapist(selectedTherapistId.value)
  const grouped = {}
  slots.forEach(slot => {
    if (!grouped[slot.slot_date]) grouped[slot.slot_date] = []
    grouped[slot.slot_date].push(slot)
  })
  return grouped
})

// Computed - Available time slots for selected date
const availableTimeSlotsForDate = computed(() => {
  if (!selectedTherapistId.value || !selectedDate.value) return []
  return bookingsStore.getSlotsByTherapistAndDate(selectedTherapistId.value, selectedDate.value)
})

// Computed - Can proceed to next step
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return !!selectedTherapistId.value
    case 2: return !!selectedDate.value
    case 3: return !!selectedSlot.value
    case 4: return true
    default: return false
  }
})

// Methods
function handleTherapistSelect(therapistId) {
  selectedTherapistId.value = therapistId
  // Reset subsequent selections
  selectedDate.value = null
  selectedSlot.value = null
}

function handleDateSelect(date) {
  selectedDate.value = date
  // Reset time slot
  selectedSlot.value = null
}

function handleSlotSelect(slot) {
  selectedSlot.value = slot
}

function nextStep() {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function createReservation() {
  if (submitting.value) return
  
  submitting.value = true
  error.value = null

  try {
    const reservationData = {
      service_id: serviceId.value,
      therapist_id: selectedTherapistId.value,
      time_slot_id: selectedSlot.value.id,
      notes: notes.value || null
    }

    const response = await bookingsStore.createReservation(reservationData)
    
    // Success - redirect to confirmation page
    router.push({
      name: 'BookingConfirmation',
      params: { bookingId: response.data.booking.id }
    })
  } catch (err) {
    error.value = err.message || 'Failed to create reservation. Please try again.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    submitting.value = false
  }
}

// Formatting helpers imported from @/lib/dateUtils

// Load data on mount
onMounted(async () => {
  try {
    // Fetch service details
    const services = await servicesStore.fetchActiveServices()
    service.value = services.find(s => s.id === serviceId.value)
    
    if (!service.value) {
      error.value = 'Service not found'
      return
    }

    // Fetch available slots (next 30 days)
    const today = new Date().toISOString().split('T')[0]
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    const endDateStr = endDate.toISOString().split('T')[0]
    
    await bookingsStore.fetchAvailableSlots(serviceId.value, today, endDateStr)
    
    if (bookingsStore.availableSlots.length === 0) {
      error.value = 'No available time slots for this service at the moment.'
    }
  } catch (err) {
    error.value = 'Failed to load booking information. Please try again.'
    console.error('Load booking data error:', err)
  }
})
</script>