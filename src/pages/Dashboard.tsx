import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  Search, Filter, Download, Users, Activity, Thermometer,
  Database, LogOut, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';

// Mock data - replace with real data from your backend
const mockData = [
  { id: 1, institution: "Medical Center A", name: "John Doe", userType: "Regular User", time: 30, pH: 7.2, Nicotene: 250, temperature: 37, substanceDetected: "Nicotine" },
  { id: 2, institution: "Hospital B", name: "Jane Smith", userType: "Non-user", time: 25, pH: 6.8, Nicotene: 180, temperature: 36.5, substanceDetected: "None" },
  { id: 3, institution: "Research Lab C", name: "Mike Johnson", userType: "Addict", time: 45, pH: 7.5, Nicotene: 300, temperature: 37.2, substanceDetected: "Nicotine" },
  // Add more mock data as needed
];

const analyticsData = [
  
  { month: 'Jan', users: 65 },
  { month: 'Feb', users: 59 },
  { month: 'Mar', users: 80 },
  { month: 'Apr', users: 81 },
  { month: 'May', users: 56 },
  { month: 'Jun', users: 55 },
];

interface Filters {
  userType: string;
  phRange: string;
  NicoteneRange: string;
  temperatureRange: string;
  substanceDetected: string;
  timeRange: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: 'admin' | 'data_entry';
  createdAt: string;
}

// Update the interfaces to match API response
interface Entry {
  _id: string;
  institutionName: string;
  rollNumber: string;
  name: string;
  sampleId: number;
  userType: 'Non-user' | 'Regular User' | 'Addict';
  timeMins: number;
  phLevel: number;
  Nicotene: number;
  temperature: number;
  substanceDetected: string;
  createdBy: string | null;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Entry[];
}

// Add these interfaces for stats and analytics
interface DashboardStats {
  totalUsers: number;
  detectionRate: string;
  avgTemperature: string;
  totalSamples: number;
}

interface MonthlyStats {
  month: string;
  count: number;
  userTypes: {
    'Non-user': number;
    'Regular User': number;
    'Addict': number;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    userType: 'all',
    phRange: 'all',
    NicoteneRange: 'all',
    temperatureRange: 'all',
    substanceDetected: 'all',
    timeRange: 'all'
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add new state for dashboard stats and monthly data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    detectionRate: '0%',
    avgTemperature: '0°C',
    totalSamples: 0
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);

  // Add loading state for refresh button
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownload = () => {
    const headers = [
      'Institution',
      'Name',
      'User Type',
      'Time (mins)',
      'pH Level',
      'Nicotene (µS/cm)',
      'Temperature (°C)',
      'Substance Detected'
    ];

    const csvData = [
      headers.join(','),
      ...filteredData.map(item => [
        item.institutionName,
        item.name,
        item.userType,
        item.timeMins,
        item.phLevel,
        item.Nicotene,
        item.temperature,
        item.substanceDetected
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tobacco-detection-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse>('/admin/all-entries');
      
      if (response.data.success) {
        setEntries(response.data.data);
      } else {
        throw new Error('Failed to fetch entries');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  };

  // Add refresh function
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchEntries();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update useEffect to calculate stats when entries are loaded
  useEffect(() => {
    if (entries.length > 0) {
      // Calculate dashboard stats
      const stats = calculateDashboardStats(entries);
      setDashboardStats(stats);

      // Calculate monthly data for graphs
      const monthly = calculateMonthlyStats(entries);
      setMonthlyData(monthly);
    }
  }, [entries]);

  // Add calculation functions
  const calculateDashboardStats = (data: Entry[]): DashboardStats => {
    const uniqueUsers = new Set(data.map(entry => entry.name)).size;
    const detectedCases = data.filter(entry => entry.substanceDetected !== 'None').length;
    const detectionRate = ((detectedCases / data.length) * 100).toFixed(1);
    const avgTemp = (data.reduce((sum, entry) => sum + entry.temperature, 0) / data.length).toFixed(1);

    return {
      totalUsers: uniqueUsers,
      detectionRate: `${detectionRate}%`,
      avgTemperature: `${avgTemp}°C`,
      totalSamples: data.length
    };
  };

  const calculateMonthlyStats = (data: Entry[]): MonthlyStats[] => {
    const monthlyMap = new Map<string, MonthlyStats>();

    data.forEach(entry => {
      const date = new Date(entry.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: date.toLocaleString('default', { month: 'short' }),
          count: 0,
          userTypes: {
            'Non-user': 0,
            'Regular User': 0,
            'Addict': 0
          }
        });
      }

      const monthData = monthlyMap.get(monthKey)!;
      monthData.count++;
      monthData.userTypes[entry.userType]++;
    });

    return Array.from(monthlyMap.values())
      .sort((a, b) => monthlyMap.keys()
      .indexOf(a.month) - monthlyMap.keys().indexOf(b.month));
  };

  const filteredData = entries.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.institutionName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUserType = filters.userType === 'all' || item.userType === filters.userType;
    
    const matchesPhRange = filters.phRange === 'all' || (
      filters.phRange === 'acidic' ? item.phLevel < 7 :
      filters.phRange === 'neutral' ? item.phLevel === 7 :
      filters.phRange === 'alkaline' ? item.phLevel > 7 : true
    );

    const matchesNicotene = filters.NicoteneRange === 'all' || (
      filters.NicoteneRange === 'low' ? item.Nicotene < 200 :
      filters.NicoteneRange === 'medium' ? item.Nicotene >= 200 && item.Nicotene < 300 :
      filters.NicoteneRange === 'high' ? item.Nicotene >= 300 : true
    );

    const matchesTemperature = filters.temperatureRange === 'all' || (
      filters.temperatureRange === 'low' ? item.temperature < 36.5 :
      filters.temperatureRange === 'normal' ? item.temperature >= 36.5 && item.temperature <= 37.5 :
      filters.temperatureRange === 'high' ? item.temperature > 37.5 : true
    );

    const matchesSubstance = filters.substanceDetected === 'all' || 
      item.substanceDetected === filters.substanceDetected;

    const matchesTime = filters.timeRange === 'all' || (
      filters.timeRange === 'short' ? item.timeMins < 30 :
      filters.timeRange === 'medium' ? item.timeMins >= 30 && item.timeMins < 45 :
      filters.timeRange === 'long' ? item.timeMins >= 45 : true
    );

    return matchesSearch && matchesUserType && matchesPhRange && 
           matchesNicotene && matchesTemperature;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-primary-900 to-background p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold neon-glow">Admin Dashboard</h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/user-management')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </motion.button>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, title: "Total Users", value: dashboardStats.totalUsers.toString(), color: "text-blue-500" },
            { icon: Activity, title: "Detection Rate", value: dashboardStats.detectionRate, color: "text-green-500" },
            { icon: Thermometer, title: "Avg. Temperature", value: dashboardStats.avgTemperature, color: "text-orange-500" },
            { icon: Database, title: "Total Samples", value: dashboardStats.totalSamples.toString(), color: "text-purple-500" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism p-6 rounded-xl"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
              <h3 className="text-lg text-gray-400">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glassmorphism p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">Monthly Samples</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glassmorphism p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">User Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)' 
                  }} 
                />
                <Bar dataKey="userTypes.Non-user" stackId="a" fill="#4ade80" name="Non-user" />
                <Bar dataKey="userTypes.Regular User" stackId="a" fill="#fb923c" name="Regular User" />
                <Bar dataKey="userTypes.Addict" stackId="a" fill="#f87171" name="Addict" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glassmorphism p-6 rounded-xl"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Entries</h3>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background/50 border border-primary-500/30 rounded-lg input-glow"
                />
              </div>

