import React, { useState } from 'react';
import axios from '../../utils/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', msg: 'If that email is registered, a reset link was sent.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>
      {status && (
        <div className={`notice ${status.type}`}>{status.msg}</div>
      )}
    </div>
  );
}
