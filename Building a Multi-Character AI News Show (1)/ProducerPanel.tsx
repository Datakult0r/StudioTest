import React, { useState } from 'react';

// ProducerPanel component for controlling the news show
interface ProducerPanelProps {
  characters: {
    name: string;
    energyLevel: number;
  }[];
  onEnergyChange: (characterName: string, newLevel: number) => void;
  onStoryInject: (story: { title: string; summary: string; category: string; source: string }) => void;
}

const ProducerPanel: React.FC<ProducerPanelProps> = ({ 
  characters, 
  onEnergyChange, 
  onStoryInject 
}) => {
  const [storyTitle, setStoryTitle] = useState('');
  const [storySummary, setStorySummary] = useState('');
  const [storyCategory, setStoryCategory] = useState('Technology');
  const [storySource, setStorySource] = useState('AI News Network');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle story injection
  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storySummary) return;
    
    onStoryInject({
      title: storyTitle,
      summary: storySummary,
      category: storyCategory,
      source: storySource
    });
    
    // Reset form
    setStoryTitle('');
    setStorySummary('');
  };
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* Header with toggle */}
      <div 
        className="bg-gray-800 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Producer Panel
        </h2>
        <button className="text-gray-400 hover:text-white">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
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
                      onChange={(e) => onEnergyChange(character.name, parseInt(e.target.value))}
                      className="flex-grow mx-2"
                    />
                    <span className="w-8 text-center text-white">{character.energyLevel}</span>
                  </div>
                ))}
              </div>
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
        </div>
      )}
    </div>
  );
};

export default ProducerPanel;
