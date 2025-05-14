<template>
  <v-app>
    <div class="min-h-screen bg-gray-100">
      <nav v-if="isAuthenticated" class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <img src="@/assets/lakshmi-logo.png" alt="Lakshmi Logo" class="h-10 w-10 mr-3 rounded-full object-contain bg-white" />
              <h1 class="text-xl font-bold text-primary-600">SLP SaaSware</h1>
            </div>
            <div class="flex">
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <router-link
                  to="/dashboard"
                  class="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/transactions"
                  class="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Transactions
                </router-link>
              </div>
            </div>
            <div class="flex items-center">
              <button
                @click="logout"
                class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-1xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-view></router-view>
      </main>
    </div>
  </v-app>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

onMounted(() => {
  if (authStore.token && !authStore.user) {
    authStore.fetchUser();
  }
});
</script> 