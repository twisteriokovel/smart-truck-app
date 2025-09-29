import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import AddressesView from '@/views/AddressesView.vue'
import TrucksView from '@/views/TrucksView.vue'
import OrdersView from '@/views/OrdersView.vue'
import OrderDetailsView from '@/views/OrderDetailsView.vue'
import CreateOrderView from '@/views/CreateOrderView.vue'
import EditOrderView from '@/views/EditOrderView.vue'
import TripsView from '@/views/TripsView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: AddressesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/trucks',
      name: 'trucks',
      component: TrucksView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/create',
      name: 'create-order',
      component: CreateOrderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/edit/:id',
      name: 'edit-order',
      component: EditOrderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      name: 'order-details',
      component: OrderDetailsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/trips',
      name: 'trips',
      component: TripsView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

  if (!authStore.token) {
    authStore.initializeAuth()
  }

  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (
    !requiresAuth &&
    authStore.isAuthenticated &&
    to.name === 'login'
  ) {
    next('/')
  } else {
    next()
  }
})

export default router
