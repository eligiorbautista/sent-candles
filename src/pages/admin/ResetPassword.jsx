import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../config/supabase.js';
import { logout } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if we have a valid password reset session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new password reset.' });
        }
      } catch (error) {
        console.error('Session check error:', error);
        setMessage({ type: 'error', text: 'Invalid or expired reset link. Please request a new password reset.' });
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password reset error:', error);
        setMessage({ type: 'error', text: error.message || 'Failed to reset password.' });
        return;
      }

      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
      
      // Logout the user and redirect to login after 2 seconds
      setTimeout(async () => {
        await logout();
        navigate('/admin/login');
      }, 2000);

    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AdminHeader />
      
      <section className="py-12 flex-1">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8">
            {!isValidSession ? (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">Invalid Reset Link</h3>
                <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
                <button
                  onClick={() => navigate('/admin/forgot')}
                  className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
                >
                  Request New Reset Link
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none hover:border-amber-300 disabled:opacity-50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none hover:border-amber-300 disabled:opacity-50"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.type === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={async () => {
                await logout();
                navigate('/admin/login');
              }}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </section>

      <AdminFooter />
    </div>
  );
};

export default ResetPassword;
