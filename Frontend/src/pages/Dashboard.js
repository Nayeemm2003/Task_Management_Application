import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaTasks, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUserCheck,
  FaSpinner 
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || 'https://back-end-production-fcde.up.railway.app';

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/api/tasks/dashboard/stats`);
      setStats(statsRes.data);
      
      const tasksRes = await axios.get(`${API_URL}/api/tasks`);
      setRecentTasks(tasksRes.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Tasks', value: stats?.total || 0, icon: FaTasks, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/20' },
    { title: 'Pending', value: stats?.pending || 0, icon: FaClock, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/20' },
    { title: 'In Progress', value: stats?.inProgress || 0, icon: FaSpinner, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/20' },
    { title: 'Completed', value: stats?.completed || 0, icon: FaCheckCircle, color: 'from-green-500 to-green-600', bg: 'bg-green-500/20' },
    { title: 'Overdue', value: stats?.overdue || 0, icon: FaExclamationTriangle, color: 'from-red-500 to-red-600', bg: 'bg-red-500/20' },
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 17, 14, 22, 18],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-white/80 text-lg">
                Here's what's happening with your tasks today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full px-4 py-2">
                <span className="text-white font-semibold">
                  Role: {user?.role === 'admin' ? '👑 Administrator' : '👤 Team Member'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-4`}>
                <stat.icon className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts and Recent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Task Analytics</h3>
            <Line data={chartData} options={chartOptions} />
          </motion.div>

          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Recent Tasks</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {recentTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{task.title}</h4>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{task.project?.name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <FaUserCheck className="text-xs" />
                      <span>{task.assignedTo?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <FaCalendarAlt className="text-xs" />
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;