import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GameLayout from "../../components/GameLayout";
import { soundEffects } from "../../utils/audio";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getAiMove(board) {
  const empty = board.map((value, index) => (value ? null : index)).filter((value) => value !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function TicTacToePage() {
  const appState = useOutletContext();
  const { currentUser, rewardPlayer, submitScore, triggerGameOver } = appState;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [mode, setMode] = useState("pvp");
  const [status, setStatus] = useState("Player X turn.");
  const finishedRef = useRef(false);

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => !winner && board.every(Boolean), [board, winner]);

  useEffect(() => {
    if (winner) {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      setStatus(`${winner} wins.`);
      const playerWon = mode === "pvp" || winner === "X";
      rewardPlayer({
        username: currentUser.username,
        gameId: "tic-tac-toe",
        score: winner === "X" ? 12 : 8,
        won: playerWon,
        highScore: playerWon,
      });
      submitScore({ username: currentUser.username, gameId: "tic-tac-toe", score: winner === "X" ? 12 : 8 });
      if (mode === "ai" && winner === "O") {
        triggerGameOver("AI took the round.");
      }
      return;
    }

    if (draw) {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      setStatus("Draw game.");
      rewardPlayer({ username: currentUser.username, gameId: "tic-tac-toe", score: 6 });
      submitScore({ username: currentUser.username, gameId: "tic-tac-toe", score: 6 });
      return;
    }

    if (mode === "ai" && currentTurn === "O") {
      const timeout = window.setTimeout(() => {
        const move = getAiMove(board);
        if (move !== undefined) {
          setBoard((prev) => prev.map((value, index) => (index === move ? "O" : value)));
          setCurrentTurn("X");
          setStatus("Player X turn.");
        }
      }, 420);
      return () => window.clearTimeout(timeout);
    }

    setStatus(`Player ${currentTurn} turn.`);
    return undefined;
  }, [board, currentTurn, currentUser.username, draw, mode, rewardPlayer, submitScore, winner]);

  const reset = (nextMode = mode) => {
    finishedRef.current = false;
    setMode(nextMode);
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    setStatus("Player X turn.");
    soundEffects.button();
  };

  const handleCellClick = (index) => {
    if (board[index] || winner || draw || (mode === "ai" && currentTurn === "O")) {
      return;
    }
    setBoard((prev) => prev.map((value, cellIndex) => (cellIndex === index ? currentTurn : value)));
    setCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
    soundEffects.beep(400, 0.08, "triangle", 0.03);
  };

  return (
    <GameLayout
      title="Tic Tac Toe"
      subtitle="Switch between couch PvP and a quick browser AI challenger."
      sideContent={() => (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button className={mode === "pvp" ? "primary-button" : "ghost-button"} onClick={() => reset("pvp")}>
              PvP
            </button>
            <button className={mode === "ai" ? "primary-button" : "ghost-button"} onClick={() => reset("ai")}>
              Vs AI
            </button>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>{status}</p>
          <button className="secondary-button" onClick={() => reset(mode)}>
            Reset Board
          </button>
        </div>
      )}
    >
      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(3, minmax(90px, 1fr))",
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: value === "X" ? "var(--accent-primary)" : "var(--accent-secondary)",
              fontFamily: '"Orbitron", sans-serif',
              fontSize: "2rem",
              boxShadow: value ? "0 0 20px rgba(69, 214, 255, 0.12)" : "none",
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </GameLayout>
  );
}

export default TicTacToePage;
