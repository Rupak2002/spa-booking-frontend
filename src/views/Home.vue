<template>
  <div class="min-h-screen">

    <!-- ─── HERO ──────────────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-purple-100">
      <!-- Decorative blobs -->
      <div aria-hidden="true" class="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
      <div aria-hidden="true" class="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-200 rounded-full opacity-25 blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div class="max-w-3xl">
          <!-- Badge -->
          <span class="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Premium Spa Experience
          </span>

          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Relax.<br/>
            <span class="text-purple-600">Rejuvenate.</span><br/>
            Renew.
          </h1>

          <p class="mt-6 text-xl sm:text-2xl text-gray-600 max-w-xl leading-relaxed">
            Book your perfect spa experience in minutes — expert therapists, premium treatments, total bliss.
          </p>

          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            <router-link
              to="/services"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-lg shadow-purple-200"
            >
              Book Now
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </router-link>
            <router-link
              to="/services"
              class="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold rounded-xl hover:bg-purple-50 active:scale-95 transition-all"
            >
              View Services
            </router-link>
          </div>

          <!-- Social proof -->
          <div class="mt-12 flex items-center gap-6">
            <div class="flex -space-x-3">
              <div v-for="i in 4" :key="i" aria-hidden="true"
                class="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br"
                :class="[
                  i === 1 && 'from-purple-400 to-purple-600',
                  i === 2 && 'from-pink-400 to-pink-600',
                  i === 3 && 'from-indigo-400 to-indigo-600',
                  i === 4 && 'from-violet-400 to-violet-600',
                ]"
              ></div>
            </div>
            <div>
              <div class="flex items-center gap-1">
                <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <p class="text-sm text-gray-500 mt-0.5"><span class="font-semibold text-gray-700">500+</span> happy clients</p>
            </div>
          </div>
        </div>

        <!-- Floating card decoration -->
        <div aria-hidden="true" class="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
          <div class="bg-white rounded-2xl shadow-xl p-5 w-56 rotate-2 hover:rotate-0 transition-transform duration-300">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-500">Duration</p>
                <p class="text-sm font-bold text-gray-800">60 minutes</p>
              </div>
            </div>
            <p class="text-xs text-gray-600">Swedish Massage</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-lg font-extrabold text-purple-600">$85</span>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Available</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-xl p-5 w-56 -rotate-1 hover:rotate-0 transition-transform duration-300 ml-8">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-sm font-bold text-gray-800">4.9 / 5.0</span>
            </div>
            <p class="text-xs text-gray-500">Based on 200+ reviews</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── HOW IT WORKS ──────────────────────────────────────────── -->
    <section class="bg-white py-20 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Simple Process</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Book in 3 Easy Steps</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- connector line (desktop) -->
          <div aria-hidden="true" class="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-purple-100"></div>

          <div
            v-for="step in howItWorks"
            :key="step.number"
            class="flex flex-col items-center text-center px-6"
          >
            <div class="relative mb-6">
              <div class="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center shadow-sm">
                <svg class="w-9 h-9 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="step.icon"/>
                </svg>
              </div>
              <span class="absolute -top-2 -right-2 w-7 h-7 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                {{ step.number }}
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURED SERVICES ─────────────────────────────────────── -->
    <section class="bg-gray-50 py-20 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p class="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Treatments</p>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Popular Services</h2>
          </div>
          <router-link
            to="/services"
            class="inline-flex items-center gap-1.5 text-purple-600 font-semibold hover:text-purple-700 shrink-0"
          >
            View all services
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="servicesStore.loading" class="py-16">
          <LoadingSpinner size="lg" message="Loading services…" />
        </div>

        <!-- Empty -->
        <EmptyState
          v-else-if="featuredServices.length === 0"
          icon="inbox"
          title="No services yet"
          message="Check back soon — we're adding treatments."
        />

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article
            v-for="service in featuredServices"
            :key="service.id"
            class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <!-- Image -->
            <div class="relative overflow-hidden h-44 bg-purple-100">
              <img
                v-if="service.image_url"
                :src="service.image_url"
                :alt="service.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-14 h-14 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <!-- Category badge -->
              <span
                v-if="service.category?.name"
                class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {{ service.category.name }}
              </span>
            </div>

            <!-- Body -->
            <div class="p-5 flex flex-col flex-1">
              <h3 class="text-base font-bold text-gray-900 mb-1 line-clamp-1">{{ service.name }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{{ service.description }}</p>

              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-1 text-gray-500 text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ service.duration }} min
                </div>
                <span class="text-xl font-extrabold text-purple-600">${{ service.price }}</span>
              </div>

              <router-link
                :to="`/book/${service.id}`"
                class="block w-full text-center py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 active:scale-95 transition-all"
              >
                Book Now
              </router-link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ─── WHY CHOOSE US ─────────────────────────────────────────── -->
    <section class="bg-white py-20 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Our Promise</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Why Kaya Kesh?</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="item in whyChooseUs"
            :key="item.title"
            class="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200"
          >
            <div class="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-1.5">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIAL STRIP ─────────────────────────────────────── -->
    <section class="bg-purple-600 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <svg class="w-10 h-10 text-purple-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <blockquote>
          <p class="text-2xl sm:text-3xl font-semibold text-white leading-relaxed">
            "The best spa experience I've ever had. The booking was effortless and the treatments were absolutely divine."
          </p>
          <footer class="mt-6">
            <p class="text-purple-200 font-medium">Rubina S. — Regular Client</p>
          </footer>
        </blockquote>
      </div>
    </section>

    <!-- ─── CTA BANNER ────────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-violet-600 py-20 sm:py-28">
      <div aria-hidden="true" class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Ready to unwind?
        </h2>
        <p class="text-purple-200 text-lg sm:text-xl mb-10 max-w-xl mx-auto">
          Treat yourself to a world-class spa experience. Your first appointment is just a click away.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/services"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 text-lg font-bold rounded-xl hover:bg-purple-50 active:scale-95 transition-all shadow-lg"
          >
            Book Your Appointment
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="inline-flex items-center justify-center px-8 py-4 border-2 border-white/50 text-white text-lg font-semibold rounded-xl hover:border-white hover:bg-white/10 active:scale-95 transition-all"
          >
            Create Free Account
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useServicesStore } from '@/stores/services'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const authStore = useAuthStore()
const servicesStore = useServicesStore()

const featuredServices = computed(() => servicesStore.services.slice(0, 4))

const howItWorks = [
  {
    number: 1,
    title: 'Browse Services',
    description: 'Explore our full range of premium treatments — massages, facials, and more.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
  },
  {
    number: 2,
    title: 'Pick Your Time',
    description: 'Choose your preferred therapist and select a convenient date and time slot.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    number: 3,
    title: 'Relax & Enjoy',
    description: 'Arrive, unwind, and let our expert therapists pamper you from head to toe.',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
  }
]

const whyChooseUs = [
  {
    title: 'Expert Therapists',
    description: 'Certified professionals with years of experience in wellness and relaxation.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
  },
  {
    title: 'Flexible Booking',
    description: 'Easy online scheduling available 24/7 — book whenever it suits you.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Premium Products',
    description: 'Only the finest organic and cruelty-free products used in every treatment.',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    title: 'Satisfaction Guaranteed',
    description: 'Your comfort and satisfaction are our highest priority, every single visit.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  }
]

onMounted(() => {
  servicesStore.fetchActiveServices()
})
</script>
