import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { resetPassword } from '../../utils/auth';
import AdminHeader from '../../components/admin/Header';
import AdminFooter from '../../components/admin/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await resetPassword(email);
      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AdminHeader />
      <section className="py-20 flex-1">
        <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-6">Reset Password</h1>
        
        {sent ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-black mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-blue-900">What's next?</h3>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  Check your email inbox (and spam folder), click the reset link in the email, and create your new password.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-black transition-colors text-sm"
                >
                  Try Different Email
                </button>
                <Link 
                  to="/admin/login" 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none hover:border-amber-300 disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
            
            <div className="text-center">
              <Link to="/admin/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                Back to login
              </Link>
            </div>
          </form>
        )}
        </div>
      </section>
      <AdminFooter />
    </div>
  );
};

export default ForgotPassword;


