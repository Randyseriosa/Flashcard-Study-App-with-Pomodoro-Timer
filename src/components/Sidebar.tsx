import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  isPublic?: boolean;
}

interface TopicStats {
  cardCount: number;
  totalCorrect: number;
  totalIncorrect: number;
  successRate: number;
}

interface SidebarProps {
  topics: Topic[];
  activeTopic: string | null;
  onTopicChange: (topicId: string) => void;
  onAddTopic: () => void;
  onAddFlashcard: () => void;
  onShowSettings: () => void;
  onEditTopic?: (topicId: string) => void;
  onDeleteTopic: (topicId: string) => void;
  getTopicStats: (topicName: string) => TopicStats;
  isOpen: boolean;
  onToggle: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  username?: string;
  onLogout?: () => void;
}

export function Sidebar({ 
  topics,
  activeTopic,
  onTopicChange,
  onAddTopic,
  onAddFlashcard,
  onShowSettings,
  onEditTopic,
  onDeleteTopic,
  getTopicStats,
  isOpen,
  onToggle,
  darkMode,
  onToggleDarkMode,
  username,
  onLogout
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative left-0 top-0 h-full w-80 bg-sidebar border-r-4 border-dashed border-sidebar-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-dashed border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center transform rotate-3 border-2 border-dashed border-gray-400">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <h1 className="text-lg text-sidebar-foreground font-medium">
                  {username ? `${username}'s StudyBuddy` : 'StudyBuddy'}
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  {username ? 'Personal Learning Space' : 'Doodle & Learn'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleDarkMode}
                className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <svg className="w-4 h-4 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              {username && onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
                  title="Log out"
                >
                  <svg className="w-4 h-4 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
              <button
                onClick={onToggle}
                className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Welcome Message */}
          {username && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-xl border-2 border-dashed border-yellow-300"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">👋</span>
                <span className="text-sidebar-foreground font-medium">Welcome back, {username}!</span>
              </div>
              <div className="text-xs text-sidebar-foreground/70 mt-1">
                Ready to continue learning?
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={onAddTopic}
              className="px-3 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg text-sm font-medium hover:bg-sidebar-primary/90 transition-colors transform hover:scale-105 border-2 border-dashed border-transparent hover:border-sidebar-primary-foreground/20"
            >
              🏷️ Topic
            </button>
            <button
              onClick={onAddFlashcard}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors transform hover:scale-105 border-2 border-dashed border-transparent hover:border-white/20"
            >
              ✨ Card
            </button>
            <button
              onClick={onShowSettings}
              className="px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg text-sm font-medium hover:bg-sidebar-accent/80 transition-colors transform hover:scale-105"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Topics List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm text-sidebar-foreground/70 font-medium uppercase tracking-wider">Category Topics</h2>
              <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-1 rounded-full">
                {topics.length}
              </span>
            </div>
            
            {topics.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-sm text-sidebar-foreground/60 mb-3">No topics yet</p>
                <button
                  onClick={onAddTopic}
                  className="text-xs text-sidebar-primary hover:underline"
                >
                  Create your first topic
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {topics.map((topic, index) => {
                  const stats = getTopicStats(topic.name);
                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative group"
                    >
                      <button
                        onClick={() => onTopicChange(topic.id)}
                        className={`w-full p-4 rounded-xl transition-all duration-200 transform hover:scale-105 relative ${
                          activeTopic === topic.id
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground border-2 border-dashed border-sidebar-primary shadow-lg'
                            : 'bg-sidebar hover:bg-sidebar-accent border-2 border-dashed border-transparent hover:border-sidebar-border'
                        }`}
                      >
                        {/* Doodle decoration */}
                        <div className="absolute top-1 right-1 opacity-20">
                          <svg width="20" height="20" viewBox="0 0 20 20" className="text-current">
                            <path
                              d="M2 2 Q10 8 18 2 Q10 12 2 18 Q10 12 18 18"
                              stroke="currentColor"
                              strokeWidth="1"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center transform rotate-2 border-2 border-dashed border-current/30"
                            style={{ backgroundColor: `${topic.color}20` }}
                          >
                            <span className="text-lg">{topic.icon}</span>
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-sm truncate">{topic.name}</h3>
                              {activeTopic === topic.id && (
                                <span className="text-xs bg-current/20 px-2 py-1 rounded-full">Active</span>
                              )}
                              {topic.isPublic && (
                                <span className="text-xs opacity-60">🔗</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs opacity-70">
                                {stats.cardCount} cards
                              </p>
                              {stats.successRate > 0 && (
                                <span className="text-xs font-medium">
                                  {stats.successRate}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-2 bg-current/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500 bg-current/40"
                            style={{ width: `${Math.min(100, (stats.cardCount / 20) * 100)}%` }}
                          />
                        </div>
                      </button>

                      {/* Action buttons (only show on hover and not for shared topics) */}
                      {!topic.isPublic && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {onEditTopic && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTopic(topic.id);
                              }}
                              className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                              title="Edit topic"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete topic "${topic.name}" and all its flashcards?`)) {
                                onDeleteTopic(topic.id);
                              }
                            }}
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Delete topic"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-dashed border-sidebar-border">
          <div className="text-center text-xs text-sidebar-foreground/60 mb-2">
            Made with 💖 for learning
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </motion.div>
    </>
  );
}