import React from 'react';

// Character component interface
interface CharacterProps {
  name: string;
  personality: string;
  voiceType: string;
  energyLevel: number;
  isActive: boolean;
  avatarSrc: string;
}

// Character component for the news desk
const Character: React.FC<CharacterProps> = ({
  name,
  personality,
  voiceType,
  energyLevel,
  isActive,
  avatarSrc
}) => {
  // Character color mapping
  const colorMap: {[key: string]: string} = {
    'Macallan': 'border-character-macallan',
    'Zyx-9': 'border-character-zyx9',
    'The Blob': 'border-character-blob',
    'Glitch': 'border-character-glitch',
    'Chronos': 'border-character-chronos'
  };

  // Animation states based on energy level and active status
  const getAnimationClass = () => {
    if (isActive) return 'animate-bounce-slow';
    if (energyLevel > 7) return 'animate-pulse-slow';
    return '';
  };

  return (
    <div className={`relative ${getAnimationClass()}`}>
      {/* Character avatar */}
      <div className={`w-48 h-48 overflow-hidden rounded-full border-4 ${colorMap[name] || 'border-gray-400'}`}>
        <img 
          src={avatarSrc || '/placeholder-avatar.png'} 
          alt={`${name} character`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Character mouth for lip-sync (will be animated) */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-black rounded-full opacity-0">
        {/* This will be controlled by the lip-sync system */}
      </div>
      
      {/* Character name tag */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-full text-sm font-bold">
        {name}
      </div>
      
      {/* Energy level indicator */}
      <div className="absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
           style={{backgroundColor: `rgba(255, ${Math.min(255, energyLevel * 25)}, 0, 0.8)`}}>
        {energyLevel}
      </div>
      
      {/* Active speaking indicator */}
      {isActive && (
        <div className="absolute top-2 left-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default Character;
