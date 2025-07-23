import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

/**
 * Tic Tac Toe Frontend - Main Application
 * - Handles authentication, navigation, lobby, game room (with live updates), match history, leaderboard.
 * - Connects to backend REST API and websocket endpoints per openapi spec.
 */

// ========== Components ==========
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";
import History from "./components/History";
import Leaderboard from "./components/Leaderboard";

// ========== Helper Functions & Constants ==========

// You may need to change this depending on deployment
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const WS_BASE = (API_BASE.startsWith("https") ? "wss" : "ws") + "://" + API_BASE.replace(/^https?:\/\//, "");

// ========== Main Application ==========
function App() {
  // App View State: "lobby" | "register" | "login" | "game" | "history" | "leaderboard"
  const [view, setView] = useState("lobby");
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [selectedRoom, setSelectedRoom] = useState(null); // for game room
  const [theme, setTheme] = useState('light');
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth state sync with localStorage
  useEffect(() => {
    if (token && username) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
    }
  }, [token, username]);

  // Logout
  const handleLogout = () => {
    setToken("");
    setUsername("");
    setView("login");
  };
  // Theme toggle
  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  // Navigation
  const goTo = useCallback((v) => setView(v), []);
  const enterLobby = () => setView("lobby");

  // Auth
  if (!token) {
    if (view === "register") {
      return (
        <div className="App">
          <Navbar view={view} goTo={goTo} />
          <Register API_BASE={API_BASE}
            onSuccess={(tk, uname) => { setToken(tk); setUsername(uname); setView("lobby"); }}
            onLoginLink={() => setView("login")}
          />
        </div>
      );
    } else { // login
      return (
        <div className="App">
          <Navbar view={view} goTo={goTo} />
          <Login API_BASE={API_BASE}
            onSuccess={(tk, uname) => { setToken(tk); setUsername(uname); setView("lobby"); }}
            onRegisterLink={() => setView("register")}
          />
        </div>
      );
    }
  }

  // Main navigation
  return (
    <div className="App">
      <Navbar
        username={username}
        onLogout={handleLogout}
        current={view}
        goTo={goTo}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      <div className="main-container">
        {view === "lobby" && (
          <Lobby
            API_BASE={API_BASE}
            token={token}
            username={username}
            onJoinRoom={(room) => { setSelectedRoom(room); setView("game"); }}
            onCreateRoom={(room) => { setSelectedRoom(room); setView("game"); }}
            goToHistory={() => setView("history")}
            goToLeaderboard={() => setView("leaderboard")}
          />
        )}
        {view === "game" && selectedRoom && (
          <GameRoom
            API_BASE={API_BASE}
            WS_BASE={WS_BASE}
            token={token}
            username={username}
            room={selectedRoom}
            onLeave={() => { setSelectedRoom(null); enterLobby(); }}
          />
        )}
        {view === "history" && (
          <History
            API_BASE={API_BASE}
            token={token}
            goToLobby={enterLobby}
          />
        )}
        {view === "leaderboard" && (
          <Leaderboard
            API_BASE={API_BASE}
            token={token}
            goToLobby={enterLobby}
          />
        )}
      </div>
    </div>
  );
}

export default App;
