import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Stat({ label, value, sub }) {
  return (
    <div className="p-4 rounded-xl bg-ivory dark:bg-steel shadow-sm">
      <div className="text-sm text-gray-500 dark:text-sand/70">{label}</div>
      <div className="text-2xl font-bold text-ocean dark:text-sand">{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-500 dark:text-sand/70 mt-1">{sub}</div>}
    </div>
  );
}

function CircleProgress({ percent=0, size=96, stroke=10, trackColor='#e5e7eb', barColor='#48A6A7' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(100, percent)) / 100 * c;
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size/2} cy={size/2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={barColor} strokeWidth={stroke} fill="none"
              strokeLinecap="round" strokeDasharray={`${dash} ${c-dash}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-current text-ocean dark:text-sand" fontSize={14}>
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

const tabs = ['Overview','Courses','Achievements','Activity','Settings'];

export default function StudentProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('Overview');
  const [compare, setCompare] = useState(false);
  const [rankInfo, setRankInfo] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`/api/profiles/user/${id}`);
        if (mounted) setProfile(res.data.profile);
      } catch (e) {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (!compare) return;
    (async () => {
      try {
        const res = await axios.get('/api/profiles');
        const list = res.data.profiles || [];
        const sorted = [...list].sort((a,b)=>(b?.progress?.lessonsCompleted||0)-(a?.progress?.lessonsCompleted||0));
        const idx = sorted.findIndex(p=>p.user?._id===profile?.user?._id);
        if (idx>=0) setRankInfo({ rank: idx+1, total: sorted.length });
      } catch {}
    })();
  }, [compare, profile]);

  const perf = useMemo(()=>{
    const lessons = profile?.progress?.lessonsCompleted ?? 0;
    return (Math.min(4, (lessons/25))).toFixed(2); // naive score on 0-4
  }, [profile]);

  const attendance = useMemo(()=>{
    // Placeholder until real attendance is wired
    const base = profile?.progress?.currentStreak ?? 0;
    return Math.max(50, Math.min(100, 60 + base));
  }, [profile]);

  const coursePct = useMemo(()=>{
    const lessons = profile?.progress?.lessonsCompleted ?? 0;
    const total = 100; // assume 100 lessons target
    return Math.min(100, Math.round((lessons/total)*100));
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-night flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-night flex items-center justify-center">
        <div className="card">Profile not found.</div>
      </div>
    );
  }

  const u = profile.user || {};

  return (
    <div className="min-h-screen bg-ivory dark:bg-night py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid: profile card + quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <div className="card relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-aqua/20 blur-2xl" />
            <div className="flex items-center gap-5">
              <div className="relative group">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-24 h-24 rounded-2xl object-cover transform transition-all duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-aqua to-teal text-white flex items-center justify-center text-3xl font-bold">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 text-xs rounded-full bg-teal text-white shadow">Active</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-ocean dark:text-sand">{u.name}</h1>
                <div className="text-sm text-gray-500 dark:text-sand/70">{u.email}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-ocean text-white">{u.role === 'teacher' ? 'Group Admin' : 'Japanese Learner'}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-khaki text-night">ID: {u._id?.slice(-6)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Performance (GPA)" value={perf} sub="0.00 – 4.00" />
              <Stat label="Attendance" value={`${attendance}%`} sub="last 30 days" />
              <div className="p-4 rounded-xl bg-ivory dark:bg-steel shadow-sm flex items-center gap-4">
                <CircleProgress percent={coursePct} />
                <div>
                  <div className="text-sm text-gray-500 dark:text-sand/70">Course Progress</div>
                  <div className="text-2xl font-bold text-ocean dark:text-sand">{coursePct}%</div>
                </div>
              </div>
              <Stat label="Last login" value={new Date().toLocaleString()} />
            </div>
          </div>
        </div>

        {/* Peer comparison + actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ocean dark:text-sand cursor-pointer">
              <input type="checkbox" checked={compare} onChange={(e)=>setCompare(e.target.checked)} />
              Peer comparison
            </label>
            {compare && rankInfo && (
              <span className="text-sm px-2 py-1 rounded bg-aqua text-white dark:bg-khaki dark:text-night">Rank #{rankInfo.rank} of {rankInfo.total}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary">Message</button>
            <button className="btn-primary">Recommend</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-aqua/40 dark:border-steel -mx-6 px-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map(t => (
                <button key={t} onClick={()=>setActive(t)}
                        className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${active===t ? 'bg-aqua text-white dark:bg-khaki dark:text-night' : 'text-ocean dark:text-sand hover:bg-ivory dark:hover:bg-steel'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            {active === 'Overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-ocean dark:text-sand mb-2">About</h3>
                  <p className="text-gray-600 dark:text-sand/80">{profile.bio || 'No bio added yet.'}</p>
                  <h3 className="text-lg font-semibold text-ocean dark:text-sand mt-6 mb-2">Goals</h3>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-sand/80 space-y-1">
                    <li>JLPT Level improvement</li>
                    <li>Daily speaking practice</li>
                    <li>Consistent attendance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ocean dark:text-sand mb-2">Smart Recommendations</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-ivory dark:bg-steel">Kanji Mastery – N5</div>
                    <div className="p-4 rounded-lg bg-ivory dark:bg-steel">Speaking Circle – Beginner</div>
                    <div className="p-4 rounded-lg bg-ivory dark:bg-steel">Grammar Drills – A1</div>
                    <div className="p-4 rounded-lg bg-ivory dark:bg-steel">Reading Club – Short Stories</div>
                  </div>
                </div>
              </div>
            )}

            {active === 'Courses' && (
              <div className="space-y-3">
                {[1,2,3].map(i=> (
                  <div key={i} className="p-4 rounded-lg bg-ivory dark:bg-steel flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-ocean dark:text-sand">Course {i}</div>
                      <div className="text-sm text-gray-500 dark:text-sand/70">Completion: {coursePct - i*5}%</div>
                    </div>
                    <CircleProgress percent={Math.max(0, coursePct - i*5)} size={64} stroke={8} barColor="#948979" />
                  </div>
                ))}
              </div>
            )}

            {active === 'Achievements' && (
              <div className="grid sm:grid-cols-3 gap-3">
                {[{t:'Starter Badge'},{t:'Consistency 7d'},{t:'First Kanji!'}].map((b,idx)=> (
                  <div key={idx} className="p-4 rounded-lg bg-ivory dark:bg-steel text-center hover:shadow transition">
                    <div className="text-3xl mb-2">🏅</div>
                    <div className="font-semibold text-ocean dark:text-sand">{b.t}</div>
                    <div className="text-xs text-gray-500 dark:text-sand/70">Hover to view details</div>
                  </div>
                ))}
              </div>
            )}

            {active === 'Activity' && (
              <div className="space-y-3">
                {[1,2,3,4].map(i=> (
                  <div key={i} className="p-4 rounded-lg bg-ivory dark:bg-steel">
                    <div className="font-medium text-ocean dark:text-sand">Submission #{i}</div>
                    <div className="text-sm text-gray-500 dark:text-sand/70">Just now • Practice exercise</div>
                  </div>
                ))}
              </div>
            )}

            {active === 'Settings' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-ivory dark:bg-steel">
                  <div className="font-semibold text-ocean dark:text-sand mb-2">Notifications</div>
                  <label className="flex items-center gap-2 text-sm text-ocean dark:text-sand">
                    <input type="checkbox" defaultChecked /> Email updates
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ocean dark:text-sand">
                    <input type="checkbox" /> Progress digests
                  </label>
                </div>
                <div className="p-4 rounded-lg bg-ivory dark:bg-steel">
                  <div className="font-semibold text-ocean dark:text-sand mb-2">Privacy</div>
                  <label className="flex items-center gap-2 text-sm text-ocean dark:text-sand">
                    <input type="checkbox" /> Show profile in ranking
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
