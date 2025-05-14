<template>
  <v-app>
  <div class="max-w-1xl mx-auto">
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Transactions</h2>
          <div class="flex space-x-4">
            <button
              @click="exportAllToCSV"
              class="btn btn-secondary flex items-center"
              :disabled="loading || filteredTransactions.length === 0"
            >
              <span class="mr-2">📥</span> Export
            </button>
        <router-link
          to="/transactions/new"
              class="btn btn-primary flex items-center"
        >
              <span class="mr-2">
                <svg class="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
              </span>New Transaction
        </router-link>
          </div>
      </div>

      <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <div class="flex flex-wrap md:flex-nowrap gap-4 items-end">
            <div class="flex-1 min-w-[180px]">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  id="search"
                  v-model="filters.search"
                  type="text"
                  placeholder="Search transactions..."
                  class="input pl-10 w-full"
                  @input="handleFilterChange"
                />
              </div>
            </div>
            <div class="flex-1 min-w-[180px]">
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span>
                <input
                  id="startDate"
                  v-model="filters.startDate"
                  type="date"
                  class="input pl-10 w-full"
                  @input="handleFilterChange"
                />
              </div>
            </div>
            <div class="flex-1 min-w-[180px]">
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span>
                <input
                  id="endDate"
                  v-model="filters.endDate"
                  type="date"
                  class="input pl-10 w-full"
                  @input="handleFilterChange"
                />
              </div>
            </div>
            <div class="flex-1 min-w-[180px]">
              <label for="buyer" class="block text-sm font-medium text-gray-700 mb-1">Buyer</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🧍</span>
                <input
                  id="buyer"
                  v-model="filters.buyer"
                  type="text"
                  placeholder="Filter by buyer"
                  class="input pl-10 w-full"
                  @input="handleFilterChange"
                />
              </div>
            </div>
            <div class="flex-1 min-w-[180px]">
              <label for="seller" class="block text-sm font-medium text-gray-700 mb-1">Seller</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🧍</span>
                <input
                  id="seller"
                  v-model="filters.seller"
                  type="text"
                  placeholder="Filter by seller"
                  class="input pl-10 w-full"
                  @input="handleFilterChange"
                />
              </div>
            </div>
            <div class="flex-1 min-w-[180px]">
              <label for="lorryNumber" class="block text-sm font-medium text-gray-700 mb-1">Lorry Number</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🚚</span>
                <input
                  id="lorryNumber"
                  v-model="filters.lorryNumber"
                  type="text"
                  placeholder="Filter by lorry"
                  class="input pl-10 w-full"
                  @input="handleFilterChange"
                />
              </div>
            </div>
          </div>
      </div>

        <!-- Bulk Actions -->
        <div v-if="selectedTransactions.length > 0" class="bg-white p-4 rounded-lg shadow mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">{{ selectedTransactions.length }} transactions selected</span>
                <button
                @click="exportSelectedToCSV"
                class="btn btn-secondary btn-sm flex items-center"
                :disabled="selectedTransactions.length === 0"
                >
                <span class="mr-1">📥</span> Export Selected
                </button>
                <button
                @click="handleBulkDelete"
                class="btn btn-danger btn-sm flex items-center"
              >
                <span class="mr-1">🗑️</span> Delete Selected
              </button>
            </div>
            <button
              @click="clearSelection"
              class="text-gray-500 hover:text-gray-700"
            >
              Clear Selection
            </button>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="bg-white p-3 rounded-lg shadow mb-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm text-gray-500">Quick Filters:</span>
            <button
              v-for="filter in quickFilters"
              :key="filter.value"
              @click="applyQuickFilter(filter.value)"
              class="px-2 py-1 text-sm rounded-full flex items-center"
              :class="[
                activeQuickFilter === filter.value
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              <span class="mr-1">{{ filter.icon }}</span>
              {{ filter.label }}
              <span v-if="filter.count" class="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                {{ filter.count }}
              </span>
                </button>
            <div class="ml-auto flex items-center space-x-2">
              
              
              
              
              
            </div>
          </div>
        </div>

        <!-- Sort Controls -->
        <div class="flex items-center mb-4 gap-4">
          <label class="text-sm font-medium text-gray-700">Sort by:</label>
          <select v-model="sortBy" @change="handleSort(sortBy)" class="input w-auto">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="btn btn-secondary btn-sm">
            <span v-if="sortOrder === 'asc'">⬆️ Ascending</span>
            <span v-else>⬇️ Descending</span>
          </button>
        </div>

        <!-- Transactions List -->
        <div class="space-y-2">
          <div v-for="transaction in paginatedTransactions" :key="transaction.id" 
            class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3">
            <div class="flex items-center justify-between">
              <!-- Left Section: Basic Info -->
              <div class="flex items-center space-x-3 min-w-[200px]">
                <input
                  type="checkbox"
                  :checked="isSelected(transaction.id)"
                  @change="toggleSelection(transaction.id)"
                  class="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
                <div class="flex flex-col">
                  <div class="flex items-center space-x-2">
                    <span class="font-semibold text-primary-600">#{{ transaction.billNumber }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</span>
                  </div>
                  <div class="flex items-center space-x-2 text-xs">
                    <span class="text-gray-500">Due: {{ formatDate(transaction.receivedDate) }}</span>
                    <span class="px-1.5 py-0.5 rounded-full text-xs" :class="getStatusClass(transaction)">
                      {{ getStatusText(transaction) }}
                    </span>
                  </div>
                </div>
      </div>

              <!-- Middle Section: Key Details -->
              <div class="flex-1 flex items-center justify-between mx-4">
                <div class="flex items-center space-x-4">
                  <!-- Buyer Name (Town) -->
                  <div class="text-sm">
                    <div class="text-[10px] text-gray-400 uppercase">Buyer Name (Town)</div>
                    <span class="text-gray-500">👤</span>
                    <span class="ml-1">{{ transaction.buyerName }}</span>
                    <span class="text-gray-400 text-xs ml-1">({{ transaction.town }})</span>
                  </div>
                  <!-- Seller -->
                  <div class="text-sm">
                    <div class="text-[10px] text-gray-400 uppercase">Seller</div>
                    <span class="text-gray-500">👤</span>
                    <span class="ml-1">{{ transaction.seller }}</span>
                  </div>
                  <!-- Lorry Number -->
                  <div class="text-sm">
                    <div class="text-[10px] text-gray-400 uppercase">Lorry Number</div>
                    <span class="text-gray-500">🚚</span>
                    <span class="ml-1">{{ transaction.lorryNumber }}</span>
                  </div>
                </div>
      </div>

              <!-- Right Section: Amount and Actions -->
              <div class="flex items-center space-x-4">
                <!-- Pending Amount -->
                <div class="flex w-full">
                  <div class="flex-1 text-center pr-4 border-r border-gray-200">
                    <div class="text-[10px] text-gray-400 uppercase">Pending Amount</div>
                    <div class="font-semibold text-lg">
                      ₹{{ formatNumber((transaction.billAmount || 0) - (transaction.receivedAmount || 0)) }}
                    </div>
                  </div>
                  <div class="flex-1 text-center pl-4">
                    <div class="text-[10px] text-gray-400 uppercase">Received Amount</div>
                    <div class="font-semibold text-lg">₹{{ formatNumber(getDisplayAmount(transaction.receivedAmount)) }}</div>
                    <div class="text-xs text-gray-500 mt-1">Commission: ₹{{ formatNumber(getDisplayAmount(transaction.commission)) }}</div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="viewTransaction(transaction)"
                    class="text-gray-500 hover:text-primary-600"
                    title="View"
                  >
                    <span class="mdi mdi-eye"></span>
                  </button>
                  <button
                    @click="handleEdit(transaction.id)"
                    class="text-orange-500 hover:text-orange-700"
                    title="Edit"
                  >
                    <span class="mdi mdi-pencil"></span>
                  </button>
                  <button
                    @click="handleDelete(transaction.id)"
                    class="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <span class="mdi mdi-delete"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing {{ paginationStart }} to {{ paginationEnd }} of {{ filteredTransactions.length }} transactions
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactions';
import { useBuyerStore } from '@/stores/buyers';
import { format } from 'date-fns';

