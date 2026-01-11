import { useEffect, useRef, useState } from 'react';
import type { GhostLayer } from '../types';
import './CellularGrid.css';

interface CellularGridProps {
  mood: string | null;
  onSeed: () => void;
  ghostLayers: GhostLayer[];
  onFossilize: (grid: string[][], mood: string) => void;
}

const CELL_SIZE = 12;
const COLS = 80;
const ROWS = 50;

const CellularGrid = ({ mood, onSeed, ghostLayers, onFossilize }: CellularGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<string[][]>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(''))
  );
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [birthTime, setBirthTime] = useState<number | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

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

  // Seed the grid when mood changes
  useEffect(() => {
    if (mood) {
      // First, fossilize existing pattern if there is one
      if (currentMood) {
        const hasLivingCells = grid.some(row => row.some(cell => cell !== ''));
        if (hasLivingCells) {
          const snapshot = grid.map(row => [...row]);
          onFossilize(snapshot, currentMood);
        }
      }

      const newGrid = grid.map(row => [...row]);
      const centerX = Math.floor(COLS / 2);
      const centerY = Math.floor(ROWS / 2);

      // Create initial pattern
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          const x = centerX + i;
          const y = centerY + j;
          if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
            if (Math.random() > 0.3) {
              newGrid[y][x] = mood;
            }
          }
        }
      }
      setGrid(newGrid);
      setCurrentMood(mood);
      setBirthTime(Date.now());
      onSeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  // Fossilize pattern after 30 seconds
  useEffect(() => {
    if (!birthTime || !currentMood) return;

    const fossilizeTimer = setTimeout(() => {
      // Capture current grid state at the time of timeout
      setGrid(currentGrid => {
        const hasLivingCells = currentGrid.some(row => row.some(cell => cell !== ''));
        if (hasLivingCells) {
          const snapshot = currentGrid.map(row => [...row]);
          onFossilize(snapshot, currentMood);
        }
        return currentGrid;
      });

      // Reset tracking
      setCurrentMood(null);
      setBirthTime(null);
    }, 30000); // 30 seconds

    return () => clearTimeout(fossilizeTimer);
  }, [birthTime, currentMood, onFossilize]);

  // Evolution loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);

        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            const neighbors = countNeighbors(prevGrid, x, y);
            const cell = prevGrid[y][x];

            // Conway's Game of Life rules with color propagation
            if (cell) {
              // Cell is alive
              if (neighbors < 2 || neighbors > 3) {
                newGrid[y][x] = ''; // Dies
              }
            } else {
              // Cell is dead
              if (neighbors === 3) {
                // Birth - inherit color from neighbors
                newGrid[y][x] = getNeighborColor(prevGrid, x, y);
              }
            }
          }
        }

        return newGrid;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const countNeighbors = (grid: string[][], x: number, y: number): number => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newY = y + i;
        const newX = x + j;
        if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
          if (grid[newY][newX]) count++;
        }
      }
    }
    return count;
  };

  const getNeighborColor = (grid: string[][], x: number, y: number): string => {
    const neighborColors: string[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newY = y + i;
        const newX = x + j;
        if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
          if (grid[newY][newX]) neighborColors.push(grid[newY][newX]);
        }
      }
    }
    return neighborColors[Math.floor(Math.random() * neighborColors.length)] || '';
  };

  // Render grid to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ghost layers first (oldest to newest)
    ghostLayers.forEach(layer => {
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const cell = layer.grid[y]?.[x];
          if (cell) {
            const color = colors[cell] || '#FFFFFF';
            ctx.globalAlpha = layer.opacity * 0.3; // Ghost layers are translucent
            ctx.fillStyle = color;
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
    });

    // Draw current living cells at full opacity
    ctx.globalAlpha = 1.0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
        if (cell) {
          ctx.fillStyle = colors[cell] || '#FFFFFF';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
  }, [grid, ghostLayers, colors]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
      const cellMood = grid[y][x];
      if (cellMood) {
        setHoveredMood(cellMood);
        setTooltipPos({ x: e.clientX, y: e.clientY });
        return;
      }

      // Check ghost layers
      for (let i = ghostLayers.length - 1; i >= 0; i--) {
        const ghostMood = ghostLayers[i].grid[y]?.[x];
        if (ghostMood) {
          setHoveredMood(ghostMood);
          setTooltipPos({ x: e.clientX, y: e.clientY });
          return;
        }
      }
    }

    setHoveredMood(null);
    setTooltipPos(null);
  };

  const handleMouseLeave = () => {
    setHoveredMood(null);
    setTooltipPos(null);
  };

  return (
    <div className="cellular-grid">
      <canvas
        ref={canvasRef}
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
        className="grid-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredMood && tooltipPos && (
        <div
          className="cell-tooltip"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y + 10,
          }}
        >
          {hoveredMood}
        </div>
      )}
    </div>
  );
};

export default CellularGrid;
