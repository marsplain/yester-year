import { useState, useEffect, useCallback } from 'react';
import type { GhostLayer, Memory } from '../types';

const GHOST_LAYERS_KEY = 'yester-year-ghost-layers';
const MEMORIES_KEY = 'yester-year-memories';

export const useGhostLayers = () => {
  const [ghostLayers, setGhostLayers] = useState<GhostLayer[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    console.log('Loading from localStorage...');
    const storedLayers = localStorage.getItem(GHOST_LAYERS_KEY);
    const storedMemories = localStorage.getItem(MEMORIES_KEY);

    console.log('Stored layers:', storedLayers ? JSON.parse(storedLayers).length : 0);
    console.log('Stored memories:', storedMemories ? JSON.parse(storedMemories).length : 0);

    if (storedLayers) {
      try {
        const parsed = JSON.parse(storedLayers);
        console.log('Loaded ghost layers:', parsed.length);
        setGhostLayers(parsed);
      } catch (e) {
        console.error('Failed to parse ghost layers:', e);
      }
    }

    if (storedMemories) {
      try {
        const parsed = JSON.parse(storedMemories);
        console.log('Loaded memories:', parsed.length);
        setMemories(parsed);
      } catch (e) {
        console.error('Failed to parse memories:', e);
      }
    }
  }, []);

  // Save to localStorage whenever ghost layers change
  useEffect(() => {
    console.log('Saving ghost layers to localStorage:', ghostLayers.length);
    localStorage.setItem(GHOST_LAYERS_KEY, JSON.stringify(ghostLayers));
  }, [ghostLayers]);

  // Save to localStorage whenever memories change
  useEffect(() => {
    console.log('Saving memories to localStorage:', memories.length);
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  }, [memories]);

  // Update ghost layer opacities based on age (every hour)
  useEffect(() => {
    const updateOpacities = () => {
      const now = Date.now();
      setGhostLayers(prev =>
        prev.map(layer => {
          const ageInDays = (now - layer.timestamp) / (1000 * 60 * 60 * 24);
          let newOpacity = 1.0;

          if (ageInDays > 90) {
            newOpacity = 0.2;
          } else if (ageInDays > 60) {
            newOpacity = 0.4;
          } else if (ageInDays > 30) {
            newOpacity = 0.6;
          } else if (ageInDays > 14) {
            newOpacity = 0.8;
          }

          return { ...layer, opacity: newOpacity };
        })
      );
    };

    // Update opacities every hour
    const interval = setInterval(updateOpacities, 1000 * 60 * 60);

    // Also update on mount
    updateOpacities();

    return () => clearInterval(interval);
  }, []);

  const addGhostLayer = useCallback((grid: string[][], mood: string, note?: string) => {
    const now = Date.now();

    // Calculate age-based opacity for existing layers
    setGhostLayers(prev => {
      const updated = prev.map(layer => {
        const ageInDays = (now - layer.timestamp) / (1000 * 60 * 60 * 24);
        let newOpacity = 1.0;

        // Fade layers over time (living canvas of the year)
        if (ageInDays > 90) {
          // After 3 months: fade to 20%
          newOpacity = 0.2;
        } else if (ageInDays > 60) {
          // After 2 months: fade to 40%
          newOpacity = 0.4;
        } else if (ageInDays > 30) {
          // After 1 month: fade to 60%
          newOpacity = 0.6;
        } else if (ageInDays > 14) {
          // After 2 weeks: fade to 80%
          newOpacity = 0.8;
        }

        return { ...layer, opacity: newOpacity };
      });

      // Add new layer at full opacity
      const newLayer: GhostLayer = {
        id: now.toString(),
        mood,
        timestamp: now,
        grid: grid.map(row => [...row]),
        opacity: 1.0,
        note,
      };

      console.log('Adding ghost layer:', newLayer.mood, 'with note:', note);
      const final = [...updated, newLayer];
      console.log('Total ghost layers:', final.length);
      return final;
    });

    // Also create a memory entry
    const newMemory: Memory = {
      id: now.toString(),
      mood,
      season: 'spring',
      weather: 'sunny',
      activity: 'rest',
      timestamp: now,
      position: { x: 50, y: 50 },
      note,
      gridSnapshot: grid.map(row => [...row]),
    };

    console.log('Adding memory:', newMemory.mood);
    setMemories(prev => {
      const updated = [...prev, newMemory];
      console.log('Total memories:', updated.length);
      return updated;
    });
  }, []);

  const updateGhostLayer = useCallback((grid: string[][], mood: string) => {
    setGhostLayers(prev => {
      const layerIndex = prev.findIndex(layer => layer.mood === mood && !layer.grid.some(row => row.some(cell => cell !== '')));
      if (layerIndex !== -1) {
        const updated = [...prev];
        updated[layerIndex] = {
          ...updated[layerIndex],
          grid: grid.map(row => [...row]),
        };
        console.log('Updated ghost layer grid for:', mood);
        return updated;
      }
      return prev;
    });

    setMemories(prev => {
      const memoryIndex = prev.findIndex(memory => memory.mood === mood && memory.gridSnapshot && !memory.gridSnapshot.some(row => row.some(cell => cell !== '')));
      if (memoryIndex !== -1) {
        const updated = [...prev];
        updated[memoryIndex] = {
          ...updated[memoryIndex],
          gridSnapshot: grid.map(row => [...row]),
        };
        console.log('Updated memory grid for:', mood);
        return updated;
      }
      return prev;
    });
  }, []);

  const clearAllLayers = useCallback(() => {
    setGhostLayers([]);
    setMemories([]);
    localStorage.removeItem(GHOST_LAYERS_KEY);
    localStorage.removeItem(MEMORIES_KEY);
  }, []);

  return {
    ghostLayers,
    memories,
    addGhostLayer,
    updateGhostLayer,
    clearAllLayers,
  };
};
