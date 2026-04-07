function ProgressBar({ value, max }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="progress-shell">
      <div className="progress-fill" style={{ width: `${width}%` }} />
    </div>
  );
}

export default ProgressBar;
