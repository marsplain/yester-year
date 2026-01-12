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
  const [immortalCell, setImmortalCell] = useState<{ x: number; y: number; mood: string } | null>(null);
  const [composition, setComposition] = useState<Record<string, number>>({});

  // Vibrant color spectrum: 1 (coldest) → 10 (warmest)
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

      // Create larger initial pattern for longer-lasting evolution
      const aliveCells: { x: number; y: number }[] = [];
      for (let i = -5; i <= 5; i++) {
        for (let j = -5; j <= 5; j++) {
          const x = centerX + i;
          const y = centerY + j;
          if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
            if (Math.random() > 0.4) {
              newGrid[y][x] = mood;
              aliveCells.push({ x, y });
            }
          }
        }
      }

      // Select one random cell to be immortal
      if (aliveCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * aliveCells.length);
        const immortal = aliveCells[randomIndex];
        setImmortalCell({ x: immortal.x, y: immortal.y, mood });
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
        // Always fossilize, even if pattern died out (immortal cell guarantees at least one cell)
        const snapshot = currentGrid.map(row => [...row]);
        onFossilize(snapshot, currentMood);
        return currentGrid;
      });

      // Reset tracking and clear immortal cell
      setCurrentMood(null);
      setBirthTime(null);
      setImmortalCell(null);
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
            // Check if this is the immortal cell - if so, skip evolution rules
            if (immortalCell && x === immortalCell.x && y === immortalCell.y) {
              // Immortal cell always stays alive with its original mood
              newGrid[y][x] = immortalCell.mood;
              continue;
            }

            const neighbors = countNeighbors(prevGrid, x, y);
            const cell = prevGrid[y][x];

            // HighLife rules: more stable and creates beautiful patterns
            // Survival: 2 or 3 neighbors (same as Conway)
            // Birth: 3 or 6 neighbors (extended from Conway's 3)
            if (cell) {
              // Cell is alive
              if (neighbors < 2 || neighbors > 3) {
                newGrid[y][x] = ''; // Dies
              }
            } else {
              // Cell is dead
              if (neighbors === 3 || neighbors === 6) {
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
  }, [immortalCell]);

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

    // Calculate composition from all layers (ghost + current)
    const moodCounts: Record<string, number> = {};
    let totalCells = 0;

    // Count ghost layer cells
    ghostLayers.forEach(layer => {
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const cell = layer.grid[y]?.[x];
          if (cell) {
            moodCounts[cell] = (moodCounts[cell] || 0) + 1;
            totalCells++;
          }
        }
      }
    });

    // Count current living cells
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
        if (cell) {
          moodCounts[cell] = (moodCounts[cell] || 0) + 1;
          totalCells++;
        }
      }
    }

    // Calculate percentages
    const newComposition: Record<string, number> = {};
    if (totalCells > 0) {
      Object.keys(moodCounts).forEach(mood => {
        newComposition[mood] = (moodCounts[mood] / totalCells) * 100;
      });
    }
    setComposition(newComposition);

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

  // Sort composition by percentage descending
  const sortedComposition = Object.entries(composition)
    .sort(([, a], [, b]) => b - a)
    .filter(([, percentage]) => percentage > 0);

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
      {sortedComposition.length > 0 && (
        <div className="composition-bar">
          {sortedComposition.map(([mood, percentage]) => (
            <div
              key={mood}
              className="composition-segment"
              style={{
                width: `${percentage}%`,
                backgroundColor: colors[mood] || '#FFFFFF',
              }}
              data-mood={`${mood} (${percentage.toFixed(1)}%)`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CellularGrid;
