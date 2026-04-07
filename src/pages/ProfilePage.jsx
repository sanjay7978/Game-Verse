import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import ProgressBar from "../components/ProgressBar";
import { ACHIEVEMENT_LIST, GAME_CATALOG, getLevelInfo } from "../utils/storage";
import { fadeUp, pageVariants, staggerContainer, viewportOnce } from "../utils/motion";

function ProfilePage() {
  const { currentUser } = useOutletContext();
  const levelInfo = getLevelInfo(currentUser.totalXP);

  const stats = useMemo(
    () =>
      GAME_CATALOG.map((game) => ({
        ...game,
        playData: currentUser.stats[game.id] ?? { plays: 0, bestScore: 0, lastScore: 0 },
      })),
    [currentUser.stats]
  );

  return (
    <motion.div className="page-stack" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.section
        className="glass-panel"
        style={{ borderRadius: 28, padding: 28 }}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div
            aria-hidden="true"
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: "2rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, rgba(149, 92, 255, 0.82), rgba(69, 214, 255, 0.82))",
            }}
          >
            {currentUser.avatar ?? "🎮"}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="meta-label">Pilot Profile</div>
            <h1 className="section-title" style={{ marginBottom: 8 }}>
              {currentUser.username}
            </h1>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Level {levelInfo.level}</span>
                <span>{levelInfo.currentLevelXP} / 50 XP</span>
              </div>
              <ProgressBar value={levelInfo.currentLevelXP} max={50} />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="leaderboard-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {stats.map((game) => (
          <motion.div key={game.id} className="glass-panel" style={{ borderRadius: 22, padding: 20 }} variants={fadeUp}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{game.title}</strong>
              <span>{game.icon}</span>
            </div>
            <div style={{ color: "var(--text-secondary)", marginTop: 14, display: "grid", gap: 6 }}>
              <span>Plays: {game.playData.plays}</span>
              <span>Best Score: {game.playData.bestScore}</span>
              <span>Last Score: {game.playData.lastScore}</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        className="glass-panel"
        style={{ borderRadius: 28, padding: 28 }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="meta-label">Achievements</div>
        <h2 style={{ margin: "8px 0 18px", fontFamily: '"Orbitron", sans-serif' }}>Badge Vault</h2>
        <div className="stats-grid">
          {ACHIEVEMENT_LIST.map((achievement) => {
            const unlocked = currentUser.achievements.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: unlocked ? "rgba(69, 214, 255, 0.12)" : "rgba(255, 255, 255, 0.04)",
                  border: `1px solid ${unlocked ? "rgba(69, 214, 255, 0.28)" : "rgba(255, 255, 255, 0.08)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{achievement.title}</strong>
                  <span>{unlocked ? "Unlocked" : "Locked"}</span>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-secondary)" }}>{achievement.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}

export default ProfilePage;
