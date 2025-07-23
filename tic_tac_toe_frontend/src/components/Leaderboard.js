import React, { useEffect, useState } from "react";

/**
 * Leaderboard Table
 * - GET /scoreboard
 */
// PUBLIC_INTERFACE
function Leaderboard({ API_BASE, token, goToLobby }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(API_BASE + "/scoreboard", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(resp => resp.json())
      .then(d => setEntries(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [API_BASE, token]);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <button className="btn" onClick={goToLobby}>Back to Lobby</button>
      {error && <div className="error-message">{error}</div>}
      {loading ? (<div>Loading...</div>) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
              <th>Games Played</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={5}>No stats yet.</td></tr>
            ) : (
              entries.map(e => (
                <tr key={e.username}>
                  <td>{e.username}</td>
                  <td>{e.wins}</td>
                  <td>{e.losses}</td>
                  <td>{e.draws}</td>
                  <td>{e.games_played}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
