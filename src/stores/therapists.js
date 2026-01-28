import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useTherapistsStore = defineStore('therapists', () => {
  // State
  const therapists = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch all therapists with their user profiles
  async function fetchTherapists() {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      // First fetch therapists
      const { data: therapistsData, error: fetchError } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Then fetch associated profiles if therapists have user_id
      if (therapistsData && therapistsData.length > 0) {
        const userIds = therapistsData.map(t => t.user_id).filter(Boolean)

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .in('id', userIds)

          // Merge profile data into therapists
          therapists.value = therapistsData.map(t => ({
            ...t,
            user: profiles?.find(p => p.id === t.user_id) || null
          }))
        } else {
          therapists.value = therapistsData
        }
      } else {
        therapists.value = []
      }

      return { success: true }
    } catch (err) {
      console.error('Error fetching therapists:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Create a new therapist
  async function createTherapist(therapistData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('therapists')
        .insert([therapistData])
        .select(`
          *,
          user:profiles(id, full_name, email, avatar_url)
        `)
        .single()

      if (createError) throw createError

      therapists.value.unshift(data)
      return { success: true, data }
    } catch (err) {
      console.error('Error creating therapist:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Update a therapist
  async function updateTherapist(id, therapistData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('therapists')
        .update(therapistData)
        .eq('id', id)
        .select(`
          *,
          user:profiles(id, full_name, email, avatar_url)
        `)
        .single()

      if (updateError) throw updateError

      const index = therapists.value.findIndex(t => t.id === id)
      if (index !== -1) {
        therapists.value[index] = data
      }

      return { success: true, data }
    } catch (err) {
      console.error('Error updating therapist:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Fetch therapist profile for the currently logged-in user
  async function fetchMyTherapistProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error: fetchError } = await supabase
        .from('therapists')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      console.error('Error fetching therapist profile:', err)
      return null
    }
  }

  // Toggle therapist active status
  async function toggleTherapistStatus(id, isActive) {
    return await updateTherapist(id, { is_active: isActive })
  }

  // Delete a therapist
  async function deleteTherapist(id) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('therapists')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      therapists.value = therapists.value.filter(t => t.id !== id)
      return { success: true }
    } catch (err) {
      console.error('Error deleting therapist:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    therapists,
    loading,
    error,
    fetchTherapists,
    fetchMyTherapistProfile,
    createTherapist,
    updateTherapist,
    toggleTherapistStatus,
    deleteTherapist
  }
})
