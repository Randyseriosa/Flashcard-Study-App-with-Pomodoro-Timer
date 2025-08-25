import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (email: string, username: string) => void;
  onSwitchToExistingUser: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function LoginPage({ onLogin, onSwitchToExistingUser, darkMode, onToggleDarkMode }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !username.trim()) return;

    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin(email.trim(), username.trim());
    setIsLoading(false);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmit = email.trim() && username.trim() && isValidEmail(email) && !isLoading;

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-20 text-6xl transform rotate-12">📚</div>
        <div className="absolute top-40 right-32 text-4xl transform -rotate-12">✏️</div>
        <div className="absolute bottom-32 left-40 text-5xl transform rotate-45">🎯</div>
        <div className="absolute bottom-20 right-20 text-3xl transform -rotate-45">⭐</div>
        <div className="absolute top-1/3 left-1/4 text-2xl transform rotate-12">💡</div>
        <div className="absolute bottom-1/3 right-1/3 text-3xl transform -rotate-12">🚀</div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={onToggleDarkMode}
          className="p-3 hover:bg-accent rounded-xl transition-colors border-2 border-dashed border-border"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center transform rotate-3 border-4 border-dashed border-primary mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🧠</span>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-dashed border-green-600 flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl text-foreground font-medium mb-2"
          >
            Welcome to StudyBuddy!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground"
          >
            Let's get you started on your learning journey
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-3xl shadow-2xl border-4 border-dashed border-primary p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
              <path
                d="M5 5 Q20 15 35 5 Q20 25 5 35 Q20 25 35 35"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 opacity-10">
            <svg width="30" height="30" viewBox="0 0 30 30" className="text-green-500">
              <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2,2" />
              <path d="M9 15 L13 19 L21 11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Username Field */}
            <div>
              <label className="block text-foreground mb-3 flex items-center gap-2">
                <span className="text-lg">👤</span>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full p-4 border-2 border-dashed border-border rounded-2xl focus:border-primary focus:outline-none bg-input-background text-foreground placeholder-muted-foreground transition-all"
                maxLength={30}
                required
              />
              <div className="mt-2 text-xs text-muted-foreground text-right">
                {username.length}/30
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-foreground mb-3 flex items-center gap-2">
                <span className="text-lg">📧</span>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-4 border-2 border-dashed border-border rounded-2xl focus:border-primary focus:outline-none bg-input-background text-foreground placeholder-muted-foreground transition-all"
                required
              />
              {email && !isValidEmail(email) && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠️</span>
                  Please enter a valid email address
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full p-4 rounded-2xl font-medium transition-all transform hover:scale-105 border-2 border-dashed ${
                canSubmit
                  ? 'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground border-primary shadow-lg hover:shadow-xl'
                  : 'bg-secondary text-secondary-foreground border-border cursor-not-allowed opacity-50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Getting Ready...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🚀</span>
                  <span>Create Account & Continue</span>
                </div>
              )}
            </button>

            {/* Switch to Existing User */}
            <div className="text-center pt-4 border-t-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground mb-3">Already have an account?</p>
              <button
                type="button"
                onClick={onSwitchToExistingUser}
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <span>🔑</span>
                <span>Sign In to Existing Account</span>
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>🔒</span>
              <span>Your data is safe and secure</span>
            </div>
            <p>We'll send you a quick verification code to get started</p>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
            <span>Made with</span>
            <span className="text-red-500">💖</span>
            <span>for learning</span>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}