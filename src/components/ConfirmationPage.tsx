import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface ConfirmationPageProps {
  email: string;
  username: string;
  onConfirm: () => void;
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ConfirmationPage({ 
  email, 
  username, 
  onConfirm, 
  onBack, 
  darkMode, 
  onToggleDarkMode 
}: ConfirmationPageProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take the last character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedCode = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedCode[i] || '';
    }
    
    setCode(newCode);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsLoading(true);
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm();
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setTimeLeft(60);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    // Simulate resend API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const isComplete = code.every(digit => digit !== '');

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-20 text-6xl transform rotate-12">📧</div>
        <div className="absolute top-40 right-32 text-4xl transform -rotate-12">🔐</div>
        <div className="absolute bottom-32 left-40 text-5xl transform rotate-45">✅</div>
        <div className="absolute bottom-20 right-20 text-3xl transform -rotate-45">⏰</div>
        <div className="absolute top-1/3 left-1/4 text-2xl transform rotate-12">🎯</div>
        <div className="absolute bottom-1/3 right-1/3 text-3xl transform -rotate-12">📱</div>
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

      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBack}
          className="p-3 hover:bg-accent rounded-xl transition-colors border-2 border-dashed border-border flex items-center gap-2"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm text-foreground">Back</span>
        </button>
      </div>

      {/* Main Confirmation Form */}
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
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center transform rotate-3 border-4 border-dashed border-green-600 mx-auto mb-4 shadow-lg">
              <span className="text-4xl">📧</span>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full border-2 border-dashed border-blue-600 flex items-center justify-center">
              <span className="text-xs">🔐</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl text-foreground font-medium mb-2"
          >
            Check Your Email
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground"
          >
            <p className="mb-2">Hi {username}! 👋</p>
            <p>We sent a 6-digit code to:</p>
            <p className="font-medium text-foreground mt-1">{email}</p>
          </motion.div>
        </div>

        {/* Verification Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-3xl shadow-2xl border-4 border-dashed border-green-500 p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-green-500">
              <path
                d="M20 5 L25 15 L35 15 L27 23 L30 33 L20 28 L10 33 L13 23 L5 15 L15 15 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 opacity-10">
            <svg width="30" height="30" viewBox="0 0 30 30" className="text-blue-500">
              <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2,2" />
              <path d="M15 10 L15 15 L18 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Code Input */}
            <div>
              <label className="block text-foreground mb-4 flex items-center gap-2">
                <span className="text-lg">🔢</span>
                Enter Verification Code
              </label>
              
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center border-2 border-dashed border-border rounded-xl focus:border-green-500 focus:outline-none bg-input-background text-foreground font-medium text-lg transition-all"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="mt-4 text-center">
                {timeLeft > 0 ? (
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <span>⏰</span>
                    <span>Code expires in {timeLeft}s</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend}
                    className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
                  >
                    📤 Resend Code
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isComplete || isLoading}
              className={`w-full p-4 rounded-2xl font-medium transition-all transform hover:scale-105 border-2 border-dashed ${
                isComplete && !isLoading
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg hover:shadow-xl'
                  : 'bg-secondary text-secondary-foreground border-border cursor-not-allowed opacity-50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">✅</span>
                  <span>Verify & Continue</span>
                </div>
              )}
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>🛡️</span>
              <span>This helps keep your account secure</span>
            </div>
            <p>Didn't receive an email? Check your spam folder</p>
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
            <span>Almost there!</span>
            <span className="text-yellow-500">⭐</span>
            <span>Just one more step</span>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}