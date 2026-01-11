import { useState } from 'react';
import MemoryCanvas from './components/MemoryCanvas';
import MemoryControls from './components/MemoryControls';
import { useGhostLayers } from './hooks/useGhostLayers';
import './App.css';

function App() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
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
      setCurrentMood(selectedMood);
      // Store note with mood for later fossilization
      sessionStorage.setItem('current-note', note);
      setSelectedMood(null);
    }
  };

  const handleJournalSkip = () => {
    if (selectedMood) {
      setCurrentMood(selectedMood);
      setSelectedMood(null);
    }
  };

  const handleSeed = () => {
    // Reset mood after seeding to allow re-triggering
    setCurrentMood(null);
  };

  const handleFossilize = (grid: string[][], mood: string) => {
    const note = sessionStorage.getItem('current-note') || undefined;
    sessionStorage.removeItem('current-note');
    addGhostLayer(grid, mood, note);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}.${day}.${year}`;
  };

  const colors: Record<string, string> = {
    luminous: '#FFD700',
    tender: '#FFB6C1',
    fleeting: '#E6E6FA',
    golden: '#DAA520',
    serene: '#87CEEB',
    melancholy: '#9370DB',
    nostalgic: '#CD5C5C',
    whimsical: '#FF1493',
    hushed: '#696969',
    brilliant: '#FFD700',
    mellow: '#D2691E',
    tranquil: '#4169E1',
    delicate: '#C71585',
    boundless: '#1E90FF',
    painful: '#8B0000',
  };

  const sortedMemories = [...memories].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="app">
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
      <div className="vault-container">
        <button className="archive-toggle" onClick={() => {
          console.log('Vault clicked, memories:', memories.length);
          setShowArchive(!showArchive);
        }}>
          vault
        </button>
        {showArchive && sortedMemories.length > 0 && (
          <div className="vault-list">
            {sortedMemories.map((memory) => (
              <div key={memory.id} className="vault-item">
                <div
                  className="vault-mood"
                  style={{ color: colors[memory.mood] || '#bbb' }}
                >
                  {memory.mood}
                </div>
                <div className="vault-date">{formatDate(memory.timestamp)}</div>
                {memory.note && (
                  <div className="vault-note">"{memory.note}"</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
