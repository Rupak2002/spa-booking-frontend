<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome back!</h1>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 class="font-semibold text-blue-900 mb-2">Your Profile</h2>
          <div class="space-y-1 text-blue-800">
            <p><span class="font-medium">Name:</span> {{ authStore.profile?.full_name }}</p>
            <p><span class="font-medium">Email:</span> {{ authStore.profile?.email }}</p>
            <p><span class="font-medium">Role:</span> {{ authStore.profile?.role }}</p>
            <p><span class="font-medium">Member since:</span> {{ formatDate(authStore.profile?.created_at) }}</p>
          </div>
        </div>
        <!-- Add after the blue profile box, before the closing divs -->
        <div v-if="authStore.isAdmin" class="mt-6">
        <h2 class="text-xl font-semibold mb-4">Admin Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
            to="/admin/services"
            class="bg-white border-2 border-indigo-200 rounded-lg p-6 hover:border-indigo-400 transition"
            >
            <h3 class="font-semibold text-lg text-indigo-600 mb-2">📦 Manage Services</h3>
            <p class="text-gray-600">Add, edit, and manage spa services</p>
            </router-link>
        </div>
        </div>
        <p class="text-gray-600">Your dashboard is ready! Next milestone: Service catalog 🎯</p>
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