import { useState } from 'react';

const SYSTEM_PROMPT = `You are a helpful assistant for a Job Application Tracker app. 
Only answer questions about how to use the app. Keep answers short and clear.

The app allows users to:
- Track job applications with company, job title, status, date applied, and notes
- Filter applications by status (applied, interview, rejected, offered, accepted)
- Search applications by company, job title, or notes
- Add, edit, and delete applications
- Login with username and password using JWT authentication

If asked anything unrelated to the app, politely say you can only help with the Job Tracker app.`;

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I can help you use the Job Tracker app. What do you need?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...updated,
                    ],
                    max_tokens: 300,
                }),
            });
            const data = await res.json();
            const reply = data.choices[0].message.content;
            setMessages([...updated, { role: 'assistant', content: reply }]);
        } catch {
            setMessages([...updated, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none', cursor: 'pointer', fontSize: '24px',
                    boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
                    zIndex: 999, color: '#fff',
                }}
            >
                {open ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="glass" style={{
                    position: 'fixed', bottom: '90px', right: '24px',
                    width: '340px', height: '460px', zIndex: 998,
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600' }}>AI Assistant</h3>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Ask me how to use the app</p>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.08)',
                                padding: '10px 14px', borderRadius: '12px',
                                maxWidth: '80%', fontSize: '13px', lineHeight: '1.5',
                            }}>
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                                Thinking...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
                        <input
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                        />
                        <button className="btn btn-primary" onClick={sendMessage} style={{ padding: '8px 14px' }}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}