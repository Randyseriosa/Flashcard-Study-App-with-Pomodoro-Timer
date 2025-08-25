import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Topic {
  name: string;
  color: string;
  icon: string;
}

interface AddTopicModalProps {
  onAdd: (topic: Topic) => void;
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

export function AddTopicModal({ onAdd, onClose }: AddTopicModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].color);
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

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
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        color: selectedColor,
        icon: selectedIcon,
      });
      onClose();
    }
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
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <h2 className="text-xl text-foreground font-medium">Create New Topic</h2>
                  <p className="text-sm text-muted-foreground">Organize your flashcards by category</p>
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

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Topic Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <span className="text-lg">✍️</span>
                Topic Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter topic name (e.g., Mathematics, History...)"
                className="w-full p-4 border-2 border-dashed border-border rounded-2xl focus:border-primary focus:outline-none bg-input-background text-foreground placeholder-muted-foreground"
                autoFocus
                maxLength={30}
              />
              <div className="mt-2 text-xs text-muted-foreground text-right">
                {name.length}/30
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
                    {name || 'Topic Name'}
                  </div>
                  <div className="text-sm text-muted-foreground">0 cards</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all transform hover:scale-105"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!name.trim()}
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                🏷️ Create Topic
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}