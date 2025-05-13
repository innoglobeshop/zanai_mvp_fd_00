// src/components/ChatScreen.jsx
import React, { useState, useEffect, useRef } from 'react';

// !!! IMPORTANT: REPLACE WITH YOUR ACTUAL LIVE RAILWAY BACKEND URL !!!
const API_BASE_URL = 'https://zanaimvpbd00-production.up.railway.app'; // e.g., https://zanai-api.up.railway.app

function ChatScreen({ token, initialHistory, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const formattedHistory = initialHistory.map((msg, index) => ({
      id: `hist-${index}-${new Date(msg.time).getTime()}`,
      sender: msg.from,
      text: msg.text,
      timestamp: new Date(msg.time),
    }));
    setMessages(formattedHistory);
  }, [initialHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;

    const userMessageText = newMessage.trim();
    const tempMessageId = `temp-${Date.now()}`;

    setMessages(prevMessages => [
      ...prevMessages,
      { id: tempMessageId, sender: 'user', text: userMessageText, timestamp: new Date() }
    ]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, { // Using the hardcoded URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ message: userMessageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error sending message:', data.msg || 'Failed to send message');
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessageId));
        setMessages(prevMessages => [
            ...prevMessages,
            { id: `err-${tempMessageId}`, sender: 'user', text: `${userMessageText} (Error: ${data.msg || 'Send failed'})`, timestamp: new Date(), error: true }
        ]);
        setIsLoading(false);
        return;
      }

      setMessages(prevMessages => [
        ...prevMessages.filter(msg => msg.id !== tempMessageId),
        { id: `user-${Date.now()}`, sender: 'user', text: userMessageText, timestamp: new Date() },
        { id: `ai-${Date.now() + 1}`, sender: 'ai', text: data.reply, timestamp: new Date() }
      ]);

    } catch (err) {
      console.error('API call error:', err);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessageId));
      setMessages(prevMessages => [
        ...prevMessages,
        { id: `err-${tempMessageId}`, sender: 'user', text: `${userMessageText} (Error: Network issue)`, timestamp: new Date(), error: true }
    ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-deep-blue">
      <header className="bg-white bg-opacity-10 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">ZanAi Chat</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm"
        >
          Log Out
        </button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user' 
                  ? 'bg-white text-gray-800 rounded-br-none' 
                  : 'bg-gray-700 bg-opacity-50 text-white rounded-bl-none'
              } ${msg.error ? 'border border-red-500' : ''}`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white bg-opacity-5 p-4 border-t border-white border-opacity-20">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow p-3 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent outline-none bg-transparent text-white placeholder-gray-400 disabled:opacity-70"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-white text-deep-blue font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-blue focus:ring-white transition duration-150 ease-in-out disabled:opacity-50"
            disabled={isLoading || newMessage.trim() === ''}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default ChatScreen;
