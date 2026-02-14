<template>
  <div v-if="!authStore.loading" class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer v-if="showFooter" />
    <InstallPrompt />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" message="Loading…" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import LoadingSpinner from './components/ui/LoadingSpinner.vue'

const authStore = useAuthStore()
const route = useRoute()

const showFooter = computed(() => !['Login', 'Register'].includes(route.name))
</script>