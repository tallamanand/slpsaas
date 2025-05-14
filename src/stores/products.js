import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('products', {
  state: () => ({
    varieties: [],
    brands: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVarieties() {
      this.loading = true;
      try {
        const response = await axios.get('/api/varieties');
        this.varieties = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching varieties';
      } finally {
        this.loading = false;
      }
    },

    async fetchBrands() {
      this.loading = true;
      try {
        const response = await axios.get('/api/brands');
        this.brands = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching brands';
      } finally {
        this.loading = false;
      }
    },

    async createVariety(varietyData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/varieties', varietyData);
        this.varieties.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error creating variety';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createBrand(brandData) {
      this.loading = true;
      try {
        const response = await axios.post('/api/brands', brandData);
        this.brands.push(response.data);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error creating brand';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 