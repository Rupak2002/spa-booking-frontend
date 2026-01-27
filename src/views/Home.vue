<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="text-2xl font-bold text-indigo-600">SpaBooking</div>
          <div class="space-x-4">
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="text-gray-700 hover:text-indigo-600">Login</router-link>
              <router-link to="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Sign Up
              </router-link>
            </template>
            <template v-else>
              <router-link to="/dashboard" class="text-gray-700 hover:text-indigo-600">Dashboard</router-link>
              <button @click="handleLogout" class="text-gray-700 hover:text-indigo-600">Logout</button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Welcome to Your Spa Booking System
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Book your relaxation sessions with ease
      </p>
      <router-link 
        v-if="!authStore.isAuthenticated"
        to="/register" 
        class="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 inline-block"
      >
        Get Started
      </router-link>
      <router-link 
        v-else
        to="/dashboard" 
        class="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 inline-block"
      >
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/')
}
</script>