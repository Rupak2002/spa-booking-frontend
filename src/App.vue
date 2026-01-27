<template>
  <div v-if="!authStore.loading">
    <!-- Add Navbar here -->
    <Navbar />
    
    <!-- Main content -->
    <router-view />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-xl text-gray-600">Loading...</div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()
</script>