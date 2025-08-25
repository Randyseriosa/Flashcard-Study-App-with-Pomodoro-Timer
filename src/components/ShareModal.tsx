import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ShareModalProps {
  topic: Topic;
  flashcards: Flashcard[];
  onClose: () => void;
}

export function ShareModal({ topic, flashcards, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

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

  const generateShareUrl = () => {
    const shareData = {
      topic: {
        ...topic,
        isPublic: true
      },
      flashcards: flashcards.map(card => ({
        ...card,
        id: '', // Will be regenerated on import
      }))
    };

    const encodedData = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}${window.location.pathname}?topic=${encodedData}`;
    setShareUrl(url);
    setIsPublic(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaWeb = (platform: string) => {
    const text = `Check out my ${topic.name} flashcards on StudyBuddy!`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

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
          className="bg-card rounded-3xl shadow-2xl w-full max-w-lg border-4 border-dashed border-primary overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b-2 border-dashed border-border relative">
            <div className="absolute top-2 right-2 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-blue-500">
                <path d="M20 4 L28 12 L20 20 L12 12 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M8 20 L16 28 L24 20 L32 28" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center transform rotate-3">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <h2 className="text-xl text-foreground font-medium">Share Topic</h2>
                  <p className="text-sm text-muted-foreground">Let others study with your flashcards</p>
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
          </div>

          <div className="p-6 space-y-6">
            {/* Topic Preview */}
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-xl border-2 border-dashed border-border">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed"
                style={{ 
                  backgroundColor: `${topic.color}20`,
                  borderColor: topic.color
                }}
              >
                <span className="text-2xl">{topic.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{topic.name}</h3>
                <p className="text-sm text-muted-foreground">{flashcards.length} flashcards</p>
              </div>
            </div>

            {!shareUrl ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🌐</div>
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to share?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Generate a shareable link that others can use to study your flashcards. 
                  They'll be able to view and study them, but not edit your original set.
                </p>
                <button
                  onClick={generateShareUrl}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                  🔗 Generate Share Link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    📋 Share Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 p-3 bg-secondary/20 border-2 border-dashed border-border rounded-lg text-sm font-mono text-foreground"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {copied ? '✅' : '📋'}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-2">✨ Link copied to clipboard!</p>
                  )}
                </div>

                {/* Social Sharing */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    📱 Share via Social Media
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => shareViaWeb('twitter')}
                      className="flex items-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <span>🐦</span>
                      <span className="text-sm">Twitter</span>
                    </button>
                    <button
                      onClick={() => shareViaWeb('facebook')}
                      className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>📘</span>
                      <span className="text-sm">Facebook</span>
                    </button>
                    <button
                      onClick={() => shareViaWeb('whatsapp')}
                      className="flex items-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <span>💬</span>
                      <span className="text-sm">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => shareViaWeb('linkedin')}
                      className="flex items-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <span>💼</span>
                      <span className="text-sm">LinkedIn</span>
                    </button>
                  </div>
                </div>

                {/* Study Tips */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-dashed border-yellow-200">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    💡 Study Group Tips
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Share the link with study partners</li>
                    <li>• Use video calls for collaborative studying</li>
                    <li>• Quiz each other using the shared cards</li>
                    <li>• Create study schedules together</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center pt-4 border-t-2 border-dashed border-border">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all transform hover:scale-105"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}