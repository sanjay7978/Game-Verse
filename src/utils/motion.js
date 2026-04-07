export const easeOut = [0.22, 1, 0.36, 1];

export const pageTransition = {
  duration: 0.5,
  ease: easeOut,
};

export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: pageTransition },
  exit: { opacity: 0, y: -18, transition: { duration: 0.4, ease: "easeOut" } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export const footerReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

export const hoverLift = {
  y: -6,
  scale: 1.05,
  boxShadow: "0 0 36px rgba(69, 214, 255, 0.24), 0 0 82px rgba(149, 92, 255, 0.16)",
  borderColor: "rgba(69, 214, 255, 0.38)",
  transition: { duration: 0.28, ease: "easeOut" },
};

export const viewportOnce = { once: true, amount: 0.2 };
