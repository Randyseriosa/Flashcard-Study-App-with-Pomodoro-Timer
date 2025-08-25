import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AddFlashcardModalProps {
  existingTopics: string[];
  defaultTopic?: string;
  onAdd: (flashcard: {
    question: string;
    answer: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => void;
  onClose: () => void;
}

export function AddFlashcardModal({ existingTopics, defaultTopic, onAdd, onClose }: AddFlashcardModalProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [topic, setTopic] = useState(defaultTopic || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [step, setStep] = useState(1);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<string[]>([]);
  const topicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (topic && existingTopics.length > 0) {
      const filtered = existingTopics.filter(t => 
        t.toLowerCase().includes(topic.toLowerCase()) && 
        t.toLowerCase() !== topic.toLowerCase()
      );
      setFilteredTopics(filtered);
      setShowTopicSuggestions(filtered.length > 0 && topic.length > 0);
    } else {
      setFilteredTopics([]);
      setShowTopicSuggestions(false);
    }
  }, [topic, existingTopics]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim() && topic.trim()) {
      onAdd({
        question: question.trim(),
        answer: answer.trim(),
        subject: topic.trim(),
        difficulty
      });
      onClose();
    }
  };

  const nextStep = () => {
    if (step === 1 && question.trim()) {
      setStep(2);
    } else if (step === 2 && answer.trim()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const selectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setShowTopicSuggestions(false);
    topicInputRef.current?.focus();
  };

  // Handle Escape key to close modal
  useEffect(() => {
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
          className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl border-4 border-dashed border-primary overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b-2 border-dashed border-border relative">
            <div className="absolute top-2 right-2 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
                <polygon 
                  points="20,3 23,13 33,13 25,19 28,29 20,24 12,29 15,19 7,13 17,13" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transform rotate-3">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="text-xl text-foreground font-medium">Create New Flashcard</h2>
                  <p className="text-sm text-muted-foreground">Step {step} of 3</p>
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

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">❓</span>
                      What's your question?
                    </label>
                    <div className="relative">
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question here... (e.g., What is the capital of France?)"
                        className="w-full h-32 p-4 border-2 border-dashed border-border rounded-2xl focus:border-primary focus:outline-none resize-none bg-input-background text-foreground placeholder-muted-foreground"
                        autoFocus
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {question.length}/200
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-dashed border-blue-200">
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      💡 Question Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Be clear and specific</li>
                      <li>• Use simple language</li>
                      <li>• Avoid yes/no questions for better learning</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      What's the answer?
                    </label>
                    <div className="relative">
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the answer here... (e.g., Paris)"
                        className="w-full h-32 p-4 border-2 border-dashed border-border rounded-2xl focus:border-green-500 focus:outline-none resize-none bg-input-background text-foreground placeholder-muted-foreground"
                        autoFocus
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {answer.length}/200
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-dashed border-green-200">
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      🎯 Answer Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Keep it concise but complete</li>
                      <li>• Include key details</li>
                      <li>• Use examples when helpful</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">🏷️</span>
                      Topic/Title
                    </label>
                    <input
                      ref={topicInputRef}
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter a topic (e.g., Geography, History, Math...)"
                      className="w-full p-4 border-2 border-dashed border-border rounded-2xl focus:border-yellow-500 focus:outline-none bg-input-background text-foreground placeholder-muted-foreground"
                      autoFocus
                    />

                    {/* Topic Suggestions Dropdown */}
                    {showTopicSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-dashed border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto"
                      >
                        <div className="p-2">
                          <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
                            📝 Existing Topics:
                          </div>
                          {filteredTopics.map((existingTopic, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectTopic(existingTopic)}
                              className="w-full text-left px-3 py-2 hover:bg-accent rounded-lg transition-colors text-sm text-foreground"
                            >
                              {existingTopic}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {existingTopics.length > 0 && !showTopicSuggestions && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        💡 Start typing to see existing topics or create a new one
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      Difficulty level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['easy', 'medium', 'hard'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`p-4 rounded-xl border-2 border-dashed transition-all transform hover:scale-105 ${
                            difficulty === level
                              ? 'bg-gradient-to-r from-primary/10 to-green-500/10 border-primary text-primary'
                              : 'bg-secondary border-border text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          <div className="text-2xl mb-2">
                            {level === 'easy' ? '😊' : level === 'medium' ? '🤔' : '🤯'}
                          </div>
                          <div className="text-sm font-medium capitalize">{level}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-dashed border-yellow-200">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      👀 Preview
                    </h4>
                    <div className="bg-card p-3 rounded-lg border border-border">
                      <div className="text-sm text-foreground mb-2">
                        <strong>Q:</strong> {question}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>A:</strong> {answer}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-secondary px-2 py-1 rounded">{topic || 'Topic'}</span>
                        <span className={`px-2 py-1 rounded ${
                          difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {difficulty}
                        </span>
                        {!existingTopics.includes(topic) && topic && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            New Topic
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-dashed border-border">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                ← Back
              </button>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-3 h-3 rounded-full transition-all ${
                      stepNum === step
                        ? 'bg-primary scale-125'
                        : stepNum < step
                        ? 'bg-green-500'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !question.trim()) ||
                    (step === 2 && !answer.trim())
                  }
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-primary text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  ✨ Create Flashcard
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}