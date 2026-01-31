<template>
  <div class="countdown-timer">
    <div v-if="!expired" class="flex items-center gap-2">
      <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="font-semibold" :class="urgent ? 'text-red-600' : 'text-yellow-600'">
        Time remaining: {{ formattedTime }}
      </span>
    </div>
    <div v-else class="text-red-600 font-semibold">
      ⚠️ Reservation expired
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  expiresAt: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['expired'])

const timeRemaining = ref(0) // seconds
const interval = ref(null)

// Computed - Check if expired
const expired = computed(() => timeRemaining.value <= 0)

// Computed - Urgent warning (less than 1 minute)
const urgent = computed(() => timeRemaining.value < 60)

// Computed - Format time as MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60)
  const seconds = timeRemaining.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Calculate remaining time
function updateTimer() {
  const now = new Date()
  const expires = new Date(props.expiresAt)
  const diff = Math.floor((expires - now) / 1000)
  
  timeRemaining.value = Math.max(0, diff)
  
  if (timeRemaining.value === 0) {
    emit('expired')
    clearInterval(interval.value)
  }
}

onMounted(() => {
  updateTimer()
  interval.value = setInterval(updateTimer, 1000) // Update every second
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>

<style scoped>
@reference "tailwindcss";

.countdown-timer {
  @apply p-4 bg-yellow-50 border border-yellow-200 rounded-lg;
}
</style>