              {/* Add Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </motion.button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-background/30 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">User Type</label>
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters({...filters, userType: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 input-glow"
                >
                  <option value="all">All Types</option>
                  <option value="Non-user">Non-user</option>
                  <option value="Regular User">Regular User</option>
                  <option value="Addict">Addict</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">pH Range</label>
                <select
                  value={filters.phRange}
                  onChange={(e) => setFilters({...filters, phRange: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 input-glow"
                >
                  <option value="all">All Ranges</option>
                  <option value="acidic">Acidic (&lt;7)</option>
                  <option value="neutral">Neutral (7)</option>
                  <option value="alkaline">Alkaline (&gt;7)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nicotene level</label>
                <select
                  value={filters.NicoteneRange}
                  onChange={(e) => setFilters({...filters, NicoteneRange: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 input-glow"
                >
                  <option value="all">All Ranges</option>
                  <option value="low">Low (&lt;200)</option>
                  <option value="medium">Medium (200-300)</option>
                  <option value="high">High (&gt;300)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <select
                  value={filters.temperatureRange}
                  onChange={(e) => setFilters({...filters, temperatureRange: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 input-glow"
                >
                  <option value="all">All Ranges</option>
                  <option value="low">Low (&lt;36.5°C)</option>
                  <option value="normal">Normal (36.5-37.5°C)</option>
                  <option value="high">High (&gt;37.5°C)</option>
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">Substance</label>
                <select
                  value={filters.substanceDetected}
                  onChange={(e) => setFilters({...filters, substanceDetected: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 input-glow"
                >
                  <option value="all">All</option>
                  <option value="None">None</option>
                  <option value="Nicotine">Nicotine</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium mb-2">Time Range</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
                  className="w-full bg-background/50 border border-primary-500/30 rounded-lg py-2 px-3 input-glow"
                >
                  <option value="all">All Ranges</option>
                  <option value="short">&lt;30 mins</option>
                  <option value="medium">30-45 mins</option>
                  <option value="long">&gt;45 mins</option>
                </select>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-4">Loading entries...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-500/20">
                    <th className="text-left py-4 px-6">Institution</th>
                    <th className="text-left py-4 px-6">Name</th>
                    <th className="text-left py-4 px-6">Roll Number</th>
                    <th className="text-left py-4 px-6">User Type</th>
                    <th className="text-left py-4 px-6">Time (Secs)</th>
                    <th className="text-left py-4 px-6">pH Level</th>
                    <th className="text-left py-4 px-6">Nicotene</th>
                    <th className="text-left py-4 px-6">Temperature</th>
                    {/* <th className="text-left py-4 px-6">Substance</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry) => (
                    <motion.tr
                      key={entry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-primary-500/10 hover:bg-primary-500/5"
                    >
                      <td className="py-4 px-6">{entry.institutionName}</td>
                      <td className="py-4 px-6">{entry.name}</td>
                      <td className="py-4 px-6">{entry.rollNumber}</td>
                      <td className="py-4 px-6">{entry.userType}</td>
                      <td className="py-4 px-6">{entry.timeMins}</td>
                      <td className="py-4 px-6">{entry.phLevel}</td>
                      <td className="py-4 px-6">{entry.Nicotene}</td>
                      <td className="py-4 px-6">{entry.temperature}°C</td>
                      {/* <td className="py-4 px-6">{entry.substanceDetected}</td> */}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && !error && filteredData.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No entries found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}