import React from 'react';
import { motion } from 'motion/react';

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  correctCount?: number;
  incorrectCount?: number;
}

interface FlashcardProps {
  card: FlashcardData;
  isFlipped: boolean;
  showAnswer: boolean;
  onFlip: () => void;
  onDelete: () => void;
  onNextCard?: () => void; // New prop for advancing to next card
  isQuizMode: boolean;
}

export function Flashcard({ 
  card, 
  isFlipped, 
  showAnswer, 
  onFlip, 
  onDelete, 
  onNextCard,
  isQuizMode 
}: FlashcardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#FACC15';
      case 'hard': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getSuccessRate = () => {
    const total = (card.correctCount || 0) + (card.incorrectCount || 0);
    if (total === 0) return 0;
    return Math.round(((card.correctCount || 0) / total) * 100);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If showing answer and we have a next card function, advance to next card
    if (showAnswer && isFlipped && onNextCard) {
      onNextCard();
    } else {
      // Otherwise, flip the card
      onFlip();
    }
  };

  return (
    <div className="perspective-1000 w-full h-96">
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 15 }}
        onClick={handleCardClick}
      >
        {/* Front Side - Question */}
        <div className="absolute inset-0 backface-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-card rounded-3xl shadow-2xl border-4 border-dashed border-primary p-8 flex flex-col relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <svg width="60" height="60" viewBox="0 0 60 60" className="text-primary">
                <path
                  d="M10 10 Q30 25 50 10 Q30 35 10 50 Q30 35 50 50"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="absolute bottom-4 left-4 opacity-10">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-green-500">
                <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="3,3" />
                <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border-2 border-dashed border-primary">
                  <span className="text-lg">❓</span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">Question</span>
              </div>

              {!isQuizMode && (
                <div className="flex items-center gap-2">
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-medium border-2 border-dashed"
                    style={{ 
                      backgroundColor: `${getDifficultyColor(card.difficulty)}20`,
                      borderColor: getDifficultyColor(card.difficulty),
                      color: getDifficultyColor(card.difficulty)
                    }}
                  >
                    {card.difficulty || 'medium'}
                  </div>
                </div>
              )}
            </div>

            {/* Question Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-foreground leading-relaxed mb-4">
                  {card.question}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>💡</span>
                  <span>Click to reveal answer</span>
                </div>
              </div>
            </div>

            {/* Stats (if not quiz mode) */}
            {!isQuizMode && (card.correctCount || card.incorrectCount) && (
              <div className="mt-6 p-3 bg-secondary/50 rounded-xl border-2 border-dashed border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="font-medium text-foreground">{getSuccessRate()}%</span>
                </div>
                <div className="mt-2 flex gap-4 text-xs">
                  <span className="text-green-600">✅ {card.correctCount || 0}</span>
                  <span className="text-red-600">❌ {card.incorrectCount || 0}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Back Side - Answer */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showAnswer ? 1 : 0, scale: showAnswer ? 1 : 0.8 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-2xl border-4 border-dashed border-green-500 p-8 flex flex-col relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <svg width="60" height="60" viewBox="0 0 60 60" className="text-green-500">
                <path
                  d="M15 30 L25 40 L45 20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="absolute bottom-4 left-4 opacity-10">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-yellow-500">
                <polygon 
                  points="20,5 25,15 35,15 27,23 30,33 20,28 10,33 13,23 5,15 15,15" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                />
              </svg>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-dashed border-green-500">
                  <span className="text-lg">💡</span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">Answer</span>
              </div>

              <div className="text-xs text-muted-foreground bg-white/50 px-3 py-1 rounded-full border border-dashed border-border">
                {onNextCard ? 'Click to continue' : 'Click to flip back'}
              </div>
            </div>

            {/* Answer Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block p-6 bg-white/80 rounded-2xl border-2 border-dashed border-green-500 shadow-lg">
                  <p className="text-2xl text-foreground font-medium leading-relaxed">
                    {card.answer}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  {onNextCard ? (
                    <>
                      <span>👆</span>
                      <span>Click anywhere to continue</span>
                      <span>👆</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>How did you do?</span>
                      <span>✨</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {!isQuizMode && (
              <div className="mt-4 text-center text-xs text-muted-foreground">
                Subject: {card.subject} • ID: {card.id.slice(-4)}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}