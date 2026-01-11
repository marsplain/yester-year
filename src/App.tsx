import { useState } from 'react';
import MemoryCanvas from './components/MemoryCanvas';
import MemoryControls from './components/MemoryControls';
import { useGhostLayers } from './hooks/useGhostLayers';
import './App.css';

function App() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [userName, setUserName] = useState('');
  const [userYear, setUserYear] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [showYearInput, setShowYearInput] = useState(false);
  const { ghostLayers, memories, addGhostLayer } = useGhostLayers();

  const handleWordClick = (selection: {
    mood: string;
    season: string;
    weather: string;
    activity: string;
  }) => {
    setSelectedMood(selection.mood);
  };

  const handleJournalSubmit = (note: string) => {
    if (selectedMood) {
      // Create memory immediately with empty grid (will be updated later)
      const emptyGrid: string[][] = Array(50).fill(null).map(() => Array(50).fill(''));
      addGhostLayer(emptyGrid, selectedMood, note);

      setCurrentMood(selectedMood);
      // Store note with mood key for later grid update
      sessionStorage.setItem(`note-${selectedMood}`, note);
      sessionStorage.setItem(`memory-id-${selectedMood}`, Date.now().toString());
      setSelectedMood(null);
    }
  };

  const handleJournalSkip = () => {
    if (selectedMood) {
      // Create memory immediately without note
      const emptyGrid: string[][] = Array(50).fill(null).map(() => Array(50).fill(''));
      addGhostLayer(emptyGrid, selectedMood, undefined);

      setCurrentMood(selectedMood);
      sessionStorage.setItem(`memory-id-${selectedMood}`, Date.now().toString());
      setSelectedMood(null);
    }
  };

  const handleSeed = () => {
    // Reset mood after seeding to allow re-triggering
    setCurrentMood(null);
  };

  const handleFossilize = (_grid: string[][], mood: string) => {
    // Memory was already created when journal was submitted
    // Just clean up sessionStorage
    sessionStorage.removeItem(`note-${mood}`);
    sessionStorage.removeItem(`memory-id-${mood}`);
    // Note: The grid snapshot is already saved, this fossilization just cleans up
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}.${day}.${year}`;
  };

  const colors: Record<string, string> = {
    effervescent: '#FFFF00',      // pure bright yellow
    joyful: '#FFD700',            // golden yellow
    warm: '#FF8C00',              // dark orange
    golden: '#FFA500',            // pure orange
    tender: '#FF1493',            // deep pink
    soft: '#FF69B4',              // hot pink
    dreamy: '#DA70D6',            // orchid
    quiet: '#BA55D3',             // medium orchid
    nostalgic: '#9370DB',         // medium purple
    restless: '#8A2BE2',          // blue violet
    aching: '#4169E1',            // royal blue
    heavy: '#1E90FF',             // dodger blue
    melancholic: '#00BFFF',       // deep sky blue
    hollow: '#00CED1',            // dark turquoise
    raw: '#20B2AA',               // light sea green
  };

  const sortedMemories = [...memories].sort((a, b) => b.timestamp - a.timestamp);

  console.log('App render - showArchive:', showArchive, 'memories count:', memories.length);
  if (memories.length > 0) {
    console.log('First memory:', memories[0]);
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameInput(false);
      setShowYearInput(true);
    }
  };

  const handleYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userYear.trim()) {
      setShowYearInput(false);
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">The Game of Yesteryear</h1>
      <div className="user-info">
        {showNameInput ? (
          <form onSubmit={handleNameSubmit} className="user-form">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="your name"
              className="user-input"
              autoFocus
              maxLength={20}
            />
          </form>
        ) : showYearInput ? (
          <form onSubmit={handleYearSubmit} className="user-form">
            <span className="user-display">{userName}'s </span>
            <input
              type="text"
              value={userYear}
              onChange={(e) => setUserYear(e.target.value)}
              placeholder="year"
              className="user-input"
              autoFocus
              maxLength={4}
            />
          </form>
        ) : (
          <div className="user-display" onClick={() => setShowNameInput(true)}>
            {userName}'s {userYear}
          </div>
        )}
      </div>
      <MemoryCanvas
        currentMood={currentMood}
        onSeed={handleSeed}
        ghostLayers={ghostLayers}
        onFossilize={handleFossilize}
      />
      <MemoryControls
        onCreateMemory={handleWordClick}
        selectedMood={selectedMood}
        onJournalSubmit={handleJournalSubmit}
        onJournalSkip={handleJournalSkip}
      />
      <button
        className="archive-toggle"
        onClick={() => {
          console.log('Vault clicked, current showArchive:', showArchive, 'memories:', memories.length);
          setShowArchive(prev => !prev);
        }}
      >
        vault
      </button>
      {showArchive && (
        <div className="vault-list">
          {sortedMemories.length === 0 ? (
            <div className="vault-item">
              <div className="vault-mood" style={{ color: '#ddd' }}>
                no memories yet
              </div>
            </div>
          ) : (
            sortedMemories.map((memory) => {
              console.log('Rendering memory:', memory.mood, 'has note:', !!memory.note, 'note:', memory.note);
              return (
                <div key={memory.id} className="vault-item">
                  <div>
                    <span
                      className="vault-mood"
                      style={{ color: colors[memory.mood] || '#bbb' }}
                    >
                      {memory.mood}
                    </span>
                    {memory.note && (
                      <span className="vault-note">"{memory.note}"</span>
                    )}
                  </div>
                  <div className="vault-date">{formatDate(memory.timestamp)}</div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default App;
