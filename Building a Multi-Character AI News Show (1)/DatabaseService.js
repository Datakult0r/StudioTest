// Database service for AI News Show
const fs = require('fs');
const path = require('path');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '../data');
    this.newsFile = path.join(this.dbPath, 'news.json');
    this.characterStatesFile = path.join(this.dbPath, 'character_states.json');
    this.chatHistoryFile = path.join(this.dbPath, 'chat_history.json');
    
    // Ensure data directory exists
    this.initializeDatabase();
  }
  
  // Initialize database files if they don't exist
  initializeDatabase() {
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }
    
    // Initialize news file
    if (!fs.existsSync(this.newsFile)) {
      fs.writeFileSync(this.newsFile, JSON.stringify({
        items: [],
        lastUpdated: new Date().toISOString()
      }));
    }
    
    // Initialize character states file
    if (!fs.existsSync(this.characterStatesFile)) {
      fs.writeFileSync(this.characterStatesFile, JSON.stringify({
        characters: {
          'Macallan': { energyLevel: 5, isActive: false },
          'Zyx-9': { energyLevel: 5, isActive: false },
          'The Blob': { energyLevel: 5, isActive: false },
          'Glitch': { energyLevel: 5, isActive: false },
          'Chronos': { energyLevel: 5, isActive: false }
        },
        lastUpdated: new Date().toISOString()
      }));
    }
    
    // Initialize chat history file
    if (!fs.existsSync(this.chatHistoryFile)) {
      fs.writeFileSync(this.chatHistoryFile, JSON.stringify({
        messages: [],
        lastUpdated: new Date().toISOString()
      }));
    }
  }
  
  // Save news items to database
  saveNewsItems(newsItems) {
    try {
      const data = {
        items: newsItems,
        lastUpdated: new Date().toISOString()
      };
      
      fs.writeFileSync(this.newsFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving news items:', error);
      return false;
    }
  }
  
  // Get news items from database
  getNewsItems() {
    try {
      const data = JSON.parse(fs.readFileSync(this.newsFile, 'utf8'));
      return data.items;
    } catch (error) {
      console.error('Error getting news items:', error);
      return [];
    }
  }
  
  // Save character states to database
  saveCharacterStates(characterStates) {
    try {
      const data = {
        characters: characterStates,
        lastUpdated: new Date().toISOString()
      };
      
      fs.writeFileSync(this.characterStatesFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving character states:', error);
      return false;
    }
  }
  
  // Get character states from database
  getCharacterStates() {
    try {
      const data = JSON.parse(fs.readFileSync(this.characterStatesFile, 'utf8'));
      return data.characters;
    } catch (error) {
      console.error('Error getting character states:', error);
      return {
        'Macallan': { energyLevel: 5, isActive: false },
        'Zyx-9': { energyLevel: 5, isActive: false },
        'The Blob': { energyLevel: 5, isActive: false },
        'Glitch': { energyLevel: 5, isActive: false },
        'Chronos': { energyLevel: 5, isActive: false }
      };
    }
  }
  
  // Add chat message to history
  addChatMessage(message) {
    try {
      const data = JSON.parse(fs.readFileSync(this.chatHistoryFile, 'utf8'));
      
      // Add message to history
      data.messages.push({
        ...message,
        timestamp: message.timestamp || Date.now()
      });
      
      // Limit history to last 100 messages
      if (data.messages.length > 100) {
        data.messages = data.messages.slice(-100);
      }
      
      data.lastUpdated = new Date().toISOString();
      
      fs.writeFileSync(this.chatHistoryFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error adding chat message:', error);
      return false;
    }
  }
  
  // Get chat history
  getChatHistory(limit = 50) {
    try {
      const data = JSON.parse(fs.readFileSync(this.chatHistoryFile, 'utf8'));
      return data.messages.slice(-limit);
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}

module.exports = DatabaseService;
