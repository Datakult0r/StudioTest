import React, { useState, useEffect } from 'react';
import NewsShow from '../components/NewsShow';
import ProducerPanel from '../components/ProducerPanel';
import ChatBox from '../components/ChatBox';
import { io } from 'socket.io-client';

export default function Home() {
  const [socket, setSocket] = useState<any>(null);
  const [characters, setCharacters] = useState([
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
  ]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isProducerMode, setIsProducerMode] = useState(false);

  // Connect to socket.io server
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    // Set up event listeners
    newSocket.on('chat_message', (message) => {
      setMessages(prev => [...prev, message]);
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
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Handle energy level change
  const handleEnergyChange = (characterName: string, newLevel: number) => {
    if (socket) {
      socket.emit('character_energy_update', { character: characterName, level: newLevel });
    }
  };
  
  // Handle story injection
  const handleStoryInject = (story: any) => {
    if (socket) {
      socket.emit('inject_story', story);
    }
  };
  
  // Handle chat message send
  const handleSendMessage = (message: string) => {
    if (socket) {
      const newMessage = {
        id: Date.now().toString(),
        sender: 'User',
        text: message,
        timestamp: Date.now()
      };
      
      socket.emit('chat_message', newMessage);
      setMessages(prev => [...prev, newMessage]);
    }
  };
  
  // Toggle producer mode
  const toggleProducerMode = () => {
    setIsProducerMode(!isProducerMode);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI News Show</h1>
        <button 
          onClick={toggleProducerMode}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {isProducerMode ? 'Viewer Mode' : 'Producer Mode'}
        </button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main news show display */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
              <NewsShow initialCharacters={characters} />
            </div>
            
            {/* Producer panel (only visible in producer mode) */}
            {isProducerMode && (
              <div className="mb-6">
                <ProducerPanel 
                  characters={characters.map(char => ({ name: char.name, energyLevel: char.energyLevel }))}
                  onEnergyChange={handleEnergyChange}
                  onStoryInject={handleStoryInject}
                />
              </div>
            )}
          </div>
          
          {/* Chat box */}
          <div className="lg:col-span-1">
            <ChatBox 
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-4 text-center text-gray-400">
        <p>AI News Show &copy; 2025</p>
      </footer>
    </div>
  );
}
