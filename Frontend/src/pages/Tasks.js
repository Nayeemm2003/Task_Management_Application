import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaUserCheck, FaCalendarAlt, FaFlag } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, []);
  const API_URL = process.env.REACT_APP_API_URL || 'https://back-end-production-fcde.up.railway.app';

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`);
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/tasks`, formData);
      toast.success('Task created successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, { status });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/api/tasks/${id}`);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'overdue') {
      return new Date(task.dueDate) < new Date() && task.status !== 'completed';
    }
    return task.status === filter;
  });

  const getPriorityIcon = (priority) => {
    const colors = {
      high: 'text-red-400',
      medium: 'text-orange-400',
      low: 'text-green-400'
    };
    return <FaFlag className={colors[priority]} />;
  };

  return (
    <div className="min-h-screen gradient-bg pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Tasks</h1>
            <p className="text-white/80">Track and manage your team's tasks</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus />
            Create Task
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {['all', 'pending', 'in-progress', 'completed', 'overdue'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Tasks Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-x-auto"
        >
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-white/80 text-left">
                <th className="px-6 py-4 font-semibold">Task</th>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Assigned To</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{task.title}</p>
                        <p className="text-white/60 text-sm mt-1">{task.description.substring(0, 50)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/80">{task.project?.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white/80">
                        <FaUserCheck className="text-sm" />
                        <span>{task.assignedTo?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className={`status-badge status-${task.status} cursor-pointer border-none focus:outline-none`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(task.priority)}
                        <span className="text-white/80 capitalize">{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-sm text-white/60" />
                        <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400 font-semibold' : 'text-white/80'}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        {/* Create Task Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Task Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="input-field text-white"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="input-field text-white"
                      rows="3"
                      placeholder="Enter task description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Project</label>
                      <select
                        value={formData.project}
                        onChange={(e) => setFormData({...formData, project: e.target.value})}
                        className="input-field text-white"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project._id} value={project._id}>{project.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Assign To</label>
                      <select
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                        className="input-field text-white"
                        required
                      >
                        <option value="">Select Member</option>
                        {user?.role === 'admin' ? (
                          users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                          ))
                        ) : (
                          <option value={user?._id}>{user?.name}</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="input-field text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="input-field text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">Create Task</button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Tasks;