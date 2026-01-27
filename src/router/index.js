import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    meta: { requiresGuest: true },
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    meta: { requiresGuest: true },
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/dashboard',
    meta: { requiresAuth: true },
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/admin/services',
    name: 'AdminServices',
    component: () => import('@/views/admin/ServicesManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/Services.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let isInitialized = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait for auth initialization on first navigation
  if (!isInitialized) {
    await authStore.initialize()
    isInitialized = true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard') // Redirect non-admins
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
