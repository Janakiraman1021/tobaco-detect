import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../lib/store';
import { Lock, User } from 'lucide-react';
import axios from 'axios';
import  api  from '../lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Update the LoginResponse interface to match backend response
export interface LoginResponse {
  token: string;
  role: 'admin' | 'data-entry';
  userId: string; // Add userId to response type
}

// Update the loginUser function
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const { email, password } = credentials;
    const response = await api.post('/auth/login', { email, password });
    
    // Validate the response
    if (!response.data || !response.data.token || !response.data.role) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      // Log the full error response for debugging
      console.error('Login error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'data-entry'])
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Log login attempt
      console.log('🔐 Login attempt:', { 
        email: data.email,
        role: data.role
      });
      
      const response = await loginUser({
        email: data.email,
        password: data.password
      });

      // Log successful login with more details
      console.log('✅ Login successful:', {
        email: data.email,
        role: response.role,
        userId: response.userId,
        token: response.token.substring(0, 10) + '...',
        timestamp: new Date().toLocaleString()
      });

      // Store the token, role and userId in auth store
      login(response.token, response.role, response.userId);
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Log navigation attempt
      console.log(`🚀 Attempting navigation to: ${response.role === 'admin' ? '/dashboard' : '/data-entry'}`);
      
      // Use replace instead of navigate to avoid back button issues
      navigate(response.role === 'admin' ? '/dashboard' : '/data-entry', { replace: true });
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-primary-900 to-background flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glassmorphism p-8 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold neon-glow">Secure Login</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 pl-12 pr-4 input-glow"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 pl-12 pr-4 input-glow"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <select
              {...register('role')}
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            >
              <option value="admin">Admin</option>
              <option value="data-entry">Data Entry</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full cyberpunk-border bg-primary-500 text-white py-3 rounded-lg font-semibold relative"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}