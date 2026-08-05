import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import {
  User, Mail, Calendar, Flame, Clock, Award, Target,
  Edit3, Database, CheckCircle, AlertCircle, Sparkles,
} from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isSupabaseConnected } = useAuthStore();
  const { streaks, achievements, goals } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState((user as any)?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();
    updateProfile({ fullName, bio, avatarUrl } as any);
    setIsEditing(false);
  };

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const initial = (user?.fullName || 'G').charAt(0).toUpperCase();
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Today';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 py-4">

      {/* ── Profile Hero Card ── */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-r from-[#6D4C41]/40 via-[#CDAA7D]/20 to-[#35543A]/30 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-14 relative">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar */}
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#CDAA7D]/40 shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6D4C41] to-[#CDAA7D]/60 border-2 border-[#CDAA7D]/30 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-[#CDAA7D]/20">
                {initial}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl font-extrabold text-white">{user?.fullName || 'Guest User'}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#CDAA7D]/10 text-[#CDAA7D] rounded-full border border-[#CDAA7D]/30">
                  LOCAL
                </span>
              </div>

              {user?.email && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </p>
              )}

              <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {joinedDate}</span>
              </p>

              {(user as any)?.bio && (
                <p className="text-xs text-slate-300 mt-2 max-w-md italic">"{(user as any).bio}"</p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClickSound();
              setIsEditing(!isEditing);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CDAA7D]/10 hover:bg-[#CDAA7D]/20 text-[#CDAA7D] text-xs font-semibold border border-[#CDAA7D]/30 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* ── Edit Form ── */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="glass-panel p-6 rounded-3xl border border-[#CDAA7D]/25 space-y-4 animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#CDAA7D]" />
            <h3 className="text-sm font-bold text-white">Update Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                placeholder="https://..."
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
              placeholder="A short bio about yourself…"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#6D4C41] hover:bg-[#5d3e35] text-[#F5EBDD] rounded-xl text-xs font-semibold shadow-lg shadow-[#6D4C41]/30 transition-all"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Clock className="w-5 h-5 text-[#CDAA7D]" />, value: streaks.totalSessions, label: 'Total Sessions' },
          { icon: <Flame className="w-5 h-5 text-amber-400" />, value: `${streaks.bestStreak}d`, label: 'Best Streak' },
          { icon: <Award className="w-5 h-5 text-cyan-400" />, value: `${unlockedCount}/${achievements.length}`, label: 'Badges Earned' },
          { icon: <Target className="w-5 h-5 text-emerald-400" />, value: goals.filter((g) => g.completed).length, label: 'Goals Done' },
        ].map(({ icon, value, label }) => (
          <div
            key={label}
            className="glass-panel p-5 rounded-3xl border border-white/10 text-center hover:border-[#CDAA7D]/25 transition-all group"
          >
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="text-2xl font-extrabold text-white font-mono">{value}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Supabase Storage Status ── */}
      <div className={`glass-panel p-5 rounded-3xl border flex items-start gap-4 ${isSupabaseConnected ? 'border-emerald-500/20' : 'border-amber-500/15'}`}>
        <div className={`p-3 rounded-2xl shrink-0 ${isSupabaseConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
          <Database className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isSupabaseConnected
              ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
            <h4 className="text-sm font-bold text-white">
              {isSupabaseConnected ? 'Supabase Storage Connected' : 'Local Storage Mode'}
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isSupabaseConnected
              ? 'Your data is synced to Supabase. No authentication required — the app runs in open-access mode.'
              : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable cloud storage. Currently all data is saved locally on this device.'}
          </p>
        </div>
      </div>
    </div>
  );
};
