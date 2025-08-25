import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PomodoroStats {
  completedSessions: number;
  totalFocusTime: number;
  streakDays: number;
  lastSessionDate?: Date;
}

interface PomodoroTimerProps {
  settings: {
    pomodoroWork: number;
    pomodoroBreak: number;
    longBreak: number;
    sessionsUntilLongBreak: number;
    soundEnabled: boolean;
  };
  stats: PomodoroStats;
  onUpdateStats: (stats: Partial<PomodoroStats>) => void;
}

type TimerState = 'idle' | 'work' | 'break' | 'longBreak' | 'paused';

const breakSuggestions = [
  "🚶 Take a short walk around the room",
  "💧 Drink a glass of water",
  "👁️ Look away from the screen for 20 seconds",
  "🤸 Do some light stretching",
  "🫁 Take 5 deep breaths",
  "🌱 Water your plants",
  "🧘 Practice mindfulness for a minute",
  "☕ Make a healthy snack",
  "📱 Check in with a friend",
  "🎵 Listen to your favorite song"
];

export function PomodoroTimer({ settings, stats, onUpdateStats }: PomodoroTimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroWork * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentSession, setCurrentSession] = useState(1);
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationRef = useRef<Notification | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (timerState === 'work' || timerState === 'break' || timerState === 'longBreak') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  // Handle Escape key to close expanded timer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not on the timer content
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
    }
  };

  const handleTimerComplete = () => {
    if (settings.soundEnabled) {
      playNotificationSound();
    }

    showNotification();

    if (timerState === 'work') {
      // Completed a work session
      const newCompletedSessions = stats.completedSessions + 1;
      const newTotalFocusTime = stats.totalFocusTime + settings.pomodoroWork;
      
      // Update streak
      const today = new Date().toDateString();
      const lastSessionDate = stats.lastSessionDate ? new Date(stats.lastSessionDate).toDateString() : null;
      const newStreakDays = lastSessionDate === today ? stats.streakDays : 
                           lastSessionDate === new Date(Date.now() - 86400000).toDateString() ? stats.streakDays + 1 : 1;

      onUpdateStats({
        completedSessions: newCompletedSessions,
        totalFocusTime: newTotalFocusTime,
        streakDays: newStreakDays,
        lastSessionDate: new Date()
      });

      // Determine next break type
      const isLongBreak = currentSession % settings.sessionsUntilLongBreak === 0;
      setTimerState(isLongBreak ? 'longBreak' : 'break');
      setTimeLeft(isLongBreak ? settings.longBreak * 60 : settings.pomodoroBreak * 60);
      
      // Show break suggestion
      setCurrentSuggestion(breakSuggestions[Math.floor(Math.random() * breakSuggestions.length)]);
      setShowBreakSuggestion(true);
      
      setCurrentSession(prev => prev + 1);
    } else {
      // Break completed
      setTimerState('work');
      setTimeLeft(settings.pomodoroWork * 60);
      setShowBreakSuggestion(false);
    }
  };

  const playNotificationSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = timerState === 'work' ? 800 : 600;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = timerState === 'work' ? '🎉 Work Session Complete!' : '☕ Break Time Over!';
      const body = timerState === 'work' 
        ? 'Great job! Time for a well-deserved break.' 
        : 'Ready to get back to focused work?';
      
      notificationRef.current = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      setTimeout(() => {
        if (notificationRef.current) {
          notificationRef.current.close();
        }
      }, 5000);
    }
  };

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work');
      setTimeLeft(settings.pomodoroWork * 60);
    } else if (timerState === 'paused') {
      const wasInBreak = timeLeft <= Math.max(settings.pomodoroBreak, settings.longBreak) * 60;
      setTimerState(wasInBreak ? 'break' : 'work');
    }
  };

  const pauseTimer = () => {
    setTimerState('paused');
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(settings.pomodoroWork * 60);
    setCurrentSession(1);
    setShowBreakSuggestion(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = timerState === 'work' 
      ? settings.pomodoroWork * 60 
      : timerState === 'longBreak'
      ? settings.longBreak * 60
      : settings.pomodoroBreak * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getTimerColor = () => {
    switch (timerState) {
      case 'work': return '#DC2626';
      case 'break': return '#10B981';
      case 'longBreak': return '#8B5CF6';
      case 'paused': return '#FACC15';
      default: return '#6B7280';
    }
  };

  const getTimerEmoji = () => {
    switch (timerState) {
      case 'work': return '🍅';
      case 'break': return '☕';
      case 'longBreak': return '🌟';
      case 'paused': return '⏸️';
      default: return '⏰';
    }
  };

  const getTimerLabel = () => {
    switch (timerState) {
      case 'work': return 'Focus Time';
      case 'break': return 'Short Break';
      case 'longBreak': return 'Long Break';
      case 'paused': return 'Paused';
      default: return 'Pomodoro Timer';
    }
  };

  return (
    <>
      {/* Overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 bg-card rounded-2xl shadow-2xl border-3 border-dashed border-border p-6 w-80"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTimerEmoji()}</span>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      {getTimerLabel()}
                    </h3>
                    <p className="text-sm text-muted-foreground">Session {currentSession}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Minimize timer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Timer Display */}
              <div className="text-center mb-6">
                <div 
                  className="text-4xl font-mono font-bold mb-2"
                  style={{ color: getTimerColor() }}
                >
                  {formatTime(timeLeft)}
                </div>
                
                {/* Progress Circle */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="3,3"
                      className="text-border"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={getTimerColor()}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {getTimerEmoji()}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {timerState === 'work' ? 'Stay focused!' : 
                   timerState === 'break' || timerState === 'longBreak' ? 'Take a break!' : 
                   'Ready to start?'}
                </p>
              </div>

              {/* Break Suggestion */}
              {showBreakSuggestion && (timerState === 'break' || timerState === 'longBreak') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 rounded-lg border-2 border-dashed border-green-200"
                >
                  <h4 className="text-sm font-medium text-green-800 mb-1">Break Suggestion:</h4>
                  <p className="text-sm text-green-700">{currentSuggestion}</p>
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-4">
                {(timerState === 'idle' || timerState === 'paused') && (
                  <button
                    onClick={startTimer}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors transform hover:scale-105"
                  >
                    ▶️ Start
                  </button>
                )}
                
                {(timerState === 'work' || timerState === 'break' || timerState === 'longBreak') && (
                  <button
                    onClick={pauseTimer}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors transform hover:scale-105"
                  >
                    ⏸️ Pause
                  </button>
                )}
                
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors transform hover:scale-105"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Statistics */}
              <div className="border-t-2 border-dashed border-border pt-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-lg font-medium text-foreground">{stats.completedSessions}</div>
                    <div className="text-muted-foreground">Sessions</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-foreground">{Math.round(stats.totalFocusTime / 60)}h</div>
                    <div className="text-muted-foreground">Focus Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-foreground">{stats.streakDays}</div>
                    <div className="text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              {stats.completedSessions > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {stats.streakDays >= 7 && <span>🔥</span>}
                    {stats.completedSessions >= 10 && <span>⭐</span>}
                    {stats.totalFocusTime >= 1440 && <span>🏆</span>}
                    <span className="text-blue-700">
                      {stats.streakDays >= 7 ? 'Week Streak!' : 
                       stats.completedSessions >= 10 ? '10+ Sessions!' : 
                       'Keep it up!'}
                    </span>
                  </div>
                </div>
              )}

              {/* Click outside hint */}
              <div className="mt-3 text-center text-xs text-muted-foreground">
                Click outside or press Escape to minimize
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-2xl border-3 border-dashed border-white hover:scale-110 transition-all duration-200 flex items-center justify-center relative overflow-hidden"
          whileHover={{ rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Decorative doodle */}
          <div className="absolute inset-2 border-2 border-dashed border-white/30 rounded-full"></div>
          
          <div className="text-center">
            <div className="text-lg mb-1">{getTimerEmoji()}</div>
            {timerState !== 'idle' && (
              <div className="text-xs font-mono leading-none">
                {formatTime(timeLeft).split(':')[0]}m
              </div>
            )}
          </div>

          {/* Pulse animation when active */}
          {(timerState === 'work' || timerState === 'break' || timerState === 'longBreak') && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: getTimerColor() }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
}