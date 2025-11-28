import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { verifyOTP, forgotPassword } from '../../services/authApi';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const email = location.state?.email;
  const maskedEmail = location.state?.maskedEmail;

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      newErrors.otp = 'Please enter the complete 6-digit OTP';
    } else if (!/^\d+$/.test(otpString)) {
      newErrors.otp = 'OTP must contain only numbers';
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
      const otpString = otp.join('');
      console.log('Submitting OTP verification:', { email, otp: otpString, timestamp: new Date().toISOString() });
      const data = await verifyOTP(email, otpString);

      toast.success('OTP verified successfully!');
      
      // Navigate to reset password page with reset token
      navigate('/reset-password', { 
        state: { 
          resetToken: data.data.resetToken 
        } 
      });

    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);

    try {
      await forgotPassword(location.state?.originalEmail || email);

      toast.success('New OTP sent to your email');
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp(['', '', '', '', '', '']); // Clear current OTP
      inputRefs.current[0].focus();

    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect
  }

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
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#19aaba] to-[#158c99] rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verify OTP</h3>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit code to
            </p>
            <p className="text-[#19aaba] font-semibold text-sm">
              {maskedEmail}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    } ${digit ? 'bg-[#19aaba] text-white border-[#19aaba]' : 'bg-white text-gray-900'}`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="mt-3 text-xs sm:text-sm text-red-600 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  Time remaining: <span className="font-mono font-bold text-[#19aaba]">{formatTime(timeLeft)}</span>
                </p>
              </div>
              
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors duration-200 flex items-center gap-1 mx-auto disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Didn't receive the code? You can resend in {formatTime(timeLeft)}
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
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19aaba] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Forgot Password */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Forgot Password
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-sm">
          <h4 className="font-semibold mb-2">Tips:</h4>
          <ul className="space-y-1 text-white/80">
            <li>• Check your spam/junk folder if you don't see the email</li>
            <li>• The OTP expires in 5 minutes for security</li>
            <li>• You can paste the OTP directly into the first field</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;