const particles = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${10 + Math.random() * 12}s`,
  size: `${2 + Math.random() * 4}px`,
  opacity: 0.35 + Math.random() * 0.5,
}));

function ParticleBackground() {
  return (
    <div className="particle-layer" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            bottom: "-8%",
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default ParticleBackground;
