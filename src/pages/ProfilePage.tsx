import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { User, Mail, Calendar, Flame, Clock, Award, Target, Edit3, LogOut, ShieldCheck, Database, ArrowRight } from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isSupabaseConnected } = useAuthStore();
  const { streaks, achievements, goals } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();
    updateProfile({ fullName, bio, avatarUrl });
    setIsEditing(false);
  };

  const handleLogout = () => {
    soundEngine.playClickSound();
    logout();
    navigate('/auth');
  };

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 py-4">
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-pink-600/30 -z-10" />

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-12">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/50 shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-purple-400/50 flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-purple-500/50">
                {(user?.fullName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl font-extrabold text-white">{user?.fullName || 'User'}</h2>
                {isSupabaseConnected && (
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    SUPABASE ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'No email provided'}</span>
              </p>
              {user?.bio && <p className="text-xs text-slate-300 mt-2 max-w-md">{user.bio}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playClickSound();
                setIsEditing(!isEditing);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Status Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isSupabaseConnected ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isSupabaseConnected ? 'Supabase Authentication Connected' : 'Local Storage Mode (Offline Guest)'}</span>
            </h4>
            <p className="text-xs text-slate-400">
              {isSupabaseConnected
                ? 'Your auth session and database tables are synchronized with your Supabase backend.'
                : 'Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable cloud authentication.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            navigate('/auth');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all shrink-0"
        >
          <span>Open Auth Screen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Edit Profile Form Modal */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white">Update Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Tagline</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/30"
          >
            Save Profile Changes
          </button>
        </form>
      )}

      {/* Quick Lifetime Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/10 text-center">
          <Clock className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{streaks.totalSessions}</h4>
          <p className="text-xs text-slate-400">Total Sessions</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 text-center">
          <Flame className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{streaks.bestStreak} Days</h4>
          <p className="text-xs text-slate-400">Longest Streak</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 text-center">
          <Award className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{unlockedCount} / {achievements.length}</h4>
          <p className="text-xs text-slate-400">Badges Unlocked</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 text-center">
          <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-2xl font-extrabold text-white font-mono">{goals.filter((g) => g.completed).length} Goals</h4>
          <p className="text-xs text-slate-400">Completed Goals</p>
        </div>
      </div>
    </div>
  );
};
