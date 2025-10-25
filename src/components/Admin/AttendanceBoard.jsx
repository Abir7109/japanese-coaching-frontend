import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceBoard = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [unmarkedOnly, setUnmarkedOnly] = useState(false);

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

  const setRecordFor = (userId, record) => {
    setTodayRecords(prev => {
      const other = prev.filter(r => String(r.user?._id) !== String(userId));
      return record ? [...other, record] : other;
    });
  };

  const mark = async (userId, incrementLesson) => {
    try {
      setSubmitting(true);
      const res = await axios.post('/api/attendance/mark', { userId, present: true, incrementLesson });
      // Optimistic update
      setRecordFor(userId, res.data.attendance || { user: { _id: userId }, present: true, lessonIncrement: incrementLesson?1:0 });
      setInfo('Saved');
      setTimeout(()=>setInfo(''), 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const markAllUnmarked = async () => {
    const list = users
      .filter(u => u.role === 'student')
      .filter(u => !recordMap.get(u._id));
    if (list.length === 0) return;
    setSubmitting(true);
    try {
      await Promise.allSettled(list.map(u => axios.post('/api/attendance/mark', { userId: u._id, present: true, incrementLesson: false })));
      // refresh minimal: create records for each
      list.forEach(u => setRecordFor(u._id, { user: { _id: u._id }, present: true, lessonIncrement: 0 }));
      setInfo(`Marked ${list.length} present`);
      setTimeout(()=>setInfo(''), 1500);
    } catch (e) {
      setError('Some marks failed');
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
      <div className="sticky top-2 z-10 bg-white/70 backdrop-blur rounded-lg p-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-ocean">🗂️ Attendance Board (Today)</h2>
          <p className="text-sm text-gray-600">Marked: {todayRecords.length} / {users.filter(u=>u.role==='student').length}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="accent-teal" checked={unmarkedOnly} onChange={(e)=>setUnmarkedOnly(e.target.checked)} />
            Show unmarked only
          </label>
          <button onClick={markAllUnmarked} disabled={submitting} className="btn-primary">Mark all present</button>
          <button onClick={fetchData} className="btn-secondary">Refresh</button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>
      )}
      {info && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{info}</div>
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
              .sort((a,b)=>a.name.localeCompare(b.name))
              .filter(u => !unmarkedOnly || !recordMap.get(u._id))
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
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          disabled={submitting || !!rec}
                          onClick={() => mark(u._id, false)}
                          className={`btn-secondary ${rec ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {rec ? 'Marked' : 'Present'}
                        </button>
                        <button
                          disabled={submitting}
                          onClick={() => mark(u._id, true)}
                          className="btn-primary"
                        >
                          + Lesson
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
