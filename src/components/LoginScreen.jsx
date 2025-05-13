// src/components/LoginScreen.jsx
import React, { useState } from 'react';

// We'll pass a function `onLoginSuccess` as a prop later
// This function will be called when the login is successful,
// providing the token and chat history to the App component.
function LoginScreen({ onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError(''); // Clear error when user types
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
      // IMPORTANT: Replace with your actual backend URL if it's different
      // For development, if your backend runs on port 3001 and frontend on 5173,
      // you'll need to configure Vite proxy or use the full URL.
      // Let's use the full URL for now for clarity.
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        // data.msg should contain the error message from the backend (e.g., "Invalid PIN.")
        setError(data.msg || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Login successful
      console.log('Login successful:', data);
      // Call the onLoginSuccess prop with the token and history
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
            type="password" // Use "password" to mask input, or "text" with "tel" pattern for numeric keyboard
            inputMode="numeric" // Helps bring up numeric keyboard on mobile
            pattern="[0-9]*"    // Further helps with numeric input
            maxLength="6"
            value={pin}
            onChange={handlePinChange}
            className="w-full px-4 py-3 mb-4 text-lg text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-deep-blue focus:border-transparent outline-none tracking-[0.5em]" // Added tracking for spacing
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