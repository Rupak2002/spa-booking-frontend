<template>
  <div class="rounded-lg border p-4" :class="styles.bg" role="alert">
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <svg
        class="w-5 h-5 shrink-0 mt-0.5"
        :class="styles.icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <!-- Error: X circle -->
        <path
          v-if="variant === 'error'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <!-- Warning: exclamation triangle -->
        <path
          v-else-if="variant === 'warning'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
        <!-- Info: info circle -->
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <p v-if="title !== ''" class="font-semibold text-sm" :class="styles.title">{{ title }}</p>
        <p class="text-sm" :class="[title !== '' ? 'mt-1' : '', styles.message]">{{ message }}</p>

        <button
          v-if="showRetry"
          @click="$emit('retry')"
          class="mt-3 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          :class="styles.retryBtn"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'error',
    validator: (v) => ['error', 'warning', 'info'].includes(v)
  }
})

defineEmits(['retry'])

const styles = computed(() => ({
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-700',
    retryBtn: 'bg-red-100 text-red-800 hover:bg-red-200'
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    retryBtn: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-700',
    retryBtn: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  }
}[props.variant]))
</script>
