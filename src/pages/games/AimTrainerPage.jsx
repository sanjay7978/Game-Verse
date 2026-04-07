import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GameLayout from "../../components/GameLayout";
import { soundEffects } from "../../utils/audio";

function randomTarget() {
  return {
    x: 10 + Math.random() * 80,
    y: 12 + Math.random() * 72,
    size: 58 - Math.random() * 20,
  };
}

function AimTrainerPage() {
  const appState = useOutletContext();
  const { currentUser, rewardPlayer, submitScore, unlockAchievement, triggerGameOver } = appState;
  const [mode, setMode] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [target, setTarget] = useState(randomTarget());
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      setTimeLeft(mode);
    }
  }, [mode, running]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [running]);

  useEffect(() => {
    if (running || timeLeft !== 0 || finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    const totalClicks = hits + misses;
    const accuracy = totalClicks ? Math.round((hits / totalClicks) * 100) : 0;
    rewardPlayer({
      username: currentUser.username,
      gameId: "aim-trainer",
      score: hits,
      highScore: hits >= 15,
      won: hits >= 18,
    });
    submitScore({ username: currentUser.username, gameId: "aim-trainer", score: hits });
    if (hits >= 18) {
      unlockAchievement(currentUser.username, "sharp-shooter");
    }
    triggerGameOver(`Time up. Hits ${hits}, misses ${misses}, accuracy ${accuracy}%.`);
  }, [
    currentUser.username,
    hits,
    misses,
    rewardPlayer,
    running,
    submitScore,
    timeLeft,
    triggerGameOver,
    unlockAchievement,
  ]);

  const startGame = () => {
    finishedRef.current = false;
    setStarted(true);
    setTimeLeft(mode);
    setHits(0);
    setMisses(0);
    setTarget(randomTarget());
    setRunning(true);
    soundEffects.start();
  };

  const hitTarget = () => {
    if (!running) {
      return;
    }
    setHits((prev) => prev + 1);
    setTarget(randomTarget());
    soundEffects.beep(740, 0.09, "square", 0.03);
  };

  const accuracy = useMemo(() => {
    const totalClicks = hits + misses;
    return totalClicks ? Math.round((hits / totalClicks) * 100) : 0;
  }, [hits, misses]);

  const handleArenaClick = (event) => {
    if (!running) {
      return;
    }

    if (event.target.dataset.role === "target") {
      return;
    }

    setMisses((prev) => prev + 1);
    soundEffects.beep(220, 0.06, "sawtooth", 0.02);
  };

  return (
    <GameLayout
      title="Aim Trainer"
      subtitle="Snap onto randomized targets before the clock burns down."
      sideContent={() => (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Time Left</span>
            <strong>{timeLeft}s</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Hits</span>
            <strong>{hits}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Misses</span>
            <strong>{misses}</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Accuracy</span>
            <strong>{accuracy}%</strong>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Hit 18+ in one run to unlock the <strong>Sharp Shooter</strong> badge.
          </p>
        </div>
      )}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[30, 60].map((seconds) => (
            <button
              key={seconds}
              className={mode === seconds ? "primary-button" : "ghost-button"}
              onClick={() => setMode(seconds)}
            >
              {seconds}s Mode
            </button>
          ))}
          <button className="secondary-button" onClick={startGame}>
            {started ? "Restart Game" : "Start Game"}
          </button>
        </div>

        <div
          className="glass-panel"
          onClick={handleArenaClick}
          style={{
            position: "relative",
            minHeight: 420,
            borderRadius: 24,
            overflow: "hidden",
            background:
              "radial-gradient(circle at center, rgba(69, 214, 255, 0.08), transparent 35%), rgba(0, 0, 0, 0.18)",
          }}
        >
          {running ? (
            <button
              aria-label="Aim target"
              onClick={hitTarget}
              data-role="target"
              style={{
                position: "absolute",
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: target.size,
                height: target.size,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.9)",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.9) 10%, rgba(255,77,141,0.9) 12%, rgba(255,77,141,0.85) 28%, rgba(69,214,255,0.85) 30%, rgba(69,214,255,0.3) 56%, transparent 58%)",
                boxShadow: "0 0 28px rgba(69, 214, 255, 0.35)",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                padding: 24,
              }}
            >
              <div style={{ display: "grid", gap: 10 }}>
                <div className="meta-label">Aim Chamber</div>
                <h3 style={{ margin: "10px 0 8px", fontFamily: '"Orbitron", sans-serif' }}>
                  Select a mode and press Start Game
                </h3>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                  Current mode: {mode}s. Hits and misses only start counting after launch.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}

export default AimTrainerPage;
