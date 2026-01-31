<template>
  <div class="time-slot-selector">
    <h3 class="text-lg font-semibold mb-4">Select a Time</h3>

    <div v-if="timeSlots.length === 0" class="text-center py-8 text-gray-600">
      <p>No time slots available for this date.</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <button
        v-for="slot in timeSlots"
        :key="slot.id"
        @click="selectSlot(slot)"
        class="time-slot-button p-3 border-2 rounded-lg transition-all"
        :class="selectedSlotId === slot.id 
          ? 'border-purple-600 bg-purple-50 text-purple-700' 
          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'"
      >
        <div class="font-semibold">
          {{ formatTime(slot.start_time) }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ getDuration(slot) }} min
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  timeSlots: {
    type: Array,
    required: true
  },
  selectedSlotId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

function selectSlot(slot) {
  emit('select', slot)
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

function getDuration(slot) {
  const [startHour, startMin] = slot.start_time.split(':').map(Number)
  const [endHour, endMin] = slot.end_time.split(':').map(Number)
  const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  return duration
}
</script>