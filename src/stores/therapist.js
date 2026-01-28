import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useTherapistsStore = defineStore('therapists', () => {
  // State
  const therapists = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch all therapists (with user info)
  async function fetchTherapists() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('therapists')
        .select(`
          *,
          user:profiles!therapists_user_id_fkey(
            id,
            email,
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      therapists.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching therapists:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch only active therapists (for customer view)
  async function fetchActiveTherapists() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('therapists')
        .select(`
          *,
          user:profiles!therapists_user_id_fkey(
            id,
            full_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      therapists.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching active therapists:', err)
    } finally {
      loading.value = false
    }
  }

  // Get current user's therapist profile
  async function fetchMyTherapistProfile() {
    loading.value = true
    error.value = null

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { data, error: fetchError } = await supabase
        .from('therapists')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        // If therapist profile doesn't exist, return null (not an error)
        if (fetchError.code === 'PGRST116') {
          return null
        }
        throw fetchError
      }

      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching therapist profile:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create therapist profile (Admin only)
  async function createTherapist(therapistData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('therapists')
        .insert([therapistData])
        .select(`
          *,
          user:profiles!therapists_user_id_fkey(
            id,
            email,
            full_name
          )
        `)
        .single()

      if (createError) throw createError

      therapists.value.unshift(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Update therapist
  async function updateTherapist(id, therapistData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('therapists')
        .update(therapistData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = therapists.value.findIndex(t => t.id === id)
      if (index !== -1) {
        therapists.value[index] = { ...therapists.value[index], ...data }
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Toggle therapist active status
  async function toggleTherapistStatus(id, isActive) {
    return updateTherapist(id, { is_active: isActive })
  }

  return {
    // State
    therapists,
    loading,
    error,

    // Actions
    fetchTherapists,
    fetchActiveTherapists,
    fetchMyTherapistProfile,
    createTherapist,
    updateTherapist,
    toggleTherapistStatus
  }
})