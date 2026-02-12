<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-xl shadow-xl border border-purple-100 p-4 z-50 flex items-start gap-3"
  >
    <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-900">Install Kaya Kesh</p>
      <p class="text-xs text-gray-500 mt-0.5">Add to your home screen for quick access</p>
      <div class="flex gap-2 mt-3">
        <button
          @click="install"
          class="flex-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Install
        </button>
        <button
          @click="dismiss"
          class="px-3 py-1.5 text-gray-500 text-xs font-medium hover:text-gray-700 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
    <button @click="dismiss" class="text-gray-400 hover:text-gray-600 flex-shrink-0 -mt-1 -mr-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showPrompt = ref(false)
let deferredPrompt = null

function handleBeforeInstallPrompt(e) {
  e.preventDefault()
  deferredPrompt = e
  showPrompt.value = true
}

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    showPrompt.value = false
  }
  deferredPrompt = null
}

function dismiss() {
  showPrompt.value = false
  deferredPrompt = null
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})
</script>
