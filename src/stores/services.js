import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useServicesStore = defineStore('services', () => {
  // State
  const services = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order')

      if (fetchError) throw fetchError

      categories.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchServices() {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(id, name)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      services.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching services:', err)
    } finally {
      loading.value = false
    }
  }

  // NEW: Fetch only active services (for customers)
  async function fetchActiveServices() {
    // Prevent duplicate fetches - return existing services if already loading
    if (loading.value) return services.value

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(id, name, icon)
        `)
        .eq('is_active', true)
        .order('name')

      if (fetchError) throw fetchError

      services.value = data || []
      return services.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching active services:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function createService(serviceData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('services')
        .insert([{
          ...serviceData,
          created_by: (await supabase.auth.getUser()).data.user.id
        }])
        .select()
        .single()

      if (createError) throw createError

      services.value.unshift(data)
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateService(id, serviceData) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = services.value.findIndex(s => s.id === id)
      if (index !== -1) {
        services.value[index] = data
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteService(id) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      services.value = services.value.filter(s => s.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function uploadServiceImage(file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `service-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('services')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(filePath)

      return { success: true, url: publicUrl }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // NEW: Helper function to get category name by ID
  function getCategoryName(categoryId) {
    const category = categories.value.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  // NEW: Computed getter - Get services by category
  const getServicesByCategory = computed(() => {
    return (categoryId) => {
      if (!categoryId) return services.value
      return services.value.filter(service => service.category_id === categoryId)
    }
  })

  // NEW: Computed getter - Search services by name/description
  const searchServices = computed(() => {
    return (query) => {
      if (!query) return services.value
      const lowerQuery = query.toLowerCase()
      return services.value.filter(service => 
        service.name.toLowerCase().includes(lowerQuery) ||
        service.description?.toLowerCase().includes(lowerQuery)
      )
    }
  })

  return {
    // State
    services,
    categories,
    loading,
    error,

    // Actions
    fetchCategories,
    fetchServices,
    fetchActiveServices, // NEW
    createService,
    updateService,
    deleteService,
    uploadServiceImage,
    getCategoryName, // NEW - Helper function
    
    // Computed Getters
    getServicesByCategory, // NEW
    searchServices // NEW
  }
})