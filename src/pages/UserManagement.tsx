import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface ApiResponse {
  success: boolean;
  count: number;
  data: User[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'data_entry';
  createdAt: string;
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'data_entry';
  createdAt: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fix the fetchUsers function
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<ApiResponse>('/admin/data-entry-users');
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add deleteUser function after fetchUsers
  const deleteUser = async (userId: string) => {
    try {
      const response = await api.delete(`/admin/data-entry-users/${userId}`);
      if (response.data.success) {
        // Refresh the users list after successful deletion
        await fetchUsers();
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Fix the createUser function
  const createUser = async (userData: typeof newUser) => {
    try {
      const response = await api.post<CreateUserResponse>('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'data_entry'
      });

      if (!response.data) {
        throw new Error('No response from server');
      }

      // Log the response for debugging
      console.log('Create user response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdUser = await createUser(newUser);
      
      // After successful creation, fetch updated user list
      await fetchUsers();
      
      // Reset form
      setNewUser({ name: '', email: '', password: '' });
      
      // Show success message
      alert('User created successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      alert(errorMessage);
      console.error('Create user error:', error);
    }
  };

  // Update the delete button in the table
  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-primary-900 to-background p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold neon-glow">User Management</h1>
        </div>

        <div className="glassmorphism p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-6">Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <PlusCircle className="w-4 h-4" />
              Add User
            </button>
          </form>
        </div>

        <div className="glassmorphism p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Existing Users</h2>
          {isLoading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="overflow-x-auto"> 
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-500/20">
                    <th className="text-left py-4 px-6">Name</th>
                    <th className="text-left py-4 px-6">Email</th>
                    <th className="text-left py-4 px-6">Created</th>
                    <th className="text-left py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-primary-500/10">
                      <td className="py-4 px-6">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  No users found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}