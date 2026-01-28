import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useTimeSlotsStore = defineStore('timeSlots', () => {
  // State
  const timeSlots = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch time slots for a therapist (with date range)
  async function fetchTimeSlots(therapistId, startDate, endDate) {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('time_slots')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (startDate) {
        query = query.gte('slot_date', startDate)
      }
      if (endDate) {
        query = query.lte('slot_date', endDate)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      timeSlots.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching time slots:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch available slots for a service (for customer booking)
  async function fetchAvailableSlots(serviceId, startDate, endDate) {
    loading.value = true
    error.value = null

    try {
      // Get service duration
      const { data: service } = await supabase
        .from('services')
        .select('duration')
        .eq('id', serviceId)
        .single()

      if (!service) throw new Error('Service not found')

      // Fetch available time slots
      let query = supabase
        .from('time_slots')
        .select(`
          *,
          therapist:therapists(
            id,
            specialization,
            user:profiles!therapists_user_id_fkey(full_name)
          )
        `)
        .eq('is_available', true)
        .gte('slot_date', startDate || new Date().toISOString().split('T')[0])

      if (endDate) {
        query = query.lte('slot_date', endDate)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Filter slots that are long enough for the service
      const filteredSlots = data.filter(slot => {
        const duration = getSlotDuration(slot.start_time, slot.end_time)
        return duration >= service.duration
      })

      timeSlots.value = filteredSlots
      return filteredSlots
    } catch (err) {
      error.value = err.message
      console.error('Error fetching available slots:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Create a single time slot
  async function createTimeSlot(slotData) {
    loading.value = true
    error.value = null

    try {
      // Validate no overlap
      const overlap = await checkOverlap(
        slotData.therapist_id,
        slotData.slot_date,
        slotData.start_time,
        slotData.end_time
      )

      if (overlap) {
        throw new Error('This time slot overlaps with an existing slot')
      }

      const { data, error: createError } = await supabase
        .from('time_slots')
        .insert([slotData])
        .select()
        .single()

      if (createError) throw createError

      timeSlots.value.push(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Create multiple time slots (bulk)
  async function createBulkTimeSlots(slots) {
    loading.value = true
    error.value = null

    try {
      // Validate all slots for overlaps
      for (const slot of slots) {
        const overlap = await checkOverlap(
          slot.therapist_id,
          slot.slot_date,
          slot.start_time,
          slot.end_time
        )

        if (overlap) {
          throw new Error(`Overlap detected on ${slot.slot_date} at ${slot.start_time}`)
        }
      }

      const { data, error: createError } = await supabase
        .from('time_slots')
        .insert(slots)
        .select()

      if (createError) throw createError

      timeSlots.value.push(...data)
      return { success: true, data, count: data.length }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Update time slot
  async function updateTimeSlot(id, slotData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('time_slots')
        .update(slotData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = timeSlots.value.findIndex(s => s.id === id)
      if (index !== -1) {
        timeSlots.value[index] = data
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Delete time slot
  async function deleteTimeSlot(id) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      timeSlots.value = timeSlots.value.filter(s => s.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Toggle slot availability
  async function toggleSlotAvailability(id, isAvailable) {
    return updateTimeSlot(id, { is_available: isAvailable })
  }

  // Helper: Check for overlapping slots
  async function checkOverlap(therapistId, date, startTime, endTime, excludeId = null) {
    try {
      let query = supabase
        .from('time_slots')
        .select('id')
        .eq('therapist_id', therapistId)
        .eq('slot_date', date)

      if (excludeId) {
        query = query.neq('id', excludeId)
      }

      const { data, error } = await query

      if (error) throw error

      // Check if any existing slot overlaps with the new slot
      for (const slot of data) {
        const { data: existingSlot } = await supabase
          .from('time_slots')
          .select('start_time, end_time')
          .eq('id', slot.id)
          .single()

        if (existingSlot) {
          const overlap = timeRangesOverlap(
            startTime, endTime,
            existingSlot.start_time, existingSlot.end_time
          )
          
          if (overlap) return true
        }
      }

      return false
    } catch (err) {
      console.error('Error checking overlap:', err)
      return false
    }
  }

  // Helper: Check if two time ranges overlap
  function timeRangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && end1 > start2
  }

  // Helper: Calculate slot duration in minutes
  function getSlotDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    return (endHour * 60 + endMin) - (startHour * 60 + startMin)
  }

  return {
    // State
    timeSlots,
    loading,
    error,

    // Actions
    fetchTimeSlots,
    fetchAvailableSlots,
    createTimeSlot,
    createBulkTimeSlots,
    updateTimeSlot,
    deleteTimeSlot,
    toggleSlotAvailability,
    checkOverlap,
    getSlotDuration
  }
})