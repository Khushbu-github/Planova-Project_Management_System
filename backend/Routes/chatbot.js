const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const GROQ_API_KEY = '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';
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('Groq API error:', text);
      return res.status(500).json({ error: 'Groq API error', detail: text });
    }

    const data = JSON.parse(text); // Parse manually since we already called `.text()`
    const reply = data.choices[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

module.exports = router;
