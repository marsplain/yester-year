export interface Memory {
  id: string;
  mood: string;
  season: string;
  weather: string;
  activity: string;
  timestamp: number;
  position: {
    x: number;
    y: number;
  };
  note?: string; // Optional journal entry
  gridSnapshot?: string[][]; // Snapshot of the pattern at fossilization
}

export interface GhostLayer {
  id: string;
  mood: string;
  timestamp: number;
  grid: string[][]; // The fossilized pattern
  opacity: number; // Fades over time
  note?: string;
}

export type Mood = 'happy' | 'calm' | 'excited' | 'melancholy' | 'peaceful';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'snowy';
export type Activity = 'work' | 'play' | 'rest' | 'create' | 'explore';
