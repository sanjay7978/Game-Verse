import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import GameLayout from "../../components/GameLayout";
import { soundEffects } from "../../utils/audio";

const CELLS = Array.from({ length: 9 }, (_, index) => index);

function WhackAMolePage() {
  const appState = useOutletContext();
  const { currentUser, rewardPlayer, submitScore, triggerGameOver } = appState;
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [moleIndex, setMoleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const moleTimer = window.setInterval(() => setMoleIndex(Math.floor(Math.random() * CELLS.length)), 650);
    const clock = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(clock);
          window.clearInterval(moleTimer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(clock);
      window.clearInterval(moleTimer);
    };
  }, [running]);

  useEffect(() => {
    if (running || timeLeft !== 0 || finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    rewardPlayer({
      username: currentUser.username,
      gameId: "whack-a-mole",
      score,
      highScore: score >= 12,
      won: score >= 15,
    });
    submitScore({ username: currentUser.username, gameId: "whack-a-mole", score });
    triggerGameOver(`Round over. Final hits: ${score}.`);
  }, [currentUser.username, rewardPlayer, running, score, submitScore, timeLeft]);

  const startGame = () => {
    finishedRef.current = false;
    setRunning(true);
    setTimeLeft(20);
    setScore(0);
    setMoleIndex(Math.floor(Math.random() * CELLS.length));
    soundEffects.start();
  };

  const handleWhack = (index) => {
    if (!running || index !== moleIndex) {
      return;
    }
    setScore((prev) => prev + 1);
    setMoleIndex(Math.floor(Math.random() * CELLS.length));
    soundEffects.beep(520, 0.1, "square", 0.03);
  };

  return (
    <GameLayout
      title="Whack-a-Mole"
      subtitle="Stay sharp and smash the glowing mole as it bounces around the board."
      sideContent={() => (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Time Left</span>
            <strong>{timeLeft}s</strong>
          </div>
          <div className="pill" style={{ justifyContent: "space-between" }}>
            <span>Hits</span>
            <strong>{score}</strong>
          </div>
          <button className="primary-button" onClick={startGame}>
            Start Run
          </button>
        </div>
      )}
    >
      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(3, minmax(80px, 1fr))",
          maxWidth: 460,
          margin: "0 auto",
        }}
      >
        {CELLS.map((index) => {
          const active = running && index === moleIndex;
          return (
            <button
              key={index}
              onClick={() => handleWhack(index)}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: "22%",
                  borderRadius: "50%",
                  background: active
                    ? "radial-gradient(circle, rgba(255,255,255,0.92), rgba(255,193,94,0.95) 35%, rgba(255,77,141,0.85) 65%)"
                    : "rgba(255,255,255,0.05)",
                  transform: active ? "translateY(0)" : "translateY(120%)",
                  transition: "transform 140ms ease",
                  boxShadow: active ? "0 0 24px rgba(255, 193, 94, 0.28)" : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </GameLayout>
  );
}

export default WhackAMolePage;
