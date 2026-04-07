import { NavLink, Outlet } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import ProgressBar from "./ProgressBar";
import LevelUpPopup from "./LevelUpPopup";
import GameOverPopup from "./GameOverPopup";
import Footer from "./Footer";
import { getLevelInfo } from "../utils/storage";
import { soundEffects } from "../utils/audio";

function Layout({ appState }) {
  const { currentUser, logout, levelUpState, gameOverState } = appState;
  const levelInfo = getLevelInfo(currentUser.totalXP);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <div className="app-shell">
      <ParticleBackground />
      <div className="container page-stack">
        <header
          className="glass-panel"
          style={{
            borderRadius: 24,
            padding: "18px 22px",
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <NavLink
                to="/"
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: "clamp(1.3rem, 4vw, 1.9rem)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent-primary)",
                  textShadow: "0 0 22px rgba(69, 214, 255, 0.55)",
                }}
              >
                GameVerse
              </NavLink>
              <div className="pill">
                <span className="meta-label">Level</span>
                <strong>{levelInfo.level}</strong>
              </div>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => soundEffects.button()}
                  className="pill"
                  style={({ isActive }) => ({
                    borderColor: isActive ? "rgba(69, 214, 255, 0.38)" : undefined,
                    boxShadow: isActive ? "0 0 18px rgba(69, 214, 255, 0.2)" : undefined,
                    color: isActive ? "var(--accent-primary)" : "var(--text-primary)",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div style={{ minWidth: "min(100%, 280px)", width: 320, display: "grid", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "flex-end" }}>
              <div style={{ textAlign: "right" }}>
                <div className="meta-label">Pilot</div>
                <strong>{currentUser.username}</strong>
              </div>
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(149, 92, 255, 0.9), rgba(69, 214, 255, 0.85))",
                  boxShadow: "0 0 28px rgba(69, 214, 255, 0.28)",
                  fontWeight: 700,
                  fontSize: "1.45rem",
                }}
              >
                {currentUser.avatar ?? "🎮"}
              </div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>XP Progress</span>
                <span>
                  {levelInfo.currentLevelXP} / 50 XP
                </span>
              </div>
              <ProgressBar value={levelInfo.currentLevelXP} max={50} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="ghost-button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main>
          <Outlet context={appState} />
        </main>

        <Footer appState={appState} />
      </div>

      <LevelUpPopup state={levelUpState} />
      <GameOverPopup state={gameOverState} />
    </div>
  );
}

export default Layout;
