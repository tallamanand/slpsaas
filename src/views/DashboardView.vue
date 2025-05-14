<template>
  <div class="min-h-screen bg-primary-50">
    <main class="max-w-1xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
      <h3 class="text-xl text-gray-700 mb-6">Welcome, <span class="text-primary-600">{{ user?.name || 'User' }}</span>!</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card flex flex-col items-center">
          <span class="text-4xl font-bold text-primary-600">{{ stats.totalTransactions }}</span>
          <span class="text-gray-500 mt-2">Total Transactions</span>
        </div>
        <div class="card flex flex-col items-center">
          <span class="text-4xl font-bold text-green-600">₹{{ stats.totalAmount }}</span>
          <span class="text-gray-500 mt-2">Total Amount</span>
        </div>
        <div class="card flex flex-col items-center">
          <span class="text-4xl font-bold text-red-600">₹{{ stats.pendingAmount }}</span>
          <span class="text-gray-500 mt-2">Pending Amount</span>
        </div>
      </div>
      <p class="text-gray-500 mb-4">
        This is your dashboard. You can manage your transactions and view statistics here.
      </p>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transactions';

const router = useRouter();
const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const user = computed(() => authStore.user);

onMounted(() => {
  transactionStore.fetchTransactions();
});

const stats = computed(() => {
  const transactions = transactionStore.transactions;
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + (t.billAmount || 0), 0);
  const pendingAmount = transactions.reduce((sum, t) => sum + ((t.billAmount || 0) - (t.receivedAmount || 0)), 0);
  return {
    totalTransactions,
    totalAmount,
    pendingAmount,
  };
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 