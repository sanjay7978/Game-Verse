import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { soundEffects } from "../utils/audio";
import { fadeUp, hoverLift } from "../utils/motion";

const MotionLink = motion(Link);

function GameCard({ game }) {
  return (
    <MotionLink
      to={game.path}
      onClick={() => soundEffects.button()}
      className="glass-panel"
      style={{
        borderRadius: 24,
        padding: 22,
        display: "grid",
        gap: 14,
        minHeight: 220,
        transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
      }}
      variants={fadeUp}
      whileHover={hoverLift}
    >
      <div
        aria-hidden="true"
        style={{
          width: 54,
          height: 54,
          display: "grid",
          placeItems: "center",
          borderRadius: 16,
          fontSize: "1.6rem",
          background: "linear-gradient(135deg, rgba(149, 92, 255, 0.28), rgba(69, 214, 255, 0.24))",
          boxShadow: "0 0 24px rgba(69, 214, 255, 0.2)",
        }}
      >
        {game.icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontFamily: '"Orbitron", sans-serif', fontSize: "1.12rem" }}>
          {game.title}
        </h3>
        <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {game.description}
        </p>
      </div>
      <div className="pill" style={{ marginTop: "auto", width: "fit-content", color: "var(--accent-primary)" }}>
        Launch Game
      </div>
    </MotionLink>
  );
}

export default GameCard;
