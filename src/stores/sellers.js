import { defineStore } from 'pinia';
import axios from 'axios';

export const useSellerStore = defineStore('sellers', {
  state: () => ({
    sellers: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSellers() {
      this.loading = true;
      try {
        const response = await axios.get('/api/sellers');
        this.sellers = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching sellers';
      } finally {
        this.loading = false;
      }
    },

    async createSeller(sellerData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/sellers', sellerData);
        this.sellers.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error creating seller';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 