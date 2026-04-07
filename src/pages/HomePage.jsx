import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import GameCard from "../components/GameCard";
import { GAME_CATALOG } from "../utils/storage";
import { fadeUp, pageVariants, staggerContainer, viewportOnce } from "../utils/motion";

function HomePage() {
  const { currentUser } = useOutletContext();

  return (
    <motion.div className="page-stack" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.section
        className="glass-panel"
        style={{
          borderRadius: 28,
          padding: "30px 28px",
          display: "grid",
          gap: 16,
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div className="meta-label" variants={fadeUp}>Welcome Back</motion.div>
        <motion.h1 className="section-title" style={{ marginBottom: 0 }} variants={fadeUp}>
          SELECT YOUR GAME
        </motion.h1>
        <motion.p className="section-copy" variants={fadeUp}>
          {currentUser.username}, every run earns XP, pushes your rank, and unlocks new achievements.
        </motion.p>
      </motion.section>

      <motion.section
        className="card-grid"
        style={{
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {GAME_CATALOG.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </motion.section>
    </motion.div>
  );
}

export default HomePage;
