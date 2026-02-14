<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Icon -->
    <svg
      class="h-16 w-16 text-gray-300 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        v-if="icon === 'calendar'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
      <path
        v-else-if="icon === 'user'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
      <path
        v-else-if="icon === 'clock'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else-if="icon === 'search'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
      <!-- inbox (default) -->
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-700 mb-1">{{ title }}</h3>

    <!-- Message -->
    <p v-if="message" class="text-sm text-gray-500 max-w-xs">{{ message }}</p>

    <!-- CTA -->
    <router-link
      v-if="actionLabel && actionRoute"
      :to="actionRoute"
      class="mt-5 inline-block px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
    >
      {{ actionLabel }}
    </router-link>
    <button
      v-else-if="actionLabel"
      @click="$emit('action')"
      class="mt-5 px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'inbox',
    validator: (v) => ['calendar', 'user', 'clock', 'search', 'inbox'].includes(v)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  },
  actionRoute: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])
</script>
