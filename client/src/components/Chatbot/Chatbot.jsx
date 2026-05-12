import React from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/slices/chatSlice';
import './Chatbot.css';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const { currentTrip } = useSelector((state) => state.trips);

  const submit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    dispatch(sendMessage({ message, tripId: currentTrip?._id, tripContext: currentTrip }));
    setMessage('');
  };

  if (!open) {
    return <button className="chat-launch" aria-label="Open chat" onClick={() => setOpen(true)}><MessageCircle /></button>;
  }

  return (
    <aside className="chatbot">
      <header>
        <strong>Tiny</strong>
        <button className="icon-btn" aria-label="Close chat" onClick={() => setOpen(false)}><X /></button>
      </header>
      <div className="chat-messages">
        {messages.length === 0 && <p>Ask about food, safety, weather, transport, nearby places, or budget tips.</p>}
        {messages.map((item, index) => <div className={`bubble ${item.role}`} key={`${item.role}-${index}`}>{item.content}</div>)}
        {loading && <div className="bubble assistant">Thinking...</div>}
        {error && <div className="error">{error}</div>}
      </div>
      <form onSubmit={submit}>
        <input className="input" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask Tiny..." />
        <button className="icon-btn" aria-label="Send message"><Send size={18} /></button>
      </form>
    </aside>
  );
}
