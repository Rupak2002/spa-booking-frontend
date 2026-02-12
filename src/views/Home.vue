<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Welcome to Kaya Kesh
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
      <router-link 
        to="/services" 
        class="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
      >
        Browse Services
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>