import type { Memory } from '../types';
import Character from './Character';
import PoolScene from './PoolScene';
import './MemoryCanvas.css';

interface MemoryCanvasProps {
  memories: Memory[];
}

const MemoryCanvas = ({ memories }: MemoryCanvasProps) => {
  return (
    <div className="memory-canvas">
      <PoolScene />
      {memories.map((memory) => (
        <Character key={memory.id} memory={memory} />
      ))}
    </div>
  );
};

export default MemoryCanvas;
