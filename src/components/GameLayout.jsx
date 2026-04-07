import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { soundEffects } from "../utils/audio";
import { fadeUp, pageVariants, scaleIn, staggerContainer, viewportOnce } from "../utils/motion";

function GameLayout({ title, subtitle, sideContent, children }) {
  const appState = useOutletContext();

  return (
    <motion.div className="page-stack" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.div
        style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={scaleIn}>
          <motion.div className="meta-label" variants={fadeUp}>Arcade Mode</motion.div>
          <motion.h1 className="section-title" variants={scaleIn}>{title}</motion.h1>
          <motion.p className="section-copy" variants={fadeUp}>{subtitle}</motion.p>
        </motion.div>
        <Link
          to="/"
          className="back-arcade-link"
          onClick={() => soundEffects.button()}
        >
          <span style={{ fontSize: "1.15rem" }}>⬅</span>
          <span>Back to Arcade</span>
        </Link>
      </motion.div>

      <motion.div
        className="game-stage"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.section className="glass-panel game-board" variants={fadeUp}>
          {children}
        </motion.section>
        <motion.aside className="glass-panel side-panel" variants={fadeUp}>
          {sideContent(appState)}
        </motion.aside>
      </motion.div>
    </motion.div>
  );
}

export default GameLayout;
