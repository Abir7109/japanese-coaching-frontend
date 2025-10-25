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
      await axios.post(`/auth/reset-password/${token}`, { password });
      setStatus({ type: 'success', msg: 'Password updated. Redirecting to login...' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>New password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <label>Confirm password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
        <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</button>
      </form>
      {status && (
        <div className={`notice ${status.type}`}>{status.msg}</div>
      )}
    </div>
  );
}
