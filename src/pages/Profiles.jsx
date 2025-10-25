import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard/ProfileCard';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get('/api/profiles');
      setProfiles(res.data.profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (filter === 'all') return true;
    return profile.japaneseLevel === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-night flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-night py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ocean dark:text-sand mb-4">👥 Student Profiles</h1>
          <p className="text-gray-600 dark:text-sand/80 mb-6">
            Connect with fellow learners and explore their Japanese learning journey
          </p>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-teal text-white dark:bg-khaki dark:text-night'
                  : 'bg-white text-ocean hover:bg-aqua dark:bg-steel dark:text-sand dark:hover:bg-khaki'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilter('beginner')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'beginner'
                  ? 'bg-teal text-white dark:bg-khaki dark:text-night'
                  : 'bg-white text-ocean hover:bg-aqua dark:bg-steel dark:text-sand dark:hover:bg-khaki'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilter('elementary')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'elementary'
                  ? 'bg-teal text-white dark:bg-khaki dark:text-night'
                  : 'bg-white text-ocean hover:bg-aqua dark:bg-steel dark:text-sand dark:hover:bg-khaki'
              }`}
            >
              Elementary
            </button>
            <button
              onClick={() => setFilter('intermediate')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'intermediate'
                  ? 'bg-teal text-white dark:bg-khaki dark:text-night'
                  : 'bg-white text-ocean hover:bg-aqua dark:bg-steel dark:text-sand dark:hover:bg-khaki'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilter('advanced')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'advanced'
                  ? 'bg-teal text-white dark:bg-khaki dark:text-night'
                  : 'bg-white text-ocean hover:bg-aqua dark:bg-steel dark:text-sand dark:hover:bg-khaki'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Profile Cards Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No profiles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;
