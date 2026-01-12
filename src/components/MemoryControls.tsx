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
  const [selectedNumber, setSelectedNumber] = useState('');

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handleNumberClick = (number: string) => {
    setSelectedNumber(number);
    // Trigger mood selection immediately (no journal prompt)
    onCreateMemory({
      mood: number,
      season: 'spring',
      weather: 'sunny',
      activity: 'rest',
    });
    // Brief delay before clearing visual selection
    setTimeout(() => setSelectedNumber(''), 300);
  };

  return (
    <div className="memory-controls">
      <div className="question">how was your day?</div>
      {numbers.map((number) => (
        <button
          key={number}
          className={`word-button ${selectedNumber === number ? 'selected' : ''}`}
          onClick={() => handleNumberClick(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default MemoryControls;
