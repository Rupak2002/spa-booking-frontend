import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/services',
      name: 'Services',
      component: () => import('@/views/Services.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    // ⭐ NEW: Booking routes
    {
      path: '/book/:serviceId',
      name: 'BookingPage',
      component: () => import('@/views/BookingPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/booking/:bookingId/confirmation',
      name: 'BookingConfirmation',
      component: () => import('@/views/BookingConfirmation.vue'),
      meta: { requiresAuth: true }
    },
    // Admin routes
    {
      path: '/admin/services',
      name: 'AdminServices',
      component: () => import('@/views/admin/ServicesManagement.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/therapists',
      name: 'AdminTherapists',
      component: () => import('@/views/admin/TherapistsManagement.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/therapists',
      name: 'admin-therapists',
      component: () => import('@/views/admin/TherapistsManagement.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/views/admin/AdminBookingsManagement.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    // Therapist routes
    {
      path: '/therapist/availability',
      name: 'TherapistAvailability',
      component: () => import('@/views/therapist/MyAvailability.vue'),
      meta: { requiresAuth: true, requiresTherapist: true }
    }

  ]
})

// Navigation guards
let isInitialized = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!isInitialized) {
    await authStore.initialize()
    isInitialized = true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
  } else if (to.meta.requiresTherapist && !authStore.isTherapist) {
    next('/dashboard')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router