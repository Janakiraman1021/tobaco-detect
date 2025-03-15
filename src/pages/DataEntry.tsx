import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogOut, Save, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../lib/store';

const dataEntrySchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  name: z.string().min(1, 'Name is required'),
  userType: z.enum(['Non-user', 'Regular User', 'Addict']),
  time: z.number().min(0).max(60),
  phLevel: z.number().min(1).max(14),
  conductivity: z.number().min(0),
  temperature: z.number(),
  substanceDetected: z.enum(['Nicotine', 'None']),
});

type DataEntryForm = z.infer<typeof dataEntrySchema>;

const institutions = [
  'Medical Center A',
  'Hospital B',
  'Research Lab C',
  'University Medical Center',
  'City Hospital'
];

export default function DataEntry() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DataEntryForm>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      time: 30,
      phLevel: 7,
      temperature: 37,
      conductivity: 200,
      userType: 'Non-user',
      substanceDetected: 'None'
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onSubmit = async (data: DataEntryForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-primary-900 to-background p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold neon-glow">Data Entry</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glassmorphism p-8 rounded-xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Institution Name</label>
                <input
                  list="institutions"
                  {...register('institutionName')}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                <datalist id="institutions">
                  {institutions.map(inst => (
                    <option key={inst} value={inst} />
                  ))}
                </datalist>
                {errors.institutionName && (
                  <p className="text-red-500 text-sm mt-1">{errors.institutionName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Roll Number</label>
                <input
                  type="text"
                  {...register('rollNumber')}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                {errors.rollNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.rollNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">User Type</label>
                <select
                  {...register('userType')}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                >
                  <option value="Non-user">Non-user</option>
                  <option value="Regular User">Regular User</option>
                  <option value="Addict">Addict</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time (mins)</label>
                <input
                  type="number"
                  {...register('time', { valueAsNumber: true })}
                  min="0"
                  max="60"
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('phLevel', { valueAsNumber: true })}
                  min="1"
                  max="14"
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                {errors.phLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.phLevel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Conductivity (µS/cm)</label>
                <input
                  type="number"
                  {...register('conductivity', { valueAsNumber: true })}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                {errors.conductivity && (
                  <p className="text-red-500 text-sm mt-1">{errors.conductivity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                />
                {errors.temperature && (
                  <p className="text-red-500 text-sm mt-1">{errors.temperature.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Substance Detected</label>
                <select
                  {...register('substanceDetected')}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
                >
                  <option value="None">None</option>
                  <option value="Nicotine">Nicotine</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => reset()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500/20 text-gray-300 rounded-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}