import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Settings {
  autoFlip: boolean;
  autoFlipTimer: number;
  pomodoroWork: number;
  pomodoroBreak: number;
  longBreak: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  shuffleCards: boolean;
  swipeEnabled: boolean;
}

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onUpdate, onClose }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'pomodoro' | 'general'>('flashcards');

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'flashcards', label: 'Flashcards', icon: '📚' },
    { id: 'pomodoro', label: 'Pomodoro', icon: '🍅' },
    { id: 'general', label: 'General', icon: '⚙️' },
  ] as const;

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="bg-card rounded-3xl shadow-2xl w-full max-w-3xl border-4 border-dashed border-primary overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b-2 border-dashed border-border relative">
            <div className="absolute top-2 right-2 opacity-20">
              <svg width="60" height="60" viewBox="0 0 60 60" className="text-primary">
                <circle cx="30" cy="30" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M30,2 L30,10 M30,50 L30,58 M58,30 L50,30 M10,30 L2,30 M51,9 L45,15 M15,45 L9,51 M51,51 L45,45 M15,15 L9,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center transform rotate-3">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h2 className="text-xl text-foreground font-medium">Settings</h2>
                  <p className="text-sm text-muted-foreground">Customize your study experience</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors z-10 relative"
                type="button"
                aria-label="Close settings"
              >
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card border-2 border-dashed border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'flashcards' && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    📚 Flashcard Settings
                  </h3>

                  {/* Auto-flip toggle */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-dashed border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          ⏰ Auto-flip Cards
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Automatically reveal answers after a delay
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('autoFlip', !localSettings.autoFlip)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          localSettings.autoFlip ? 'bg-green-500' : 'bg-border'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            localSettings.autoFlip ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {localSettings.autoFlip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Auto-flip timer: {localSettings.autoFlipTimer}s
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="15"
                          step="1"
                          value={localSettings.autoFlipTimer}
                          onChange={(e) => updateSetting('autoFlipTimer', parseInt(e.target.value))}
                          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>2s</span>
                          <span>15s</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Shuffle cards */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-dashed border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          🔀 Shuffle Cards
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Randomize card order for better learning
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('shuffleCards', !localSettings.shuffleCards)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          localSettings.shuffleCards ? 'bg-green-500' : 'bg-border'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            localSettings.shuffleCards ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Swipe gestures */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border-2 border-dashed border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          👆 Swipe Gestures
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Enable swipe navigation on touch devices
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('swipeEnabled', !localSettings.swipeEnabled)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          localSettings.swipeEnabled ? 'bg-green-500' : 'bg-border'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            localSettings.swipeEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Keyboard shortcuts info */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-dashed border-yellow-200">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      ⌨️ Keyboard Shortcuts
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-secondary rounded text-xs">Space</kbd>
                        <span className="text-muted-foreground">Flip card</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-secondary rounded text-xs">→</kbd>
                        <span className="text-muted-foreground">Next card</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-secondary rounded text-xs">←</kbd>
                        <span className="text-muted-foreground">Previous card</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-secondary rounded text-xs">1/2</kbd>
                        <span className="text-muted-foreground">Mark answer</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pomodoro' && (
                <motion.div
                  key="pomodoro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    🍅 Pomodoro Timer Settings
                  </h3>

                  {/* Work session length */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border-2 border-dashed border-red-200">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      ⏱️ Work Session: {localSettings.pomodoroWork} minutes
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={localSettings.pomodoroWork}
                      onChange={(e) => updateSetting('pomodoroWork', parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>15m</span>
                      <span>60m</span>
                    </div>
                  </div>

                  {/* Short break session length */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border-2 border-dashed border-green-200">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      ☕ Short Break: {localSettings.pomodoroBreak} minutes
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={localSettings.pomodoroBreak}
                      onChange={(e) => updateSetting('pomodoroBreak', parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5m</span>
                      <span>20m</span>
                    </div>
                  </div>

                  {/* Long break session length */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border-2 border-dashed border-purple-200">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      🌟 Long Break: {localSettings.longBreak} minutes
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="45"
                      step="5"
                      value={localSettings.longBreak}
                      onChange={(e) => updateSetting('longBreak', parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>15m</span>
                      <span>45m</span>
                    </div>
                  </div>

                  {/* Sessions until long break */}
                  <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-4 rounded-xl border-2 border-dashed border-indigo-200">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      🔄 Sessions Until Long Break: {localSettings.sessionsUntilLongBreak}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      step="1"
                      value={localSettings.sessionsUntilLongBreak}
                      onChange={(e) => updateSetting('sessionsUntilLongBreak', parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>2</span>
                      <span>8</span>
                    </div>
                  </div>

                  {/* Sound notifications */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-2 border-dashed border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          🔔 Sound Notifications
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Play sound when timer completes
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('soundEnabled', !localSettings.soundEnabled)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          localSettings.soundEnabled ? 'bg-green-500' : 'bg-border'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                            localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Pomodoro technique info */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-dashed border-yellow-200">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      💡 Pomodoro Technique
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Work in focused intervals followed by short breaks. This technique helps maintain 
                      concentration and prevents mental fatigue while studying.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    🎨 General Settings
                  </h3>

                  {/* App info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-dashed border-indigo-200">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      📱 App Information
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Version:</span>
                        <span className="font-medium">2.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Theme:</span>
                        <span className="font-medium">Doodle Style</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-medium">Local Browser</span>
                      </div>
                    </div>
                  </div>

                  {/* Data management */}
                  <div className="bg-gradient-to-r from-secondary/20 to-accent/20 p-4 rounded-xl border-2 border-dashed border-border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      💾 Data Management
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        📤 Export Data
                      </button>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        📥 Import Data
                      </button>
                      <button className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors">
                        🗑️ Clear All Data
                      </button>
                    </div>
                  </div>

                  {/* About */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-dashed border-yellow-200">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      💖 About StudyBuddy
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      A playful, doodle-style flashcard app designed to make studying fun and effective. 
                      Combine active recall with the Pomodoro technique for optimal learning.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Made with</span>
                      <span className="text-red-500">❤️</span>
                      <span>for learners everywhere</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-dashed border-border p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all transform hover:scale-105"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-primary text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                ✨ Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}