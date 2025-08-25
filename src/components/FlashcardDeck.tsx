import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Flashcard } from './Flashcard';

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  correctCount?: number;
  incorrectCount?: number;
}

interface FlashcardDeckProps {
  flashcards: FlashcardData[];
  isQuizMode: boolean;
  settings: {
    autoFlip: boolean;
    autoFlipTimer: number;
    shuffleCards: boolean;
    swipeEnabled: boolean;
  };
  onUpdateCard: (card: FlashcardData) => void;
  onDeleteCard: (cardId: string) => void;
}

export function FlashcardDeck({ 
  flashcards, 
  isQuizMode, 
  settings, 
  onUpdateCard, 
  onDeleteCard 
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, incorrect: 0 });
  const [displayCards, setDisplayCards] = useState<FlashcardData[]>([]);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // Shuffle cards if setting is enabled
  useEffect(() => {
    if (settings.shuffleCards) {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setDisplayCards(shuffled);
    } else {
      setDisplayCards(flashcards);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setIsCompleted(false);
    setQuizScore({ correct: 0, incorrect: 0 });
  }, [flashcards, settings.shuffleCards]);

  const currentCard = displayCards[currentIndex];

  // Auto-flip functionality
  useEffect(() => {
    if (settings.autoFlip && !isFlipped && !showAnswer && currentCard) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
        setShowAnswer(true);
      }, settings.autoFlipTimer * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, settings.autoFlip, settings.autoFlipTimer, isFlipped, showAnswer, currentCard]);

  // Clear auto-advance timer when component unmounts or conditions change
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);

  // Helper function to check if user is typing in an input field
  const isTypingInInput = (): boolean => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    const inputTypes = ['input', 'textarea', 'select'];
    
    // Check if it's an input element
    if (inputTypes.includes(tagName)) return true;
    
    // Check if it's a contenteditable element
    if (activeElement.getAttribute('contenteditable') === 'true') return true;
    
    // Check if it's inside a modal or form (additional safety)
    const isInModal = activeElement.closest('[role="dialog"]') || 
                     activeElement.closest('.modal') ||
                     activeElement.closest('[data-modal]');
    
    return !!isInModal && (tagName === 'input' || tagName === 'textarea');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (isTypingInInput()) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (!showAnswer) {
            handleFlip();
          } else if (showAnswer && isFlipped) {
            // Space bar also advances to next card when answer is showing
            nextCard();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextCard();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previousCard();
          break;
        case '1':
          if (isQuizMode && showAnswer) {
            event.preventDefault();
            markAnswer(false);
          }
          break;
        case '2':
          if (isQuizMode && showAnswer) {
            event.preventDefault();
            markAnswer(true);
          }
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          resetQuiz();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped, showAnswer, isQuizMode]);

  // Touch/Swipe handling
  const handleSwipe = (info: PanInfo) => {
    if (!settings.swipeEnabled) return;

    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      if (info.offset.x > 0) {
        // Swipe right - previous card
        setSwipeDirection('right');
        setTimeout(() => {
          previousCard();
          setSwipeDirection(null);
        }, 150);
      } else {
        // Swipe left - next card
        setSwipeDirection('left');
        setTimeout(() => {
          nextCard();
          setSwipeDirection(null);
        }, 150);
      }
    }
  };

  const handleTap = () => {
    if (!showAnswer) {
      handleFlip();
    }
  };

  const handleFlip = () => {
    // Clear auto-advance timer when manually flipping
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const nextCard = () => {
    // Clear any existing auto-advance timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (currentIndex < displayCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    } else {
      // Reached the end
      setIsCompleted(true);
    }
  };

  const previousCard = () => {
    // Clear any existing auto-advance timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setIsCompleted(false);
    }
  };

  const markAnswer = (correct: boolean) => {
    if (!currentCard) return;

    const updatedCard = {
      ...currentCard,
      correctCount: (currentCard.correctCount || 0) + (correct ? 1 : 0),
      incorrectCount: (currentCard.incorrectCount || 0) + (correct ? 0 : 1),
      lastReviewed: new Date()
    };

    onUpdateCard(updatedCard);
    
    setQuizScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1)
    }));

    // Auto-advance to next card in quiz mode
    setTimeout(() => {
      nextCard();
    }, 1000);
  };

  const resetQuiz = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setQuizScore({ correct: 0, incorrect: 0 });
    setIsCompleted(false);
  };

  const restartDeck = () => {
    resetQuiz();
  };

  // Completion screen
  if (isCompleted || (!currentCard && displayCards.length > 0)) {
    const accuracy = quizScore.correct + quizScore.incorrect > 0 
      ? Math.round((quizScore.correct / (quizScore.correct + quizScore.incorrect)) * 100)
      : 0;

    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-2xl text-foreground mb-4">Great job!</h2>
          <p className="text-muted-foreground mb-6">
            You've completed all {displayCards.length} flashcards in this topic.
          </p>

          {isQuizMode && (quizScore.correct > 0 || quizScore.incorrect > 0) && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 mb-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Your Results</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl text-green-600 mb-1">✅</div>
                  <div className="text-xl font-medium text-foreground">{quizScore.correct}</div>
                  <div className="text-xs text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl text-red-600 mb-1">❌</div>
                  <div className="text-xl font-medium text-foreground">{quizScore.incorrect}</div>
                  <div className="text-xs text-muted-foreground">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl text-yellow-500 mb-1">🎯</div>
                  <div className="text-xl font-medium text-foreground">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={restartDeck}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              🔄 Study Again
            </button>
            <button
              onClick={() => {
                if (settings.shuffleCards) {
                  const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
                  setDisplayCards(shuffled);
                }
                restartDeck();
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all transform hover:scale-105"
            >
              🔀 Shuffle & Restart
            </button>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Press 'R' to restart or use the buttons above
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl text-foreground mb-2">No flashcards available</h2>
          <p className="text-muted-foreground">Add some flashcards to get started!</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / displayCards.length) * 100;

  return (
    <div className="h-full flex flex-col" ref={deckRef}>
      {/* Progress and Stats Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {displayCards.length}
            </span>
            {isQuizMode && (
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  ✅ {quizScore.correct}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  ❌ {quizScore.incorrect}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={resetQuiz}
              className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              🔄 Reset (R)
            </button>
            <span className="text-xs text-muted-foreground">
              {settings.swipeEnabled ? 'Swipe or use' : 'Use'} {isQuizMode ? 'Space: flip/next | ←→: navigate | 1/2: mark' : 'Space: flip/next | ←→: navigate'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-secondary rounded-full overflow-hidden border-2 border-dashed border-border">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Flashcard Area */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-2xl"
          drag={settings.swipeEnabled ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onPanEnd={(_, info) => handleSwipe(info)}
          onTap={handleTap}
          animate={{
            x: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0,
            scale: swipeDirection ? 0.95 : 1
          }}
          transition={{ duration: 0.15 }}
        >
          <AnimatePresence mode="wait">
            <Flashcard
              key={currentCard.id}
              card={currentCard}
              isFlipped={isFlipped}
              showAnswer={showAnswer}
              onFlip={handleFlip}
              onDelete={() => onDeleteCard(currentCard.id)}
              onNextCard={!isQuizMode && showAnswer && isFlipped ? nextCard : undefined}
              isQuizMode={isQuizMode}
            />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Swipe Indicators */}
      {settings.swipeEnabled && (
        <div className="mb-4 flex justify-center gap-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 opacity-70">
            <span>👈</span>
            <span>Swipe left: Next</span>
          </div>
          <div className="flex items-center gap-2 opacity-70">
            <span>👉</span>
            <span>Swipe right: Previous</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={previousCard}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-card border-2 border-dashed border-border text-muted-foreground rounded-xl font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          ← Previous
        </button>

        <button
          onClick={handleFlip}
          disabled={showAnswer && !isQuizMode}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all transform hover:scale-105 border-2 border-dashed border-transparent hover:border-primary-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showAnswer ? '🔄 Flip Back' : '👁️ Reveal Answer'}
        </button>

        <button
          onClick={nextCard}
          disabled={currentIndex === displayCards.length - 1}
          className="px-6 py-3 bg-card border-2 border-dashed border-border text-muted-foreground rounded-xl font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          Next →
        </button>
      </div>

      {/* Quiz Mode Controls */}
      {isQuizMode && showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => markAnswer(false)}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all transform hover:scale-105 border-2 border-dashed border-transparent hover:border-white/20"
          >
            ❌ Incorrect (1)
          </button>
          <button
            onClick={() => markAnswer(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all transform hover:scale-105 border-2 border-dashed border-transparent hover:border-white/20"
          >
            ✅ Correct (2)
          </button>
        </motion.div>
      )}

      {/* Auto-flip indicators */}
      {!isQuizMode && (
        <div className="mt-2 text-center">
          {settings.autoFlip && !isFlipped && (
            <div className="text-xs text-muted-foreground">
              Auto-flipping in {settings.autoFlipTimer}s... (Press space to flip now)
            </div>
          )}
          {showAnswer && isFlipped && (
            <div className="text-xs text-muted-foreground">
              Click the answer to continue to next card
            </div>
          )}
        </div>
      )}
    </div>
  );
}