import { useState } from 'react';
import JournalPrompt from './JournalPrompt';
import './MemoryControls.css';

interface MemoryControlsProps {
  onCreateMemory: (selection: {
    mood: string;
    season: string;
    weather: string;
    activity: string;
  }) => void;
  selectedMood: string | null;
  onJournalSubmit: (note: string) => void;
  onJournalSkip: () => void;
}

const MemoryControls = ({ onCreateMemory, selectedMood, onJournalSubmit, onJournalSkip }: MemoryControlsProps) => {
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
    'painful',
  ];

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    // Trigger mood selection (will show journal prompt)
    onCreateMemory({
      mood: word,
      season: 'spring',
      weather: 'sunny',
      activity: 'rest',
    });
    // Brief delay before clearing visual selection
    setTimeout(() => setSelectedWord(''), 300);
  };

  return (
    <div className="memory-controls">
      {words.map((word) => (
        <div key={word}>
          <button
            className={`word-button ${selectedWord === word ? 'selected' : ''}`}
            onClick={() => handleWordClick(word)}
          >
            {word}
          </button>
          {selectedMood === word && (
            <JournalPrompt
              mood={selectedMood}
              onSubmit={onJournalSubmit}
              onSkip={onJournalSkip}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MemoryControls;
