import React from 'react';

// BreakingNewsBar component for displaying scrolling headlines
interface BreakingNewsBarProps {
  headlines: {
    id: string;
    title: string;
    category: string;
  }[];
}

const BreakingNewsBar: React.FC<BreakingNewsBarProps> = ({ headlines }) => {
  // If no headlines, show a default message
  if (!headlines || headlines.length === 0) {
    headlines = [{ 
      id: 'default', 
      title: 'Welcome to AI News Network - The future of news broadcasting', 
      category: 'Welcome' 
    }];
  }

  return (
    <div className="w-full bg-news-red py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-white text-news-red font-bold px-3 py-1 mr-3 uppercase text-sm">
          Breaking
        </div>
        
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="animate-marquee inline-block">
            {headlines.map((headline, index) => (
              <span key={headline.id} className="mr-8 text-white font-medium">
                {headline.category}: {headline.title}
                {index < headlines.length - 1 && <span className="mx-2">•</span>}
              </span>
            ))}
          </div>
          
          {/* Duplicate for seamless looping */}
          <div className="animate-marquee2 inline-block absolute top-0">
            {headlines.map((headline, index) => (
              <span key={`${headline.id}-dup`} className="mr-8 text-white font-medium">
                {headline.category}: {headline.title}
                {index < headlines.length - 1 && <span className="mx-2">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBar;
