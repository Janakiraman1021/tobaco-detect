import axios from 'axios';
import { useAuthStore } from './store';

// const api = axios.create({
//   baseURL: 'http://localhost:3001/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
const api = axios.create({
  baseURL: 'https://tobaco-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Redirect to login page if needed
    }
    return Promise.reject(error);
  }
);

export default api;