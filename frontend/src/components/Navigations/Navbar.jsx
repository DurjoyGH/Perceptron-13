import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, User, LogOut } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user/profile');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transform hover:rotate-12 transition-transform duration-300 overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="VoterX Logo" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <Link to="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight hover:text-gray-100 transition-colors duration-200">
              Perceptron-13
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/schedule"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/schedule') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Schedule
            </Link>
            <Link
              to="/bus-seat-allocation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive('/bus-seat-allocation') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Bus Allocation
            </Link>
            <Link
              to="/ship-seat-allocation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive('/ship-seat-allocation') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Ship Allocation
            </Link>
            <Link
              to="/room-allocation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive('/room-allocation') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Room Allocation
            </Link>
            <Link
              to="/members"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/members') || isActive('/member/') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Members
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/contact') 
                  ? 'bg-white/20 text-white border-b-2 border-white' 
                  : 'text-white hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              Contact
            </Link>
            
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Dashboard/Profile Button */}
                <button
                  onClick={handleDashboardClick}
                  className="flex items-center gap-2 px-3 xl:px-4 py-2 text-white rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  {user.role === 'admin' ? (
                    <>
                      <LayoutDashboard size={16} />
                      <span className="hidden xl:inline">Dashboard</span>
                      <span className="xl:hidden">Admin</span>
                    </>
                  ) : (
                    <>
                      <UserAvatar user={user} size="xs" />
                      <span>Profile</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 xl:px-6 py-2 bg-white text-[#19aaba] rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:bg-gray-100"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Auth Button */}
            {user && (
              <button
                onClick={handleDashboardClick}
                className="p-2 bg-white text-[#19aaba] rounded-full shadow-lg"
              >
                {user.role === 'admin' ? (
                  <LayoutDashboard size={20} />
                ) : (
                  <UserAvatar user={user} size="sm" />
                )}
              </button>
            )}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-slideDown">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/schedule"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/schedule') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link
                to="/members"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/members') || isActive('/member/') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Members
              </Link>
              <Link
                to="/bus-seat-allocation"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/bus-seat-allocation') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Bus Allocation
              </Link>
              <Link
                to="/ship-seat-allocation"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/ship-seat-allocation') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ship Allocation
              </Link>
              <Link
                to="/room-allocation"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/room-allocation') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Room Allocation
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive('/contact') 
                    ? 'bg-white/20 text-white border-l-4 border-white' 
                    : 'text-white hover:text-gray-100 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Auth Buttons - Mobile */}
              {user ? (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <button
                    onClick={handleDashboardClick}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#19aaba] rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:bg-gray-100"
                  >
                    {user.role === 'admin' ? (
                      <>
                        <LayoutDashboard size={16} />
                        <span>Admin Dashboard</span>
                      </>
                    ) : (
                      <>
                        <UserAvatar user={user} size="xs" />
                        <span>My Profile</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:bg-red-600"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-white text-[#19aaba] rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:bg-gray-100 mt-4"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
