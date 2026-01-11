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
    effervescent: '#FFD700',      // bright gold
    joyful: '#FFA500',            // warm orange
    warm: '#FF6347',              // tomato red
    golden: '#DAA520',            // goldenrod
    tender: '#FFB6C1',            // light pink
    soft: '#98D8C8',              // seafoam green
    dreamy: '#DDA0DD',            // plum
    quiet: '#6B9AC4',             // soft blue
    nostalgic: '#CD5C5C',         // indian red
    restless: '#5F9EA0',          // cadet blue
    aching: '#C44569',            // deep rose red
    heavy: '#696969',             // dim gray
    melancholic: '#1E4D7B',       // cobalt blue
    hollow: '#5A7D9A',            // steel blue
    raw: '#8B0000',               // dark red
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
