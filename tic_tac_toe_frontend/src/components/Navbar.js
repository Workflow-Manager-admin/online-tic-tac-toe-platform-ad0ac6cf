import React from "react";

/**
 * Top Navigation Bar: App title, current user, navigation, logout, theme switch.
 */
// PUBLIC_INTERFACE
function Navbar({ username, onLogout, current, goTo, onToggleTheme, theme }) {
  return (
    <nav className="navbar" style={{
      background: "var(--bg-secondary)",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <span className="title" style={{ fontWeight: "bold", fontSize: 24 }}>Online Tic Tac Toe</span>
        {username && (
          <span style={{ marginLeft: 16, color: "var(--text-secondary)", fontWeight: 500 }}>
            Welcome, {username}!
          </span>
        )}
      </div>
      <div>
        <button style={{marginRight: 8}} className="navbar-btn" onClick={() => goTo("lobby")}>
          Lobby
        </button>
        <button style={{marginRight: 8}} className="navbar-btn" onClick={() => goTo("history")}>
          History
        </button>
        <button style={{marginRight: 8}} className="navbar-btn" onClick={() => goTo("leaderboard")}>
          Leaderboard
        </button>
        {username && (
          <button style={{marginRight: 8}} className="navbar-btn" onClick={onLogout}>
            Logout
          </button>
        )}
        <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
