import React, { useEffect, useState } from "react";

/**
 * Game Lobby: lists open rooms, allows create/join room
 * - GET /game/list
 * - POST /game/create, POST /game/join
 */
// PUBLIC_INTERFACE
function Lobby({ API_BASE, token, username, onJoinRoom, onCreateRoom, goToHistory, goToLeaderboard }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch lobby rooms
  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(API_BASE + "/game/list");
      if (!resp.ok) throw new Error("Unable to fetch rooms");
      const d = await resp.json();
      setRooms(d);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  // Create new room
  const createRoom = async () => {
    setCreating(true);
    setError("");
    try {
      const resp = await fetch(API_BASE + "/game/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: username }),
      });
      if (!resp.ok) throw new Error("Failed to create room");
      const d = await resp.json();
      onCreateRoom(d); // start game
    } catch (e) {
      setError(e.message);
    }
    setCreating(false);
  };

  // Join room
  const joinRoom = async (room) => {
    setError("");
    try {
      const resp = await fetch(API_BASE + "/game/join", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_id: room.room_id, nickname: username }),
      });
      if (!resp.ok) throw new Error("Join failed (room may be full)");
      const d = await resp.json();
      onJoinRoom(d); // start game
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="lobby-container">
      <h2>Lobby</h2>
      <div style={{marginBottom: 12}}>
        <button onClick={createRoom} disabled={creating} className="btn btn-large">
          {creating ? "Creating..." : "Create Room"}
        </button>
        <button onClick={fetchRooms} style={{marginLeft: 8}} className="btn btn-large">
          Refresh
        </button>
        <button onClick={goToHistory} style={{marginLeft: 8}} className="btn">
          Match History
        </button>
        <button onClick={goToLeaderboard} style={{marginLeft: 8}} className="btn">
          Leaderboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (<div>Loading...</div>) : (
        <table className="lobby-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Players</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={4}>No open rooms. Create one!</td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.room_id}</td>
                  <td>
                    {room.players.map(p => <span key={p.username} style={{marginRight: 8}}>{p.username}</span>)}
                  </td>
                  <td>{room.finished ? "Finished" : room.players.length === 2 ? "In Progress" : "Waiting"}</td>
                  <td>
                    {!room.finished && room.players.length < 2 ? (
                      <button className="btn" onClick={() => joinRoom(room)}>
                        Join
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Lobby;
