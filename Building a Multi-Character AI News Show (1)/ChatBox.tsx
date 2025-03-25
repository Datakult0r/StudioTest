import React, { useState, useEffect } from 'react';

// ChatBox component for user interaction
interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  messages: {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
  }[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage, messages }) => {
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    onSendMessage(inputMessage);
    setInputMessage('');
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg flex flex-col h-96">
      {/* Chat header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Live Chat</h2>
        <p className="text-gray-400 text-sm">Interact with the show and other viewers</p>
      </div>
      
      {/* Messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center italic">No messages yet. Be the first to chat!</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-baseline mb-1">
                <span className="font-bold text-blue-400">{message.sender}</span>
                <span className="text-gray-500 text-xs ml-2">{formatTime(message.timestamp)}</span>
              </div>
              <p className="text-white bg-gray-800 rounded-lg p-2 inline-block">{message.text}</p>
            </div>
          ))
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 text-white rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
