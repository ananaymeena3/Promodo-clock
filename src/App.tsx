import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { FloatingAudioPlayer } from './components/layout/FloatingAudioPlayer';
import { CommandPalette } from './components/common/CommandPalette';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ExportImportModal } from './components/common/ExportImportModal';
import { AchievementsModal } from './components/common/AchievementsModal';
import { AICoachModal } from './components/coach/AICoachModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Pages
import { TimerPage } from './pages/TimerPage';
import { TasksPage } from './pages/TasksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HabitsPage } from './pages/HabitsPage';
import { NotesPage } from './pages/NotesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { FocusModePage } from './pages/FocusModePage';
import { AuthPage } from './pages/AuthPage';

// Stores
import { useTimerStore } from './store/useTimerStore';
import { useThemeStore, THEMES } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import { soundEngine } from './services/soundGenerator';

export const App: React.FC = () => {
  const location = useLocation();
  const { initializeAuth } = useAuthStore();
  const { settings } = useThemeStore();
  const { startTimer, pauseTimer, resetTimer, setMode, adjustTime } = useTimerStore();

  const isFocusMode = location.pathname === '/focus';
  const isAuthPage = location.pathname === '/auth';

  // Initialize theme & auth
  useEffect(() => {
    initializeAuth();

    // Set initial theme styles
    const themeObj = THEMES.find((t) => t.id === settings.theme);
    const hex = themeObj ? themeObj.hex : '#8b5cf6';
    document.documentElement.className = settings.isDark ? `dark theme-${settings.theme}` : `theme-${settings.theme}`;
    document.documentElement.style.setProperty('--accent-primary', hex);
    document.documentElement.style.setProperty('--accent-glow', `${hex}66`);
  }, []);

  // Global Keyboard Shortcuts (Space, R, F, Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        const isRunning = useTimerStore.getState().isRunning;
        if (isRunning) pauseTimer();
        else startTimer();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const modes: ('pomodoro' | 'shortBreak' | 'longBreak')[] = ['pomodoro', 'shortBreak', 'longBreak'];
        const curr = useTimerStore.getState().mode;
        const idx = modes.indexOf(curr as any);
        const next = modes[(idx - 1 + modes.length) % modes.length];
        setMode(next);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const modes: ('pomodoro' | 'shortBreak' | 'longBreak')[] = ['pomodoro', 'shortBreak', 'longBreak'];
        const curr = useTimerStore.getState().mode;
        const idx = modes.indexOf(curr as any);
        const next = modes[(idx + 1) % modes.length];
        setMode(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        adjustTime(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        adjustTime(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startTimer, pauseTimer, resetTimer, setMode, adjustTime]);

  if (isFocusMode) {
    return (
      <ErrorBoundary>
        <FocusModePage />
      </ErrorBoundary>
    );
  }

  if (isAuthPage) {
    return (
      <ErrorBoundary>
        <AuthPage />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-[#08090d]">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Top Header Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 mt-16 p-6 overflow-x-hidden min-h-[calc(100vh-64px)] pb-24">
          <Routes>
            <Route path="/" element={<Navigate to="/timer" replace />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/timer" replace />} />
          </Routes>
        </main>

        {/* Ambient Audio Floating Widget */}
        <FloatingAudioPlayer />

        {/* Global Modals */}
        <CommandPalette />
        <KeyboardShortcutsModal />
        <ExportImportModal />
        <AchievementsModal />
        <AICoachModal />
      </div>
    </ErrorBoundary>
  );
};
