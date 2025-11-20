import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Home } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-[#19aaba] to-[#158c99] shadow-lg border-b border-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/admin" className="flex items-center gap-2 group">
                <LayoutDashboard className="text-white group-hover:scale-110 transition-transform" size={24} />
                <span className="text-xl font-bold text-white">Admin Panel</span>
              </Link>
              
              <Link 
                to="/" 
                className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <Home size={20} />
                <span className="hidden sm:inline font-medium">Back to Site</span>
              </Link>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-cyan-100">{user?.role?.toUpperCase()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium border border-white/20 hover:border-white/40"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
