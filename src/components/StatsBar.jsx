import { useState } from 'react';
import { Timer, Trophy, Volume2, VolumeX, RotateCcw, Eye, Flame, Languages, User, Check, Edit2, Hourglass, Zap } from 'lucide-react';
import './StatsBar.css';

const StatsBar = ({
  time,
  moves,
  matches,
  totalPairs,
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
  streak,
  bonusTimeAnim,
  muted,
  toggleSound,
  onRestart,
  onPeek,
  peekUsed,
  isPeeking,
  bestScore,
  lang,
  setLang,
  t,
  playerName,
  setPlayerName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracy = moves > 0 ? Math.round((matches / moves) * 100) : 100;

  const handleSaveName = (e) => {
    e.preventDefault();
    const finalName = tempName.trim() || (lang === 'ar' ? 'بطل الذاكرة' : 'Memory Master');
    setPlayerName(finalName);
    setIsEditingName(false);
  };

  return (
    <header className="stats-dashboard">
      {/* Row 1: Brand, Mode Toggle, Player, Difficulty, Lang, Audio & Restart */}
      <div className="dashboard-top">
        {/* Clean Logo */}
        <div className="brand-clean">
          <h1 className="game-title">Mind Match</h1>
          <span className="game-subtitle">{t.subtitle}</span>
        </div>

        {/* Game Mode Pill (Classic vs Time Attack) */}
        <div className="mode-pill-group" role="tablist">
          <button
            className={`mode-btn ${gameMode === 'classic' ? 'active' : ''}`}
            onClick={() => setGameMode('classic')}
            title="وضع اللعب العادي / Classic Mode"
          >
            {t.classicMode}
          </button>
          <button
            className={`mode-btn ${gameMode === 'timeAttack' ? 'active' : ''}`}
            onClick={() => setGameMode('timeAttack')}
            title="تحدي الوقت التنازلي / Time Attack Mode"
          >
            <Hourglass size={12} />
            <span>{t.timeAttackMode}</span>
          </button>
        </div>

        {/* Player Name Tag */}
        <div className="player-badge">
          <User size={15} className="player-icon" />
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="player-name-form">
              <input
                type="text"
                className="player-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                maxLength={16}
                placeholder={t.enterName}
              />
              <button type="submit" className="name-save-btn" title={t.saveName}>
                <Check size={14} />
              </button>
            </form>
          ) : (
            <div
              className="player-display"
              onClick={() => {
                setTempName(playerName);
                setIsEditingName(true);
              }}
              title={t.editName}
            >
              <span className="player-text">{playerName}</span>
              <Edit2 size={12} className="edit-icon" />
            </div>
          )}
        </div>

        {/* Difficulty switcher */}
        <div className="difficulty-pill-group" role="tablist">
          <button
            className={`diff-btn ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => setDifficulty('easy')}
          >
            {t.easy}
          </button>
          <button
            className={`diff-btn ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => setDifficulty('medium')}
          >
            {t.medium}
          </button>
          <button
            className={`diff-btn ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => setDifficulty('hard')}
          >
            {t.hard}
          </button>
        </div>

        {/* Actions & Controls */}
        <div className="action-buttons">
          {/* Language Toggle */}
          <button
            className="control-btn lang-btn"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title="Switch Language / تغيير اللغة"
          >
            <Languages size={15} />
            <span className="lang-text">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Peek */}
          <button
            className={`control-btn hint-btn ${peekUsed ? 'disabled' : ''} ${isPeeking ? 'peeking' : ''}`}
            onClick={onPeek}
            disabled={peekUsed || isPeeking}
            title={peekUsed ? t.peekUsed : t.peek}
          >
            <Eye size={15} />
            <span className="btn-label">{t.peek}</span>
          </button>

          {/* Sound */}
          <button
            className="control-btn icon-only-btn"
            onClick={toggleSound}
            title={muted ? t.soundOn : t.soundOff}
            aria-label="Sound Toggle"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Restart */}
          <button
            className="control-btn restart-btn"
            onClick={onRestart}
            title={t.restart}
          >
            <RotateCcw size={15} />
            <span className="btn-label">{t.restart}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Ultra-Compact Metrics Bar */}
      <div className="metrics-compact-row">
        {/* Timer / Countdown */}
        <div className={`metric-chip timer-chip ${gameMode === 'timeAttack' && time <= 10 ? 'timer-urgent' : ''}`}>
          {gameMode === 'timeAttack' ? <Hourglass size={15} /> : <Timer size={15} />}
          <span className="chip-label">{t.time}:</span>
          <span className="chip-val font-mono">{formatTime(time)}</span>
          {bonusTimeAnim && (
            <span className="bonus-time-badge">{t.timeBonus}</span>
          )}
        </div>

        {/* Combo / Streak Chip (Visible when streak >= 2) */}
        {streak >= 2 && (
          <div className="metric-chip combo-chip">
            <Zap size={15} className="combo-zap-icon" />
            <span className="chip-label">{t.streak}:</span>
            <span className="chip-val combo-text">{streak}x COMBO!</span>
          </div>
        )}

        <div className="metric-chip moves-chip">
          <Flame size={15} />
          <span className="chip-label">{t.moves}:</span>
          <span className="chip-val font-mono">{moves}</span>
        </div>

        <div className="metric-chip match-chip">
          <span className="chip-label">{t.matches}:</span>
          <span className="chip-val font-mono">{matches}/{totalPairs}</span>
        </div>

        <div className="metric-chip accuracy-chip">
          <span className="chip-label">{t.accuracy}:</span>
          <span className="chip-val font-mono">{accuracy}%</span>
        </div>

        <div className="metric-chip trophy-chip">
          <Trophy size={15} />
          <span className="chip-label">{t.bestScore}:</span>
          <span className="chip-val font-mono">
            {bestScore ? `${formatTime(bestScore.time)} (${bestScore.moves})` : '--:--'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default StatsBar;
