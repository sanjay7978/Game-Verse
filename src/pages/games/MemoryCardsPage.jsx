import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GameLayout from "../../components/GameLayout";
import { soundEffects } from "../../utils/audio";

const DIFFICULTIES = {
  easy: { size: 8, label: "Easy" },
  medium: { size: 12, label: "Medium" },
  hard: { size: 16, label: "Hard" },
};

const ICONS = ["🎮", "👾", "🕹️", "🎯", "🏆", "⚡", "🔥", "🐉"];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createDeck(difficulty) {
  const pairs = DIFFICULTIES[difficulty].size / 2;
  return shuffle(
    ICONS.slice(0, pairs).flatMap((icon, index) => [
      { id: `${index}-a`, icon, matched: false },
      { id: `${index}-b`, icon, matched: false },
    ])
  );
}

function MemoryCardsPage() {
  const appState = useOutletContext();
  const { currentUser, rewardPlayer, submitScore, unlockAchievement } = appState;
  const [difficulty, setDifficulty] = useState("easy");
  const [deck, setDeck] = useState(() => createDeck("easy"));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Match every neon pair.");
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timerId = window.setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => window.clearInterval(timerId);
  }, [running]);

  useEffect(() => {
    if (flipped.length !== 2) {
      return undefined;
    }

    const [firstId, secondId] = flipped;
    const firstCard = deck.find((card) => card.id === firstId);
    const secondCard = deck.find((card) => card.id === secondId);

    if (firstCard.icon === secondCard.icon) {
      setDeck((prev) => prev.map((card) => (flipped.includes(card.id) ? { ...card, matched: true } : card)));
      setFlipped([]);
      soundEffects.beep(680, 0.12, "triangle", 0.03);
      return undefined;
    }

    const timeout = window.setTimeout(() => setFlipped([]), 700);
    return () => window.clearTimeout(timeout);
  }, [deck, flipped]);

  useEffect(() => {
    const done = deck.length > 0 && deck.every((card) => card.matched);
    if (!done || !running || completedRef.current) {
      return;
    }

    completedRef.current = true;
    const score = Math.max(10, Math.round(200 - timer * 2 - moves * 3 + DIFFICULTIES[difficulty].size * 4));
    rewardPlayer({
      username: currentUser.username,
      gameId: "memory-cards",
      score,
      won: true,
      highScore: difficulty !== "easy",
    });
    submitScore({ username: currentUser.username, gameId: "memory-cards", score });
    if (difficulty === "hard") {
      unlockAchievement(currentUser.username, "memory-master");
    }
    soundEffects.start();
    setRunning(false);
    setStatus(`Board cleared in ${timer}s with ${moves} moves.`);
  }, [currentUser.username, deck, difficulty, moves, rewardPlayer, running, submitScore, timer, unlockAchievement]);

  const resetGame = (nextDifficulty = difficulty) => {
    completedRef.current = false;
    setDifficulty(nextDifficulty);
    setDeck(createDeck(nextDifficulty));
    setFlipped([]);
    setMoves(0);
    setTimer(0);
    setRunning(true);
    setStatus(`${DIFFICULTIES[nextDifficulty].label} mode active.`);
    soundEffects.button();
  };

  const handleCardClick = (cardId) => {
    if (flipped.length === 2 || flipped.includes(cardId)) {
      return;
    }

    const card = deck.find((item) => item.id === cardId);
    if (card.matched) {
      return;
    }

    if (!running) {
      setRunning(true);
    }

    setFlipped((prev) => [...prev, cardId]);
    if (flipped.length === 1) {
      setMoves((prev) => prev + 1);
    }
  };

  const revealed = useMemo(() => new Set([...flipped, ...deck.filter((card) => card.matched).map((card) => card.id)]), [deck, flipped]);

  return (
    <GameLayout
      title="Memory Cards"
      subtitle="Flip, remember, and clear the board before the timer drains your perfect run."
      sideContent={() => (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Difficulty</span>
            <strong>{DIFFICULTIES[difficulty].label}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Timer</span>
            <strong>{timer}s</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Moves</span>
            <strong>{moves}</strong>
          </div>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>{status}</p>
        </div>
      )}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(DIFFICULTIES).map(([key, value]) => (
            <button
              key={key}
              className={difficulty === key ? "primary-button" : "ghost-button"}
              onClick={() => resetGame(key)}
            >
              {value.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: `repeat(${difficulty === "hard" ? 4 : 4}, minmax(64px, 1fr))`,
          }}
        >
          {deck.map((card) => {
            const isVisible = revealed.has(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: isVisible
                    ? "linear-gradient(135deg, rgba(149, 92, 255, 0.7), rgba(69, 214, 255, 0.42))"
                    : "rgba(255,255,255,0.05)",
                  color: "var(--text-primary)",
                  fontSize: "1.8rem",
                  boxShadow: isVisible ? "0 0 22px rgba(69, 214, 255, 0.18)" : "none",
                }}
              >
                {isVisible ? card.icon : "?"}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}

export default MemoryCardsPage;
