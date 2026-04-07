import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import SocialIcons from "./SocialIcons";
import { getGlobalSoundEnabled, setGlobalSoundEnabled, soundEffects } from "../utils/audio";
import { fadeUp, footerReveal, staggerContainer, viewportOnce } from "../utils/motion";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

function Footer({ appState }) {
  const { users, leaderboard } = appState;
  const [soundOn, setSoundOn] = useState(getGlobalSoundEnabled());
  const [sequence, setSequence] = useState([]);
  const [secretMode, setSecretMode] = useState(false);

  const stats = useMemo(() => {
    const playerCount = Object.keys(users).length || 1;
    const gamesPlayed = Object.values(users).reduce((sum, user) => {
      const plays = Object.values(user.stats ?? {}).reduce((innerSum, stat) => innerSum + (stat.plays ?? 0), 0);
      return sum + plays;
    }, 0);
    const highestScore = leaderboard.reduce((max, entry) => Math.max(max, entry.score), 0);

    return {
      totalPlayers: playerCount,
      gamesPlayed,
      highestScore,
    };
  }, [leaderboard, users]);

  useEffect(() => {
    const onKeyDown = (event) => {
      setSequence((prev) => {
        const next = [...prev, event.key].slice(-KONAMI.length);
        const matched = KONAMI.every((key, index) => key === next[index]);
        if (matched) {
          setSecretMode(true);
          soundEffects.levelUp();
          window.setTimeout(() => setSecretMode(false), 2600);
          return [];
        }
        return next;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setGlobalSoundEnabled(next);
    if (next) {
      soundEffects.button();
    }
  };

  return (
    <>
      <motion.footer
        className="gameverse-footer is-visible"
        variants={footerReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="footer-top-line" />
        <motion.div className="footer-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.section className="footer-brand" variants={fadeUp}>
            <div className="meta-label">Arcade Network</div>
            <h2 className="footer-brand-title">GameVerse</h2>
            <p className="footer-brand-copy">Level up your skills. Play. Compete. Dominate.</p>
            <p className="footer-brand-copy footer-brand-copy-large">
              A premium neon arena for quick reflex games, profile progression, leaderboard climbs,
              and late-night arcade sessions that actually feel alive.
            </p>
            <div className="footer-brand-chips">
              <span className="footer-mini-chip">Ranked Energy</span>
              <span className="footer-mini-chip">Live Progress</span>
              <span className="footer-mini-chip">Neon Lobby</span>
            </div>
            <div className="footer-brand-status">
              <div>
                <span className="meta-label">Arcade Status</span>
                <strong>Online</strong>
              </div>
              <div>
                <span className="meta-label">Current Season</span>
                <strong>Neon Drift</strong>
              </div>
            </div>
            <div className="footer-brand-aurora" aria-hidden="true" />
          </motion.section>

          <motion.section className="footer-block" variants={fadeUp}>
            <div className="footer-block-heading">Live Player Stats</div>
            <div className="footer-stats-grid">
              <StatsCard icon="👤" label="Total Players" value={stats.totalPlayers} />
              <StatsCard icon="🎮" label="Games Played" value={stats.gamesPlayed} />
              <StatsCard icon="🏆" label="Highest Score" value={stats.highestScore} />
            </div>
          </motion.section>

          <motion.section className="footer-block" variants={fadeUp}>
            <div className="footer-block-heading">Community</div>
            <SocialIcons />

            <div className="footer-community-note">
              Drop into the social feed, share runs, flex scores, and keep the arcade noise alive.
            </div>

            <div className="footer-block-heading" style={{ marginTop: 22 }}>
              Settings
            </div>
            <div className="footer-switches">
              <button className="footer-switch-row" onClick={handleSoundToggle}>
                <span>🔊 Sound {soundOn ? "On" : "Off"}</span>
                <span className={`footer-switch ${soundOn ? "is-on" : ""}`}>
                  <span className="footer-switch-thumb" />
                </span>
              </button>
            </div>

            <div className="footer-credit-line">Built by Sanjay 🚀</div>
          </motion.section>
        </motion.div>

        <div className="footer-legal">
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
          </div>
          <div>Copyright © 2026 GameVerse</div>
        </div>
      </motion.footer>

      {secretMode ? (
        <div className="footer-secret-popup" aria-live="polite">
          <div className="footer-secret-card">Secret Mode Activated 🎮</div>
        </div>
      ) : null}
    </>
  );
}

export default Footer;
