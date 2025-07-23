import React, { useEffect, useState } from "react";

/**
 * Match History/Completed games
 * - GET /game/history
 */
// PUBLIC_INTERFACE
function History({ API_BASE, token, goToLobby }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(API_BASE + "/game/history", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(resp => resp.json())
      .then(d => setGames(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [API_BASE, token]);

  return (
    <div className="history-container">
      <h2>Match History</h2>
      <button className="btn" onClick={goToLobby}>Back to Lobby</button>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Players</th>
              <th>Winner</th>
              <th>Finished</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 ? (
              <tr><td colSpan={4}>No finished games yet.</td></tr>
            ) : (
              games.map(g => (
                <tr key={g.room_id}>
                  <td>{g.room_id}</td>
                  <td>{g.players.join(", ")}</td>
                  <td>{g.winner ?? "Draw"}</td>
                  <td>{g.finished ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;
