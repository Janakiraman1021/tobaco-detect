import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogOut, Save, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';

// Update the schema to match the exact requirements
const dataEntrySchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  name: z.string().min(1, 'Name is required'),
  // userType: z.enum(['Non-user', 'Regular User', 'Addict']),
  timeMins: z.number().min(0).max(60),
  phLevel: z.number().min(0).max(14),
  Nicotene: z.number().min(0),
  temperature: z.number().min(0),
  substanceDetected: z.string().min(1, 'Substance detection is required')
});

type DataEntryForm = z.infer<typeof dataEntrySchema>;

export default function DataEntry() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  // Generate a numeric sample ID based on timestamp
  const generateSampleId = () => {
    return parseInt(Date.now().toString().slice(-8));
  };

  // Update the form's default values
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DataEntryForm>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      institutionName: '',
      rollNumber: '',
      name: '',
      // userType: 'Non-user',
      timeMins: 30,
      phLevel: 7.5,
      Nicotene: 150.5,
      temperature: 25.6,
      substanceDetected: 'None'
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Update the onSubmit function
  const onSubmit = async (data: DataEntryForm) => {
    try {
      const sampleId = generateSampleId();
      console.log('Submitting data:', { ...data, sampleId });
  
      const response = await api.post('/data/entry', {
        ...data,
        sampleId
      });
  
      console.log('Server response:', response.data);
  
      if (response.data.success) {
        alert('Data entry saved successfully!');
        reset({
          ...data,
          sampleId: generateSampleId(), // Reset with new ID
          name: '',
          rollNumber: '',
          substanceDetected: 'None'
        });
      }
    } catch (error: any) {
      console.error('Data entry error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to save data. Please try again.');
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glassmorphism p-8 rounded-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Institution Name</label>
            <input
              type="text"
              {...register('institutionName')}
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            />
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
          {/* <div>
            <label className="block text-sm font-medium mb-2">User Type</label>
            <select
              {...register('userType')}
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            >
              <option value="Non-user">Non-user</option>
              <option value="Regular User">Regular User</option>
              <option value="Addict">Addict</option>
            </select> */}
          {/* </div> */}
          <div>
            <label className="block text-sm font-medium mb-2">Time (Seconds)</label>
            <input
              type="number"
              {...register('timeMins', { valueAsNumber: true })}
              min="0"
              max="60"
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            />
            {errors.timeMins && (
              <p className="text-red-500 text-sm mt-1">{errors.timeMins.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">pH Level</label>
            <input
              type="number"
              step="0.1" // For decimal precision
              {...register('phLevel', { valueAsNumber: true })}
              min="0"
              max="14"
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            />
            {errors.phLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.phLevel.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nicotine Level</label>
            <input
              type="number"
              step="0.1" // For decimal precision
              {...register('Nicotene', { valueAsNumber: true })}
              min="0"
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            />
            {errors.Nicotene && (
              <p className="text-red-500 text-sm mt-1">{errors.Nicotene.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
            <input
              type="number"
              step="0.1" // For decimal precision
              {...register('temperature', { valueAsNumber: true })}
              min="0"
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
            />
            {errors.temperature && (
              <p className="text-red-500 text-sm mt-1">{errors.temperature.message}</p>
            )}
          </div>

          {/* Add Sample ID field */}
          <div>
            <label className="block text-sm font-medium mb-2">Sample ID</label>
            <input
              type="number"
              {...register('sampleId', { valueAsNumber: true })}
              className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-3 px-4 input-glow"
              readOnly // Make it read-only since we're auto-generating it
            />
            {errors.sampleId && (
              <p className="text-red-500 text-sm mt-1">{errors.sampleId.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500/20 text-gray-300 rounded-lg"
            disabled={isSubmitting}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 ${
              isSubmitting ? 'bg-primary-500/50' : 'bg-primary-500'
            } text-white rounded-lg font-semibold`}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}