<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-purple-600 hover:text-purple-700">
            Spa Booking
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            active-class="text-purple-600"
          >
            Home
          </router-link>
          
          <router-link 
            to="/services" 
            class="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            active-class="text-purple-600"
          >
            Services
          </router-link>

          <!-- Show different links based on auth state -->
          <template v-if="authStore.profile">
            <router-link 
              to="/dashboard" 
              class="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              active-class="text-purple-600"
            >
              Dashboard
            </router-link>

            <!-- Admin Link (only for admins) -->
            <router-link 
              v-if="authStore.profile.role === 'admin'"
              to="/admin/services" 
              class="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              active-class="text-purple-600"
            >
              Manage Services
            </router-link>

            <!-- User Profile Dropdown/Button -->
            <div class="flex items-center space-x-4">
              <span class="text-gray-600 text-sm">
                {{ authStore.profile.full_name || authStore.profile.email }}
              </span>
              <button 
                @click="handleLogout"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </template>

          <!-- Login/Register (when not logged in) -->
          <template v-else>
            <router-link 
              to="/login" 
              class="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              active-class="text-purple-600"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign Up
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-purple-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!mobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
        <div class="flex flex-col space-y-4">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-purple-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>
          
          <router-link 
            to="/services" 
            class="text-gray-700 hover:text-purple-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            Services
          </router-link>

          <template v-if="authStore.profile">
            <router-link 
              to="/dashboard" 
              class="text-gray-700 hover:text-purple-600 font-medium"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>

            <router-link 
              v-if="authStore.profile.role === 'admin'"
              to="/admin/services" 
              class="text-gray-700 hover:text-purple-600 font-medium"
              @click="mobileMenuOpen = false"
            >
              Manage Services
            </router-link>

            <div class="pt-4 border-t border-gray-200">
              <p class="text-gray-600 text-sm mb-2">
                {{ authStore.profile.full_name || authStore.profile.email }}
              </p>
              <button 
                @click="handleLogout"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <router-link 
              to="/login" 
              class="text-gray-700 hover:text-purple-600 font-medium"
              @click="mobileMenuOpen = false"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
              @click="mobileMenuOpen = false"
            >
              Sign Up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.signOut()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>