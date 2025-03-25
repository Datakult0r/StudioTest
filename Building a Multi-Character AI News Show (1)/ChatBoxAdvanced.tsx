// Enhanced chat functionality for AI News Show
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// ChatBoxAdvanced component with enhanced functionality
interface ChatBoxAdvancedProps {
  initialMessages?: {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    isCharacter?: boolean;
    character?: string;
  }[];
}

const ChatBoxAdvanced: React.FC<ChatBoxAdvancedProps> = ({ 
  initialMessages = [] 
}) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Connect to socket.io server
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });
    
    newSocket.on('chat_message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    newSocket.on('character_message', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        isCharacter: true
      }]);
    });
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle username submission
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };
  
  // Handle message submission
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() && socket) {
      const message = {
        id: Date.now().toString(),
        sender: username,
        text: newMessage,
        timestamp: Date.now()
      };
      
      socket.emit('chat_message', message);
      setNewMessage('');
    }
  };
  
  // Get formatted time from timestamp
  const getFormattedTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // If username not set, show username form
  if (!isUsernameSet) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 h-full flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Join the Chat</h2>
        
        <form onSubmit={handleUsernameSubmit} className="mt-auto">
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Your Name</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="Enter your name"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Chat
          </button>
        </form>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Live Chat</h2>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
          <span className="text-sm text-gray-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto mb-4 scrollbar-thin">
        <div className="space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg ${
                message.isCharacter 
                  ? 'bg-indigo-900 border-l-4 border-indigo-500' 
                  : message.sender === username 
                    ? 'bg-blue-800' 
                    : 'bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-bold ${
                  message.isCharacter 
                    ? 'text-indigo-300' 
                    : message.sender === username 
                      ? 'text-blue-300' 
                      : 'text-gray-300'
                }`}>
                  {message.isCharacter ? `${message.character} (AI)` : message.sender}
                </span>
                <span className="text-xs text-gray-500">
                  {getFormattedTime(message.timestamp)}
                </span>
              </div>
              <p className="text-white mt-1">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <form onSubmit={handleMessageSubmit} className="mt-auto">
        <div className="flex">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-gray-700 text-white rounded-l px-3 py-2"
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-r"
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBoxAdvanced;
