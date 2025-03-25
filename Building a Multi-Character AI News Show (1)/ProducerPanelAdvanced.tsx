// Enhanced producer panel with authentication
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// ProducerPanelAdvanced component with authentication and enhanced controls
interface ProducerPanelAdvancedProps {
  initialCharacters: {
    name: string;
    energyLevel: number;
  }[];
}

const ProducerPanelAdvanced: React.FC<ProducerPanelAdvancedProps> = ({ 
  initialCharacters 
}) => {
  const [socket, setSocket] = useState<any>(null);
  const [characters, setCharacters] = useState(initialCharacters);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storySummary, setStorySummary] = useState('');
  const [storyCategory, setStoryCategory] = useState('Technology');
  const [storySource, setStorySource] = useState('Producer');
  const [isExpanded, setIsExpanded] = useState(true);
  const [newsQueue, setNewsQueue] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Connect to socket.io server
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    // Set up event listeners
    newSocket.on('news_queue_updated', (data) => {
      setNewsQueue(data);
    });
    
    newSocket.on('character_energy_updated', (data) => {
      const { character, level } = data;
      
      setCharacters(prevCharacters => 
        prevCharacters.map(char => 
          char.name === character 
            ? { ...char, energyLevel: level } 
            : char
        )
      );
    });
    
    newSocket.on('show_state_update', (data) => {
      if (data.newsQueue) {
        setNewsQueue(data.newsQueue);
      }
      
      if (data.characterStates) {
        setCharacters(prevCharacters => 
          prevCharacters.map(char => ({
            ...char,
            energyLevel: data.characterStates[char.name]?.energyLevel || char.energyLevel
          }))
        );
      }
    });
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Handle authentication
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication for demo purposes
    // In production, this would use a secure authentication system
    if (password === 'producer123') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid password');
    }
  };
  
  // Handle energy level change
  const handleEnergyChange = (characterName: string, newLevel: number) => {
    if (socket) {
      socket.emit('character_energy_update', { character: characterName, level: newLevel });
      
      // Show success message
      setSuccessMessage(`Updated ${characterName}'s energy level to ${newLevel}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };
  
  // Handle story injection
  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyTitle || !storySummary) {
      setError('Title and summary are required');
      return;
    }
    
    if (socket) {
      const story = {
        title: storyTitle,
        summary: storySummary,
        category: storyCategory,
        source: storySource,
        isCustom: true
      };
      
      socket.emit('inject_story', story);
      
      // Reset form
      setStoryTitle('');
      setStorySummary('');
      
      // Show success message
      setSuccessMessage('Story added to queue successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };
  
  // Handle story removal from queue
  const handleRemoveStory = (index: number) => {
    if (socket) {
      socket.emit('remove_story', { index });
    }
  };
  
  // Handle emergency stop
  const handleEmergencyStop = () => {
    if (socket) {
      socket.emit('emergency_stop');
      
      // Show success message
      setSuccessMessage('Emergency stop triggered - all characters will stop speaking');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Producer Authentication</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuthenticate}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Producer Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="Enter producer password"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Access Producer Panel
          </button>
        </form>
        
        <p className="text-gray-500 text-sm mt-4 text-center">
          For demo purposes, use password: producer123
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* Header with toggle */}
      <div 
        className="bg-gray-800 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Producer Control Panel
        </h2>
        <button className="text-gray-400 hover:text-white">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-600 text-white p-3">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-600 text-white p-3">
          {error}
        </div>
      )}
      
      {/* Panel content - hidden when collapsed */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Character Energy Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-white mb-4 border-b border-gray-700 pb-2">Character Energy Levels</h3>
              <div className="space-y-4">
                {characters.map((character, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-24 text-white">{character.name}</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={character.energyLevel}
                      onChange={(e) => handleEnergyChange(character.name, parseInt(e.target.value))}
                      className="flex-grow mx-2 energy-slider"
                    />
                    <span className="w-8 text-center text-white">{character.energyLevel}</span>
                  </div>
                ))}
              </div>
              
              {/* Emergency stop button */}
              <button 
                onClick={handleEmergencyStop}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Emergency Stop
              </button>
            </div>
            
            {/* Story Injection */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-white mb-4 border-b border-gray-700 pb-2">Inject Custom Story</h3>
              <form onSubmit={handleStorySubmit}>
                <div className="mb-3">
                  <label className="block text-gray-400 mb-1">Title</label>
                  <input 
                    type="text"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    placeholder="Breaking news headline..."
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-400 mb-1">Summary</label>
                  <textarea 
                    value={storySummary}
                    onChange={(e) => setStorySummary(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 h-20"
                    placeholder="News story details..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Category</label>
                    <select 
                      value={storyCategory}
                      onChange={(e) => setStoryCategory(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    >
                      <option>Technology</option>
                      <option>AI</option>
                      <option>Science</option>
                      <option>Futurology</option>
                      <option>Entertainment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-1">Source</label>
                    <input 
                      type="text"
                      value={storySource}
                      onChange={(e) => setStorySource(e.target.value)}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Story to Queue
                </button>
              </form>
            </div>
          </div>
          
          {/* News Queue */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold text-white mb-4 border-b border-gray-700 pb-2">News Queue</h3>
            
            {newsQueue.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No stories in queue</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {newsQueue.map((story, index) => (
                  <div key={index} className="bg-gray-700 rounded p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">{story.title}</h4>
                      <p className="text-sm text-gray-400">{story.category} • {story.source}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveStory(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerPanelAdvanced;
