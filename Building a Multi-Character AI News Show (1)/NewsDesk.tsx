import React from 'react';

// NewsDesk component to display all characters
interface NewsDeskProps {
  characters: {
    name: string;
    personality: string;
    voiceType: string;
    energyLevel: number;
    isActive: boolean;
    avatarSrc: string;
  }[];
  currentNews: {
    title: string;
    summary: string;
    category: string;
    source: string;
  } | null;
}

const NewsDesk: React.FC<NewsDeskProps> = ({ characters, currentNews }) => {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      {/* News desk background */}
      <div className="absolute inset-0 bg-[url('/news-desk-bg.jpg')] bg-cover bg-center opacity-40"></div>
      
      {/* News desk table */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-900 to-blue-800 opacity-80"></div>
      
      {/* Breaking news banner */}
      {currentNews && (
        <div className="absolute top-4 left-0 right-0 bg-news-red py-2 px-4 text-white font-bold text-lg">
          BREAKING: {currentNews.title}
        </div>
      )}
      
      {/* Character positions */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-around items-end">
        {/* This will be replaced with actual Character components */}
        {characters.map((character, index) => (
          <div key={index} className="text-center">
            <div className={`w-24 h-24 rounded-full bg-gray-700 mx-auto mb-2 ${character.isActive ? 'ring-2 ring-green-500' : ''}`}>
              {/* Character avatar placeholder */}
            </div>
            <div className="text-white font-bold">{character.name}</div>
          </div>
        ))}
      </div>
      
      {/* Network logo */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-20 p-2 rounded">
        <span className="text-white font-bold">AI NEWS NETWORK</span>
      </div>
      
      {/* Time display */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded">
        <span className="text-white">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default NewsDesk;
