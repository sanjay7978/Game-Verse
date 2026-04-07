import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "../utils/motion";

function easeOutExpo(progress) {
  return progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
}

function StatsCard({ icon, label, value, suffix = "" }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    let frameId = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const nextValue = Math.round(value * easeOutExpo(progress));
      setCount(nextValue);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [value, visible]);

  return (
    <motion.article
      ref={cardRef}
      className={`footer-stat-card ${visible ? "is-visible" : ""}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="footer-stat-icon">{icon}</div>
      <div>
        <div className="footer-stat-label">{label}</div>
        <div className="footer-stat-value">
          {count.toLocaleString()}
          {suffix}
        </div>
      </div>
    </motion.article>
  );
}

export default StatsCard;
