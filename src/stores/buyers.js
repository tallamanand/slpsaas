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

export const useBuyerStore = defineStore('buyers', {
  state: () => ({
    buyers: [],
    loading: false,
    error: null,
  }),
  getters: {
    allBuyers: (state) => state.buyers,
  },
  actions: {
    async fetchBuyers() {
      this.loading = true;
      try {
        const response = await axios.get('/api/buyers');
        this.buyers = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching buyers';
      } finally {
        this.loading = false;
      }
    },

    async createBuyer(buyerData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/buyers', buyerData);
        this.buyers.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error creating buyer';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 