import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // You can connect this to your AuthContext

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthToggle = () => {
    if (isLoggedIn) {
      // Logout logic
      setIsLoggedIn(false);
      // TODO: Add your logout API call here
      // Clear user data, tokens, etc.
      navigate('/');
    } else {
      // Navigate to login page
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transform hover:rotate-12 transition-transform duration-300 overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="VoterX Logo" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:text-gray-100 transition-colors duration-200">
              Perceptron-13
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              to="/schedule"
              className="text-white hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Schedule
            </Link>
            <Link
              to="/bus-seat-allocation"
              className="text-white hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Bus Allocation
            </Link>
            <Link
              to="/room-allocation"
              className="text-white hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Room Allocation
            </Link>
            <Link
              to="/members"
              className="text-white hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Members
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/10"
            >
              Contact
            </Link>
            
            {/* Login/Logout Toggle Button */}
            <button
              onClick={handleAuthToggle}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isLoggedIn
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-[#19aaba]'
              }`}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
          <div className="md:hidden pb-4 animate-slideDown">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/members"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Members
              </Link>
              <Link
                to="/schedule"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link
                to="/bus-allocation"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Bus Allocation
              </Link>
              <Link
                to="/room-allocation"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Room Allocation
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-gray-100 hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  handleAuthToggle();
                  setIsMenuOpen(false);
                }}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg ${
                  isLoggedIn
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-[#19aaba]'
                }`}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
