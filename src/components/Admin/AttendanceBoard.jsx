import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceBoard = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, profilesRes, todayRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/profiles'),
        axios.get('/api/attendance/today')
      ]);
      setUsers(usersRes.data.users || []);
      setProfiles(profilesRes.data.profiles || []);
      setTodayRecords(todayRes.data.records || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recordMap = new Map(todayRecords.map(r => [r.user?._id, r]));
  const profileMap = new Map(profiles.map(p => [p.user?._id, p]));

  const mark = async (userId, incrementLesson) => {
    try {
      setSubmitting(true);
      await axios.post('/api/attendance/mark', { userId, present: true, incrementLesson });
      await fetchData();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-teal mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-ocean">🗂️ Attendance Board (Today)</h2>
          <p className="text-sm text-gray-600">Marked: {todayRecords.length} / {users.filter(u=>u.role==='student').length}</p>
        </div>
        <button onClick={fetchData} className="btn-secondary">Refresh</button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-ocean">Student</th>
              <th className="text-left py-3 px-4 font-semibold text-ocean">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-ocean">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-ocean">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => u.role === 'student')
              .map((u) => {
                const rec = recordMap.get(u._id);
                const p = profileMap.get(u._id);
                return (
                  <tr key={u._id} className="border-b border-gray-200 hover:bg-ivory">
                    <td className="py-3 px-4 font-medium text-ocean">{u.name}
                      <div className="text-xs text-gray-500">Lessons: {p?.progress?.lessonsCompleted ?? 0} • Streak: {p?.progress?.currentStreak ?? 0}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      {rec ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm">Present</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">Not Marked</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          disabled={submitting || !!rec}
                          onClick={() => mark(u._id, false)}
                          className={`btn-secondary ${rec ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {rec ? 'Marked' : 'Mark Present'}
                        </button>
                        <button
                          disabled={submitting}
                          onClick={() => mark(u._id, true)}
                          className="btn-primary"
                        >
                          Present + Lesson
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceBoard;
