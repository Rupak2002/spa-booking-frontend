import axios from 'axios'
import { supabase } from './supabase'

/**
 * API Client for Backend Communication
 * 
 * Automatically attaches JWT token to requests
 * Handles errors consistently
 */

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request Interceptor
 * Automatically adds JWT token to every request
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Get current session from Supabase
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles errors consistently and token expiry
 */
apiClient.interceptors.response.use(
  (response) => response.data, // Return just the data
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - Supabase will auto-refresh
      // Retry the request once
      const originalRequest = error.config
      
      if (!originalRequest._retry) {
        originalRequest._retry = true
        
        // Wait for Supabase to refresh token
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Retry with new token
        return apiClient(originalRequest)
      }
    }
    
    // Extract error message
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

/**
 * Booking API Methods
 */
export const bookingAPI = {
  /**
   * Get available time slots for a service
   */
  async getAvailableSlots(serviceId, startDate, endDate = null) {
    const params = { service_id: serviceId, start_date: startDate }
    if (endDate) params.end_date = endDate
    
    const data = await apiClient.get('/bookings/available-slots', { params })
    return data.data // Extract the slots array
  },

  /**
   * Create a PENDING reservation (5-minute hold)
   */
  async createReservation(reservationData) {
    return await apiClient.post('/bookings/reserve', reservationData)
  },

  /**
   * Confirm a PENDING reservation
   */
  async confirmReservation(bookingId) {
    return await apiClient.post(`/bookings/${bookingId}/confirm`)
  },

  /**
   * Get customer's booking history
   */
  async getMyBookings() {
    const data = await apiClient.get('/bookings/my-bookings')
    return data.data // { all: [], grouped: {} }
  }
}

export default apiClient