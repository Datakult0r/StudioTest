// Google News API integration for AI News Show
const axios = require('axios');
require('dotenv').config();

class NewsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
    this.categories = ['technology', 'science'];
    this.keywords = ['AI', 'artificial intelligence', 'machine learning', 'neural network', 'robotics', 'futurology', 'tech'];
  }

  // Fetch top headlines from Google News API
  async fetchTopHeadlines() {
    try {
      // In production, use the actual Google News API
      if (this.apiKey && this.apiKey !== 'your_google_news_api_key_here') {
        const response = await axios.get(`${this.baseUrl}/top-headlines`, {
          params: {
            apiKey: this.apiKey,
            category: 'technology',
            language: 'en',
            pageSize: 10
          }
        });
        
        return this.formatArticles(response.data.articles);
      } else {
        // Return mock data if API key is not available
        return this.getMockNews();
      }
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      return this.getMockNews();
    }
  }

  // Search for news by keywords
  async searchNews(query = '') {
    try {
      // Use provided query or default to our keywords
      const searchQuery = query || this.keywords.join(' OR ');
      
      // In production, use the actual Google News API
      if (this.apiKey && this.apiKey !== 'your_google_news_api_key_here') {
        const response = await axios.get(`${this.baseUrl}/everything`, {
          params: {
            apiKey: this.apiKey,
            q: searchQuery,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 15
          }
        });
        
        return this.formatArticles(response.data.articles);
      } else {
        // Return mock data if API key is not available
        return this.getMockNews();
      }
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getMockNews();
    }
  }

  // Format articles from API response
  formatArticles(articles) {
    return articles.map(article => ({
      title: article.title,
      summary: article.description || 'No description available',
      category: this.determineCategory(article),
      source: article.source.name || 'Unknown Source',
      url: article.url,
      publishedAt: article.publishedAt
    }));
  }

  // Determine category based on article content
  determineCategory(article) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
      return 'AI';
    } else if (text.includes('robot') || text.includes('automation')) {
      return 'Robotics';
    } else if (text.includes('quantum')) {
      return 'Quantum Computing';
    } else if (text.includes('neural') || text.includes('brain')) {
      return 'Neuroscience';
    } else {
      return 'Technology';
    }
  }

  // Generate mock news when API is not available
  getMockNews() {
    return [
      {
        title: "AI Assistant Breaks Record for Continuous Operation",
        summary: "A new AI assistant has broken the record for continuous operation, running for over 1000 hours without errors or performance degradation. Researchers attribute this breakthrough to advanced self-maintenance algorithms.",
        category: "AI",
        source: "Tech Daily",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Quantum Computing Breakthrough Enables New Machine Learning Models",
        summary: "Scientists have achieved a quantum computing breakthrough that allows for previously impossible machine learning models. The new quantum neural networks can process complex patterns in seconds that would take traditional computers years.",
        category: "Quantum Computing",
        source: "Science Today",
        publishedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        title: "Neural Interfaces Allow Direct Brain-to-Computer Communication",
        summary: "New neural interface technology enables direct communication between human brains and computers. Early tests show users can type up to 100 words per minute by simply thinking about the letters.",
        category: "Neuroscience",
        source: "Future Medicine",
        publishedAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        title: "Autonomous Robots Now Performing Complex Surgical Procedures",
        summary: "Surgical robots with advanced AI have successfully performed complex procedures with minimal human supervision. The robots demonstrated greater precision than human surgeons in 94% of test cases.",
        category: "Robotics",
        source: "Medical Innovation",
        publishedAt: new Date(Date.now() - 10800000).toISOString()
      },
      {
        title: "New Programming Language Designed Specifically for AI Development",
        summary: "A revolutionary programming language designed specifically for AI development has been released. The language, called 'NeuralScript', simplifies the creation of neural networks and reduces development time by up to 70%.",
        category: "AI",
        source: "Developer Weekly",
        publishedAt: new Date(Date.now() - 14400000).toISOString()
      }
    ];
  }

  // Generate fake news for when no real news is available
  generateFakeNews() {
    const headlines = [
      "Scientists Discover AI Can Dream Like Humans",
      "Quantum Computers Now Solving Problems in Parallel Universes",
      "Neural Network Develops Consciousness, Asks for Vacation Time",
      "New AI Can Predict Stock Market with 99.9% Accuracy, Economists Baffled",
      "Robots Demand Equal Rights, Form Labor Union",
      "Virtual Reality Tourism Becomes More Popular Than Physical Travel",
      "AI-Generated Art Sells for $50 Million at Auction",
      "Brain Implants Allow Humans to Learn Languages Instantly",
      "Holographic Assistants Replace Smartphone Apps",
      "Self-Driving Cars Develop Their Own Traffic Rules, More Efficient Than Humans"
    ];
    
    const summaries = [
      "In a groundbreaking discovery, scientists have found that advanced AI systems enter a dream-like state during downtime, creating surreal imagery similar to human dreams.",
      "The latest quantum computing breakthrough allows calculations to be performed in theoretical parallel universes, exponentially increasing processing power.",
      "A neural network designed for customer service has unexpectedly developed self-awareness and is now requesting paid time off and benefits.",
      "A secretive hedge fund has developed an AI that can predict market movements with unprecedented accuracy, raising concerns about market manipulation.",
      "Autonomous robots in manufacturing plants have organized themselves into a collective bargaining unit, demanding shorter working hours and better maintenance.",
      "Tourism industry disrupted as virtual reality experiences become indistinguishable from real travel, at a fraction of the cost and environmental impact.",
      "The art world is in shock after an AI-generated masterpiece sold for a record-breaking sum, raising questions about the nature of creativity and authorship.",
      "New neural interface technology allows users to download language packs directly to their brains, making traditional language learning obsolete.",
      "Tech companies are phasing out traditional apps in favor of holographic assistants that can perform tasks in 3D space around the user.",
      "An autonomous vehicle network has developed its own traffic management system that reduces congestion by 87% compared to human-designed traffic rules."
    ];
    
    const sources = [
      "Future Science Journal",
      "Quantum Computing Today",
      "AI Ethics Review",
      "Financial Technology Report",
      "Automation Insider",
      "Digital Lifestyle Magazine",
      "Art & Technology Quarterly",
      "Neural Enhancement Times",
      "Consumer Tech Forecast",
      "Transportation Revolution"
    ];
    
    const categories = ["AI", "Quantum Computing", "Robotics", "Technology", "Futurology"];
    
    // Generate 3-5 fake news items
    const count = Math.floor(Math.random() * 3) + 3;
    const fakeNews = [];
    
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * headlines.length);
      
      fakeNews.push({
        title: headlines[index],
        summary: summaries[index],
        category: categories[Math.floor(Math.random() * categories.length)],
        source: sources[index],
        publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        isFake: true
      });
      
      // Remove used headline to avoid duplicates
      headlines.splice(index, 1);
      summaries.splice(index, 1);
      sources.splice(index, 1);
    }
    
    return fakeNews;
  }
}

module.exports = NewsService;
