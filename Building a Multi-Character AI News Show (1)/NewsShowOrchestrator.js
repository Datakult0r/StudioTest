// Integration of OpenAI Realtime API with news show orchestration
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// News show orchestration service
class NewsShowOrchestrator {
  constructor(io) {
    this.io = io;
    this.newsQueue = [];
    this.currentNews = null;
    this.speakingCharacter = null;
    this.characterStates = {
      'Macallan': { energyLevel: 5, isActive: false },
      'Zyx-9': { energyLevel: 5, isActive: false },
      'The Blob': { energyLevel: 5, isActive: false },
      'Glitch': { energyLevel: 5, isActive: false },
      'Chronos': { energyLevel: 5, isActive: false }
    };
    
    // Character speaking order for each news item
    this.speakingOrder = ['Macallan', 'Zyx-9', 'The Blob', 'Glitch', 'Chronos'];
    this.currentSpeakerIndex = 0;
    
    // Initialize socket event handlers
    this.initSocketHandlers();
  }
  
  // Initialize socket event handlers
  initSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected to news orchestrator');
      
      // Send initial state to new clients
      this.sendStateUpdate();
      
      // Handle character energy level updates
      socket.on('character_energy_update', (data) => {
        const { character, level } = data;
        if (this.characterStates[character]) {
          this.characterStates[character].energyLevel = level;
          this.io.emit('character_energy_updated', { character, level });
        }
      });
      
      // Handle custom story injection
      socket.on('inject_story', (story) => {
        this.addNewsItem(story);
        this.io.emit('news_queue_updated', this.getNewsQueue());
      });
      
      // Handle speech completion
      socket.on('speech_completed', (data) => {
        const { character } = data;
        if (character === this.speakingCharacter) {
          this.advanceToNextSpeaker();
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected from news orchestrator');
      });
    });
  }
  
  // Add a news item to the queue
  addNewsItem(newsItem) {
    this.newsQueue.push(newsItem);
    
    // If no current news item, start processing the queue
    if (!this.currentNews) {
      this.processNextNewsItem();
    }
  }
  
  // Process the next news item in the queue
  processNextNewsItem() {
    if (this.newsQueue.length === 0) {
      this.currentNews = null;
      this.speakingCharacter = null;
      this.currentSpeakerIndex = 0;
      this.sendStateUpdate();
      return;
    }
    
    this.currentNews = this.newsQueue.shift();
    this.currentSpeakerIndex = 0;
    this.startCharacterSpeaking(this.speakingOrder[0]);
    this.sendStateUpdate();
  }
  
  // Start a character speaking
  startCharacterSpeaking(character) {
    // Reset all characters to inactive
    Object.keys(this.characterStates).forEach(char => {
      this.characterStates[char].isActive = false;
    });
    
    // Set the current speaking character
    this.speakingCharacter = character;
    this.characterStates[character].isActive = true;
    
    // Emit event to notify clients
    this.io.emit('character_speaking', { 
      character, 
      newsItem: this.currentNews 
    });
    
    this.sendStateUpdate();
  }
  
  // Advance to the next speaker in the sequence
  advanceToNextSpeaker() {
    this.currentSpeakerIndex++;
    
    // If we've gone through all characters, move to the next news item
    if (this.currentSpeakerIndex >= this.speakingOrder.length) {
      this.processNextNewsItem();
      return;
    }
    
    // Get the next character based on energy levels
    const nextCharacter = this.getNextSpeaker();
    
    // Start the next character speaking
    this.startCharacterSpeaking(nextCharacter);
  }
  
  // Get the next speaker based on energy levels
  getNextSpeaker() {
    const nextCharacterIndex = this.currentSpeakerIndex;
    const nextCharacter = this.speakingOrder[nextCharacterIndex];
    
    // Check if this character should speak based on energy level
    const energyLevel = this.characterStates[nextCharacter].energyLevel;
    
    // If energy level is very low, consider skipping
    if (energyLevel < 2 && Math.random() > 0.3) {
      // Skip this character 70% of the time if energy is low
      this.currentSpeakerIndex++;
      
      // If we've gone through all characters, return the last one anyway
      if (this.currentSpeakerIndex >= this.speakingOrder.length) {
        this.currentSpeakerIndex = this.speakingOrder.length - 1;
        return this.speakingOrder[this.currentSpeakerIndex];
      }
      
      return this.getNextSpeaker();
    }
    
    return nextCharacter;
  }
  
  // Send current state to all clients
  sendStateUpdate() {
    this.io.emit('show_state_update', {
      currentNews: this.currentNews,
      speakingCharacter: this.speakingCharacter,
      characterStates: this.characterStates,
      newsQueue: this.getNewsQueue()
    });
  }
  
  // Get a simplified version of the news queue for clients
  getNewsQueue() {
    return this.newsQueue.map(item => ({
      title: item.title,
      category: item.category,
      source: item.source
    }));
  }
  
  // Fetch news from external API
  async fetchNewsFromAPI() {
    try {
      // In production, this would call the Google News API
      // For now, use mock data
      const mockNews = [
        {
          title: "AI Assistant Breaks Record for Continuous Operation",
          summary: "A new AI assistant has broken the record for continuous operation, running for over 1000 hours without errors.",
          category: "AI",
          source: "Tech Daily"
        },
        {
          title: "Quantum Computing Breakthrough Enables New Machine Learning Models",
          summary: "Scientists have achieved a quantum computing breakthrough that allows for previously impossible machine learning models.",
          category: "Technology",
          source: "Science Today"
        },
        {
          title: "Neural Interfaces Allow Direct Brain-to-Computer Communication",
          summary: "New neural interface technology enables direct communication between human brains and computers.",
          category: "Neuroscience",
          source: "Future Medicine"
        }
      ];
      
      // Add mock news to the queue
      mockNews.forEach(item => this.addNewsItem(item));
      
      return mockNews;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }
}

// Export the orchestrator class
module.exports = NewsShowOrchestrator;
