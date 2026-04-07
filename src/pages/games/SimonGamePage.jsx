import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GameLayout from "../../components/GameLayout";
import { soundEffects } from "../../utils/audio";

const PADS = [
  { id: 0, color: "#33d1ff", label: "Blue" },
  { id: 1, color: "#ff4dbd", label: "Pink" },
  { id: 2, color: "#7dff7a", label: "Green" },
  { id: 3, color: "#ffb347", label: "Gold" },
];

function SimonGamePage() {
  const appState = useOutletContext();
  const { currentUser, rewardPlayer, submitScore, triggerGameOver } = appState;
  const [sequence, setSequence] = useState([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [activePad, setActivePad] = useState(null);
  const [status, setStatus] = useState("Press start to begin.");
  const [strictMode, setStrictMode] = useState(false);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  const score = sequence.length ? sequence.length - 1 : 0;

  const blinkPad = (padId, duration = 480) =>
    new Promise((resolve) => {
      setActivePad(padId);
      soundEffects.beep(240 + padId * 120, duration / 1000, "triangle", 0.03);
      window.setTimeout(() => {
        setActivePad(null);
        resolve();
      }, duration);
    });

  const playSequence = async (items) => {
    setLocked(true);
    for (const padId of items) {
      await blinkPad(padId, 420);
      await new Promise((resolve) => window.setTimeout(resolve, 180));
    }
    setLocked(false);
  };

  const addStep = async (baseSequence = []) => {
    const nextPad = Math.floor(Math.random() * PADS.length);
    const nextSequence = [...baseSequence, nextPad];
    setSequence(nextSequence);
    setInputIndex(0);
    setLocked(true);
    setStatus(`Level ${nextSequence.length}: watch the new color.`);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    await blinkPad(nextPad, 520);
    setLocked(false);
  };

  const startGame = async () => {
    soundEffects.start();
    setStarted(true);
    setSequence([]);
    setInputIndex(0);
    setStatus("Initializing sequence...");
    await addStep([]);
  };

  const handleFailure = async () => {
    triggerGameOver(strictMode ? "Wrong input. Sequence reset." : "Wrong input. Watch the replay.");
    if (sequence.length > 1) {
      rewardPlayer({ username: currentUser.username, gameId: "simon", score, highScore: score >= 6 });
      submitScore({ username: currentUser.username, gameId: "simon", score });
    }

    if (strictMode) {
      setStatus("Wrong input. Strict mode reset the sequence.");
      setStarted(false);
      setSequence([]);
      setInputIndex(0);
      setLocked(false);
      return;
    }

    setStatus("Wrong input. Replaying sequence...");
    await playSequence(sequence);
    setInputIndex(0);
    setStatus("Repeat the full sequence.");
  };

  const handlePadClick = async (padId) => {
    if (!started || locked) {
      return;
    }

    await blinkPad(padId, 220);
    const expected = sequence[inputIndex];
    if (expected !== padId) {
      handleFailure();
      return;
    }

    const nextIndex = inputIndex + 1;
    setInputIndex(nextIndex);

    if (nextIndex === sequence.length) {
      const nextScore = sequence.length;
      if (nextScore >= 10) {
        rewardPlayer({
          username: currentUser.username,
          gameId: "simon",
          score: nextScore,
          won: true,
          highScore: true,
        });
        submitScore({ username: currentUser.username, gameId: "simon", score: nextScore });
        setStatus("Perfect memory streak. Starting next level...");
      } else {
        setStatus("Sequence cleared. Adding a new step...");
      }
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      await addStep(sequence);
      return;
    }

    setStatus("Keep going...");
  };

  const sideContent = useMemo(
    () => () => (
      <div style={{ display: "grid", gap: 18 }}>
        <div>
          <div className="meta-label">Rules</div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Each round flashes only the newly added color. You still need to repeat the entire sequence from memory.
          </p>
        </div>
        <div className="pill" style={{ justifyContent: "space-between" }}>
          <span>Current Score</span>
          <strong>{score}</strong>
        </div>
        <div className="pill" style={{ justifyContent: "space-between" }}>
          <span>Mode</span>
          <strong>{strictMode ? "Strict" : "Normal"}</strong>
        </div>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>{status}</p>
      </div>
    ),
    [score, strictMode, status]
  );

  return (
    <GameLayout title="Simon Game" subtitle="Track the growing pattern and keep your nerve under neon pressure." sideContent={sideContent}>
      <div style={{ display: "grid", gap: 22 }}>
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                style={{
                  aspectRatio: "1 / 1",
                  border: "none",
                  borderRadius: 28,
                  background: pad.color,
                  opacity: isActive ? 1 : 0.74,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  boxShadow: isActive ? `0 0 34px ${pad.color}` : `0 0 18px ${pad.color}66`,
                  transition: "all 160ms ease",
                }}
              />
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="primary-button" onClick={startGame}>
            Start
          </button>
          <button className="secondary-button" onClick={() => setStrictMode((prev) => !prev)}>
            Strict Mode: {strictMode ? "On" : "Off"}
          </button>
        </div>
      </div>
    </GameLayout>
  );
}

export default SimonGamePage;