const router = useRouter();
const transactionStore = useTransactionStore();
const buyerStore = useBuyerStore();

const showAdvancedFilters = ref(false);
const filters = ref({
  search: '',
  buyer: '',
  seller: '',
  startDate: '',
  endDate: '',
  lorryNumber: '',
  minAmount: '',
  maxAmount: '',
  minCommission: '',
  maxCommission: '',
  minItems: '',
  maxItems: '',
  status: '',
});

const sortBy = ref('date');
const sortOrder = ref('desc');

const sortOptions = [
  { label: 'Date', value: 'date' },
  { label: 'Bill Number', value: 'billNumber' },
  { label: 'Amount', value: 'receivedAmount' },
  { label: 'Buyer', value: 'buyerName' },
  { label: 'Seller', value: 'seller' },
];

const loading = computed(() => transactionStore.loading);
const error = computed(() => transactionStore.error);
const filteredTransactions = computed(() => transactionStore.filteredTransactions);

const sortedTransactions = computed(() => {
  const transactions = [...filteredTransactions.value];
  return transactions.sort((a, b) => {
    let comparison = 0;
    if (sortBy.value === 'date' || sortBy.value === 'receivedDate') {
      comparison = new Date(a[sortBy.value]) - new Date(b[sortBy.value]);
    } else if (sortBy.value === 'receivedAmount') {
      comparison = a[sortBy.value] - b[sortBy.value];
    } else {
      comparison = String(a[sortBy.value]).localeCompare(String(b[sortBy.value]));
    }
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

// Summary statistics
const totalAmount = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + t.receivedAmount, 0).toFixed(2);
});

const totalCommission = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + t.commission, 0).toFixed(2);
});

