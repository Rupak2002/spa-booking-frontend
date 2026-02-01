import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bookingAPI } from '@/lib/api'

/**
 * Bookings Store
 * Manages booking state and API interactions
 */
export const useBookingsStore = defineStore('bookings', () => {
  // State
  const availableSlots = ref([])
  const currentBooking = ref(null)
  const myBookings = ref([])
  const activeOperations = ref(0) // Track concurrent operations
  const error = ref(null)

  // Computed loading state based on active operations
  const loading = computed(() => activeOperations.value > 0)

  // Computed - Group slots by therapist
  const slotsByTherapist = computed(() => {
    const grouped = {}
    
    availableSlots.value.forEach(slot => {
      const therapistId = slot.therapist_id
      if (!grouped[therapistId]) {
        grouped[therapistId] = {
          therapist: slot.therapist,
          slots: []
        }
      }
      grouped[therapistId].slots.push(slot)
    })
    
    return grouped
  })

  // Computed - Group slots by date
  const slotsByDate = computed(() => {
    const grouped = {}
    
    availableSlots.value.forEach(slot => {
      const date = slot.slot_date
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(slot)
    })
    
    return grouped
  })

  // Computed - Get unique dates with available slots
  const availableDates = computed(() => {
    return [...new Set(availableSlots.value.map(slot => slot.slot_date))].sort()
  })

  /**
   * Fetch available slots for a service
   * Optionally filter by therapist and date range
   */
  async function fetchAvailableSlots(serviceId, startDate, endDate = null) {
    activeOperations.value++
    error.value = null

    try {
      const slots = await bookingAPI.getAvailableSlots(serviceId, startDate, endDate)
      availableSlots.value = slots
      return slots
    } catch (err) {
      error.value = err.message
      console.error('Fetch slots error:', err)
      throw err
    } finally {
      activeOperations.value--
    }
  }

  /**
   * Create a PENDING reservation
   * Returns booking with 5-minute expiry
   */
  async function createReservation(reservationData) {
    activeOperations.value++
    error.value = null

    try {
      const response = await bookingAPI.createReservation(reservationData)
      currentBooking.value = response.data.booking
      return response
    } catch (err) {
      error.value = err.message
      console.error('Create reservation error:', err)
      throw err
    } finally {
      activeOperations.value--
    }
  }

  /**
   * Confirm a PENDING reservation (after payment)
   */
  async function confirmReservation(bookingId) {
    activeOperations.value++
    error.value = null

    try {
      const response = await bookingAPI.confirmReservation(bookingId)
      currentBooking.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      console.error('Confirm reservation error:', err)
      throw err
    } finally {
      activeOperations.value--
    }
  }

  /**
   * Fetch customer's booking history
   */
  async function fetchMyBookings() {
    activeOperations.value++
    error.value = null

    try {
      const bookings = await bookingAPI.getMyBookings()
      myBookings.value = bookings.all
      return bookings
    } catch (err) {
      error.value = err.message
      console.error('Fetch my bookings error:', err)
      throw err
    } finally {
      activeOperations.value--
    }
  }

  /**
   * Filter slots by therapist
   */
  function getSlotsByTherapist(therapistId) {
    return availableSlots.value.filter(slot => slot.therapist_id === therapistId)
  }

  /**
   * Filter slots by date
   */
  function getSlotsByDate(date) {
    return availableSlots.value.filter(slot => slot.slot_date === date)
  }

  /**
   * Get slots for specific therapist on specific date
   */
  function getSlotsByTherapistAndDate(therapistId, date) {
    return availableSlots.value.filter(
      slot => slot.therapist_id === therapistId && slot.slot_date === date
    )
  }

  /**
   * Clear current booking (for cleanup)
   */
/**
   * Cancel a booking and update the local list reactively
   */
  async function cancelBooking(bookingId) {
    activeOperations.value++
    error.value = null

    try {
      const response = await bookingAPI.cancelBooking(bookingId)

      // Update the booking in myBookings reactively — no refetch needed
      const index = myBookings.value.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        myBookings.value[index] = response.data
      }

      return response
    } catch (err) {
      error.value = err.message
      console.error('Cancel booking error:', err)
      throw err
    } finally {
      activeOperations.value--
    }
  }

  /**
   * Clear current booking (for cleanup)
   */
  function clearCurrentBooking() {
    currentBooking.value = null
  }

  return {
    // State
    availableSlots,
    currentBooking,
    myBookings,
    loading,
    error,

    // Computed
    slotsByTherapist,
    slotsByDate,
    availableDates,

    // Actions
    fetchAvailableSlots,
    createReservation,
    confirmReservation,
    fetchMyBookings,
    cancelBooking,
    getSlotsByTherapist,
    getSlotsByDate,
    getSlotsByTherapistAndDate,
    clearCurrentBooking
  }
})