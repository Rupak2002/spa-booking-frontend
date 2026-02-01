import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Auth listener cleanup function
  let authListenerUnsubscribe = null

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isTherapist = computed(() => profile.value?.role === 'therapist')

  // Actions
  async function signUp(email, password, fullName) {
    loading.value = true
    error.value = null

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'customer'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) throw signUpError

      // Check if email confirmation is required
      // If session is null, email confirmation is needed
      const needsConfirmation = !data.session && data.user

      if (needsConfirmation) {
        return {
          success: true,
          needsConfirmation: true
        }
      }

      // If session exists, user is automatically logged in (email confirmation disabled)
      user.value = data.user
      await fetchProfile()

      return { success: true, needsConfirmation: false }
    } catch (err) {
      console.error('Signup error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      user.value = data.user
      await fetchProfile()

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null

    try {
      // Clean up auth listener before signing out
      if (authListenerUnsubscribe) {
        authListenerUnsubscribe()
        authListenerUnsubscribe = null
      }

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      user.value = null
      profile.value = null

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!user.value) return

    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (profileError) throw profileError

      profile.value = data
    } catch (err) {
      console.error('Error fetching profile:', err)
      error.value = err.message
    }
  }

  async function initialize() {
    loading.value = true

    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        user.value = session.user
        await fetchProfile()
      }

      // Clean up existing listener if any (prevents duplicate listeners on HMR)
      if (authListenerUnsubscribe) {
        authListenerUnsubscribe()
      }

      // Listen for auth changes and store unsubscribe function
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)

        user.value = session?.user || null

        if (session?.user) {
          await fetchProfile()
        } else {
          profile.value = null
        }
      })

      authListenerUnsubscribe = () => subscription.unsubscribe()
    } catch (err) {
      console.error('Auth initialization error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isTherapist,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    initialize
  }
})
