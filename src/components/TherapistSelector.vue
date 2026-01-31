<template>
  <div class="therapist-selector">
    <h3 class="text-lg font-semibold mb-4">Select a Therapist</h3>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading therapists...</p>
    </div>

    <div v-else-if="therapistsWithSlots.length === 0" class="text-center py-8 text-gray-600">
      <p>No therapists available for this service at the moment.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in therapistsWithSlots"
        :key="item.therapist.id"
        @click="selectTherapist(item.therapist.id)"
        class="therapist-card p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="selectedTherapistId === item.therapist.id 
          ? 'border-purple-600 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-semibold text-lg">
              {{ item.therapist.user?.full_name || 'Unknown' }}
            </h4>
            <p class="text-sm text-gray-600 mt-1">
              {{ item.therapist.specialization }}
            </p>
            <p class="text-xs text-gray-500 mt-2">
              {{ item.slots.length }} time slot{{ item.slots.length !== 1 ? 's' : '' }} available
            </p>
          </div>
          <div v-if="selectedTherapistId === item.therapist.id" 
               class="text-purple-600">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  slotsByTherapist: {
    type: Object,
    required: true
  },
  selectedTherapistId: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

// Convert object to array for easier rendering
const therapistsWithSlots = computed(() => {
  return Object.entries(props.slotsByTherapist).map(([therapistId, data]) => ({
    therapist: { id: therapistId, ...data.therapist },
    slots: data.slots
  }))
})

function selectTherapist(therapistId) {
  emit('select', therapistId)
}
</script>