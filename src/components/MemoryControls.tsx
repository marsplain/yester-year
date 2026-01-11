import { useState } from 'react';
import './MemoryControls.css';

interface MemoryControlsProps {
  onCreateMemory: (selection: {
    mood: string;
    season: string;
    weather: string;
    activity: string;
  }) => void;
}

const MemoryControls = ({ onCreateMemory }: MemoryControlsProps) => {
  const [selectedWord, setSelectedWord] = useState('');

  const words = [
    'luminous',
    'tender',
    'fleeting',
    'golden',
    'serene',
    'wistful',
    'ethereal',
    'gentle',
    'radiant',
    'quiet',
    'vivid',
    'soft',
    'dreamy',
    'warm',
    'melancholy',
    'peaceful',
    'nostalgic',
    'whimsical',
    'hushed',
    'brilliant',
    'mellow',
    'tranquil',
    'delicate',
    'boundless',
  ];

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    // Auto-submit when word is clicked
    onCreateMemory({
      mood: word,
      season: 'spring',
      weather: 'sunny',
      activity: 'rest',
    });
    // Brief delay before clearing selection for visual feedback
    setTimeout(() => setSelectedWord(''), 300);
  };

  return (
    <div className="memory-controls">
      {words.map((word) => (
        <button
          key={word}
          className={`word-button ${selectedWord === word ? 'selected' : ''}`}
          onClick={() => handleWordClick(word)}
        >
          {word}
        </button>
      ))}
    </div>
  );
};

export default MemoryControls;
