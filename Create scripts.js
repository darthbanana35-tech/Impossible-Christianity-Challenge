const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('input');

function appendMessage(kind, text){
  const d = document.createElement('div');
  d.className = 'message ' + (kind === 'user' ? 'user' : 'assistant');
  d.textContent = text;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return d;
}

function replaceMessage(el, text){
  if(!el) return appendMessage('assistant', text);
  el.textContent = text;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  appendMessage('user', text);
  input.value = '';
  const thinking = appendMessage('assistant', 'Thinking...');
  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    if (data?.reply) replaceMessage(thinking, data.reply);
    else replaceMessage(thinking, 'No reply (check function logs).');
  } catch(err) {
    replaceMessage(thinking, 'Error: ' + (err.message || err));
  }
});
