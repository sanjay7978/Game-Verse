function LevelUpPopup({ state }) {
  if (!state) {
    return null;
  }

  return (
    <div className="levelup-overlay" aria-live="polite">
      <div className="levelup-card">
        <span className="burst" />
        <span className="burst" />
        <span className="burst" />
        <span className="burst" />
        <span className="burst" />
        <div className="meta-label">Arcade Rank Increased</div>
        <h2
          style={{
            margin: "10px 0 6px",
            fontFamily: '"Orbitron", sans-serif',
            letterSpacing: "0.16em",
            color: "var(--accent-primary)",
          }}
        >
          LEVEL UP!
        </h2>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          Level {state.from} to Level {state.to}
        </p>
      </div>
    </div>
  );
}

export default LevelUpPopup;
