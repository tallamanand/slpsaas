import { defineStore } from 'pinia';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Ensure Authorization header is set from localStorage on page reload
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      buyer: '',
      seller: '',
      date: '',
      lorryNumber: '',
    },
    sortBy: 'date',
    sortOrder: 'desc',
  }),

  getters: {
    filteredTransactions: (state) => {
      let filtered = [...state.transactions];

      // Helper to get status text (match UI logic)
      const getStatusText = (transaction) => {
        const pendingAmount = (transaction.billAmount || 0) - (transaction.receivedAmount || 0);
        if (pendingAmount <= 0) return 'received';
        return 'pending';
      };

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.buyerName.toLowerCase().includes(search) ||
            t.seller.toLowerCase().includes(search) ||
            t.lorryNumber.toLowerCase().includes(search)
        );
      }

      if (state.filters.buyer) {
        filtered = filtered.filter((t) =>
          t.buyerName.toLowerCase().includes(state.filters.buyer.toLowerCase())
        );
      }

      if (state.filters.seller) {
        filtered = filtered.filter((t) =>
          t.seller.toLowerCase().includes(state.filters.seller.toLowerCase())
        );
      }

      if (state.filters.date) {
        const date = new Date(state.filters.date);
        filtered = filtered.filter(
          (t) => new Date(t.date).toDateString() === date.toDateString()
        );
      }

      if (state.filters.lorryNumber) {
        filtered = filtered.filter((t) =>
          t.lorryNumber.toLowerCase().includes(state.filters.lorryNumber.toLowerCase())
        );
      }

      // Add status filter
      if (state.filters.status) {
        filtered = filtered.filter((t) => getStatusText(t) === state.filters.status.toLowerCase());
      }

      return filtered.sort((a, b) => {
        const aValue = a[state.sortBy];
        const bValue = b[state.sortBy];
        const modifier = state.sortOrder === 'asc' ? 1 : -1;

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return (aValue - bValue) * modifier;
      });
    },
  },

  actions: {
    async fetchTransactions() {
      this.loading = true;
      try {
        const response = await axios.get('/api/transactions', {
          params: {
            ...this.filters,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
          },
        });
        this.transactions = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching transactions';
      } finally {
        this.loading = false;
      }
    },

    async createTransaction(transactionData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/transactions', transactionData);
        this.transactions.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error creating transaction';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTransaction(id, transactionData) {
      this.loading = true;
      try {
        const response = await axios.put(`/api/transactions/${id}`, transactionData);
        const index = this.transactions.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.transactions[index] = response.data;
        }
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error updating transaction';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTransaction(id) {
      this.loading = true;
      try {
        await axios.delete(`/api/transactions/${id}`);
        this.transactions = this.transactions.filter((t) => t.id !== id);
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error deleting transaction';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },

    setSort(sortBy, sortOrder) {
      this.sortBy = sortBy;
      this.sortOrder = sortOrder;
    },

    async fetchTransaction(id) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/transactions/${id}`);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching transaction';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 