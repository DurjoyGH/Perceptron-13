import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft, Compass } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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

    // Validate Student ID
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^\d{6}$/.test(formData.studentId.trim())) {
      newErrors.studentId = 'Student ID must be 6 digits (e.g., 200120)';
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // TODO: Replace with actual API call
      // const response = await loginAPI(formData);
      console.log('Login Data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful login, navigate to dashboard or home
      // navigate('/dashboard');
      
      alert('Login successful! (This is a demo)');
    } catch (error) {
      setErrors({ submit: 'Invalid Student ID or Password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative max-w-6xl w-full">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left Side - Login Card */}
          <div className="order-2 md:order-1">
            {/* Login Card */}
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

              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
                <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Student ID Input */}
                <div>
                  <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      placeholder="e.g., 200120"
                      value={formData.studentId}
                      onChange={handleChange}
                      maxLength={6}
                      className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${
                        errors.studentId ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                    />
                  </div>
                  {errors.studentId && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.studentId}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#19aaba] focus:ring-[#19aaba] border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm">
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
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Login to Dashboard</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>
              </div>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Contact your tour coordinator to get registered
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 font-medium text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Right Side - Tour Showcase */}
          <div className="order-1 md:order-2">
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl sm:rounded-3xl blur-3xl opacity-20"></div>
              
              {/* Tour Showcase Container */}
              <div className="relative h-full bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl">
                {/* Photo Grid - Wall Pattern */}
                <div className="relative h-full">
                  {/* Photo 1 - Top Left (Tilted) */}
                  <div className="absolute top-0 left-0 w-[45%] h-[40%] sm:h-[45%] transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
                    <div className="w-full h-full bg-white p-1.5 sm:p-2 rounded-lg shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded"></div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full shadow-lg transform rotate-12"></div>
                  </div>

                  {/* Photo 2 - Top Right (Tilted opposite) */}
                  <div className="absolute top-0 right-0 w-[45%] h-[40%] sm:h-[45%] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
                    <div className="w-full h-full bg-white p-1.5 sm:p-2 rounded-lg shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded"></div>
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full shadow-lg transform -rotate-12"></div>
                  </div>

                  {/* Photo 3 - Bottom Left */}
                  <div className="absolute bottom-0 left-0 w-[45%] h-[40%] sm:h-[45%] transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
                    <div className="w-full h-full bg-white p-1.5 sm:p-2 rounded-lg shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded"></div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full shadow-lg transform rotate-45"></div>
                  </div>

                  {/* Photo 4 - Bottom Right */}
                  <div className="absolute bottom-0 right-0 w-[45%] h-[40%] sm:h-[45%] transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
                    <div className="w-full h-full bg-white p-1.5 sm:p-2 rounded-lg shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full shadow-lg transform -rotate-45"></div>
                  </div>

                  {/* Center Badge */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border-2 sm:border-4 border-white transform hover:scale-110 transition-transform duration-300">
                      <h3 className="text-base sm:text-xl font-bold text-center mb-1">Perceptron-13</h3>
                      <p className="text-[10px] sm:text-xs text-center text-cyan-100">CSE, JUST</p>
                      <p className="text-[10px] sm:text-xs text-center font-semibold text-yellow-300">Session 20-21</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap gap-2 justify-center z-20">
                  <span className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#19aaba] shadow-lg">
                    Cox's Bazar
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#19aaba] shadow-lg">
                    Saint Martin
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#19aaba] shadow-lg">
                    Marine Drive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
