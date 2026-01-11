import { useState } from 'react';
import type { Memory } from '../types';
import './MemoryArchive.css';

interface MemoryArchiveProps {
  memories: Memory[];
  onClose: () => void;
}

const MemoryArchive = ({ memories, onClose }: MemoryArchiveProps) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Deep, rich retro colors - matching CellularGrid
  const colors: Record<string, string> = {
    effervescent: '#FFD700',      // bright gold
    joyful: '#FFA500',            // warm orange
    warm: '#DC143C',              // crimson red
    golden: '#DAA520',            // goldenrod
    tender: '#D63384',            // deep pink
    soft: '#3CB371',              // medium sea green
    dreamy: '#9932CC',            // dark orchid
    quiet: '#4682B4',             // steel blue
    nostalgic: '#CD5C5C',         // indian red
    restless: '#5F9EA0',          // cadet blue
    aching: '#C44569',            // deep rose red
    heavy: '#696969',             // dim gray
    melancholic: '#0047AB',       // cobalt blue
    hollow: '#4169E1',            // royal blue
    raw: '#8B0000',               // dark red
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const sortedMemories = [...memories].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="memory-archive">
      <div className="archive-overlay" onClick={onClose} />
      <div className="archive-content">
        <div className="archive-header">
          <h2>memory vault</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="archive-list">
          {sortedMemories.length === 0 ? (
            <p className="empty-message">no memories yet. create your first moment.</p>
          ) : (
            sortedMemories.map((memory) => (
              <div
                key={memory.id}
                className={`memory-item ${selectedMemory?.id === memory.id ? 'selected' : ''}`}
                onClick={() => setSelectedMemory(memory)}
              >
                <div
                  className="memory-mood"
                  style={{ color: colors[memory.mood] || '#666' }}
                >
                  {memory.mood}
                </div>
                <div className="memory-date">{formatDate(memory.timestamp)}</div>
                {memory.note && <div className="memory-note">"{memory.note}"</div>}
              </div>
            ))
          )}
        </div>
        {selectedMemory && selectedMemory.note && (
          <div className="memory-detail">
            <div
              className="detail-mood"
              style={{ color: colors[selectedMemory.mood] || '#666' }}
            >
              {selectedMemory.mood}
            </div>
            <div className="detail-date">{formatDate(selectedMemory.timestamp)}</div>
            <div className="detail-note">"{selectedMemory.note}"</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryArchive;
