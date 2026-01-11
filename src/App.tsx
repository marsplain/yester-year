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
      // Store note with mood key for later fossilization
      sessionStorage.setItem(`note-${selectedMood}`, note);
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
    const note = sessionStorage.getItem(`note-${mood}`) || undefined;
    sessionStorage.removeItem(`note-${mood}`);
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
    wistful: '#B0C4DE',
    ethereal: '#F0E68C',
    gentle: '#98FB98',
    radiant: '#FFA07A',
    quiet: '#D3D3D3',
    vivid: '#FF6347',
    soft: '#FFDAB9',
    dreamy: '#DDA0DD',
    warm: '#FF7F50',
    melancholy: '#9370DB',
    peaceful: '#AFEEEE',
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

  console.log('App render - showArchive:', showArchive, 'memories count:', memories.length);
  if (memories.length > 0) {
    console.log('First memory:', memories[0]);
  }

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
    </div>
  );
}

export default App;
