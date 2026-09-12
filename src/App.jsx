import { useState, useEffect } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';
import StatsBar from './components/StatsBar';
import VictoryModal from './components/VictoryModal';
import ConfirmModal from './components/ConfirmModal';
import { sound } from './utils/audio';
import { translations } from './utils/translations';

const ALL_CARDS = [
  { name: 'TypeScript', src: '/img/typescript.png' },
  { name: 'Swift', src: '/img/swift.png' },
  { name: 'GitHub', src: '/img/github.png' },
  { name: 'C++', src: '/img/c++.png' },
  { name: 'Angular', src: '/img/angularjs.png' },
  { name: 'JavaScript', src: '/img/javascript.png' },
  { name: 'Python', src: '/img/paython.png' },
  { name: 'VS Code', src: '/img/visual-studio-code.png' },
  { name: 'Ruby', src: '/img/ruby.png' },
  { name: 'Java', src: '/img/java.png' },
];

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, cols: 4, rows: 3 },
  medium: { pairs: 8, cols: 4, rows: 4 },
  hard: { pairs: 10, cols: 5, rows: 4 },
};

const CURRENT_GAME_KEY = 'mind_match_current_game';

function loadSavedGame() {
  try {
    const raw = localStorage.getItem(CURRENT_GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.cards) && parsed.cards.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Error loading saved game:', e);
  }
  return null;
}

