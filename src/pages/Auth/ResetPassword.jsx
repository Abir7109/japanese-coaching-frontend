import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ type: 'error', msg: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setStatus({ type: 'success', msg: 'Password updated. Redirecting to login...' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient">🔑 Reset Password</h2>
            <p className="mt-2 text-gray-600">Create a new password to sign back in.</p>
          </div>

          {/* Alerts */}
          {status?.type === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{status.msg}</div>
          )}
          {status?.type === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{status.msg}</div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ocean mb-2">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean mb-2">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a href="#/login" className="text-teal hover:text-ocean font-semibold">Back to sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
