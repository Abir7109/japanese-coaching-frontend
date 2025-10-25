import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-ivory dark:bg-night">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-ocean dark:text-sand">
            <h1 className="text-5xl md:text-6xl font-bold text-ocean mb-6">
              🌸 日本語コーチング
            </h1>
            <p className="text-2xl md:text-3xl text-gradient font-semibold mb-4">
              Japanese Language Coaching
            </p>
            <p className="text-xl text-ocean max-w-3xl mx-auto mb-8">
              Fostering a connected, immersive learning experience for students and teachers of Japanese language.
              Building bridges through language and culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-24 fill-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-steel py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-ocean dark:text-sand mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-ocean mb-3">
                Interactive Learning
              </h3>
              <p className="text-gray-600">
                Engage with immersive lessons, real-time feedback, and personalized learning paths tailored to your level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold text-ocean mb-3">
                Community Support
              </h3>
              <p className="text-gray-600">
                Connect with fellow learners and experienced teachers. Share progress and celebrate achievements together.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-ocean mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress reports, streaks, and milestone celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal to-ocean py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-aqua mb-8">
            Join our growing community of Japanese language learners today!
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="bg-white text-ocean hover:bg-aqua hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 inline-block shadow-lg">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
