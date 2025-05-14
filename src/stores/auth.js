import { defineStore } from 'pinia';
import axios from 'axios';

// Ensure Authorization header is set from localStorage on page reload
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/auth/login', credentials);
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('/api/auth/register', userData);
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },

    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },

    async fetchUser() {
      try {
        const response = await axios.get('/api/auth/me');
        this.user = response.data;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
  },
}); 