function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  // Language & Localization (Default Arabic)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('mind_match_lang') || 'ar';
  });

  const t = translations[lang] || translations.ar;

  // Player Name with localStorage persistence
  const [playerName, setPlayerName] = useState(() => {
    const saved = localStorage.getItem('mind_match_username');
    if (saved) return saved;
    return lang === 'ar' ? 'بطل الذاكرة' : 'Memory Master';
  });

  // Restore current game state from localStorage on page refresh
  const savedGame = loadSavedGame();

  const [difficulty, setDifficulty] = useState(() => savedGame?.difficulty || 'medium');
  const [cards, setCards] = useState(() => savedGame?.cards || []);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Metrics preserved across reloads
  const [moves, setMoves] = useState(() => savedGame?.moves || 0);
  const [wrongTries, setWrongTries] = useState(() => savedGame?.wrongTries || 0);
  const [matches, setMatches] = useState(() => savedGame?.matches || 0);
  const [time, setTime] = useState(() => savedGame?.time || 0);
  const [gameStarted, setGameStarted] = useState(() => savedGame?.gameStarted || false);
  const [gameWon, setGameWon] = useState(() => savedGame?.gameWon || false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Hint / Peek
  const [peekUsed, setPeekUsed] = useState(() => savedGame?.peekUsed || false);
  const [isPeeking, setIsPeeking] = useState(false);

  // Confirmation Modal state for restart / difficulty change
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Mute state
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('mind_match_muted') === 'true';
  });

  // Best scores
  const [bestScores, setBestScores] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mind_match_best_scores')) || {};
    } catch {
      return {};
    }
  });

  const totalPairs = DIFFICULTY_CONFIG[difficulty]?.pairs || 8;

  // Sync language and document direction
  useEffect(() => {
    localStorage.setItem('mind_match_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.fontFamily =
      lang === 'ar' ? "var(--font-arabic), 'Cairo', sans-serif" : "var(--font-english), 'Outfit', sans-serif";
  }, [lang]);

  // Sync player name
  const handleSetPlayerName = (name) => {
    setPlayerName(name);
    localStorage.setItem('mind_match_username', name);
  };

  // Sync sound
  useEffect(() => {
    sound.setMuted(muted);
    localStorage.setItem('mind_match_muted', muted.toString());
  }, [muted]);

  const toggleSound = () => {
    setMuted((prev) => !prev);
  };

  // Setup / Reset Game
  const setupGame = (diff = difficulty) => {
    const { pairs } = DIFFICULTY_CONFIG[diff];
    const selectedCards = ALL_CARDS.slice(0, pairs);

    const deck = selectedCards.flatMap((card) => [
      { ...card, id: `${card.name}-1-${Math.random()}`, matched: false },
      { ...card, id: `${card.name}-2-${Math.random()}`, matched: false },
    ]);

    const shuffledDeck = fisherYatesShuffle(deck);

    setCards(shuffledDeck);
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
    setMoves(0);
    setWrongTries(0);
    setMatches(0);
    setTime(0);
    setGameStarted(false);
    setGameWon(false);
    setIsNewRecord(false);
    setPeekUsed(false);
    setIsPeeking(false);

    // Save fresh state to localStorage
    const freshState = {
      difficulty: diff,
      cards: shuffledDeck,
      moves: 0,
      wrongTries: 0,
      matches: 0,
      time: 0,
      gameStarted: false,
      gameWon: false,
      peekUsed: false,
    };
    localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(freshState));
  };

  // Check if current game is in progress
  const isGameInProgress = () => {
    return (moves > 0 || time > 0 || matches > 0) && !gameWon;
  };

  // Trigger Restart with confirmation if game in progress
  const handleRestartRequest = () => {
    if (isGameInProgress()) {
      setConfirmDialog({
        isOpen: true,
        title: t.confirmRestartTitle,
        message: t.confirmMessage,
        onConfirm: () => {
          setupGame(difficulty);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      setupGame(difficulty);
    }
  };

  // Trigger Difficulty Change with confirmation if game in progress
  const handleDifficultyChangeRequest = (newDiff) => {
    if (newDiff === difficulty) return;
    if (isGameInProgress()) {
      setConfirmDialog({
        isOpen: true,
        title: t.confirmDiffTitle,
        message: t.confirmMessage,
        onConfirm: () => {
          setDifficulty(newDiff);
          setupGame(newDiff);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      setDifficulty(newDiff);
      setupGame(newDiff);
    }
  };

  // If no saved game in localStorage, create initial deck
  useEffect(() => {
    if (!savedGame || !savedGame.cards || savedGame.cards.length === 0) {
      setupGame(difficulty);
    }
  }, []);

  // Save current game state on every change
  useEffect(() => {
    if (cards.length > 0) {
      const stateToSave = {
        difficulty,
        cards,
        moves,
        wrongTries,
        matches,
        time,
        gameStarted,
        gameWon,
        peekUsed,
      };
      localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(stateToSave));
    }
  }, [cards, moves, wrongTries, matches, time, difficulty, gameStarted, gameWon, peekUsed]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (gameStarted && !gameWon && !isPeeking) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon, isPeeking]);

  // Handle Card Choice
  const handleChoice = (card) => {
    if (disabled || isPeeking) return;
    if (firstChoice && firstChoice.id === card.id) return;
    if (card.matched) return;

    sound.playFlip();

    if (!gameStarted) {
      setGameStarted(true);
    }

    if (!firstChoice) {
      setFirstChoice(card);
    } else {
      setSecondChoice(card);
    }
  };

  // Compare cards
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      setMoves((prev) => prev + 1);

      if (firstChoice.src === secondChoice.src) {
        sound.playMatch();
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );

        const newMatchCount = matches + 1;
        setMatches(newMatchCount);

        setTimeout(() => {
          resetTurn();
          if (newMatchCount === totalPairs) {
            handleVictory();
          }
        }, 350);
      } else {
        sound.playMismatch();
        setWrongTries((prev) => prev + 1);
        setTimeout(() => {
          resetTurn();
        }, 650);
      }
    }
  }, [firstChoice, secondChoice]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  const handleVictory = () => {
    setGameWon(true);
    sound.playVictory();

    const currentBest = bestScores[difficulty];
    const isBetter =
      !currentBest ||
      time < currentBest.time ||
      (time === currentBest.time && moves + 1 < currentBest.moves);

    if (isBetter) {
      setIsNewRecord(true);
      const updatedBest = {
        ...bestScores,
        [difficulty]: { time, moves: moves + 1 },
      };
      setBestScores(updatedBest);
      localStorage.setItem('mind_match_best_scores', JSON.stringify(updatedBest));
    }
  };

  const handlePeek = () => {
    if (peekUsed || disabled || isPeeking) return;
    setPeekUsed(true);
    setIsPeeking(true);
    sound.playFlip();

    setTimeout(() => {
      setIsPeeking(false);
    }, 1200);
  };

  const { cols, rows } = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;

  return (
    <div className="app-container">
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      <main className="game-wrapper">
        <StatsBar
          time={time}
          moves={moves}
          matches={matches}
          totalPairs={totalPairs}
          difficulty={difficulty}
          setDifficulty={handleDifficultyChangeRequest}
          muted={muted}
          toggleSound={toggleSound}
          onRestart={handleRestartRequest}
          onPeek={handlePeek}
          peekUsed={peekUsed}
          isPeeking={isPeeking}
          bestScore={bestScores[difficulty]}
          lang={lang}
          setLang={setLang}
          t={t}
          playerName={playerName}
          setPlayerName={handleSetPlayerName}
        />

        {/* Dynamic Zero-Scroll Grid */}
        <div
          className="card-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={
                isPeeking ||
                card.matched ||
                card.id === firstChoice?.id ||
                card.id === secondChoice?.id
              }
              disabled={disabled || isPeeking}
            />
          ))}
        </div>
      </main>

      {/* Confirmation Modal for Reset or Difficulty Change */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={t.confirmBtn}
        cancelText={t.cancelBtn}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Victory Celebration Modal */}
      {gameWon && (
        <VictoryModal
          time={time}
          moves={moves}
          wrongTries={wrongTries}
          difficulty={difficulty}
          isNewRecord={isNewRecord}
          onPlayAgain={() => setupGame(difficulty)}
          onChangeDifficulty={() => {
            setGameWon(false);
            const nextDiff =
              difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy';
            setDifficulty(nextDiff);
            setupGame(nextDiff);
          }}
          playerName={playerName}
          t={t}
        />
      )}
    </div>
  );
}

export default App;
