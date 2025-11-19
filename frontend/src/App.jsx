import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/Layouts/PublicLayout';
import HomePage from './pages/Public/HomePage';
import Login from './pages/Auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">About Us Page - Coming Soon</h1></div>} />
          <Route path="votes" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Votes Page - Coming Soon</h1></div>} />
          <Route path="contact" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Contact Page - Coming Soon</h1></div>} />
          <Route path="privacy" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Privacy Policy - Coming Soon</h1></div>} />
          <Route path="terms" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Terms of Service - Coming Soon</h1></div>} />
          <Route path="security" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Security Page - Coming Soon</h1></div>} />
          <Route path="faq" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">FAQ Page - Coming Soon</h1></div>} />
        </Route>

        {/* Auth Routes (without layout) */}
        <Route path="/login" element={<Login />} />

        {/* 404 Route */}
        <Route path="*" element={<div className="p-8 text-center min-h-screen flex items-center justify-center bg-gray-100"><h1 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
