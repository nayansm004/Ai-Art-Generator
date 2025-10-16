// server.js - Complete Backend Server for AI Art Generator
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// API Configuration
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_MODEL = 'black-forest-labs/FLUX.1-schnell'; // ⭐ BEST FREE OPTION
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// Validate API token on startup
if (!HF_API_TOKEN) {
  console.error('ERROR: HF_API_TOKEN not found in environment variables!');
  console.error('Please create a .env file with: HF_API_TOKEN=your_token_here');
  process.exit(1);
}

// Helper function to query Hugging Face API
async function queryHuggingFace(prompt) {
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: true,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', response.status, errorText);
      
      if (response.status === 503) {
        throw new Error('Model is loading, please try again in a moment');
      } else if (response.status === 401) {
        throw new Error('Invalid API token');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded, please try again later');
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }

    const imageBlob = await response.arrayBuffer();
    return Buffer.from(imageBlob);
  } catch (error) {
    console.error('Error querying Hugging Face:', error);
    throw error;
  }
}

// Main endpoint for image generation
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid prompt is required'
      });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is too long (max 1000 characters)'
      });
    }

    console.log('Generating image for prompt:', prompt.substring(0, 50) + '...');

    // Call Hugging Face API
    const imageBuffer = await queryHuggingFace(prompt);

    // Convert to base64 for easy transmission
    const base64Image = imageBuffer.toString('base64');

    // Send response
    res.json({
      success: true,
      image: `data:image/jpeg;base64,${base64Image}`,
      prompt: prompt
    });

    console.log('Image generated successfully');

  } catch (error) {
    console.error('Error in /api/generate-image:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    tokenConfigured: !!HF_API_TOKEN
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ AI Art Generator Server running on port ${PORT}`);
  console.log(`🔑 API Token configured: ${HF_API_TOKEN ? 'Yes' : 'No'}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
  console.log(`\n📝 Make sure you have created a .env file with your Hugging Face API token!`);
});