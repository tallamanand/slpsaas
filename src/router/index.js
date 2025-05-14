import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/TransactionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/new',
    name: 'NewTransaction',
    component: () => import('@/views/TransactionFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/:id/edit',
    name: 'EditTransaction',
    component: () => import('@/views/TransactionFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transactions/:id',
    name: 'ViewTransaction',
    component: () => import('@/views/TransactionDetailsView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (!requiresAuth && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router; 