import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { GAME_CATALOG } from "../utils/storage";
import { fadeUp, pageVariants, staggerContainer, viewportOnce } from "../utils/motion";

function LeaderboardPage() {
  const { leaderboard, currentUser } = useOutletContext();

  const topByGame = useMemo(() => {
    return GAME_CATALOG.map((game) => ({
      ...game,
      entries: Array.from(
        leaderboard
          .filter((entry) => entry.gameId === game.id)
          .reduce((acc, entry) => {
            const existing = acc.get(entry.username);
            if (
              !existing ||
              entry.score > existing.score ||
              (entry.score === existing.score &&
                new Date(entry.createdAt) > new Date(existing.createdAt))
            ) {
              acc.set(entry.username, entry);
            }
            return acc;
          }, new Map()).values()
      )
        .sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    }));
  }, [leaderboard]);

  return (
    <motion.div className="page-stack" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.section
        className="glass-panel"
        style={{ borderRadius: 28, padding: 28 }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div className="meta-label" variants={fadeUp}>Top Scores</motion.div>
        <motion.h1 className="section-title" style={{ marginBottom: 8 }} variants={fadeUp}>
          Leaderboard
        </motion.h1>
        <motion.p className="section-copy" variants={fadeUp}>
          Top local scores per game, with your runs highlighted in the neon stack.
        </motion.p>
      </motion.section>

      <motion.div
        className="leaderboard-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {topByGame.map((game) => (
          <motion.section key={game.id} className="glass-panel" style={{ borderRadius: 24, padding: 22 }} variants={fadeUp}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h2 style={{ margin: 0, fontFamily: '"Orbitron", sans-serif', fontSize: "1.05rem" }}>
                {game.title}
              </h2>
              <span style={{ fontSize: "1.4rem" }}>{game.icon}</span>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {game.entries.length ? (
                game.entries.map((entry, index) => {
                  const isCurrent = entry.username === currentUser.username;
                  return (
                    <div
                      key={entry.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "42px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        padding: "12px 14px",
                        borderRadius: 18,
                        background: isCurrent ? "rgba(69, 214, 255, 0.12)" : "rgba(255, 255, 255, 0.04)",
                        border: `1px solid ${isCurrent ? "rgba(69, 214, 255, 0.32)" : "rgba(255, 255, 255, 0.08)"}`,
                      }}
                    >
                      <strong>#{index + 1}</strong>
                      <div>
                        <div>{entry.username}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>{entry.gameName}</div>
                      </div>
                      <strong style={{ color: "var(--accent-primary)" }}>{entry.score}</strong>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: "var(--text-secondary)" }}>No scores yet. Start the first run.</div>
              )}
            </div>
          </motion.section>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default LeaderboardPage;
