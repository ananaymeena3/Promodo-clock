import React from 'react';
import { useThemeStore, THEMES } from '../store/useThemeStore';
import { useAppStore } from '../store/useAppStore';
import { ThemePreset } from '../types';
import { Settings, Palette, Bell, Volume2, Sparkles, Clock, Globe, Check, RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { settings, setThemePreset, setCustomAccent, updateSettings } = useThemeStore();
  const { resetStreaksAndStats, clearAllData } = useAppStore();

  const handleRequestNotification = async () => {
    soundEngine.playClickSound();
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        updateSettings({ notificationsEnabled: true });
        new Notification('FocusFlow Notifications Enabled!', {
          body: 'You will receive reminders when timer sessions complete.',
          icon: '/favicon.svg',
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">App Settings & Preferences</h2>
          <p className="text-xs text-slate-400">Customize theme aesthetics, notifications, sound effects, and timer defaults.</p>
        </div>
      </div>

      {/* Theme Presets */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" /> Focus Environments & Themes
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Select a tailored environment to change full background gradients, glass tones, and accent glows.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {THEMES.map((t) => {
            const isSelected = settings.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundEngine.playClickSound();
                  setThemePreset(t.id);
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                  isSelected
                    ? 'bg-white/10 border-purple-500/60 shadow-xl text-white ring-2 ring-purple-500/50 scale-[1.02]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full shadow-md" style={{ backgroundColor: t.hex }} />
                    <span className="text-xs font-bold text-white">{t.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{t.description}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Accent Color Picker */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white">Custom Accent Color</h4>
            <p className="text-[11px] text-slate-400">Choose a custom HEX accent for progress rings & buttons</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => setCustomAccent(e.target.value)}
              className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
            />
        </div>
      </div>
      </div>

      {/* Notifications & Audio Settings */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" /> Notifications & Sound Synthesizer
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <h4 className="text-xs font-semibold text-white">Browser Notifications</h4>
            <p className="text-[11px] text-slate-400">Receive native desktop popups when sessions complete</p>
          </div>
          <button
            onClick={handleRequestNotification}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
              settings.notificationsEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {settings.notificationsEnabled ? 'Enabled ✓' : 'Enable Notifications'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-xs font-semibold text-white">Sound Effects</h4>
            <p className="text-[11px] text-slate-400">Play chime synthesizer on button click & timer completion</p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              updateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
              settings.soundEnabled
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {settings.soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Time & Auto Switch Preferences */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" /> Time Format & Auto Workflow
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <h4 className="text-xs font-semibold text-white">Time Format</h4>
            <p className="text-[11px] text-slate-400">Clock display preference</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ timeFormat: '12h' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                settings.timeFormat === '12h' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              12 Hours
            </button>
            <button
              onClick={() => updateSettings({ timeFormat: '24h' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                settings.timeFormat === '24h' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              24 Hours
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-xs font-semibold text-white">Auto Break Switch</h4>
            <p className="text-[11px] text-slate-400">Automatically switch and start break timer when session finishes</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoStartBreak}
            onChange={(e) => updateSettings({ autoStartBreak: e.target.checked })}
            className="w-4 h-4 rounded text-purple-600 accent-purple-500"
          />
        </div>
      </div>

      {/* Data Management & Danger Zone */}
      <div className="glass-panel p-6 rounded-3xl border border-red-500/20 bg-red-500/5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" /> Data Management & Reset
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-b border-white/10">
          <div>
            <h4 className="text-xs font-semibold text-white">Reset Streaks & Focus Analytics</h4>
            <p className="text-[11px] text-slate-400">Reset your daily streak counter to 0 and clear focus session history</p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              if (window.confirm('Are you sure you want to reset your streak and focus stats to 0?')) {
                resetStreaksAndStats();
                toast.success('Streak and session history reset to 0');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Streak to 0</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
          <div>
            <h4 className="text-xs font-semibold text-red-300">Clear All Local App Data</h4>
            <p className="text-[11px] text-slate-400">Permanently remove all tasks, notes, habits, streaks, and local settings</p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              if (window.confirm('WARNING: This will permanently wipe all local storage data. Continue?')) {
                clearAllData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold transition-all shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
