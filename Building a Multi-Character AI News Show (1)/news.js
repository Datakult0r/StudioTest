// Routes for news API
const express = require('express');
const router = express.Router();
const NewsService = require('../services/NewsService');
const DatabaseService = require('../services/DatabaseService');

// Initialize services
const newsService = new NewsService();
const dbService = new DatabaseService();

// Get top headlines
router.get('/headlines', async (req, res) => {
  try {
    const headlines = await newsService.fetchTopHeadlines();
    
    // Save to database
    dbService.saveNewsItems(headlines);
    
    res.status(200).json(headlines);
  } catch (error) {
    console.error('Error fetching headlines:', error);
    res.status(500).json({ error: 'Failed to fetch headlines' });
  }
});

// Search news by query
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await newsService.searchNews(q);
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({ error: 'Failed to search news' });
  }
});

// Get fake news (for when no real news is available)
router.get('/fake', (req, res) => {
  try {
    const fakeNews = newsService.generateFakeNews();
    res.status(200).json(fakeNews);
  } catch (error) {
    console.error('Error generating fake news:', error);
    res.status(500).json({ error: 'Failed to generate fake news' });
  }
});

// Get news from database
router.get('/saved', (req, res) => {
  try {
    const newsItems = dbService.getNewsItems();
    res.status(200).json(newsItems);
  } catch (error) {
    console.error('Error getting saved news:', error);
    res.status(500).json({ error: 'Failed to get saved news' });
  }
});

// Add custom news item
router.post('/custom', (req, res) => {
  try {
    const { title, summary, category, source } = req.body;
    
    if (!title || !summary) {
      return res.status(400).json({ error: 'Title and summary are required' });
    }
    
    const newsItem = {
      title,
      summary,
      category: category || 'Custom',
      source: source || 'Producer',
      publishedAt: new Date().toISOString(),
      isCustom: true
    };
    
    // Get existing news items
    const newsItems = dbService.getNewsItems();
    
    // Add new item
    newsItems.push(newsItem);
    
    // Save to database
    dbService.saveNewsItems(newsItems);
    
    res.status(201).json(newsItem);
  } catch (error) {
    console.error('Error adding custom news:', error);
    res.status(500).json({ error: 'Failed to add custom news' });
  }
});

module.exports = router;
