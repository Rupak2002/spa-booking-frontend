<template>
  <footer class="bg-gray-900 text-gray-300">

    <!-- Main grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Col 1: Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <a href="/" class="inline-block text-2xl font-extrabold text-white tracking-tight hover:text-purple-400 transition-colors">
            Kaya Kesh
          </a>
          <p class="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
            Your journey to relaxation starts here. Premium spa treatments crafted for your total well-being.
          </p>

          <!-- Social icons -->
          <div class="mt-6 flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter / X"
              class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Col 2: Quick Links -->
        <div>
          <h3 class="text-white text-sm font-semibold uppercase tracking-widest mb-5">Quick Links</h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.to">
              <router-link
                :to="link.to"
                class="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1.5 group"
              >
                <svg class="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 3: Services -->
        <div>
          <h3 class="text-white text-sm font-semibold uppercase tracking-widest mb-5">Services</h3>
          <ul class="space-y-3">
            <li v-for="service in serviceLinks" :key="service">
              <router-link
                to="/services"
                class="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1.5 group"
              >
                <svg class="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                {{ service }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 4: Contact -->
        <div>
          <h3 class="text-white text-sm font-semibold uppercase tracking-widest mb-5">Contact</h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <svg class="w-4 h-4 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-sm text-gray-400 leading-relaxed">123 Serenity Lane,<br/>Wellness City</span>
            </li>
            <li class="flex items-center gap-3">
              <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a href="tel:+15551234567" class="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                (555) 123-4567
              </a>
            </li>
            <li class="flex items-center gap-3">
              <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:hello@kayakesh.com" class="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                hello@kayakesh.com
              </a>
            </li>
            <li class="flex items-center gap-3">
              <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm text-gray-400">Mon–Sat: 9AM – 8PM</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-sm text-gray-500">
          © {{ currentYear }} Kaya Kesh. All rights reserved.
        </p>
        <div class="flex items-center gap-5">
          <a href="#" class="text-sm text-gray-500 hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" class="text-sm text-gray-500 hover:text-purple-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>

  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Book Now', to: '/services' },
  { label: 'My Account', to: '/dashboard' }
]

const serviceLinks = ['Massage', 'Facial', 'Body Treatment', 'Hair Services']
</script>
