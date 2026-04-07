export const STORAGE_KEYS = {
  USERS: "gameverse-users",
  CURRENT_USER: "gameverse-current-user",
  LEADERBOARD: "gameverse-leaderboard",
  THEME: "gameverse-theme",
};

export const GAME_CATALOG = [
  {
    id: "simon",
    title: "Simon Game",
    description: "Track the neon pattern and replay the full sequence without flinching.",
    icon: "🧠",
    path: "/games/simon",
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    description: "Match glowing card pairs across difficulty tiers with a live timer.",
    icon: "🃏",
    path: "/games/memory-cards",
  },
  {
    id: "aim-trainer",
    title: "Aim Trainer",
    description: "Chase randomized targets in 30s or 60s reflex drills.",
    icon: "🎯",
    path: "/games/aim-trainer",
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    description: "Hammer fast-moving moles across a glowing 3x3 arena.",
    icon: "🐹",
    path: "/games/whack-a-mole",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic grid duels with local PvP or a browser AI rival.",
    icon: "❌",
    path: "/games/tic-tac-toe",
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Throw quick hands against the arcade AI and build your win streak.",
    icon: "✊",
    path: "/games/rock-paper-scissors",
  },
];

export const AVATAR_OPTIONS = ["🎮", "👾", "🕹️", "🎯", "🏆", "⚡", "🔥", "💀", "🤖", "👽", "🦊", "🐉"];

export const ACHIEVEMENT_LIST = [
  {
    id: "sharp-shooter",
    title: "Sharp Shooter",
    description: "Post a high Aim Trainer score by landing at least 18 hits in one run.",
  },
  {
    id: "memory-master",
    title: "Memory Master",
    description: "Clear Memory Cards on hard mode to prove perfect recall.",
  },
  {
    id: "rps-champion",
    title: "RPS Champion",
    description: "Win 5 rounds of Rock Paper Scissors in one session.",
  },
];

export const ACHIEVEMENT_DEFS = ACHIEVEMENT_LIST.reduce((acc, achievement) => {
  acc[achievement.id] = achievement;
  return acc;
}, {});

export const THEME_OPTIONS = {
  neonBlue: {
    id: "neonBlue",
    label: "Neon Blue",
    description: "The default cyber arcade glow with cool blue and violet highlights.",
    preview: ["#45d6ff", "#955cff", "#d7f8ff"],
    variables: {
      "--bg-primary": "#050816",
      "--panel-bg": "rgba(18, 26, 54, 0.62)",
      "--panel-border": "rgba(132, 103, 255, 0.34)",
      "--text-primary": "#f3f7ff",
      "--text-secondary": "#a8b1d1",
      "--accent-primary": "#45d6ff",
      "--accent-secondary": "#955cff",
      "--grid-line": "rgba(106, 123, 255, 0.12)",
    },
  },
  cyberRed: {
    id: "cyberRed",
    label: "Cyber Red",
    description: "High-alert magenta and crimson energy with a dark combat deck.",
    preview: ["#ff547c", "#ff8d5c", "#ffe3ef"],
    variables: {
      "--bg-primary": "#15050c",
      "--panel-bg": "rgba(47, 12, 24, 0.62)",
      "--panel-border": "rgba(255, 84, 124, 0.28)",
      "--text-primary": "#fff4f8",
      "--text-secondary": "#d8a7b6",
      "--accent-primary": "#ff8d5c",
      "--accent-secondary": "#ff547c",
      "--grid-line": "rgba(255, 84, 124, 0.12)",
    },
  },
  matrixGreen: {
    id: "matrixGreen",
    label: "Matrix Green",
    description: "Emerald scanlines and terminal-lit panels for stealth sessions.",
    preview: ["#62ff9b", "#0fd46d", "#dfffea"],
    variables: {
      "--bg-primary": "#06140e",
      "--panel-bg": "rgba(8, 35, 22, 0.64)",
      "--panel-border": "rgba(15, 212, 109, 0.28)",
      "--text-primary": "#eefff4",
      "--text-secondary": "#9bceb0",
      "--accent-primary": "#62ff9b",
      "--accent-secondary": "#0fd46d",
      "--grid-line": "rgba(98, 255, 155, 0.1)",
    },
  },
};

export function getLevelInfo(totalXP) {
  return {
    level: Math.floor(totalXP / 50) + 1,
    currentLevelXP: totalXP % 50,
  };
}

export function createUser(username, password, avatar = "🎮") {
  return {
    username,
    password,
    avatar,
    totalXP: 0,
    currentLevel: 1,
    achievements: [],
    stats: {},
    createdAt: new Date().toISOString(),
  };
}

export function saveState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures to avoid crashing the app.
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sanitizeUsers(users) {
  if (!isPlainObject(users)) {
    return {};
  }

  return Object.entries(users).reduce((acc, [username, user]) => {
    if (!isPlainObject(user)) {
      return acc;
    }

    acc[username] = {
      username: typeof user.username === "string" ? user.username : username,
      password: typeof user.password === "string" ? user.password : "",
      avatar: typeof user.avatar === "string" ? user.avatar : "🎮",
      totalXP: Number.isFinite(user.totalXP) ? user.totalXP : 0,
      currentLevel: Number.isFinite(user.currentLevel) ? user.currentLevel : 1,
      achievements: Array.isArray(user.achievements) ? user.achievements : [],
      stats: isPlainObject(user.stats) ? user.stats : {},
      createdAt: typeof user.createdAt === "string" ? user.createdAt : new Date().toISOString(),
    };
    return acc;
  }, {});
}

function sanitizeLeaderboard(leaderboard) {
  if (!Array.isArray(leaderboard)) {
    return [];
  }

  return leaderboard.filter(
    (entry) =>
      isPlainObject(entry) &&
      typeof entry.username === "string" &&
      typeof entry.gameId === "string" &&
      typeof entry.gameName === "string" &&
      Number.isFinite(entry.score)
  );
}

function safeParse(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadState() {
  const users = sanitizeUsers(safeParse(STORAGE_KEYS.USERS, {}));
  const currentUsernameRaw = safeParse(STORAGE_KEYS.CURRENT_USER, null);
  const currentUsername =
    typeof currentUsernameRaw === "string" && users[currentUsernameRaw] ? currentUsernameRaw : null;
  const leaderboard = sanitizeLeaderboard(safeParse(STORAGE_KEYS.LEADERBOARD, []));
  const themeIdRaw = safeParse(STORAGE_KEYS.THEME, "neonBlue");
  const themeId =
    typeof themeIdRaw === "string" && THEME_OPTIONS[themeIdRaw] ? themeIdRaw : "neonBlue";
  return { users, currentUsername, leaderboard, themeId };
}
