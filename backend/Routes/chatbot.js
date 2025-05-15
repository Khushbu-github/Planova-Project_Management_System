const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Use v2
const User = require('../Models/User');

router.post('/', async (req, res) => {
  const { message, userId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }
  
  let userContext = '';
  try {
    // Create a session-based user context instead of trying to lookup by userId
    // Only attempt to find a user if the userId looks like a valid MongoDB ObjectId
    if (userId && /^[0-9a-fA-F]{24}$/.test(userId)) {
      const user = await User.findById(userId).select('name role');
      if (user) {
        userContext = `This message is from ${user.name}, who is a ${user.role}.`;
      }
    } else if (userId) {
      // For custom user IDs that aren't MongoDB ObjectIds, just use a generic context
      userContext = `This is a session with ID: ${userId}`;
    }
    
    const fullPrompt = `${userContext}\nUser says: ${message}`;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Updated to use a current model - LLama3 is currently supported by Groq
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error:', data);
      return res.status(response.status).json({ error: 'API error', detail: data });
    }
    
    const reply = data.choices?.[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

module.exports = router;