<template>
  <div v-if="!authStore.loading">
    <router-view />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-xl text-gray-600">Loading...</div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>