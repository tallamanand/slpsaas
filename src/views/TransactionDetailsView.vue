<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Transaction Details</h1>
        <div class="flex space-x-4">
          <button
            @click="router.push('/transactions')"
            class="btn btn-secondary"
          >
            Back to Transactions
          </button>
          <button
            @click="printTransaction"
            class="btn btn-secondary"
            v-if="transaction"
          >
            <span class="mr-2">🖨️</span> Print
          </button>
          <button
            @click="router.push(`/transactions/${transaction?.id}/edit`)"
            class="btn btn-primary"
            v-if="transaction"
          >
            Edit Transaction
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="error" class="text-red-600 p-4 bg-red-50 rounded-lg">
        {{ error }}
      </div>

      <div v-else-if="transaction" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Bill Number:</span>
                <span class="font-medium">#{{ transaction.billNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Date:</span>
                <span>{{ formatDate(transaction.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span :class="getStatusClass(transaction)">{{ getStatusText(transaction) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4">Financial Details</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Received Amount:</span>
                <span class="font-medium">₹{{ formatNumber(transaction.receivedAmount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Commission:</span>
                <span>₹{{ formatNumber(transaction.commission) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Due Date:</span>
                <span>{{ formatDate(transaction.receivedDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Parties Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4">Buyer Information</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span>{{ transaction.buyerName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Town:</span>
                <span>{{ transaction.town }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4">Seller Information</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span>{{ transaction.seller }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Lorry Number:</span>
                <span>{{ transaction.lorryNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-lg font-semibold mb-4">Items</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 text-left">Variety</th>
                  <th class="px-4 py-2 text-left">Brand</th>
                  <th class="px-4 py-2 text-right">KG</th>
                  <th class="px-4 py-2 text-right">Number of Bags</th>
                  <th class="px-4 py-2 text-right">Quantity</th>
                  <th class="px-4 py-2 text-right">Rate</th>
                  <th class="px-4 py-2 text-right">Bill Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in transaction.items" :key="item.id" class="border-t">
                  <td class="px-4 py-2">{{ item.variety }}</td>
                  <td class="px-4 py-2">{{ item.brand }}</td>
                  <td class="px-4 py-2 text-right">{{ item.kg }}</td>
                  <td class="px-4 py-2 text-right">{{ item.numberOfBags }}</td>
                  <td class="px-4 py-2 text-right">{{ item.quantity }}</td>
                  <td class="px-4 py-2 text-right">₹{{ formatNumber(item.rate) }}</td>
                  <td class="px-4 py-2 text-right">₹{{ formatNumber(item.billAmount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactions';
import { format } from 'date-fns';

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();

const transaction = ref(null);
const loading = ref(true);
const error = ref(null);

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

const formatNumber = (value) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const getStatusClass = (transaction) => {
  const today = new Date();
  const receivedDate = new Date(transaction.receivedDate);
  const diffDays = Math.ceil((receivedDate - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'text-green-600';
  if (diffDays <= 7) return 'text-yellow-600';
  return 'text-red-600';
};

const getStatusText = (transaction) => {
  const pendingAmount = (transaction.billAmount || 0) - (transaction.receivedAmount || 0);
  if (pendingAmount <= 0) return 'Received';
  return 'Pending';
};

const printTransaction = () => {
  const printContent = `
    <div class="p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Transaction Details</h1>
        <p class="text-gray-500">Bill #${transaction.value.billNumber}</p>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Bill Number:</span>
              <span class="font-medium">#${transaction.value.billNumber}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Date:</span>
              <span>${formatDate(transaction.value.date)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span>${getStatusText(transaction.value)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-4">Financial Details</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Received Amount:</span>
              <span class="font-medium">₹${formatNumber(transaction.value.receivedAmount)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Commission:</span>
              <span>₹${formatNumber(transaction.value.commission)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Due Date:</span>
              <span>${formatDate(transaction.value.receivedDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 class="text-lg font-semibold mb-4">Buyer Information</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Name:</span>
              <span>${transaction.value.buyerName}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Town:</span>
              <span>${transaction.value.town}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold mb-4">Seller Information</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Name:</span>
              <span>${transaction.value.seller}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Lorry Number:</span>
              <span>${transaction.value.lorryNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold mb-4">Items</h2>
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border px-4 py-2 text-left">Variety</th>
              <th class="border px-4 py-2 text-left">Brand</th>
              <th class="border px-4 py-2 text-right">KG</th>
              <th class="border px-4 py-2 text-right">Number of Bags</th>
              <th class="border px-4 py-2 text-right">Quantity</th>
              <th class="border px-4 py-2 text-right">Rate</th>
              <th class="border px-4 py-2 text-right">Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transaction.value.items.map(item => `
              <tr>
                <td class="border px-4 py-2">${item.variety}</td>
                <td class="border px-4 py-2">${item.brand}</td>
                <td class="border px-4 py-2 text-right">${item.kg}</td>
                <td class="border px-4 py-2 text-right">${item.numberOfBags}</td>
                <td class="border px-4 py-2 text-right">${item.quantity}</td>
                <td class="border px-4 py-2 text-right">₹${formatNumber(item.rate)}</td>
                <td class="border px-4 py-2 text-right">₹${formatNumber(item.billAmount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="mt-8 text-center text-sm text-gray-500">
        <p>Printed on ${formatDate(new Date())}</p>
      </div>
    </div>
  `;

  const originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  
  window.print();
  document.body.innerHTML = originalContent;
  
  // Reattach event listeners
  onMounted();
};

onMounted(async () => {
  try {
    const transactionId = route.params.id;
    transaction.value = await transactionStore.fetchTransaction(transactionId);
  } catch (err) {
    error.value = err.message || 'Error loading transaction details';
  } finally {
    loading.value = false;
  }
});
</script> 