<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>
      
      <form class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" @submit.prevent="handleRegister">
        <!-- Success message for email confirmation -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <p class="font-medium">{{ successMessage }}</p>
          <p class="text-sm mt-1">Please check your email inbox (and spam folder) for the confirmation link.</p>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <div v-if="!successMessage" class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p class="mt-1 text-sm text-gray-500">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {{ authStore.loading ? 'Creating account...' : 'Sign up' }}
          </button>

          <div class="text-center">
            <router-link to="/login" class="text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </router-link>
          </div>
        </div>

        <!-- Show login link after successful registration -->
        <div v-else class="text-center">
          <router-link to="/login" class="inline-block mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
            Go to Sign In
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  const result = await authStore.signUp(email.value, password.value, fullName.value)
  
  if (result.success) {
    // Check if email confirmation is required
    if (result.needsConfirmation) {
      successMessage.value = 'Account created successfully! Please check your email to confirm your account.'
    } else {
      // Auto-login is enabled, redirect to dashboard
      router.push('/dashboard')
    }
  } else {
    errorMessage.value = result.error
  }
}
</script>