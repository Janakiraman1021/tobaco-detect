import axios from 'axios';

// const API_URL = 'http://localhost:5000/api'; // Update this to match your backend URL
const API_URL = 'https://tobaco-backend.onrender.com/api'; // Update this to match your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'data-entry';
  };
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
}

export default api;