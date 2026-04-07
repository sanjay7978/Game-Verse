import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { THEME_OPTIONS } from "../utils/storage";
import { fadeUp, pageVariants, staggerContainer, viewportOnce } from "../utils/motion";

function SettingsPage() {
  const { themeId, setTheme } = useOutletContext();

  return (
    <motion.div className="page-stack" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.section
        className="glass-panel"
        style={{ borderRadius: 28, padding: 28, display: "grid", gap: 18 }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div>
          <div className="meta-label">Visual Systems</div>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Settings
          </h1>
          <p className="section-copy">Swap neon colorways and keep your preferred arcade atmosphere saved locally.</p>
        </div>

        <motion.div className="stats-grid" variants={staggerContainer}>
          {Object.values(THEME_OPTIONS).map((theme) => (
            <motion.button
              key={theme.id}
              className="glass-panel"
              onClick={() => setTheme(theme.id)}
              style={{
                borderRadius: 22,
                padding: 20,
                textAlign: "left",
                borderColor: themeId === theme.id ? "rgba(69, 214, 255, 0.38)" : undefined,
                boxShadow: themeId === theme.id ? "0 0 32px rgba(69, 214, 255, 0.18)" : undefined,
              }}
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -4, boxShadow: "0 0 32px rgba(69, 214, 255, 0.22)" }}
            >
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {theme.preview.map((color) => (
                  <span
                    key={color}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 20px ${color}`,
                    }}
                  />
                ))}
              </div>
              <strong style={{ color: "#ffffff" }}>{theme.label}</strong>
              <p style={{ margin: "8px 0 0", color: "#ffffff" }}>{theme.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}

export default SettingsPage;