const totalItems = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + (t.items?.length || 0), 0);
});

const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

const getStatusClass = (transaction) => {
  const today = new Date();
  const receivedDate = new Date(transaction.receivedDate);
  const diffDays = Math.ceil((receivedDate - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'bg-green-100 text-green-800';
  if (diffDays <= 7) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getStatusText = (transaction) => {
  const pendingAmount = (transaction.billAmount || 0) - (transaction.receivedAmount || 0);
  if (pendingAmount <= 0) return 'Received';
  return 'Pending';
};

const handleFilterChange = () => {
  transactionStore.setFilters(filters.value);
};

const handleEdit = (id) => {
  router.push(`/transactions/${id}/edit`);
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await transactionStore.deleteTransaction(id);
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  }
};

const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'desc';
  }
};

const exportToCSV = (transactions) => {
  const headers = [
    'DATE',
    'BUYER NAME',
    'TOWN',
    'SELLER',
    'VARIETY',
    'BRAND',
    'BILL NO',
    'KG',
    'NO OF BAGS',
    'QUANTITY',
    'RATE',
    'BILL AMT',
    'RECD AMT',
    'RECD DT',
    'REMARKS',
    'LORRY NO',
    'FRIGHT',
    'DRIVER NO',
    'TRANSPORT',
    'BUYER MOBILE',
    'DRIVER NAME',
    'COMMISSION',
    'LORRY OWNER',
    'LORRY OWNER NAME'
  ];

  const csvRows = [headers.join(',')];

  transactions.forEach(t => {
    const items = t.items && t.items.length ? t.items : [{}];
    items.forEach(item => {
      csvRows.push([
        formatDate(t.date),                // DATE
        t.buyerName || '',                 // BUYER NAME
        t.town || '',                      // TOWN
        t.seller || '',                    // SELLER
        item.variety || '',                // VARIETY
        item.brand || '',                  // BRAND
        t.billNumber || '',                // BILL NO
        item.kg || '',                     // KG
        item.numberOfBags || '',           // NO OF BAGS
        item.quantity || '',               // QUANTITY
        item.rate || '',                   // RATE
        item.billAmount || '',             // BILL AMT
        t.receivedAmount || '',            // RECD AMT
        formatDate(t.receivedDate),        // RECD DT
        t.remarks || '',                   // REMARKS
        t.lorryNumber || '',               // LORRY NO
        t.freight || '',                   // FRIGHT
        t.driverNumber || '',              // DRIVER NO
        t.transport || '',                 // TRANSPORT
        t.buyerMobile || '',               // BUYER MOBILE
        t.driverName || '',                // DRIVER NAME
        t.commission || '',                // COMMISSION
        t.lorryOwner || '',                // LORRY OWNER
        t.lorryOwnerName || ''             // LORRY OWNER NAME
      ].join(','));
    });
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportAllToCSV = () => {
  exportToCSV(sortedTransactions.value);
};

const exportSelectedToCSV = () => {
  const selectedData = sortedTransactions.value.filter(t => selectedTransactions.value.includes(t.id));
  exportToCSV(selectedData);
};

const selectedTransactions = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);

const totalPages = computed(() => {
  return Math.ceil(sortedTransactions.value.length / pageSize.value);
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedTransactions.value.slice(start, end);
});

const isSelected = (id) => {
  return selectedTransactions.value.includes(id);
};

const toggleSelection = (id) => {
  const index = selectedTransactions.value.indexOf(id);
  if (index === -1) {
    selectedTransactions.value.push(id);
  } else {
    selectedTransactions.value.splice(index, 1);
  }
};

const clearSelection = () => {
  selectedTransactions.value = [];
};

const handleBulkDelete = async () => {
  if (confirm(`Are you sure you want to delete ${selectedTransactions.value.length} transactions?`)) {
    try {
      await Promise.all(selectedTransactions.value.map(id => transactionStore.deleteTransaction(id)));
      clearSelection();
    } catch (err) {
      console.error('Error deleting transactions:', err);
    }
  }
};

const selectedTransaction = ref(null);
const activeQuickFilter = ref('all');

const quickFilters = computed(() => [
  { label: 'All', value: 'all', icon: '📋', count: filteredTransactions.value.length },
  { label: 'Pending', value: 'pending', icon: '⏳', count: getTransactionsByStatus('pending').length },
  { label: 'Received', value: 'received', icon: '✅', count: getTransactionsByStatus('received').length }
]);

const getTransactionsByStatus = (status) => {
  return filteredTransactions.value.filter(t => getStatusText(t).toLowerCase() === status);
};

const applyQuickFilter = (filter) => {
  activeQuickFilter.value = filter;
  if (filter === 'all') {
    filters.value = {
      search: '',
      buyer: '',
      seller: '',
      startDate: '',
      endDate: '',
      lorryNumber: '',
      minAmount: '',
      maxAmount: '',
      minCommission: '',
      maxCommission: '',
      minItems: '',
      maxItems: '',
      status: '',
    };
  } else {
    filters.value = {
      ...filters.value,
      status: filter,
    };
  }
  handleFilterChange();
};

const openTransactionDetails = (transaction) => {
  selectedTransaction.value = transaction;
};

const closeTransactionDetails = () => {
  selectedTransaction.value = null;
};

const printTransaction = () => {
  const printContent = document.getElementById('printable-content').innerHTML;
  const originalContent = document.body.innerHTML;
  
  document.body.innerHTML = `
    <div class="p-8">
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">Transaction Details</h1>
        <p class="text-gray-500">Bill #${selectedTransaction.value.billNumber}</p>
      </div>
      ${printContent}
    </div>
  `;
  
  window.print();
  document.body.innerHTML = originalContent;
  // Reattach event listeners
  onMounted();
};

const transactionTrend = ref(5.2);
const amountTrend = ref(-2.1);
const commissionTrend = ref(3.4);
const itemsTrend = ref(1.8);

const getTrendClass = (trend) => {
  return trend > 0 ? 'text-green-600' : 'text-red-600';
};

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const quickActions = computed(() => [
  {
    id: 'export-all',
    label: 'Export All',
    icon: '📥',
    handler: exportAllToCSV,
    disabled: loading.value || filteredTransactions.value.length === 0
  },
  {
    id: 'export-selected',
    label: 'Export Selected',
    icon: '📦',
    handler: exportSelectedToCSV,
    disabled: loading.value || selectedTransactions.value.length === 0
  },
  {
    id: 'print-selected',
    label: 'Print Selected',
    icon: '🖨️',
    handler: printSelectedTransactions,
    disabled: loading.value || selectedTransactions.value.length === 0
  },
  {
    id: 'delete-selected',
    label: 'Delete Selected',
    icon: '🗑️',
    handler: handleBulkDelete,
    disabled: loading.value || selectedTransactions.value.length === 0
  }
]);

const printSelectedTransactions = () => {
  const selectedData = sortedTransactions.value.filter(t => selectedTransactions.value.includes(t.id));
  const printContent = selectedData.map(transaction => `
    <div class="mb-8">
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">Transaction Details</h1>
        <p class="text-gray-500">Bill #${transaction.billNumber}</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-semibold mb-2">Transaction Information</h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">Date:</span>
              <span>${formatDate(transaction.date)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Status:</span>
              <span>${getStatusText(transaction)}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Financial Details</h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">Amount:</span>
              <span>₹${transaction.receivedAmount}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Commission:</span>
              <span>₹${transaction.commission}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h4 class="font-semibold mb-2">Items</h4>
        <table class="min-w-full">
          <thead>
            <tr>
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
            ${transaction.items.map(item => `
              <tr>
                <td class="px-4 py-2">${item.variety}</td>
                <td class="px-4 py-2">${item.brand}</td>
                <td class="px-4 py-2 text-right">${item.kg}</td>
                <td class="px-4 py-2 text-right">${item.numberOfBags}</td>
                <td class="px-4 py-2 text-right">${item.quantity}</td>
                <td class="px-4 py-2 text-right">₹${item.rate}</td>
                <td class="px-4 py-2 text-right">₹${item.billAmount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `).join('');

  const originalContent = document.body.innerHTML;
  document.body.innerHTML = `
    <div class="p-8">
      ${printContent}
    </div>
  `;
  
  window.print();
  document.body.innerHTML = originalContent;
  onMounted();
};

onMounted(() => {
  transactionStore.fetchTransactions();
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (isNewBuyer.value && form.value.buyerName) {
      await buyerStore.createBuyer({
        name: form.value.buyerName,
        town: form.value.town,
        mobile: form.value.buyerMobile,
      });
      await buyerStore.fetchBuyers();
    }
    if (isEditing.value) {
      await transactionStore.updateTransaction(route.params.id, form.value);
    } else {
      await transactionStore.createTransaction(form.value);
    }
    router.push('/transactions');
  } catch (err) {
    error.value = err.message || 'Error saving transaction';
  } finally {
    loading.value = false;
  }
};

const formatNumber = (value) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const viewTransaction = (transaction) => {
  router.push(`/transactions/${transaction.id}`);
};

const getDisplayAmount = (value) => {
  return typeof value === 'number' && !isNaN(value) ? value : 0;
};
</script> 