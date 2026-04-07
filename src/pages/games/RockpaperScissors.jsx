import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GameLayout from "../../components/GameLayout";
import { soundEffects } from "../../utils/audio";

const MOVES = [
  { id: "rock", label: "Rock", emoji: "✊" },
  { id: "paper", label: "Paper", emoji: "✋" },
  { id: "scissors", label: "Scissors", emoji: "✌️" },
];

function decideRound(playerMove, botMove) {
  if (playerMove === botMove) {
    return "draw";
  }

  const playerWins =
    (playerMove === "rock" && botMove === "scissors") ||
    (playerMove === "paper" && botMove === "rock") ||
    (playerMove === "scissors" && botMove === "paper");

  return playerWins ? "win" : "lose";
}

function RockPaperScissorsPage() {
  const appState = useOutletContext();
  const { currentUser, rewardPlayer, submitScore, unlockAchievement, triggerGameOver } = appState;
  const [playerMove, setPlayerMove] = useState(null);
  const [botMove, setBotMove] = useState(null);
  const [result, setResult] = useState("Choose your throw to start the duel.");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);
  const [streak, setStreak] = useState(0);

  const rounds = wins + losses + draws;
  const score = wins * 3 + draws;

  const playerEmoji = useMemo(
    () => MOVES.find((move) => move.id === playerMove)?.emoji ?? "❔",
    [playerMove]
  );
  const botEmoji = useMemo(() => MOVES.find((move) => move.id === botMove)?.emoji ?? "❔", [botMove]);

  const handleMove = (moveId) => {
    const nextBotMove = MOVES[Math.floor(Math.random() * MOVES.length)].id;
    const outcome = decideRound(moveId, nextBotMove);
    setPlayerMove(moveId);
    setBotMove(nextBotMove);

    if (outcome === "win") {
      const nextWins = wins + 1;
      const nextStreak = streak + 1;
      const nextScore = nextWins * 3 + draws;
      setWins(nextWins);
      setStreak(nextStreak);
      setResult("You win this round.");
      rewardPlayer({
        username: currentUser.username,
        gameId: "rock-paper-scissors",
        score: nextScore,
        highScore: nextWins >= 3,
        won: nextWins >= 5,
      });
      submitScore({ username: currentUser.username, gameId: "rock-paper-scissors", score: nextScore });
      if (nextWins >= 5 || nextStreak >= 5) {
        unlockAchievement(currentUser.username, "rps-champion");
      }
      soundEffects.beep(720, 0.08, "triangle", 0.03);
      return;
    }

    if (outcome === "lose") {
      const nextLosses = losses + 1;
      const finalScore = wins * 3 + draws;
      setLosses(nextLosses);
      setStreak(0);
      setResult("You lost the round.");
      rewardPlayer({
        username: currentUser.username,
        gameId: "rock-paper-scissors",
        score: finalScore,
        highScore: wins >= 3,
      });
      submitScore({ username: currentUser.username, gameId: "rock-paper-scissors", score: finalScore });
      triggerGameOver("Round lost. Reset your streak and go again.");
      return;
    }

    setDraws((prev) => prev + 1);
    setResult("Draw. Throw again.");
    soundEffects.beep(480, 0.06, "square", 0.02);
  };

  const resetSession = () => {
    setPlayerMove(null);
    setBotMove(null);
    setResult("Choose your throw to start the duel.");
    setWins(0);
    setLosses(0);
    setDraws(0);
    setStreak(0);
    soundEffects.button();
  };

  return (
    <GameLayout
      title="Rock Paper Scissors"
      subtitle="Throw hands against the arcade AI and stack up wins, streaks, and score."
      sideContent={() => (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Wins</span>
            <strong>{wins}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Losses</span>
            <strong>{losses}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Draws</span>
            <strong>{draws}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Win Streak</span>
            <strong>{streak}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Reach 5 wins in one session to unlock the RPS Champion badge.
          </p>
          <button className="secondary-button" onClick={resetSession}>
            Reset Session
          </button>
        </div>
      )}
    >
      <div style={{ display: "grid", gap: 24 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <div className="glass-panel" style={{ borderRadius: 24, padding: 24, textAlign: "center" }}>
            <div className="meta-label">Your Throw</div>
            <div style={{ fontSize: "4rem", marginTop: 10 }}>{playerEmoji}</div>
          </div>
          <div className="glass-panel" style={{ borderRadius: 24, padding: 24, textAlign: "center" }}>
            <div className="meta-label">Arcade AI</div>
            <div style={{ fontSize: "4rem", marginTop: 10 }}>{botEmoji}</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {MOVES.map((move) => (
            <button
              key={move.id}
              className="glass-panel"
              onClick={() => handleMove(move.id)}
              style={{
                borderRadius: 22,
                padding: "22px 18px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
            >
              <div style={{ fontSize: "2.5rem", color: "#ffffff" }}>{move.emoji}</div>
              <strong style={{ display: "block", marginTop: 10, color: "#ffffff" }}>{move.label}</strong>
            </button>
          ))}
        </div>

        <div
          className="glass-panel"
          style={{
            borderRadius: 22,
            padding: 20,
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          {result}
        </div>
      </div>
    </GameLayout>
  );
}

export default RockPaperScissorsPage;
