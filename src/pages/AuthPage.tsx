import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../services/soundGenerator';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, isLoading, authError } = useAuthStore();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();

    if (isForgotPassword) {
      setForgotSent(true);
      return;
    }

    if (isRegisterMode) {
      const success = await register(fullName, email, password);
      if (success) navigate('/timer');
    } else {
      const success = await login(email, password);
      if (success) navigate('/timer');
    }
  };

  const handleGoogleSignIn = async () => {
    soundEngine.playClickSound();
    await loginWithGoogle();
    navigate('/timer');
  };

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl z-10 relative">
        {/* Logo Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/40 glow-primary">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">FocusFlow Workspace</h2>
          <p className="text-xs text-slate-400">Next-generation Notion + MacOS productivity suite</p>
        </div>

        {/* Error message if any */}
        {authError && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs text-center font-medium">
            {authError}
          </div>
        )}

        {forgotSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-400">Check your inbox for password reset instructions.</p>
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setForgotSent(false);
              }}
              className="text-xs text-purple-400 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.creator@focusflow.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-purple-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 glow-primary"
            >
              <span>{isForgotPassword ? 'Send Reset Link' : isRegisterMode ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] text-slate-500 font-mono uppercase">Or Continue With</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegisterMode ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegisterMode(false)}
                className="text-purple-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsRegisterMode(true)}
                className="text-purple-400 font-semibold hover:underline"
              >
                Register Now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
