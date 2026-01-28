<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ authStore.profile?.full_name || 'User' }}!
        </h1>
        <p class="text-gray-600 mt-2">Manage your spa booking experience</p>
      </div>

      <!-- Profile Info Card -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-600">Name:</span>
            <span class="ml-2 text-gray-800">{{ authStore.profile?.full_name }}</span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Email:</span>
            <span class="ml-2 text-gray-800">{{ authStore.profile?.email }}</span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Role:</span>
            <span class="ml-2 px-3 py-1 rounded-full text-sm font-semibold"
              :class="{
                'bg-purple-100 text-purple-800': authStore.isAdmin,
                'bg-green-100 text-green-800': authStore.isTherapist,
                'bg-blue-100 text-blue-800': !authStore.isAdmin && !authStore.isTherapist
              }"
            >
              {{ authStore.profile?.role }}
            </span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-600">Member since:</span>
            <span class="ml-2 text-gray-800">{{ formatDate(authStore.profile?.created_at) }}</span>
          </div>
          <div v-if="authStore.profile?.phone">
            <span class="text-sm font-medium text-gray-600">Phone:</span>
            <span class="ml-2 text-gray-800">{{ authStore.profile.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Admin Actions -->
      <div v-if="authStore.isAdmin" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Admin Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            to="/admin/services"
            class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200"
          >
            <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Manage Services</h3>
              <p class="text-sm text-gray-600">Add, edit, or remove services</p>
            </div>
          </router-link>

          <router-link
            to="/admin/therapists"
            class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200"
          >
            <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Manage Therapists</h3>
              <p class="text-sm text-gray-600">Add and manage therapist profiles</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Therapist Actions -->
      <div v-if="authStore.isTherapist" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Therapist Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            to="/therapist/availability"
            class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border-2 border-green-200"
          >
            <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Manage Availability</h3>
              <p class="text-sm text-gray-600">Set your working hours and schedule</p>
            </div>
          </router-link>

          <div class="flex items-center p-4 bg-gray-50 rounded-lg opacity-50 border-2 border-gray-200">
            <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">My Bookings</h3>
              <p class="text-sm text-gray-600">Coming in Milestone 6</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Actions -->
      <div v-if="!authStore.isAdmin && !authStore.isTherapist" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            to="/services"
            class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border-2 border-blue-200"
          >
            <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Browse Services</h3>
              <p class="text-sm text-gray-600">Explore our spa treatments</p>
            </div>
          </router-link>

          <div class="flex items-center p-4 bg-gray-50 rounded-lg opacity-50 border-2 border-gray-200">
            <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800">Book Appointment</h3>
              <p class="text-sm text-gray-600">Coming in Milestone 6</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats (Optional) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Services</p>
              <p class="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Therapists</p>
              <p class="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">My Bookings</p>
              <p class="text-2xl font-bold text-gray-900">--</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>