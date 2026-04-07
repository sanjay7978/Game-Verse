let audioContext;

function safeReadBoolean(key, fallback) {
  try {
    if (typeof window === "undefined") {
      return fallback;
    }

    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return typeof parsed === "boolean" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage write failures so UI still works.
  }
}

let soundEnabled = safeReadBoolean("gameverse-sound-enabled", true);

function getContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = AudioCtx ? new AudioCtx() : null;
  }
  return audioContext;
}

function playTone({
  frequency = 440,
  duration = 0.12,
  type = "sine",
  volume = 0.04,
  attack = 0.01,
  release = 0.08,
}) {
  if (!soundEnabled) {
    return;
  }

  const context = getContext();
  if (!context) {
    return;
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + release);
}

export function unlockAudio() {
  const context = getContext();
  if (context?.state === "suspended") {
    context.resume();
  }
}

export function setGlobalSoundEnabled(enabled) {
  soundEnabled = enabled;
  safeWrite("gameverse-sound-enabled", enabled);
}

export function getGlobalSoundEnabled() {
  return soundEnabled;
}

export const soundEffects = {
  button: () => playTone({ frequency: 540, duration: 0.06, type: "triangle", volume: 0.025 }),
  start: () => {
    playTone({ frequency: 360, duration: 0.08, type: "sawtooth", volume: 0.02 });
    window.setTimeout(() => playTone({ frequency: 520, duration: 0.1, type: "triangle", volume: 0.024 }), 60);
  },
  gameOver: () => {
    playTone({ frequency: 240, duration: 0.15, type: "sawtooth", volume: 0.03 });
    window.setTimeout(() => playTone({ frequency: 170, duration: 0.22, type: "triangle", volume: 0.024 }), 120);
  },
  levelUp: () => {
    playTone({ frequency: 520, duration: 0.1, type: "triangle", volume: 0.03 });
    window.setTimeout(() => playTone({ frequency: 680, duration: 0.12, type: "triangle", volume: 0.03 }), 80);
    window.setTimeout(() => playTone({ frequency: 880, duration: 0.18, type: "sine", volume: 0.026 }), 160);
  },
  beep: (frequency, duration, type = "sine", volume = 0.03) =>
    playTone({ frequency, duration, type, volume }),
};
