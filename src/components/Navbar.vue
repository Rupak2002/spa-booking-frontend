<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-purple-600 hover:text-purple-700">
            Kaya Kesh
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

            <!-- NEW: Therapist Link -->
            <router-link 
              v-if="authStore.isTherapist"
              to="/therapist/availability" 
              class="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              active-class="text-purple-600"
            >
              My Availability
            </router-link>

            <!-- Admin Dropdown (only for admins) -->
            <div v-if="authStore.isAdmin" class="relative" ref="adminMenuRef">
              <button
                @click="showAdminMenu = !showAdminMenu"
                class="flex items-center text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Admin
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showAdminMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
              >
                <router-link
                  to="/admin/services"
                  @click="showAdminMenu = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  Manage Services
                </router-link>
                <router-link
                  to="/admin/therapists"
                  @click="showAdminMenu = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  Manage Therapists
                </router-link>
              </div>
            </div>

            <!-- User Profile -->
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
            class="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg focus:outline-none transition-colors"
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
        <div class="flex flex-col space-y-1">
          <router-link
            to="/"
            class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>

          <router-link
            to="/services"
            class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
            @click="mobileMenuOpen = false"
          >
            Services
          </router-link>

          <template v-if="authStore.profile">
            <router-link
              to="/dashboard"
              class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>

            <!-- Therapist Link (Mobile) -->
            <router-link
              v-if="authStore.isTherapist"
              to="/therapist/availability"
              class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
              @click="mobileMenuOpen = false"
            >
              My Availability
            </router-link>

            <!-- Admin Links (Mobile) -->
            <template v-if="authStore.isAdmin">
              <div class="mt-2 pl-4 border-l-2 border-purple-200 space-y-1">
                <p class="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Admin</p>
                <router-link
                  to="/admin/services"
                  class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                  @click="mobileMenuOpen = false"
                >
                  Manage Services
                </router-link>
                <router-link
                  to="/admin/therapists"
                  class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                  @click="mobileMenuOpen = false"
                >
                  Manage Therapists
                </router-link>
              </div>
            </template>

            <div class="pt-4 mt-2 border-t border-gray-200">
              <p class="text-gray-600 text-sm mb-3 px-3">
                {{ authStore.profile.full_name || authStore.profile.email }}
              </p>
              <button
                @click="handleLogout"
                class="w-full px-4 py-3 min-h-[44px] bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="px-3 py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
              @click="mobileMenuOpen = false"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-3 min-h-[44px] flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const showAdminMenu = ref(false)
const adminMenuRef = ref(null)

const handleLogout = async () => {
  await authStore.signOut()
  mobileMenuOpen.value = false
  showAdminMenu.value = false
  router.push('/login')
}

// Close admin dropdown when clicking outside
const handleClickOutside = (event) => {
  if (adminMenuRef.value && !adminMenuRef.value.contains(event.target)) {
    showAdminMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>