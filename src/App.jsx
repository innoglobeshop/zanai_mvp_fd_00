// src/App.jsx
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen'; // Uncomment/Add this

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('zanai-token'));
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('zanai-token'));

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('zanai-token', authToken);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('zanai-token');
      setIsLoggedIn(false);
      setChatHistory([]); // Clear history on logout
    }
  }, [authToken]);

  const handleLoginSuccess = (token, history) => {
    setAuthToken(token);
    setChatHistory(history || []);
  };

  const handleLogout = () => {
    setAuthToken(null);
    // chatHistory will be cleared by the effect or can be done explicitly here
  };

  if (!isLoggedIn || !authToken) { // Ensure authToken is also checked
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // If logged in, show the ChatScreen
  return (
    <ChatScreen 
      token={authToken} 
      initialHistory={chatHistory} 
      onLogout={handleLogout} 
    />
  );
}

export default App;