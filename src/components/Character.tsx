import type { Memory } from '../types';
import './Character.css';

interface CharacterProps {
  memory: Memory;
}

const Character = ({ memory }: CharacterProps) => {
  const getCharacterColor = () => {
    // More vibrant, saturated colors inspired by Fine Little Day
    const colors = {
      luminous: '#FFF176',
      tender: '#FFB6C1',
      fleeting: '#E8D5C4',
      golden: '#FFD700',
      serene: '#87CEEB',
      wistful: '#C9ADA7',
      ethereal: '#E6E6FA',
      gentle: '#D4E7C5',
      radiant: '#FFD93D',
      quiet: '#B0C4C0',
      vivid: '#FF6347',
      soft: '#F5DEB3',
      dreamy: '#DDA0DD',
      warm: '#FF7F50',
      melancholy: '#9B6B9E',
      peaceful: '#88C580',
      nostalgic: '#D8A48F',
      whimsical: '#FF69B4',
      hushed: '#C5C9C7',
      brilliant: '#FFE600',
      mellow: '#F4A460',
      tranquil: '#7EC8E3',
      delicate: '#FADADD',
      boundless: '#4FC3F7',
    };
    return colors[memory.mood as keyof typeof colors] || '#7EC8E3';
  };

  const getSeasonAccent = () => {
    const accents = {
      spring: '#FF85A1',
      summer: '#FFEB3B',
      fall: '#E67E22',
      winter: '#64B5F6',
    };
    return accents[memory.season as keyof typeof accents] || '#FFEB3B';
  };

  const getSkinTone = () => {
    const tones = ['#F4B8A4', '#E8A892', '#D9967A', '#C48860', '#A87855'];
    return tones[Math.floor(Math.random() * tones.length)];
  };

  const getCharacterShape = () => {
    const skinTone = getSkinTone();
    const color = getCharacterColor();
    const accent = getSeasonAccent();

    // Organic, painterly shapes - imperfect like hand-painted
    return (
      <g>
        {/* Head - organic circle */}
        <ellipse cx="40" cy="20" rx="10" ry="11" fill={skinTone} />

        {/* Body - organic painted shape */}
        <path
          d="M 28,31 Q 27,35 28,40 L 29,55 Q 30,59 35,58 L 45,58 Q 50,59 51,55 L 52,40 Q 53,35 52,31 Z"
          fill={color}
        />

        {/* Arms - organic shapes */}
        <ellipse cx="23" cy="42" rx="3.5" ry="9" fill={color} />
        <ellipse cx="57" cy="42" rx="3.5" ry="9" fill={color} />

        {/* Legs - organic shapes */}
        <ellipse cx="34" cy="66" rx="3" ry="9" fill={skinTone} />
        <ellipse cx="46" cy="66" rx="3" ry="9" fill={skinTone} />

        {/* Small accent detail */}
        <ellipse cx="40" cy="43" rx="2.5" ry="2" fill={accent} opacity="0.7" />
      </g>
    );
  };

  const getWeatherElement = () => {
    const weather = {
      sunny: (
        <circle cx="10" cy="10" r="8" fill="#FFE66D" opacity="0.7" />
      ),
      rainy: (
        <g>
          <ellipse cx="12" cy="8" rx="6" ry="4" fill="#6C9BD1" opacity="0.5" />
          <line x1="8" y1="14" x2="6" y2="20" stroke="#6C9BD1" strokeWidth="2" opacity="0.6" />
          <line x1="14" y1="14" x2="12" y2="20" stroke="#6C9BD1" strokeWidth="2" opacity="0.6" />
        </g>
      ),
      cloudy: (
        <ellipse cx="12" cy="10" rx="10" ry="6" fill="#D4D4D4" opacity="0.6" />
      ),
      snowy: (
        <g>
          <circle cx="8" cy="8" r="3" fill="#E8F4F8" opacity="0.8" />
          <circle cx="16" cy="10" r="3" fill="#E8F4F8" opacity="0.8" />
          <circle cx="12" cy="14" r="2" fill="#E8F4F8" opacity="0.8" />
        </g>
      ),
    };
    return weather[memory.weather as keyof typeof weather] || null;
  };

  return (
    <div
      className="character"
      style={{
        left: `${memory.position.x}%`,
        top: `${memory.position.y}%`,
      }}
    >
      <svg
        width="100"
        height="80"
        viewBox="0 0 100 80"
        className="character-svg"
      >
        {getWeatherElement()}
        {getCharacterShape()}
      </svg>
    </div>
  );
};

export default Character;
