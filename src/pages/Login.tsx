import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../lib/store';
import { Lock, User } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'data-entry'])
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginForm) => {
    login(data.role);
    navigate(data.role === 'admin' ? '/dashboard' : '/data-entry');
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
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
              <input
                {...register('username')}
                type="text"
                placeholder="Username"
                className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 pl-12 pr-4 input-glow"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
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
            className="w-full cyberpunk-border bg-primary-500 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}