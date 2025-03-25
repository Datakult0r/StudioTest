import React, { useState, useEffect } from 'react';
import Character from './Character';
import CharacterDialogue from './CharacterDialogue';
import { io } from 'socket.io-client';

// Main NewsShow component that brings everything together
interface NewsShowProps {
  initialCharacters?: {
    name: string;
    personality: string;
    voiceType: string;
    energyLevel: number;
    avatarSrc: string;
  }[];
}

const NewsShow: React.FC<NewsShowProps> = ({ 
  initialCharacters = [
    {
      name: 'Macallan',
      personality: 'witty, ironic, narcissistic, somewhat inebriated',
      voiceType: 'echo',
      energyLevel: 5,
      avatarSrc: '/characters/macallan.png'
    },
    {
      name: 'Zyx-9',
      personality: 'mind-bending, half-sarcastic, mad scientist logic',
      voiceType: 'shimmer',
      energyLevel: 5,
      avatarSrc: '/characters/zyx9.png'
    },
    {
      name: 'The Blob',
      personality: 'confused alien, comedic relief, naive',
      voiceType: 'alloy',
      energyLevel: 5,
      avatarSrc: '/characters/blob.png'
    },
    {
      name: 'Glitch',
      personality: 'digital conspiracy theorist, paranoid, insider knowledge',
      voiceType: 'fable',
      energyLevel: 5,
      avatarSrc: '/characters/glitch.png'
    },
    {
      name: 'Chronos',
      personality: 'time-traveling historian, formal, scholarly',
      voiceType: 'nova',
      energyLevel: 5,
      avatarSrc: '/characters/chronos.png'
    }
  ]
}) => {
  const [socket, setSocket] = useState<any>(null);
  const [characters, setCharacters] = useState(initialCharacters.map(char => ({
    ...char,
    isActive: false
  })));
  const [currentNews, setCurrentNews] = useState<any>(null);
  const [newsQueue, setNewsQueue] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  
  // Connect to socket.io server
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Connected to news show server');
      setIsLive(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from news show server');
      setIsLive(false);
    });
    
    newSocket.on('show_state_update', (data) => {
      updateShowState(data);
    });
    
    newSocket.on('character_speaking', (data) => {
      handleCharacterSpeaking(data);
    });
    
    newSocket.on('character_energy_updated', (data) => {
      handleEnergyUpdate(data);
    });
    
    newSocket.on('news_queue_updated', (data) => {
      setNewsQueue(data);
    });
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Update show state based on server data
  const updateShowState = (data) => {
    const { currentNews, speakingCharacter, characterStates, newsQueue } = data;
    
    setCurrentNews(currentNews);
    setNewsQueue(newsQueue);
    
    // Update character states
    setCharacters(prevCharacters => 
      prevCharacters.map(char => ({
        ...char,
        isActive: char.name === speakingCharacter,
        energyLevel: characterStates[char.name]?.energyLevel || char.energyLevel
      }))
    );
  };
  
  // Handle character speaking event
  const handleCharacterSpeaking = (data) => {
    const { character, newsItem } = data;
    
    setCurrentNews(newsItem);
    
    // Update character states
    setCharacters(prevCharacters => 
      prevCharacters.map(char => ({
        ...char,
        isActive: char.name === character
      }))
    );
  };
  
  // Handle energy level update
  const handleEnergyUpdate = (data) => {
    const { character, level } = data;
    
    setCharacters(prevCharacters => 
      prevCharacters.map(char => 
        char.name === character 
          ? { ...char, energyLevel: level } 
          : char
      )
    );
  };
  
  // Handle speech completion
  const handleSpeechComplete = (characterName) => {
    if (socket) {
      socket.emit('speech_completed', { character: characterName });
    }
  };
  
  // Update character energy level
  const handleEnergyLevelChange = (characterName, newLevel) => {
    if (socket) {
      socket.emit('character_energy_update', { character: characterName, level: newLevel });
    }
  };
  
  // Inject a custom story
  const handleStoryInject = (story) => {
    if (socket) {
      socket.emit('inject_story', story);
    }
  };
  
  return (
    <div className="news-show relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {/* Status indicator */}
      <div className={`absolute top-2 left-2 flex items-center z-10 ${isLive ? 'text-green-500' : 'text-red-500'}`}>
        <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mr-2`}></div>
        <span className="text-sm font-bold">{isLive ? 'LIVE' : 'OFFLINE'}</span>
      </div>
      
      {/* News desk background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-gray-900"></div>
      
      {/* Breaking news banner */}
      {currentNews && (
        <div className="absolute top-10 left-0 right-0 bg-red-600 py-2 px-4 text-white font-bold">
          BREAKING: {currentNews.title}
        </div>
      )}
      
      {/* Characters */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-around items-end">
        {characters.map((character, index) => (
          <div key={index} className="relative">
            <Character
              name={character.name}
              personality={character.personality}
              voiceType={character.voiceType}
              energyLevel={character.energyLevel}
              isActive={character.isActive}
              avatarSrc={character.avatarSrc}
            />
            
            {/* Character dialogue */}
            {character.isActive && currentNews && (
              <CharacterDialogue
                character={character}
                newsItem={currentNews}
                isActive={character.isActive}
                onSpeechComplete={() => handleSpeechComplete(character.name)}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* News network logo */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-20 p-2 rounded z-10">
        <span className="text-white font-bold">AI NEWS NETWORK</span>
      </div>
      
      {/* News queue indicator */}
      {newsQueue.length > 0 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-2 rounded z-10">
          <span className="text-white text-sm">{newsQueue.length} stories in queue</span>
        </div>
      )}
    </div>
  );
};

export default NewsShow;
