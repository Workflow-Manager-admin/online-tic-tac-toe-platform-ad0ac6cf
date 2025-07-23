import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Import core components so they are reachable for hot reload and build
import './components/Navbar';
import './components/Login';
import './components/Register';
import './components/Lobby';
import './components/GameRoom';
import './components/History';
import './components/Leaderboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
