import { useState, useEffect } from 'react';
import type { Memory } from '../types';

const STORAGE_KEY = 'yester-year-memories';

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load memories from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMemories(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading memories:', error);
      }
    }
    setLoading(false);
  }, []);

  const addMemory = (memoryData: Omit<Memory, 'id'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: Date.now().toString(),
    };

    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
  };

  return { memories, loading, addMemory };
};
