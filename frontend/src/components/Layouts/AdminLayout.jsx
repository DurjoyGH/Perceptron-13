import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  Home, 
  User, 
  Calendar,
  Users,
  Mail,
  Menu,
  X,
  Image as ImageIcon
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/schedules',
      icon: Calendar,
      label: 'Tour Schedules'
    },
    {
      path: '/admin/gallery',
      icon: ImageIcon,
      label: 'Gallery'
    },
    {
      path: '/admin/profile',
      icon: User,
      label: 'My Profile'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#19aaba] to-[#158c99] text-white transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-cyan-600/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <LayoutDashboard size={24} />
                <span className="text-xl font-bold">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-white text-[#19aaba] shadow-lg font-semibold'
                    : 'hover:bg-white/10 text-white'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Back to Site Link */}
        <div className="absolute bottom-20 left-0 right-0 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-cyan-100 hover:text-white"
            title={!sidebarOpen ? 'Back to Site' : ''}
          >
            <Home size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all border border-white/20 hover:border-red-300"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Page Title - Can be dynamic based on route */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {location.pathname === '/admin' && 'Dashboard'}
                  {location.pathname === '/admin/schedules' && 'Tour Schedules'}
                  {location.pathname === '/admin/gallery' && 'Gallery Management'}
                  {location.pathname === '/admin/profile' && 'My Profile'}
                </h2>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-600 uppercase">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#19aaba] to-[#158c99] flex items-center justify-center border-2 border-cyan-200">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
