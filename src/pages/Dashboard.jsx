import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NoticeBoard from '../components/NoticeBoard/NoticeBoard';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [stars, setStars] = useState(0);
  const [rated, setRated] = useState(false);
  const [ratingMsg, setRatingMsg] = useState('');
 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profiles/me');
        setProfile(res.data.profile);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data.settings);
      } catch {}
    };
    const fetchAdmin = async () => {
      try {
        const res = await axios.get('/api/profiles');
        const list = (res.data.profiles || []).map(p=>p.user).filter(Boolean);
        const adm = list.find(u=>u.role==='admin') || list.find(u=>u.role==='teacher') || null;
        setAdminUser(adm);
      } catch {}
    };
    fetchProfile();
    fetchSettings();
    fetchAdmin();
  }, []);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) return;
    (async () => {
      try {
        const res = await axios.get('/api/ratings/recent');
        setRatings(res.data.ratings || []);
      } catch {}
    })();
  }, [user]);

  const avgRating = ratings.length ? (ratings.reduce((s,r)=>s+r.value,0)/ratings.length).toFixed(2) : '—';

  return (
    <div className="min-h-screen bg-ivory dark:bg-night py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="card mb-4 bg-gradient-to-r from-teal to-ocean text-white">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-aqua shadow-lg bg-white" />
            ) : (
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-ocean text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 🌸</h1>
              <p className="text-aqua mt-1">{settings ? `${settings.currentBookNameJa} • Lesson ${settings.currentLesson}` : 'Ready to continue your Japanese learning journey?'}</p>
            </div>
          </div>
        </div>

        {/* Student Stats or Teacher/Admin Ratings */}
        {user?.role === 'student' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-2xl font-bold text-teal">{loading ? '—' : (profile?.progress?.lessonsCompleted ?? 0)}</p>
                <p className="text-gray-600">Lessons Completed</p>
              </div>
              <div className="card text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-2xl font-bold text-ocean">{loading ? '—' : (profile?.progress?.currentStreak ?? 0)}</p>
                <p className="text-gray-600">Day Streak</p>
              </div>
              <div className="card text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-2xl font-bold text-teal">{loading ? '—' : (profile?.japaneseLevel?.charAt(0).toUpperCase() + profile?.japaneseLevel?.slice(1) || 'Beginner')}</p>
                <p className="text-gray-600">Current Level</p>
              </div>
            </div>

            {/* Admin card + 5-star rating */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card flex items-center gap-4">
                <div>
                  {adminUser?.avatar ? (
                    <img src={adminUser.avatar} alt={adminUser?.name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-aqua to-teal text-white flex items-center justify-center text-2xl font-bold">
                      {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Current Admin</div>
                  <div className="text-xl font-semibold text-ocean">{adminUser?.name || '—'}</div>
                  <div className="text-xs text-gray-500">{adminUser?.email}</div>
                </div>
              </div>

              <div className="card">
                <div className="font-semibold text-ocean mb-2">Rate your class today</div>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map(n=> (
                    <button key={n} className={`text-2xl ${n <= stars ? 'text-yellow-400' : 'text-gray-300'}`} onClick={()=>!rated && setStars(n)} aria-label={`${n} star`}>
                      ★
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={rated || stars===0} className="btn-primary" onClick={async()=>{
                    try {
                      setRatingMsg('');
                      await axios.post('/api/ratings', { value: stars });
                      setRated(true);
                      setRatingMsg('Thanks for your feedback!');
                    } catch (e) {
                      setRatingMsg(e.response?.data?.message || 'Failed to submit rating');
                    }
                  }}>{rated ? 'Rated' : 'Submit Rating'}</button>
                  {ratingMsg && <span className="text-sm text-gray-600">{ratingMsg}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-2">Anonymous, limited to one rating per day.</div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center md:col-span-2">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-2xl font-bold text-ocean">Average Rating (14d): {avgRating}</p>
              <p className="text-gray-600">{ratings.length} total ratings</p>
            </div>
            <div className="card max-h-64 overflow-auto">
              <div className="font-semibold text-ocean mb-2">Recent Ratings</div>
              <ul className="space-y-1 text-sm text-gray-700">
                {ratings.map((r,idx)=> (
                  <li key={idx} className="flex justify-between"><span>{new Date(r.date).toLocaleDateString()}</span><span>{'★'.repeat(r.value)}</span></li>
                ))}
                {ratings.length===0 && <li>No ratings yet.</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Notice Board */}
        <NoticeBoard />
      </div>
    </div>
  );
};

export default Dashboard;
