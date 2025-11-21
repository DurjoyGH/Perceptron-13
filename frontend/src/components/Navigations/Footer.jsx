import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Perceptron-13 Logo" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Perceptron-13
              </h2>
            </div>
            <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
              CSE Department, Jashore University of Science and Technology. 
              Bridging academic excellence with industry innovation through our Industrial Tour 2025.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61572507146309"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="mailto:perceptron13cse@gmail.com"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Members
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Allocations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Allocations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bus-seat-allocation" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Bus Allocation
                </Link>
              </li>
              <li>
                <Link to="/ship-seat-allocation" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Ship Allocation
                </Link>
              </li>
              <li>
                <Link to="/room-allocation" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Room Allocation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Perceptron-13, CSE, JUST. All rights reserved. Built with ❤️ by Batch 13.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                Tour Guidelines
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                Gallery
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
