<template>
  <div
    class="flex flex-col items-center justify-center"
    role="status"
    :aria-label="message || 'Loading'"
  >
    <div
      class="animate-spin rounded-full border-b-2 border-purple-600"
      :class="sizeClass"
      aria-hidden="true"
    ></div>
    <p v-if="message" class="mt-4 text-gray-600 text-sm">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  message: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => ({
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
}[props.size]))
</script>
