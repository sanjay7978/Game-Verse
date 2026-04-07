function GameOverPopup({ state }) {
  if (!state) {
    return null;
  }

  return (
    <div className="levelup-overlay" aria-live="polite">
      <div className="gameover-card">
        <span className="gameover-ring" />
        <span className="gameover-ring" />
        <span className="gameover-ring" />
        <div className="meta-label">Arcade Alert</div>
        <h2
          style={{
            margin: "10px 0 6px",
            fontFamily: '"Orbitron", sans-serif',
            letterSpacing: "0.12em",
            color: "var(--danger)",
          }}
        >
          GAME OVER
        </h2>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>{state.message}</p>
      </div>
    </div>
  );
}

export default GameOverPopup;
