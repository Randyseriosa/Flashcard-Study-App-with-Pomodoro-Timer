import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FlashcardDeck } from './components/FlashcardDeck';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AddFlashcardModal } from './components/AddFlashcardModal';
import { SettingsPanel } from './components/SettingsPanel';
import { ShareModal } from './components/ShareModal';
import { AddTopicModal } from './components/AddTopicModal';
import { EditTopicModal } from './components/EditTopicModal';
import { LoginPage } from './components/LoginPage';
import { ExistingUserLoginPage } from './components/ExistingUserLoginPage';
import { ConfirmationPage } from './components/ConfirmationPage';
import { motion } from 'motion/react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  correctCount?: number;
  incorrectCount?: number;
}

interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  isPublic?: boolean;
}

interface PomodoroStats {
  completedSessions: number;
  totalFocusTime: number; // in minutes
  streakDays: number;
  lastSessionDate?: Date;
}

interface User {
  email: string;
  username: string;
  isLoggedIn: boolean;
}

const defaultColors = ['#2563EB', '#10B981', '#FACC15', '#DC2626', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899'];
const defaultIcons = ['📚', '🎯', '💡', '🔬', '🎨', '🏃', '🎵', '🌟', '🚀', '⭐', '🎭', '🔥'];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState<'newUser' | 'existingUser' | 'confirmation' | 'authenticated'>('newUser');
  const [pendingAuth, setPendingAuth] = useState<{ email: string; username: string } | null>(null);
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [pomodoroStats, setPomodoroStats] = useState<PomodoroStats>({
    completedSessions: 0,
    totalFocusTime: 0,
    streakDays: 0,
  });

  // Settings state
  const [settings, setSettings] = useState({
    autoFlip: false,
    autoFlipTimer: 5,
    pomodoroWork: 25,
    pomodoroBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true,
    shuffleCards: false,
    swipeEnabled: true,
  });

  const activeTopicData = topics.find(t => t.id === activeTopic);
  const activeFlashcards = flashcards.filter(card => card.subject === activeTopicData?.name);
  const editingTopicData = topics.find(t => t.id === editingTopicId);
  const editingTopicFlashcards = flashcards.filter(card => card.subject === editingTopicData?.name);

  useEffect(() => {
    // Load data from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedTopics = localStorage.getItem('topics');
    const savedFlashcards = localStorage.getItem('flashcards');
    const savedSettings = localStorage.getItem('settings');
    const savedActiveTopic = localStorage.getItem('activeTopic');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedPomodoroStats = localStorage.getItem('pomodoroStats');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setAuthStep('authenticated');
    }

    if (savedTopics) {
      const loadedTopics = JSON.parse(savedTopics);
      setTopics(loadedTopics);
    }
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
    if (savedActiveTopic) {
      setActiveTopic(savedActiveTopic);
    }
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
    if (savedPomodoroStats) {
      setPomodoroStats(JSON.parse(savedPomodoroStats));
    }

    // Check for shared topic in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTopic = urlParams.get('topic');
    if (sharedTopic) {
      try {
        const decodedData = JSON.parse(atob(sharedTopic));
        loadSharedTopic(decodedData);
      } catch (error) {
        console.error('Invalid shared topic data');
      }
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    localStorage.setItem('topics', JSON.stringify(topics));
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    localStorage.setItem('settings', JSON.stringify(settings));
    localStorage.setItem('pomodoroStats', JSON.stringify(pomodoroStats));
    if (activeTopic) {
      localStorage.setItem('activeTopic', activeTopic);
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [user, topics, flashcards, settings, activeTopic, darkMode, pomodoroStats]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNewUserLogin = (email: string, username: string) => {
    setPendingAuth({ email, username });
    setAuthStep('confirmation');
  };

  const handleExistingUserLogin = (email: string, username: string) => {
    setPendingAuth({ email, username });
    setAuthStep('confirmation');
  };

  const handleConfirmation = () => {
    if (pendingAuth) {
      const newUser: User = {
        email: pendingAuth.email,
        username: pendingAuth.username,
        isLoggedIn: true
      };
      setUser(newUser);
      setAuthStep('authenticated');
      setPendingAuth(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthStep('newUser');
    localStorage.removeItem('user');
    // Clear all user data
    setTopics([]);
    setFlashcards([]);
    setActiveTopic(null);
    localStorage.removeItem('topics');
    localStorage.removeItem('flashcards');
    localStorage.removeItem('activeTopic');
  };

  const handleBackToLogin = () => {
    setAuthStep('newUser');
    setPendingAuth(null);
  };

  const handleSwitchToExistingUser = () => {
    setAuthStep('existingUser');
  };

  const handleSwitchToNewUser = () => {
    setAuthStep('newUser');
  };

  const loadSharedTopic = (sharedData: { topic: Topic; flashcards: Flashcard[] }) => {
    // Add shared topic and flashcards (read-only)
    const existingTopic = topics.find(t => t.name === sharedData.topic.name);
    if (!existingTopic) {
      const newTopic = {
        ...sharedData.topic,
        id: Date.now().toString(),
        isPublic: true
      };
      setTopics(prev => [...prev, newTopic]);
      setActiveTopic(newTopic.id);
      
      // Add flashcards with new IDs
      const newCards = sharedData.flashcards.map(card => ({
        ...card,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        subject: sharedData.topic.name
      }));
      setFlashcards(prev => [...prev, ...newCards]);
    }
  };

  const addTopic = (topicData: Omit<Topic, 'id' | 'createdAt'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTopics(prev => [...prev, newTopic]);
    setActiveTopic(newTopic.id);
    return newTopic.id;
  };

  const updateTopic = (topicId: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, ...updates } : topic
    ));
  };

  const deleteTopic = (topicId: string) => {
    const topicToDelete = topics.find(t => t.id === topicId);
    if (topicToDelete) {
      // Delete all flashcards in this topic
      setFlashcards(prev => prev.filter(card => card.subject !== topicToDelete.name));
      // Remove topic
      setTopics(prev => prev.filter(t => t.id !== topicId));
      // Reset active topic if deleted
      if (activeTopic === topicId) {
        const remainingTopics = topics.filter(t => t.id !== topicId);
        setActiveTopic(remainingTopics.length > 0 ? remainingTopics[0].id : null);
      }
    }
  };

  const handleEditTopic = (topicId: string) => {
    setEditingTopicId(topicId);
    setShowEditTopicModal(true);
  };

  const addFlashcard = (newCard: Omit<Flashcard, 'id'>) => {
    const card: Flashcard = {
      ...newCard,
      id: Date.now().toString(),
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: new Date(),
    };
    
    setFlashcards(prev => [...prev, card]);

    // If adding to a new topic, create it
    if (!topics.find(t => t.name === newCard.subject)) {
      const newTopicId = addTopic({
        name: newCard.subject,
        color: defaultColors[topics.length % defaultColors.length],
        icon: defaultIcons[topics.length % defaultIcons.length],
      });
      setActiveTopic(newTopicId);
    }
  };

  const updateFlashcard = (updatedCard: Flashcard) => {
    setFlashcards(prev => prev.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const deleteFlashcard = (cardId: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== cardId));
  };

  const updatePomodoroStats = (stats: Partial<PomodoroStats>) => {
    setPomodoroStats(prev => ({ ...prev, ...stats }));
  };

  const getTopicStats = (topicName: string) => {
    const topicCards = flashcards.filter(card => card.subject === topicName);
    const totalCorrect = topicCards.reduce((acc, card) => acc + (card.correctCount || 0), 0);
    const totalIncorrect = topicCards.reduce((acc, card) => acc + (card.incorrectCount || 0), 0);
    return {
      cardCount: topicCards.length,
      totalCorrect,
      totalIncorrect,
      successRate: totalCorrect + totalIncorrect > 0 ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) : 0
    };
  };

  // Show new user login page
  if (authStep === 'newUser') {
    return (
      <LoginPage
        onLogin={handleNewUserLogin}
        onSwitchToExistingUser={handleSwitchToExistingUser}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Show existing user login page
  if (authStep === 'existingUser') {
    return (
      <ExistingUserLoginPage
        onLogin={handleExistingUserLogin}
        onSwitchToNewUser={handleSwitchToNewUser}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Show confirmation page
  if (authStep === 'confirmation' && pendingAuth) {
    return (
      <ConfirmationPage
        email={pendingAuth.email}
        username={pendingAuth.username}
        onConfirm={handleConfirmation}
        onBack={handleBackToLogin}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Main app (authenticated)
  return (
    <div className={`h-screen bg-background overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 text-6xl transform rotate-12">📚</div>
        <div className="absolute top-32 right-20 text-4xl transform -rotate-12">✏️</div>
        <div className="absolute bottom-20 left-32 text-5xl transform rotate-45">🎯</div>
        <div className="absolute bottom-40 right-40 text-3xl transform -rotate-45">⭐</div>
      </div>

      <div className="flex h-full relative">
        {/* Sidebar */}
        <Sidebar
          topics={topics}
          activeTopic={activeTopic}
          onTopicChange={setActiveTopic}
          onAddTopic={() => setShowAddTopicModal(true)}
          onAddFlashcard={() => setShowAddModal(true)}
          onShowSettings={() => setShowSettings(true)}
          onEditTopic={handleEditTopic}
          onDeleteTopic={deleteTopic}
          getTopicStats={getTopicStats}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          username={user?.username}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-card border-b-2 border-dashed border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-3">
                {activeTopicData ? (
                  <>
                    <span className="text-2xl">{activeTopicData.icon}</span>
                    <div>
                      <h1 className="text-xl text-foreground font-medium">{activeTopicData.name}</h1>
                      <p className="text-sm text-muted-foreground">
                        {activeFlashcards.length} cards
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🧠</span>
                    <div>
                      <h1 className="text-xl text-foreground font-medium">
                        {user?.username ? `${user.username}'s StudyBuddy` : 'StudyBuddy'}
                      </h1>
                      <p className="text-sm text-muted-foreground">Select a topic to start</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeFlashcards.length > 0 && (
                <>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                  >
                    🔗 Share
                  </button>
                  <button
                    onClick={() => setIsQuizMode(!isQuizMode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      isQuizMode 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'bg-card border-2 border-dashed border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {isQuizMode ? '📖 Study Mode' : '🎯 Quiz Mode'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-hidden">
            {activeTopic && activeFlashcards.length > 0 ? (
              <FlashcardDeck
                flashcards={activeFlashcards}
                isQuizMode={isQuizMode}
                settings={settings}
                onUpdateCard={updateFlashcard}
                onDeleteCard={deleteFlashcard}
              />
            ) : activeTopic && activeFlashcards.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="text-8xl mb-6">{activeTopicData?.icon || '📚'}</div>
                  <h2 className="text-2xl text-foreground mb-2">No flashcards in {activeTopicData?.name}!</h2>
                  <p className="text-muted-foreground mb-6">Add some flashcards to this topic to begin studying</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors transform hover:scale-105"
                    >
                      ✨ Add Flashcard
                    </button>
                    {activeTopicData && (
                      <button
                        onClick={() => handleEditTopic(activeTopicData.id)}
                        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors transform hover:scale-105"
                      >
                        ✏️ Edit Topic
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="text-8xl mb-6">🎯</div>
                  <h2 className="text-2xl text-foreground mb-2">
                    Welcome {user?.username ? `${user.username}` : 'to StudyBuddy'}!
                  </h2>
                  <p className="text-muted-foreground mb-6">Create your first topic and flashcards to get started</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowAddTopicModal(true)}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors transform hover:scale-105"
                    >
                      🏷️ Add Topic
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors transform hover:scale-105"
                    >
                      ✨ Add Flashcard
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Pomodoro Timer */}
        <PomodoroTimer 
          settings={settings} 
          stats={pomodoroStats}
          onUpdateStats={updatePomodoroStats}
        />

        {/* Modals */}
        {showAddTopicModal && (
          <AddTopicModal
            onAdd={addTopic}
            onClose={() => setShowAddTopicModal(false)}
          />
        )}

        {showAddModal && (
          <AddFlashcardModal
            existingTopics={topics.map(t => t.name)}
            defaultTopic={activeTopicData?.name}
            onAdd={addFlashcard}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {showSettings && (
          <SettingsPanel
            settings={settings}
            onUpdate={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showShareModal && activeTopicData && (
          <ShareModal
            topic={activeTopicData}
            flashcards={activeFlashcards}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {showEditTopicModal && editingTopicData && (
          <EditTopicModal
            topic={editingTopicData}
            flashcards={editingTopicFlashcards}
            onUpdateTopic={updateTopic}
            onUpdateFlashcard={updateFlashcard}
            onDeleteFlashcard={deleteFlashcard}
            onAddFlashcard={addFlashcard}
            onClose={() => {
              setShowEditTopicModal(false);
              setEditingTopicId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}