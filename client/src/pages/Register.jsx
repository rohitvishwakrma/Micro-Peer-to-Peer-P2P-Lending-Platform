import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoinLine from 'remixicon-react/CoinLine';
import UserLine from 'remixicon-react/UserLine';
import MailLine from 'remixicon-react/MailLine';
import LockLine from 'remixicon-react/LockLine';
import PhoneLine from 'remixicon-react/PhoneLine';
import BriefcaseLine from 'remixicon-react/BriefcaseLine';
import UserStarLine from 'remixicon-react/UserStarLine';
import ArrowRightLine from 'remixicon-react/ArrowRightLine';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'borrower'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CoinLine className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join the P2P Lending Platform</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <UserLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="Enter your name" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <MailLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
            <div className="relative">
              <PhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="+91 98765 43210" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <LockLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="Min 6 characters" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <LockLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="Confirm password" required />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">I want to be a</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({...formData, role: 'borrower'})}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${formData.role === 'borrower' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200'}`}>
                <BriefcaseLine className="h-5 w-5" /><span>Borrower</span>
              </button>
              <button type="button" onClick={() => setFormData({...formData, role: 'lender'})}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${formData.role === 'lender' ? 'border-green-600 bg-green-50 text-green-600' : 'border-gray-200'}`}>
                <UserStarLine className="h-5 w-5" /><span>Lender</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
            {loading ? 'Creating account...' : <><ArrowRightLine className="h-5 w-5" /> Register</>}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;