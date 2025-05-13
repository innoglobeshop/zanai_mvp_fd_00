// src/components/LoginScreen.jsx
import React, { useState } from 'react';

// !!! IMPORTANT: REPLACE WITH YOUR ACTUAL LIVE RAILWAY BACKEND URL !!!
const API_BASE_URL = 'https://your-railway-backend-url.up.railway.app'; // e.g., https://zanai-api.up.railway.app

function LoginScreen({ onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be 6 digits.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, { // Using the hardcoded URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('Login successful:', data);
      if (onLoginSuccess) {
        onLoginSuccess(data.token, data.history);
      }

    } catch (err) {
      console.error('Login API error:', err);
      setError('An error occurred. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-deep-blue p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-deep-blue mb-6">ZanAi</h1>
        <p className="text-gray-600 mb-6">Enter your 6-digit PIN</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="6"
            value={pin}
            onChange={handlePinChange}
            className="w-full px-4 py-3 mb-4 text-lg text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-deep-blue focus:border-transparent outline-none tracking-[0.5em]"
            placeholder="------"
            disabled={isLoading}
          />
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-deep-blue text-white py-3 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-blue transition duration-150 ease-in-out disabled:opacity-50"
            disabled={isLoading || pin.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
      <footer className="text-white text-opacity-70 mt-8 text-sm">
        © {new Date().getFullYear()} ZanAi - Kurdistan
      </footer>
    </div>
  );
}

export default LoginScreen;
