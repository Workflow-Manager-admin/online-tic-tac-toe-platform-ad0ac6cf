import React, { useEffect, useRef, useState } from "react";

/**
 * Game Room: Shows live tic tac toe board, moves, winner, updates using websocket
 * - On mount: connect websocket /ws/game/{room_id}
 * - POST moves via websocket
 * - Show board, turn, winner, etc.
 * - "Leave" button returns to lobby
 */
// PUBLIC_INTERFACE
function GameRoom({ API_BASE, WS_BASE, token, username, room, onLeave }) {
  const [game, setGame] = useState(room); // keep state from backend after join/create
  const [ws, setWs] = useState(null);
  const [error, setError] = useState("");
  const [movePending, setMovePending] = useState(false);

  const wsRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    // Docs: ws endpoint is /ws/game/{room_id}
    const fullEndpoint = `${WS_BASE}/ws/game/${room.room_id}`;
    // Use Bearer token for authentication if backend expects (can add as query param if needed)
    const sock = new window.WebSocket(fullEndpoint);
    wsRef.current = sock;
    setWs(sock);

    sock.onopen = () => {
      setError("");
    };
    sock.onerror = (err) => {
      setError("WebSocket connection failed");
    };
    sock.onclose = () => {
      // ignore
    };
    sock.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "game_state" && msg.state) {
          setGame(prev => ({ ...prev, ...msg.state }));
          setMovePending(false);
        } else if (msg.error) {
          setError(msg.error);
          setMovePending(false);
        }
      } catch (e) {
        // ignore parse errors
      }
    };
    return () => {
      sock.close();
    };
    // eslint-disable-next-line
  }, [room.room_id]);

  // Board click/move
  const makeMove = (row, col) => {
    if (!wsRef.current || movePending) return;
    if (game.finished) return;
    // Must be player's turn
    if (game.next_turn !== username) return;
    // Check if cell is empty
    if (game.board[row][col]) return;
    setMovePending(true);

    wsRef.current.send(JSON.stringify({
      action: "move",
      row,
      col,
      player: username,
    }));
  };

  // Leave room (manual or after finish)
  const handleLeave = () => {
    wsRef.current && wsRef.current.close();
    onLeave();
  };

  // Board rendering
  const cellDisplay = (cell) => cell || "\u00A0";
  const renderBoard = () => (
    <table className="game-board">
      <tbody>
        {game.board.map((rowArr, i) => (
          <tr key={i}>
            {rowArr.map((cell, j) => (
              <td
                key={j}
                className="cell"
                onClick={() => makeMove(i, j)}
                style={{
                  cursor:
                    !game.finished && !game.board[i][j] && game.next_turn === username
                      ? "pointer"
                      : "not-allowed",
                  border: "2px solid var(--border-color)",
                  fontSize: 32,
                  width: 60,
                  height: 60,
                  textAlign: "center",
                  background:
                    game.finished && game.winner && (cell === "X" || cell === "O")
                      ? "var(--bg-secondary)"
                      : undefined,
                }}
              >
                {cellDisplay(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const whoAmI = () => {
    if (!game.players) return "";
    const idx = game.players.findIndex(p => p.username === username);
    return idx === 0 ? "X" : idx === 1 ? "O" : "?";
  };

  return (
    <div className="game-room-container">
      <h2>Tic Tac Toe - Room {room.room_id}</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <div style={{marginBottom: 8}}>You are <b>{whoAmI()}</b>.&nbsp; {game.players.map((p, idx) => (
          <span key={p.username}>
            {idx === 0 ? "X: " : "O: "}
            <b>{p.username}</b>{idx === 0 && game.players.length > 1 ? " | " : ""}
          </span>
        ))}</div>
        <div>
          {game.finished ? (
            <b>
              Game Over:&nbsp;
              {game.winner ? (game.winner === username ? "You Win!" : `${game.winner} Wins!`) : "Draw"}
            </b>
          ) : (
            <span>
              {game.next_turn === username ? "Your turn!" : `Waiting for ${game.next_turn}'s move...`}
            </span>
          )}
        </div>
      </div>
      <div style={{margin: "24px auto", width: "min-content"}}>{renderBoard()}</div>
      <button className="btn btn-large" onClick={handleLeave}>
        {game.finished ? "Return to Lobby" : "Leave Game"}
      </button>
    </div>
  );
}

export default GameRoom;
