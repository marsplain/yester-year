import { useState } from 'react';
import MemoryCanvas from './components/MemoryCanvas';
import MemoryControls from './components/MemoryControls';
import { useGhostLayers } from './hooks/useGhostLayers';
import './App.css';

function App() {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('yester-year-username') || '');
  const [userYear, setUserYear] = useState(() => localStorage.getItem('yester-year-useryear') || '');
  const [showNameInput, setShowNameInput] = useState(() => !localStorage.getItem('yester-year-username'));
  const [showYearInput, setShowYearInput] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const { ghostLayers, memories, addGhostLayer, updateGhostLayer } = useGhostLayers();

  const handleWordClick = (selection: {
    mood: string;
    season: string;
    weather: string;
    activity: string;
  }) => {
    // Create memory immediately with empty grid (will be updated later)
    const emptyGrid: string[][] = Array(50).fill(null).map(() => Array(50).fill(''));
    addGhostLayer(emptyGrid, selection.mood, undefined);

    setCurrentMood(selection.mood);
    sessionStorage.setItem(`memory-id-${selection.mood}`, Date.now().toString());
  };

  const handleSeed = () => {
    // Reset mood after seeding to allow re-triggering
    setCurrentMood(null);
  };

  const handleFossilize = (grid: string[][], mood: string) => {
    // Update the ghost layer and memory with the evolved grid
    updateGhostLayer(grid, mood);
    // Clean up sessionStorage
    sessionStorage.removeItem(`note-${mood}`);
    sessionStorage.removeItem(`memory-id-${mood}`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}.${day}.${year}`;
  };

  const colors: Record<string, string> = {
    '1': '#0047AB',   // dark blue (coldest)
    '2': '#0099FF',   // bright blue
    '3': '#00CCCC',   // cyan
    '4': '#00FF00',   // green
    '5': '#99FF00',   // yellow-green
    '6': '#FFFF00',   // yellow
    '7': '#FF8C00',   // orange
    '8': '#FF1493',   // hot pink
    '9': '#FF0000',   // red
    '10': '#FF0066',  // magenta (warmest)
  };

  const sortedMemories = [...memories].sort((a, b) => b.timestamp - a.timestamp);

  console.log('App render - showArchive:', showArchive, 'memories count:', memories.length);
  if (memories.length > 0) {
    console.log('First memory:', memories[0]);
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('yester-year-username', userName);
      setShowNameInput(false);
      setShowYearInput(true);
    }
  };

  const handleYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userYear.trim()) {
      localStorage.setItem('yester-year-useryear', userYear);
      setShowYearInput(false);
    }
  };

  return (
    <div className="app">
      <div className="mobile-message">
        <p>this experience is best viewed on desktop. please visit on a larger screen.</p>
      </div>
      <h1 className="app-title">The Game of Yesteryear</h1>
      <div
        className="about-container"
        onMouseEnter={() => setShowAbout(true)}
        onMouseLeave={() => setShowAbout(false)}
      >
        <button className="about-toggle">
          about
        </button>
        {showAbout && (
          <div className="about-tooltip">
            <p>This is inspired by John Conway's 1970s mathematical cellular automaton, <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Game of Life</a>.</p>
            <p>The system follows a few simple rules: a cell survives with two or three neighbors, and a new cell appears when there are exactly three. Each configuration grows for thirty seconds before settling into its final form.</p>
            <p>From these constraints, complex patterns can emerge over time. The game became famous for showing how meaning can arise without intention or control.</p>
            <p>This page is a vault of your days. Rate each one from 1–10, with each number mapped to a color. Some days expand into intricate patterns. Others fade quickly, leaving only traces.</p>
            <p>Over time, these cells accumulate into a visual record of our year. I hope we learn from our <span style={{ color: '#0047AB' }}>blues</span> and enjoy our <span style={{ color: '#CCCC00' }}>yellows</span>. Maybe some order will emerge.</p>
            <p>I enjoy taking a moment to watch the cells live, grow, and die.</p>
          </div>
        )}
      </div>
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
              return (
                <div key={memory.id} className="vault-item">
                  <span
                    className="vault-mood"
                    style={{ color: colors[memory.mood] || '#888' }}
                  >
                    {memory.mood}
                  </span>
                  <div className="vault-date">{formatDate(memory.timestamp)}</div>
                </div>
              );
            })
          )}
        </div>
      )}
      <div className="creator-credit">
        created by <a href="https://github.com/marsplain" target="_blank" rel="noopener noreferrer">marsplain</a>
      </div>
    </div>
  );
}

export default App;
