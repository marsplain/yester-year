import './PoolScene.css';

const PoolScene = () => {
  return (
    <div className="pool-scene">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 2000 1400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background - warm cream */}
        <rect x="0" y="0" width="2000" height="1400" fill="#FFF8F0" />

        {/* Pool - organic painted shape */}
        <path
          d="M 720,700 Q 850,630 1000,640 Q 1150,650 1280,710 Q 1300,780 1270,850 Q 1100,900 1000,890 Q 900,880 750,840 Q 700,770 720,700 Z"
          fill="#5AB9EA"
          opacity="0.65"
        />

        {/* Pool inner organic shape */}
        <path
          d="M 800,720 Q 900,680 1000,685 Q 1100,690 1180,730 Q 1190,780 1170,820 Q 1050,850 1000,845 Q 950,840 850,810 Q 790,760 800,720 Z"
          fill="#87CEEB"
          opacity="0.35"
        />

        {/* Organic plant shapes - left */}
        <ellipse cx="200" cy="305" rx="38" ry="42" fill="#88C580" opacity="0.55" />
        <ellipse cx="225" cy="322" rx="30" ry="35" fill="#6FAF68" opacity="0.5" />

        {/* Organic plant shapes - right */}
        <ellipse cx="1780" cy="285" rx="35" ry="38" fill="#88C580" opacity="0.55" />
        <ellipse cx="1755" cy="308" rx="28" ry="32" fill="#6FAF68" opacity="0.5" />

        {/* Subtle organic accents */}
        <ellipse cx="1450" cy="1005" rx="24" ry="20" fill="#FF7F50" opacity="0.45" />
        <ellipse cx="380" cy="905" rx="26" ry="22" fill="#FF85A1" opacity="0.45" />
        <ellipse cx="1550" cy="522" rx="16" ry="13" fill="#FFD700" opacity="0.38" />
      </svg>
    </div>
  );
};

export default PoolScene;
