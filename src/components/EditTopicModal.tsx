import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  isPublic?: boolean;
}

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

interface EditTopicModalProps {
  topic: Topic;
  flashcards: Flashcard[];
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onUpdateFlashcard: (flashcard: Flashcard) => void;
  onDeleteFlashcard: (cardId: string) => void;
  onAddFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  onClose: () => void;
}

const colorOptions = [
  { color: '#2563EB', name: 'Blue' },
  { color: '#10B981', name: 'Green' },
  { color: '#FACC15', name: 'Yellow' },
  { color: '#DC2626', name: 'Red' },
  { color: '#8B5CF6', name: 'Purple' },
  { color: '#F59E0B', name: 'Orange' },
  { color: '#06B6D4', name: 'Cyan' },
  { color: '#EC4899', name: 'Pink' },
];

const iconOptions = [
  '📚', '🎯', '💡', '🔬', '🎨', '🏃', '🎵', '🌟', 
  '🚀', '⭐', '🎭', '🔥', '⚡', '🌈', '🎲', '🏆',
  '💎', '🦋', '🌺', '🎪', '🎨', '🎭', '🎪', '🎨'
];

export function EditTopicModal({ 
  topic, 
  flashcards, 
  onUpdateTopic, 
  onUpdateFlashcard, 
  onDeleteFlashcard, 
  onAddFlashcard, 
  onClose 
}: EditTopicModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'flashcards'>('details');
  const [topicName, setTopicName] = useState(topic.name);
  const [selectedColor, setSelectedColor] = useState(topic.color);
  const [selectedIcon, setSelectedIcon] = useState(topic.icon);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState('');
  const [editingAnswer, setEditingAnswer] = useState('');
  const [editingDifficulty, setEditingDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

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

  const handleSaveTopicDetails = () => {
    if (topicName.trim()) {
      onUpdateTopic(topic.id, {
        name: topicName.trim(),
        color: selectedColor,
        icon: selectedIcon
      });
      // Also update all flashcards with the new topic name
      flashcards.forEach(card => {
        if (card.subject !== topicName.trim()) {
          onUpdateFlashcard({
            ...card,
            subject: topicName.trim()
          });
        }
      });
    }
  };

  const startEditingCard = (card: Flashcard) => {
    setEditingCard(card.id);
    setEditingQuestion(card.question);
    setEditingAnswer(card.answer);
    setEditingDifficulty(card.difficulty || 'medium');
  };

  const saveCardEdit = () => {
    if (editingCard && editingQuestion.trim() && editingAnswer.trim()) {
      const cardToEdit = flashcards.find(c => c.id === editingCard);
      if (cardToEdit) {
        onUpdateFlashcard({
          ...cardToEdit,
          question: editingQuestion.trim(),
          answer: editingAnswer.trim(),
          difficulty: editingDifficulty
        });
      }
      cancelCardEdit();
    }
  };

  const cancelCardEdit = () => {
    setEditingCard(null);
    setEditingQuestion('');
    setEditingAnswer('');
    setEditingDifficulty('medium');
  };

  const handleAddNewCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      onAddFlashcard({
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        subject: topicName.trim(),
        difficulty: newDifficulty,
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: new Date()
      });
      setNewQuestion('');
      setNewAnswer('');
      setNewDifficulty('medium');
      setShowAddCard(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingCard) {
          cancelCardEdit();
        } else if (showAddCard) {
          setShowAddCard(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [editingCard, showAddCard, onClose]);

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
          className="bg-card rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] border-4 border-dashed border-primary overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b-2 border-dashed border-border relative">
            <div className="absolute top-2 right-2 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
                <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2,2" />
                <path d="M12 20 L18 26 L28 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center transform rotate-3 border-2 border-dashed"
                  style={{ 
                    backgroundColor: `${selectedColor}20`,
                    borderColor: selectedColor
                  }}
                >
                  <span className="text-2xl">{selectedIcon}</span>
                </div>
                <div>
                  <h2 className="text-xl text-foreground font-medium">Edit Topic</h2>
                  <p className="text-sm text-muted-foreground">{flashcards.length} flashcards</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors z-10 relative"
                type="button"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                  activeTab === 'details'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card border-2 border-dashed border-border text-muted-foreground hover:bg-accent'
                }`}
              >
                <span className="mr-2">🎨</span>
                Topic Details
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                  activeTab === 'flashcards'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card border-2 border-dashed border-border text-muted-foreground hover:bg-accent'
                }`}
              >
                <span className="mr-2">📚</span>
                Flashcards ({flashcards.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    🎨 Topic Details
                  </h3>

                  {/* Topic Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">✍️</span>
                      Topic Name
                    </label>
                    <input
                      type="text"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      placeholder="Enter topic name"
                      className="w-full p-4 border-2 border-dashed border-border rounded-2xl focus:border-primary focus:outline-none bg-input-background text-foreground placeholder-muted-foreground"
                      maxLength={30}
                    />
                    <div className="mt-2 text-xs text-muted-foreground text-right">
                      {topicName.length}/30
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      Choose Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((option) => (
                        <button
                          key={option.color}
                          type="button"
                          onClick={() => setSelectedColor(option.color)}
                          className={`p-3 rounded-xl transition-all transform hover:scale-105 border-2 border-dashed ${
                            selectedColor === option.color
                              ? 'border-foreground shadow-lg'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                          style={{ backgroundColor: `${option.color}20` }}
                        >
                          <div 
                            className="w-8 h-8 rounded-full mx-auto border-2 border-dashed"
                            style={{ 
                              backgroundColor: option.color,
                              borderColor: option.color
                            }}
                          />
                          <div className="text-xs mt-2 text-foreground">{option.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">😊</span>
                      Choose Icon
                    </label>
                    <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                      {iconOptions.map((icon, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedIcon(icon)}
                          className={`p-3 rounded-lg transition-all transform hover:scale-110 text-2xl ${
                            selectedIcon === icon
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl border-2 border-dashed border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      👀 Preview
                    </h4>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center transform rotate-2 border-2 border-dashed"
                        style={{ 
                          backgroundColor: `${selectedColor}20`,
                          borderColor: selectedColor
                        }}
                      >
                        <span className="text-lg">{selectedIcon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {topicName || 'Topic Name'}
                        </div>
                        <div className="text-sm text-muted-foreground">{flashcards.length} cards</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'flashcards' && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                      📚 Flashcards ({flashcards.length})
                    </h3>
                    <button
                      onClick={() => setShowAddCard(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all transform hover:scale-105"
                    >
                      ✨ Add Card
                    </button>
                  </div>

                  {/* Add New Card Form */}
                  {showAddCard && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border-2 border-dashed border-green-200 space-y-4"
                    >
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        ✨ Add New Flashcard
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Question</label>
                          <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter your question..."
                            className="w-full h-20 p-3 border-2 border-dashed border-border rounded-lg focus:border-primary focus:outline-none bg-input-background text-foreground placeholder-muted-foreground resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Answer</label>
                          <textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Enter the answer..."
                            className="w-full h-20 p-3 border-2 border-dashed border-border rounded-lg focus:border-primary focus:outline-none bg-input-background text-foreground placeholder-muted-foreground resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
                        <div className="flex gap-2">
                          {(['easy', 'medium', 'hard'] as const).map((diff) => (
                            <button
                              key={diff}
                              onClick={() => setNewDifficulty(diff)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                newDifficulty === diff
                                  ? getDifficultyColor(diff)
                                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              } border-2 border-dashed border-current`}
                            >
                              {diff === 'easy' ? '😊' : diff === 'medium' ? '🤔' : '🤯'} {diff}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleAddNewCard}
                          disabled={!newQuestion.trim() || !newAnswer.trim()}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                        >
                          ✨ Add Card
                        </button>
                        <button
                          onClick={() => {
                            setShowAddCard(false);
                            setNewQuestion('');
                            setNewAnswer('');
                            setNewDifficulty('medium');
                          }}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Flashcards List */}
                  <div className="space-y-3">
                    {flashcards.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">📚</div>
                        <p className="text-muted-foreground mb-3">No flashcards in this topic yet</p>
                        <button
                          onClick={() => setShowAddCard(true)}
                          className="text-sm text-primary hover:underline"
                        >
                          Add your first flashcard
                        </button>
                      </div>
                    ) : (
                      flashcards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-card border-2 border-dashed border-border rounded-xl p-4"
                        >
                          {editingCard === card.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">Question</label>
                                  <textarea
                                    value={editingQuestion}
                                    onChange={(e) => setEditingQuestion(e.target.value)}
                                    className="w-full h-20 p-3 border-2 border-dashed border-border rounded-lg focus:border-primary focus:outline-none bg-input-background text-foreground resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">Answer</label>
                                  <textarea
                                    value={editingAnswer}
                                    onChange={(e) => setEditingAnswer(e.target.value)}
                                    className="w-full h-20 p-3 border-2 border-dashed border-border rounded-lg focus:border-primary focus:outline-none bg-input-background text-foreground resize-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
                                <div className="flex gap-2">
                                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                                    <button
                                      key={diff}
                                      onClick={() => setEditingDifficulty(diff)}
                                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                        editingDifficulty === diff
                                          ? getDifficultyColor(diff)
                                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                      } border-2 border-dashed border-current`}
                                    >
                                      {diff === 'easy' ? '😊' : diff === 'medium' ? '🤔' : '🤯'} {diff}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={saveCardEdit}
                                  disabled={!editingQuestion.trim() || !editingAnswer.trim()}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                  💾 Save
                                </button>
                                <button
                                  onClick={cancelCardEdit}
                                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all transform hover:scale-105"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-muted-foreground">Q:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium border border-dashed ${getDifficultyColor(card.difficulty || 'medium')}`}>
                                      {card.difficulty || 'medium'}
                                    </span>
                                  </div>
                                  <p className="text-foreground mb-3">{card.question}</p>
                                  
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-muted-foreground">A:</span>
                                  </div>
                                  <p className="text-muted-foreground">{card.answer}</p>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => startEditingCard(card)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit flashcard"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Delete this flashcard?')) {
                                        onDeleteFlashcard(card.id);
                                      }
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete flashcard"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              {/* Stats */}
                              {(card.correctCount || card.incorrectCount) && (
                                <div className="flex items-center gap-4 text-sm pt-3 border-t border-dashed border-border">
                                  <span className="text-green-600">✅ {card.correctCount || 0}</span>
                                  <span className="text-red-600">❌ {card.incorrectCount || 0}</span>
                                  <span className="text-muted-foreground">
                                    Success: {card.correctCount && (card.correctCount + (card.incorrectCount || 0)) > 0 
                                      ? Math.round((card.correctCount / (card.correctCount + (card.incorrectCount || 0))) * 100)
                                      : 0}%
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
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
              
              {activeTab === 'details' && (
                <button
                  onClick={() => {
                    handleSaveTopicDetails();
                    onClose();
                  }}
                  disabled={!topicName.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-primary text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  💾 Save Changes
                </button>
              )}
              
              {activeTab === 'flashcards' && (
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                  ✨ Done
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}