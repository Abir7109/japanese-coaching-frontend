import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SelfProfile() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  const id = user.id || user._id;
  return <Navigate to={`/profiles/${id}`} replace />;
}
