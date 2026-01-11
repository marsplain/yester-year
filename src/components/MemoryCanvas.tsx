import CellularGrid from './CellularGrid';
import type { GhostLayer } from '../types';
import './MemoryCanvas.css';

interface MemoryCanvasProps {
  currentMood: string | null;
  onSeed: () => void;
  ghostLayers: GhostLayer[];
  onFossilize: (grid: string[][], mood: string) => void;
}

const MemoryCanvas = ({ currentMood, onSeed, ghostLayers, onFossilize }: MemoryCanvasProps) => {
  return (
    <div className="memory-canvas">
      <CellularGrid
        mood={currentMood}
        onSeed={onSeed}
        ghostLayers={ghostLayers}
        onFossilize={onFossilize}
      />
    </div>
  );
};

export default MemoryCanvas;
