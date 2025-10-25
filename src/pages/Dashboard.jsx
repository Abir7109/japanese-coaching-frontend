import React from 'react';
import { useAuth } from '../context/AuthContext';
import NoticeBoard from '../components/NoticeBoard/NoticeBoard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="card mb-8 bg-gradient-to-r from-teal to-ocean text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-ocean text-2xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 🌸</h1>
              <p className="text-aqua mt-1">Ready to continue your Japanese learning journey?</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-2xl font-bold text-teal">0</p>
            <p className="text-gray-600">Lessons Completed</p>
          </div>
          <div className="card text-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-ocean">0</p>
            <p className="text-gray-600">Day Streak</p>
          </div>
          <div className="card text-center hover:scale-105 transition-transform">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-2xl font-bold text-teal">Beginner</p>
            <p className="text-gray-600">Current Level</p>
          </div>
        </div>

        {/* Notice Board */}
        <NoticeBoard />
      </div>
    </div>
  );
};

export default Dashboard;
