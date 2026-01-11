import { useState } from 'react';
import type { Memory } from '../types';
import './MemoryArchive.css';

interface MemoryArchiveProps {
  memories: Memory[];
  onClose: () => void;
}

const MemoryArchive = ({ memories, onClose }: MemoryArchiveProps) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Vibrant color spectrum: warm/happy → cool/sad
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
