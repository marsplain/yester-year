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
}

export type Mood = 'happy' | 'calm' | 'excited' | 'melancholy' | 'peaceful';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'snowy';
export type Activity = 'work' | 'play' | 'rest' | 'create' | 'explore';
