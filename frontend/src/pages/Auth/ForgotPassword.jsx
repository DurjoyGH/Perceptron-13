import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPassword } from '../../services/authApi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Student ID or Faculty ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await forgotPassword(formData.email);
      
      toast.success('OTP sent to your email address');
      
      // Navigate to OTP verification page with email
      navigate('/verify-otp', { 
        state: { 
          email: data.data.email, // Actual email for verification
          maskedEmail: data.data.maskedEmail, // Masked email for display
          originalEmail: formData.email // Original input for resending
        } 
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Perceptron-13</h2>
              <p className="text-xs sm:text-sm text-[#19aaba] font-semibold">Industrial Tour 2025</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h3>
            <p className="text-gray-600 text-sm">
              No worries! Enter your Student ID or Faculty ID and we'll send you an OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student ID / Faculty ID Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Student ID / Faculty ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your Student ID or Faculty ID"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19aaba] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send OTP</span>
                </>
              )}
            </button>
          </form>

          {/* Information */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-700">
                <p className="font-semibold mb-1">How it works:</p>
                <ul className="space-y-1 text-blue-600">
                  <li>1. Enter your Student ID or Faculty ID</li>
                  <li>2. We'll send a 6-digit OTP to your registered email</li>
                  <li>3. Enter the OTP to verify your identity</li>
                  <li>4. Set your new password</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            Still having trouble? Contact your tour coordinator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;