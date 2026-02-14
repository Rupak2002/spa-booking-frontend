<template>
  <div class="date-selector">
    <h3 class="text-lg font-semibold mb-4">Select a Date</h3>

    <EmptyState
      v-if="availableDates.length === 0"
      icon="calendar"
      title="No Dates Available"
      message="Please select a therapist first."
    />

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="date in availableDates"
        :key="date"
        @click="selectDate(date)"
        class="date-button p-4 border-2 rounded-lg transition-all"
        :class="selectedDate === date 
          ? 'border-purple-600 bg-purple-50 text-purple-700' 
          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'"
      >
        <div class="text-sm font-medium">
          {{ formatDate(date) }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ getSlotsCount(date) }} slot{{ getSlotsCount(date) !== 1 ? 's' : '' }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps({
  availableDates: {
    type: Array,
    required: true
  },
  selectedDate: {
    type: String,
    default: null
  },
  slotsByDate: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

function selectDate(date) {
  emit('select', date)
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.getTime() === today.getTime()) {
    return 'Today'
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    })
  }
}

function getSlotsCount(date) {
  return props.slotsByDate[date]?.length || 0
}
</script>