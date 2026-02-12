<template>
  <div v-if="!authStore.loading">
    <Navbar />
    <router-view />
    <InstallPrompt />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-xl text-gray-600">Loading...</div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import InstallPrompt from './components/InstallPrompt.vue'

const authStore = useAuthStore()
</script>