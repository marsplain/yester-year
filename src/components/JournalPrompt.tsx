import { useState, useEffect, useRef } from 'react';
import './JournalPrompt.css';

interface JournalPromptProps {
  mood: string;
  onSubmit: (note: string) => void;
  onSkip: () => void;
}

const JournalPrompt = ({ mood, onSubmit, onSkip }: JournalPromptProps) => {
  const [note, setNote] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSubmit(note.trim());
    } else {
      onSkip();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSkip();
    }
  };

  return (
    <div className="journal-prompt">
      <form onSubmit={handleSubmit}>
        <label htmlFor="note">what felt {mood} today?</label>
        <input
          ref={inputRef}
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          maxLength={100}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};

export default JournalPrompt;
