import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ExistingUserLoginPageProps {
  onLogin: (email: string, username: string) => void;
  onSwitchToNewUser: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

// Mock user database for demo - in real app this would be an API call
const mockUsers = [
  { email: 'john@example.com', username: 'John' },
  { email: 'sarah@example.com', username: 'Sarah' },
  { email: 'mike@example.com', username: 'Mike' },
  { email: 'emma@example.com', username: 'Emma' },
  { email: 'alex@example.com', username: 'Alex' },
];

export function ExistingUserLoginPage({ 
  onLogin, 
  onSwitchToNewUser, 
  darkMode, 
  onToggleDarkMode 
}: ExistingUserLoginPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user lookup
    const foundUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      onLogin(email.trim(), foundUser.username);
    } else {
      setError('No account found with this email address. Please check your email or create a new account.');
    }
    
    setIsLoading(false);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmit = email.trim() && isValidEmail(email) && !isLoading;

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-20 text-6xl transform rotate-12">🔑</div>
        <div className="absolute top-40 right-32 text-4xl transform -rotate-12">📧</div>
        <div className="absolute bottom-32 left-40 text-5xl transform rotate-45">👋</div>
        <div className="absolute bottom-20 right-20 text-3xl transform -rotate-45">⭐</div>
        <div className="absolute top-1/3 left-1/4 text-2xl transform rotate-12">🎯</div>
        <div className="absolute bottom-1/3 right-1/3 text-3xl transform -rotate-12">🧠</div>
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
            <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center transform rotate-3 border-4 border-dashed border-blue-600 mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🔑</span>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-dashed border-yellow-600 flex items-center justify-center">
              <span className="text-xs">👋</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl text-foreground font-medium mb-2"
          >
            Welcome Back!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground"
          >
            Continue your learning journey with StudyBuddy
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-3xl shadow-2xl border-4 border-dashed border-blue-500 p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-blue-500">
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
            {/* Email Field */}
            <div>
              <label className="block text-foreground mb-3 flex items-center gap-2">
                <span className="text-lg">📧</span>
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="Enter your email"
                className="w-full p-4 border-2 border-dashed border-border rounded-2xl focus:border-blue-500 focus:outline-none bg-input-background text-foreground placeholder-muted-foreground transition-all"
                required
              />
              {email && !isValidEmail(email) && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠️</span>
                  Please enter a valid email address
                </div>
              )}
              {error && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <span>❌</span>
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full p-4 rounded-2xl font-medium transition-all transform hover:scale-105 border-2 border-dashed ${
                canSubmit
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg hover:shadow-xl'
                  : 'bg-secondary text-secondary-foreground border-border cursor-not-allowed opacity-50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🔑</span>
                  <span>Continue to StudyBuddy</span>
                </div>
              )}
            </button>

            {/* Switch to New User */}
            <div className="text-center pt-4 border-t-2 border-dashed border-border">
              <p className="text-sm text-muted-foreground mb-3">Don't have an account yet?</p>
              <button
                type="button"
                onClick={onSwitchToNewUser}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <span>✨</span>
                <span>Create New Account</span>
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>🔒</span>
              <span>Secure login with email verification</span>
            </div>
            <p>We'll send you a quick verification code</p>
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