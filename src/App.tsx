import { useState } from 'react';
import MemoryCanvas from './components/MemoryCanvas';
import MemoryControls from './components/MemoryControls';
import MemoryArchive from './components/MemoryArchive';
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
      <button className="archive-toggle" onClick={() => setShowArchive(true)}>
        vault
      </button>
      {showArchive && (
        <MemoryArchive memories={memories} onClose={() => setShowArchive(false)} />
      )}
    </div>
  );
}

export default App;
