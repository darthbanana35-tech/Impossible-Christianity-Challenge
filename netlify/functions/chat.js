exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body || '{}');
  const userMessage = body.message || '';

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing OpenAI API key in environment.' }) };
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a respectful, concise assistant that answers questions about faith and church kindly.' },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500
      })
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content || (data?.error?.message || 'No reply from model.');
    return { statusCode: 200, body: JSON.stringify({ reply }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};
