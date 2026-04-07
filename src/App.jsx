import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SimonGamePage from "./pages/games/SimonGamePage";
import MemoryCardsPage from "./pages/games/MemoryCardsPage";
import AimTrainerPage from "./pages/games/AimTrainerPage";
import WhackAMolePage from "./pages/games/WhackAMolePage";
import TicTacToePage from "./pages/games/TicTacToePage";
import RockPaperScissorsPage from "./pages/games/RockpaperScissors";
import {
  ACHIEVEMENT_DEFS,
  GAME_CATALOG,
  STORAGE_KEYS,
  THEME_OPTIONS,
  createUser,
  getLevelInfo,
  loadState,
  saveState,
} from "./utils/storage";
import { soundEffects, unlockAudio } from "./utils/audio";
import {
  PASSWORD_REGEX,
  PASSWORD_RULE_TEXT,
  USERNAME_REGEX,
  USERNAME_RULE_TEXT,
} from "./utils/validation";

function App() {
  const location = useLocation();
  const initialState = useMemo(() => loadState(), []);
  const [users, setUsers] = useState(initialState.users);
  const [currentUsername, setCurrentUsername] = useState(initialState.currentUsername);
  const [leaderboard, setLeaderboard] = useState(initialState.leaderboard);
  const [themeId, setThemeId] = useState(initialState.themeId);
  const [levelUpState, setLevelUpState] = useState(null);
  const [gameOverState, setGameOverState] = useState(null);

  const currentUser = currentUsername ? users[currentUsername] ?? null : null;

  useEffect(() => {
    saveState(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    saveState(STORAGE_KEYS.CURRENT_USER, currentUsername);
  }, [currentUsername]);

  useEffect(() => {
    saveState(STORAGE_KEYS.LEADERBOARD, leaderboard);
  }, [leaderboard]);

  useEffect(() => {
    saveState(STORAGE_KEYS.THEME, themeId);
    const theme = THEME_OPTIONS[themeId] ?? THEME_OPTIONS.neonBlue;
    Object.entries(theme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [themeId]);

  useEffect(() => {
    unlockAudio();
  }, []);

  useEffect(() => {
    if (!levelUpState) {
      return undefined;
    }

    const timer = window.setTimeout(() => setLevelUpState(null), 2400);
    return () => window.clearTimeout(timer);
  }, [levelUpState]);

  useEffect(() => {
    if (!gameOverState) {
      return undefined;
    }

    const timer = window.setTimeout(() => setGameOverState(null), 2200);
    return () => window.clearTimeout(timer);
  }, [gameOverState]);

  const updateUser = (username, updater) => {
    setUsers((prev) => {
      const user = prev[username];
      if (!user) {
        return prev;
      }

      const nextUser = updater(user);
      return { ...prev, [username]: nextUser };
    });
  };

  const handleAuth = ({ mode, username, password, avatar }) => {
    const normalized = username.trim();
    if (!normalized || !password.trim()) {
      return { ok: false, message: "Username and password are required." };
    }

    if (!USERNAME_REGEX.test(normalized)) {
      return { ok: false, message: USERNAME_RULE_TEXT };
    }

    const existingUser = users[normalized];

    if (mode === "signup") {
      if (existingUser) {
        return { ok: false, message: "Username already exists." };
      }

      if (!PASSWORD_REGEX.test(password)) {
        return { ok: false, message: PASSWORD_RULE_TEXT };
      }

      setUsers((prev) => ({ ...prev, [normalized]: createUser(normalized, password, avatar) }));
      setCurrentUsername(normalized);
      soundEffects.button();
      return { ok: true };
    }

    if (!existingUser || existingUser.password !== password) {
      return { ok: false, message: "Invalid username or password." };
    }

    setCurrentUsername(normalized);
    soundEffects.button();
    return { ok: true };
  };

  const logout = () => {
    setCurrentUsername(null);
  };

  const setTheme = (nextThemeId) => {
    if (THEME_OPTIONS[nextThemeId]) {
      setThemeId(nextThemeId);
      soundEffects.button();
    }
  };

  const rewardPlayer = ({
    username,
    gameId,
    score = 0,
    won = false,
    highScore = false,
    extras = [],
  }) => {
    const user = users[username];
    if (!user) {
      return;
    }

    const xpDelta =
      5 +
      (score > 0 ? 10 : 0) +
      (won || highScore ? Math.max(15, Math.min(20, 15 + Math.floor(score / 20))) : 0) +
      extras.reduce((sum, amount) => sum + amount, 0);

    const oldLevel = getLevelInfo(user.totalXP).level;
    const newTotalXP = user.totalXP + xpDelta;
    const newLevelInfo = getLevelInfo(newTotalXP);

    updateUser(username, (prevUser) => ({
      ...prevUser,
      totalXP: newTotalXP,
      currentLevel: newLevelInfo.level,
      stats: {
        ...prevUser.stats,
        [gameId]: {
          plays: (prevUser.stats[gameId]?.plays ?? 0) + 1,
          bestScore: Math.max(prevUser.stats[gameId]?.bestScore ?? 0, score),
          lastScore: score,
        },
      },
    }));

    if (newLevelInfo.level > oldLevel) {
      soundEffects.levelUp();
      setLevelUpState({ from: oldLevel, to: newLevelInfo.level });
    }
  };

  const submitScore = ({ username, gameId, score }) => {
    const gameName = GAME_CATALOG.find((game) => game.id === gameId)?.title ?? gameId;
    setLeaderboard((prev) => {
      const nextEntry = {
        id: `${username}-${gameId}`,
        username,
        gameId,
        gameName,
        score,
        createdAt: new Date().toISOString(),
      };

      const existingIndex = prev.findIndex(
        (entry) => entry.username === username && entry.gameId === gameId
      );

      if (existingIndex === -1) {
        return [...prev, nextEntry]
          .sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 120);
      }

      const existingEntry = prev[existingIndex];
      if (
        existingEntry.score > score ||
        (existingEntry.score === score &&
          new Date(existingEntry.createdAt) >= new Date(nextEntry.createdAt))
      ) {
        return prev;
      }

      const next = [...prev];
      next[existingIndex] = nextEntry;
      return next
        .sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 120);
    });
  };

  const unlockAchievement = (username, achievementId) => {
    const def = ACHIEVEMENT_DEFS[achievementId];
    if (!def || !users[username] || users[username].achievements.includes(achievementId)) {
      return;
    }

    updateUser(username, (prevUser) => ({
      ...prevUser,
      achievements: [...prevUser.achievements, achievementId],
    }));
  };

  const triggerGameOver = (message = "Game Over") => {
    soundEffects.gameOver();
    setGameOverState({
      id: `${Date.now()}-${Math.random()}`,
      message,
    });
  };

  const appState = {
    users,
    currentUser,
    leaderboard,
    themeId,
    theme: THEME_OPTIONS[themeId] ?? THEME_OPTIONS.neonBlue,
    handleAuth,
    logout,
    setTheme,
    rewardPlayer,
    submitScore,
    unlockAchievement,
    levelUpState,
    gameOverState,
    triggerGameOver,
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/auth"
          element={currentUser ? <Navigate to="/" replace /> : <AuthPage onAuth={handleAuth} />}
        />
        <Route
          path="/"
          element={currentUser ? <Layout appState={appState} /> : <Navigate to="/auth" replace />}
        >
          <Route index element={<HomePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="games/simon" element={<SimonGamePage />} />
          <Route path="games/memory-cards" element={<MemoryCardsPage />} />
          <Route path="games/aim-trainer" element={<AimTrainerPage />} />
          <Route path="games/whack-a-mole" element={<WhackAMolePage />} />
          <Route path="games/tic-tac-toe" element={<TicTacToePage />} />
          <Route path="games/rock-paper-scissors" element={<RockPaperScissorsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/auth"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
