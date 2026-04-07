import { useState } from "react";
import { motion } from "framer-motion";
import { AVATAR_OPTIONS } from "../utils/storage";
import { fadeUp, pageVariants, scaleIn, staggerContainer } from "../utils/motion";
import {
  PASSWORD_REGEX,
  PASSWORD_RULE_TEXT,
  USERNAME_REGEX,
  USERNAME_RULE_TEXT,
} from "../utils/validation";

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "", avatar: AVATAR_OPTIONS[0] });
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!USERNAME_REGEX.test(form.username.trim())) {
      setMessage(USERNAME_RULE_TEXT);
      return;
    }

    if (mode === "signup" && !PASSWORD_REGEX.test(form.password)) {
      setMessage(PASSWORD_RULE_TEXT);
      return;
    }

    const result = onAuth({ mode, ...form });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("");
  };

  return (
    <motion.div
      className="app-shell"
      style={{ display: "grid", placeItems: "center" }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container">
        <motion.div
          className="glass-panel"
          style={{
            width: "min(100%, 460px)",
            margin: "0 auto",
            borderRadius: 30,
            padding: "34px 30px",
            position: "relative",
            overflow: "hidden",
          }}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "auto -70px -110px auto",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(149, 92, 255, 0.44), transparent 68%)",
            }}
          />
          <motion.div
            style={{ textAlign: "center", display: "grid", gap: 14, position: "relative" }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="meta-label" variants={fadeUp}>Neon Arcade Access</motion.div>
            <motion.h1 className="section-title" style={{ marginBottom: 0 }} variants={fadeUp}>
              GameVerse
            </motion.h1>
            <motion.p className="section-copy" variants={fadeUp}>
              Step into the grid. Sign in or create a new pilot profile.
            </motion.p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "28px 0 22px" }}>
            {["login", "signup"].map((value) => (
              <button
                key={value}
                type="button"
                className={mode === value ? "primary-button" : "ghost-button"}
                onClick={() => setMode(value)}
              >
                {value === "login" ? "Login" : "Signup"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              <span className="meta-label">Username</span>
              <input
                className="input-field"
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="ArcadePilot"
              />
              <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {USERNAME_RULE_TEXT}
              </span>
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span className="meta-label">Password</span>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="••••••••"
              />
              {mode === "signup" ? (
                <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  {PASSWORD_RULE_TEXT}
                </span>
              ) : null}
            </label>

            {mode === "signup" ? (
              <div style={{ display: "grid", gap: 10 }}>
                <span className="meta-label">Choose Your Avatar</span>
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  }}
                >
                  {AVATAR_OPTIONS.map((avatar) => {
                    const selected = form.avatar === avatar;
                    return (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, avatar }))}
                        style={{
                          aspectRatio: "1 / 1",
                          borderRadius: 18,
                          border: `1px solid ${selected ? "rgba(69, 214, 255, 0.46)" : "rgba(255,255,255,0.08)"}`,
                          background: selected
                            ? "linear-gradient(135deg, rgba(69, 214, 255, 0.22), rgba(149, 92, 255, 0.2))"
                            : "rgba(255,255,255,0.04)",
                          boxShadow: selected ? "0 0 24px rgba(69, 214, 255, 0.22)" : "none",
                          fontSize: "1.8rem",
                        }}
                      >
                        {avatar}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {message ? <div style={{ color: "var(--warning)" }}>{message}</div> : null}

            <motion.button
              type="submit"
              className="primary-button"
              whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(69, 214, 255, 0.32)" }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: "easeOut" }}
            >
              Enter Arcade
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AuthPage;
