import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaTasks, FaProjectDiagram, FaChartLine, FaSignOutAlt, FaUser, FaSun, FaMoon } from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: FaChartLine },
    { path: '/projects', name: 'Projects', icon: FaProjectDiagram },
    { path: '/tasks', name: 'Tasks', icon: FaTasks },
  ];

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <FaTasks className="text-white text-sm" />
            </div>
            <span className="text-white font-bold text-xl">TaskFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="text-sm" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/10 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white text-sm font-semibold">{user?.name}</span>
                <span className="text-white/60 text-xs">{user?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all duration-300"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;