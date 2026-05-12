import React from 'react';
import Chatbot from '../components/Chatbot/Chatbot';

export default function Chat() {
  return (
    <main className="page-shell">
      <section className="panel stack">
        <span className="eyebrow">Tiny assistant</span>
        <h2>Travel questions, grounded in your active trip</h2>
        <p>The floating assistant is available on authenticated pages. Use it for practical travel help under the current trip context.</p>
      </section>
      <Chatbot />
    </main>
  );
}
