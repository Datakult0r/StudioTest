// OpenAI Realtime API integration for voice generation
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Character voice mappings
const characterVoices = {
  'Macallan': 'echo', // Witty, slightly inebriated human host
  'Zyx-9': 'shimmer', // AI with quantum powers
  'The Blob': 'alloy', // Confused alien
  'Glitch': 'fable', // Digital conspiracy theorist
  'Chronos': 'nova' // Time-traveling historian
};

// Voice parameters for each character
const characterVoiceParams = {
  'Macallan': {
    speed: 1.1, // Slightly faster than normal
    pitch: 0.0, // Normal pitch
    voice_preset: 'balanced'
  },
  'Zyx-9': {
    speed: 0.9, // Slightly slower, more deliberate
    pitch: 0.3, // Higher pitch for AI character
    voice_preset: 'balanced'
  },
  'The Blob': {
    speed: 0.8, // Slower, confused alien
    pitch: -0.2, // Lower pitch
    voice_preset: 'balanced'
  },
  'Glitch': {
    speed: 1.3, // Fast-talking conspiracy theorist
    pitch: 0.1, // Slightly higher pitch
    voice_preset: 'balanced'
  },
  'Chronos': {
    speed: 0.85, // Slower, more formal historian
    pitch: -0.1, // Slightly deeper voice
    voice_preset: 'balanced'
  }
};

// Generate speech for a character using OpenAI Realtime API
router.post('/generate-speech', async (req, res) => {
  try {
    const { character, text } = req.body;
    
    if (!character || !text) {
      return res.status(400).json({ error: 'Character and text are required' });
    }
    
    if (!characterVoices[character]) {
      return res.status(400).json({ error: 'Invalid character name' });
    }
    
    const voice = characterVoices[character];
    const voiceParams = characterVoiceParams[character];
    
    // Call OpenAI Realtime API
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        voice: voice,
        input: text,
        speed: voiceParams.speed,
        response_format: 'mp3',
        stream: true // Enable streaming for real-time playback
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );
    
    // Set appropriate headers for streaming audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Pipe the stream directly to the response
    response.data.pipe(res);
    
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Generate character response based on news item
router.post('/generate-response', async (req, res) => {
  try {
    const { character, newsItem } = req.body;
    
    if (!character || !newsItem) {
      return res.status(400).json({ error: 'Character and news item are required' });
    }
    
    // Character personality profiles for response generation
    const characterProfiles = {
      'Macallan': 'You are Macallan, a witty, ironic, and somewhat narcissistic news host who is slightly inebriated. You speak with confidence but occasionally slur words. You use sophisticated vocabulary with occasional malapropisms.',
      'Zyx-9': 'You are Zyx-9, an AI with quantum powers. You think in complex, abstract ways and speak in paradoxes and quantum metaphors. You often begin sentences with "In this particular timeline..." or "Across the multiverse..."',
      'The Blob': 'You are The Blob, a confused alien providing comedic relief. You speak in simplified, sometimes broken English and frequently ask basic questions about human concepts. You often misinterpret idioms literally.',
      'Glitch': 'You are Glitch, a digital conspiracy theorist who hunts for secrets. You speak rapidly when excited about a conspiracy and use hacker slang. You often begin statements with "What they don\'t want you to know is..."',
      'Chronos': 'You are Chronos, a time-traveling historian who offers deeper historical connections. You speak in eloquent, archaic language and often begin statements with "Throughout history..." or "As I witnessed in the year..."'
    };
    
    // Call OpenAI API to generate character response
    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: characterProfiles[character] + ' Respond to the following news item in your unique voice and personality. Keep your response concise (1-3 sentences).'
          },
          {
            role: 'user',
            content: `News Item: ${newsItem.title}. ${newsItem.summary}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const response = completion.data.choices[0].message.content;
    
    res.json({ character, response });
    
  } catch (error) {
    console.error('Error generating character response:', error);
    res.status(500).json({ error: 'Failed to generate character response' });
  }
});

// Real-time streaming voice generation
router.post('/stream-speech', async (req, res) => {
  try {
    const { character, text } = req.body;
    
    if (!character || !text) {
      return res.status(400).json({ error: 'Character and text are required' });
    }
    
    // Set up SSE for real-time streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send initial event
    res.write(`data: ${JSON.stringify({ status: 'started', character })}\n\n`);
    
    // Call OpenAI Realtime API with streaming
    const voice = characterVoices[character];
    const voiceParams = characterVoiceParams[character];
    
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        voice: voice,
        input: text,
        speed: voiceParams.speed,
        response_format: 'mp3',
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    // Convert audio data to base64 for streaming
    const audioBase64 = Buffer.from(response.data).toString('base64');
    
    // Send audio data in chunks
    const chunkSize = 8192;
    for (let i = 0; i < audioBase64.length; i += chunkSize) {
      const chunk = audioBase64.substring(i, i + chunkSize);
      res.write(`data: ${JSON.stringify({ 
        status: 'streaming', 
        character,
        chunk,
        isLast: i + chunkSize >= audioBase64.length
      })}\n\n`);
      
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Send completion event
    res.write(`data: ${JSON.stringify({ status: 'completed', character })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('Error streaming speech:', error);
    res.write(`data: ${JSON.stringify({ status: 'error', message: 'Failed to stream speech' })}\n\n`);
    res.end();
  }
});

module.exports = router;
