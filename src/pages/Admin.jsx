import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendanceBoard from '../components/Admin/AttendanceBoard';

const MOTIVATION_QUOTES = [
  'Leadership is service, not status. Your effort uplifts everyone. — Thank you!',
  'The best leaders create more leaders. Your guidance empowers our class.',
  'Small consistent actions lead to big results. Your consistency inspires us.',
  'Clarity, kindness, and courage—pillars of great admin work. We appreciate you.',
  'A great classroom is built on care and accountability. Thanks for modeling both.'
];

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [settingsId, setSettingsId] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchSettings();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeSettings = (data) => {
    if (!data) return null;
    const s = data.settings || data;
    return {
      id: s._id || s.id || null,
      currentBookNameJa: s.currentBookNameJa || s.currentBookNameJP || s.bookNameJa || s.book || 'みんなの日本語',
      currentLesson: Number(s.currentLesson ?? s.lesson ?? 0) || 0,
    };
  };

  const fetchSettings = async () => {
    try {
      const urls = ['/api/settings','/api/class/settings','/settings','/api/v1/settings'];
      let ok = null; let lastErr = null;
      for (const u of urls) {
        try { const res = await axios.get(u); ok = res; break; } catch (err) { lastErr = err; }
      }
      if (!ok) throw lastErr || new Error('Failed to load settings');
      const norm = normalizeSettings(ok.data);
      setSettings(norm);
      setSettingsId(norm?.id || null);
    } catch (e) {
      // ignore
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    setSaveMessage('');
    setSaveError('');
    const payload = {
      currentBookNameJa: settings.currentBookNameJa,
      currentBookNameJP: settings.currentBookNameJa,
      bookNameJa: settings.currentBookNameJa,
      currentLesson: Number(settings.currentLesson) || 0,
    };
    try {
      const urlCandidates = [
        '/api/settings',
        settingsId ? `/api/settings/${settingsId}` : null,
        '/settings',
        settingsId ? `/settings/${settingsId}` : null,
        '/api/v1/settings',
        settingsId ? `/api/v1/settings/${settingsId}` : null,
        '/api/admin/settings',
        '/api/settings/admin',
        '/api/class/settings',
      ].filter(Boolean);
      const methods = ['put','patch','post'];
      const bodies = [
        payload,
        { settings: payload },
        { bookNameJa: payload.currentBookNameJa, currentLesson: payload.currentLesson },
        { currentBookName: payload.currentBookNameJa, lesson: payload.currentLesson },
      ];
      let ok = null; let lastErr = null; let lastUrl = '';
      const triedList = [];
      for (const url of urlCandidates) {
        // keep a breadcrumb list globally for debugging
        if (typeof window !== 'undefined') window.__lastTriedSettingsList = triedList.join(', ');
        for (const method of methods) {
          for (const body of bodies) {
            triedList.push(`${method.toUpperCase()} ${url}`);
            try {
              lastUrl = url;
              const res = await axios[method](url, body);
              ok = res; break;
            } catch (err) {
              lastErr = err;
            }
          }
          if (ok) break;
        }
        if (ok) break;
      }
      if (!ok) throw lastErr || new Error('Failed');
      const normalized = normalizeSettings(ok.data);
      setSettings(normalized);
      setSettingsId(normalized?.id || settingsId);
      setSaveMessage('Settings saved');
    } catch (e) {
      const tried = e?.response?.config?.url ? ` (${e.response.config.url})` : '';
      const triedMsg = (typeof window !== 'undefined' && window.__lastTriedSettingsList) ? ` | Tried: ${window.__lastTriedSettingsList}` : '';
      setSaveError((e.response?.data?.message || e.message || 'Failed to save settings') + tried + triedMsg);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) {
      return;
    }

    try {
      await axios.put(`/api/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'teacher':
        return 'bg-blue-100 text-blue-700';
      case 'student':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-night py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ocean mb-2">⚙️ Admin Panel</h1>
          <p className="text-gray-600">Manage users and their roles</p>
        </div>

        {/* Motivation */}
        <div className="card mb-8 bg-gradient-to-r from-khaki to-aqua text-night">
          <div className="text-lg font-semibold mb-1">💡 Motivation</div>
          <div className="text-sm">{MOTIVATION_QUOTES[Math.floor(Math.random()*MOTIVATION_QUOTES.length)]}</div>
        </div>

        {/* Global Settings */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ocean">Class Settings</h2>
            <button onClick={saveSettings} disabled={savingSettings} className="btn-primary">{savingSettings ? 'Saving…' : 'Save'}</button>
          </div>
          {saveMessage && (
            <div className="mb-3 px-3 py-2 rounded bg-green-100 text-green-700 text-sm">{saveMessage}</div>
          )}
          {saveError && (
            <div className="mb-3 px-3 py-2 rounded bg-red-100 text-red-700 text-sm">{saveError}</div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm text-ocean">Book (日本語)
              <input className="input-field mt-1" value={settings?.currentBookNameJa || ''} onChange={e=>setSettings(s=>({...s, currentBookNameJa: e.target.value}))} placeholder="みんなの日本語" />
            </label>
            <label className="block text-sm text-ocean">Current Lesson
              <input type="number" min="0" className="input-field mt-1" value={settings?.currentLesson ?? 0} onChange={e=>setSettings(s=>({...s, currentLesson: e.target.value}))} />
            </label>
            <div className="text-sm text-gray-500">Students see this on Dashboard and Profile</div>
          </div>
        </div>

        {/* Preview of what students see */}
        <div className="card mb-8">
          <div className="font-semibold text-ocean mb-2">Preview: Student View</div>
          <div className="text-sm text-gray-700">{settings?.currentBookNameJa || 'みんなの日本語'} • Lesson {settings?.currentLesson ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">This appears on the Dashboard header and on student profiles.</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-3xl font-bold text-ocean">{users.length}</p>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-teal">
              {users.filter(u => u.role === 'student').length}
            </p>
            <p className="text-gray-600">Students</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-ocean">
              {users.filter(u => u.role === 'teacher' || u.role === 'admin').length}
            </p>
            <p className="text-gray-600">Teachers & Admins</p>
          </div>
        </div>

        {/* Attendance Board */}
        <div className="mb-8">
          <AttendanceBoard />
        </div>

        {/* Users Table */}
        <div className="card">
          <h2 className="text-2xl font-bold text-ocean mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-ocean">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-ocean">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-ocean">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-ocean">Joined</th>
                  <th className="text-center py-3 px-4 font-semibold text-ocean">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-ivory">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-aqua to-teal rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-ocean">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Role Change Dropdown */}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="text-sm border-2 border-aqua rounded px-2 py-1 focus:outline-none focus:border-teal"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
