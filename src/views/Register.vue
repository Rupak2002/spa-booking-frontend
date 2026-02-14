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

        <ErrorAlert v-if="errorMessage" :message="errorMessage" />

        <div v-if="!successMessage" class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              required
              autocomplete="name"
              @blur="touch('fullName')"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="fieldErrors.fullName ? 'border-red-400' : 'border-gray-300'"
            />
            <p v-if="fieldErrors.fullName" class="mt-1 text-sm text-red-600">{{ fieldErrors.fullName }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              @blur="touch('email')"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="fieldErrors.email ? 'border-red-400' : 'border-gray-300'"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">{{ fieldErrors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              required
              autocomplete="tel"
              placeholder="+1 (555) 000-0000"
              @blur="touch('phone')"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="fieldErrors.phone ? 'border-red-400' : 'border-gray-300'"
            />
            <p v-if="fieldErrors.phone" class="mt-1 text-sm text-red-600">{{ fieldErrors.phone }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              autocomplete="new-password"
              @blur="touch('password')"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="fieldErrors.password ? 'border-red-400' : 'border-gray-300'"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">{{ fieldErrors.password }}</p>
            <p v-else class="mt-1 text-sm text-gray-500">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {{ authStore.loading ? 'Creating account...' : 'Sign up' }}
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="authStore.loading"
            class="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
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
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import { isValidEmail, isValidPhone, isNotEmpty } from '@/utils/validators'

const authStore = useAuthStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref({ fullName: '', email: '', phone: '', password: '' })

function validateField(field) {
  switch (field) {
    case 'fullName':
      fieldErrors.value.fullName = !isNotEmpty(fullName.value) ? 'Full name is required.' : ''
      break
    case 'email':
      fieldErrors.value.email = !isNotEmpty(email.value)
        ? 'Email is required.'
        : !isValidEmail(email.value)
        ? 'Please enter a valid email address.'
        : ''
      break
    case 'phone':
      fieldErrors.value.phone = !isNotEmpty(phone.value)
        ? 'Phone number is required.'
        : !isValidPhone(phone.value)
        ? 'Please enter a valid phone number.'
        : ''
      break
    case 'password':
      fieldErrors.value.password = !isNotEmpty(password.value)
        ? 'Password is required.'
        : password.value.length < 6
        ? 'Password must be at least 6 characters.'
        : ''
      break
  }
}

function touch(field) {
  validateField(field)
}

function validateAll() {
  ;['fullName', 'email', 'phone', 'password'].forEach(validateField)
  return Object.values(fieldErrors.value).every(e => e === '')
}

const handleGoogleSignIn = async () => {
  errorMessage.value = ''
  const result = await authStore.signInWithGoogle()
  if (result?.error) {
    errorMessage.value = result.error
  }
}

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateAll()) return

  const result = await authStore.signUp(email.value, password.value, fullName.value, phone.value)

  if (result.success) {
    if (result.needsConfirmation) {
      successMessage.value = 'Account created successfully! Please check your email to confirm your account.'
    } else {
      router.push('/dashboard')
    }
  } else {
    errorMessage.value = result.error
  }
}
</script>