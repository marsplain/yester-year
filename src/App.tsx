import { useMemories } from './hooks/useMemories';
import MemoryCanvas from './components/MemoryCanvas';
import MemoryControls from './components/MemoryControls';
import type { Memory } from './types';
import './App.css';

function App() {
  const { memories, loading, addMemory } = useMemories();

  const handleCreateMemory = (selection: {
    mood: string;
    season: string;
    weather: string;
    activity: string;
  }) => {
    // Generate random position for the character
    const position = {
      x: Math.random() * 80 + 10, // 10% to 90% to keep within bounds
      y: Math.random() * 70 + 10, // 10% to 80% to avoid controls
    };

    const newMemory: Omit<Memory, 'id'> = {
      ...selection,
      timestamp: Date.now(),
      position,
    };

    addMemory(newMemory);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>loading memories...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <MemoryCanvas memories={memories} />
      <MemoryControls onCreateMemory={handleCreateMemory} />
    </div>
  );
}

export default App;
