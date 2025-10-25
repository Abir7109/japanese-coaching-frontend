import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    japaneseLevel: 'beginner',
    socialLinks: {
      facebook: '',
      whatsapp: '',
      instagram: '',
      twitter: ''
    }
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profiles/me');
      setProfile(res.data.profile);
      setFormData({
        bio: res.data.profile.bio || '',
        japaneseLevel: res.data.profile.japaneseLevel || 'beginner',
        socialLinks: res.data.profile.socialLinks || {
          facebook: '',
          whatsapp: '',
          instagram: '',
          twitter: ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.put('/api/profiles', formData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      setMessage('Failed to update profile');
      console.error('Error updating profile:', error);
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
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card mb-8 bg-gradient-to-r from-teal to-ocean text-white">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-2 border-aqua shadow-lg bg-white" />
            ) : (
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-ocean text-3xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-aqua">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white text-ocean rounded-full text-sm font-medium">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded ${
            message.includes('success') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Form */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-ocean">Profile Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div>
                <h3 className="text-lg font-semibold text-ocean mb-2">Profile Picture</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-aqua cursor-pointer group">
                    {user?.avatar || avatarPreview ? (
                      <img src={avatarPreview || user?.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-ivory flex items-center justify-center text-ocean">No Image</div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
                      const f = e.target.files?.[0];
                      if (f) {
                        setAvatarFile(f);
                        setAvatarPreview(URL.createObjectURL(f));
                      }
                    }} />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-end justify-center transition-opacity">
                      <span className="text-white text-xs mb-2">Tap to change</span>
                    </div>
                  </label>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <button type="button" className="btn-secondary" onClick={()=>{
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e)=>{
                          const f = e.target.files?.[0];
                          if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }
                        };
                        input.click();
                      }}>Choose Photo</button>
                      <button type="button" className="btn-primary" onClick={async ()=>{
                        if (!avatarFile && !avatarUrl) return alert('Choose a file or enter a URL');
                        const id = user?.id || user?._id;
                        try {
                          if (avatarFile) {
                            const fd = new FormData();
                            fd.append('avatar', avatarFile);
                            await axios.post(`/api/users/${id}/avatar`, fd);
                          } else if (avatarUrl) {
                            await axios.post(`/api/users/${id}/avatar`, { url: avatarUrl });
                          }
                          window.location.reload();
                        } catch (e) {
                          alert(e.response?.data?.message || 'Failed to update avatar');
                        }
                      }}>Save Photo</button>
                    </div>
                    <div className="text-sm text-gray-500">Or paste an image URL</div>
                    <input value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)} placeholder="https://example.com/pic.jpg" className="input-field w-full" />
                    <p className="text-xs text-gray-500">Tip: On mobile, tap the photo or Choose Photo to open your camera/gallery.</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-ocean mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Japanese Level */}
              <div>
                <label className="block text-sm font-medium text-ocean mb-2">
                  Japanese Level
                </label>
                <select
                  name="japaneseLevel"
                  value={formData.japaneseLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="elementary">Elementary</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="native">Native</option>
                </select>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ocean">Social Links</h3>
                
                <div>
                  <label className="block text-sm font-medium text-ocean mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="social_facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ocean mb-2">
                    WhatsApp (Phone Number)
                  </label>
                  <input
                    type="text"
                    name="social_whatsapp"
                    value={formData.socialLinks.whatsapp}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ocean mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="social_instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ocean mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="social_twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display Bio */}
              <div>
                <h3 className="text-sm font-medium text-ocean mb-2">Bio</h3>
                <p className="text-gray-600">
                  {profile?.bio || 'No bio added yet'}
                </p>
              </div>

              {/* Display Level */}
              <div>
                <h3 className="text-sm font-medium text-ocean mb-2">Japanese Level</h3>
                <span className="inline-block px-3 py-1 bg-teal text-white rounded-full text-sm font-medium">
                  {profile?.japaneseLevel?.charAt(0).toUpperCase() + profile?.japaneseLevel?.slice(1)}
                </span>
              </div>

              {/* Display Progress */}
              <div>
                <h3 className="text-sm font-medium text-ocean mb-4">Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-ivory rounded-lg text-center">
                    <p className="text-3xl font-bold text-teal">{profile?.progress?.lessonsCompleted || 0}</p>
                    <p className="text-sm text-gray-600">Lessons Completed</p>
                  </div>
                  <div className="p-4 bg-ivory rounded-lg text-center">
                    <p className="text-3xl font-bold text-ocean">{profile?.progress?.currentStreak || 0}</p>
                    <p className="text-sm text-gray-600">Day Streak 🔥</p>
                  </div>
                </div>
              </div>

              {/* Display Social Links */}
              <div>
                <h3 className="text-sm font-medium text-ocean mb-2">Social Links</h3>
                <div className="flex gap-3">
                  {profile?.socialLinks?.facebook && (
                    <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-ocean">
                      Facebook
                    </a>
                  )}
                  {profile?.socialLinks?.whatsapp && (
                    <a href={`https://wa.me/${profile.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-ocean">
                      WhatsApp
                    </a>
                  )}
                  {profile?.socialLinks?.instagram && (
                    <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-ocean">
                      Instagram
                    </a>
                  )}
                  {profile?.socialLinks?.twitter && (
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-ocean">
                      Twitter
                    </a>
                  )}
                  {!profile?.socialLinks?.facebook && !profile?.socialLinks?.whatsapp && 
                   !profile?.socialLinks?.instagram && !profile?.socialLinks?.twitter && (
                    <p className="text-gray-500">No social links added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
