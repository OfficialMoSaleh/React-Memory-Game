import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, Timer, Flame, CheckCircle2, Award } from 'lucide-react';
import './VictoryModal.css';

const VictoryModal = ({
  time,
  moves,
  wrongTries,
  difficulty,
  isNewRecord,
  onPlayAgain,
  onChangeDifficulty,
  playerName,
  t,
}) => {
  useEffect(() => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#facc15', '#f43f5e'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStars = () => {
    let thresholds = {
      easy: { three: 10, two: 15 },
      medium: { three: 14, two: 22 },
      hard: { three: 18, two: 28 },
    };
    const th = thresholds[difficulty] || thresholds.medium;
    if (moves <= th.three) return 3;
    if (moves <= th.two) return 2;
    return 1;
  };

  const stars = getStars();
  const accuracy = moves > 0 ? Math.round(((moves - wrongTries) / moves) * 100) : 100;

  const getLevelLabel = () => {
    if (difficulty === 'easy') return t.levelEasy;
    if (difficulty === 'medium') return t.levelMedium;
    return t.levelHard;
  };

  return (
    <div className="modal-backdrop">
      <div className="victory-card">
        <div className="victory-glow"></div>

        <div className="trophy-wrapper">
          <div className="trophy-circle">
            <Trophy size={36} className="trophy-icon" />
          </div>
          {isNewRecord && (
            <div className="new-record-badge">
              <Award size={13} /> {t.newRecord}
            </div>
          )}
        </div>

        <h2 className="victory-title">
          {t.victoryTitle} <span className="player-highlight">{playerName}</span>! 🚀
        </h2>
        <p className="victory-sub">{t.victorySub}</p>

        {/* Stars */}
        <div className="stars-container">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`star-slot ${starIndex <= stars ? 'star-active' : ''}`}
            >
              <Star
                size={28}
                className={`star-icon ${starIndex <= stars ? 'fill-star' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="victory-stats-box">
          <div className="v-stat-row">
            <div className="v-stat-item">
              <div className="v-icon-title">
                <Timer size={14} />
                <span>{t.time}</span>
              </div>
              <span className="v-val font-mono">{formatTime(time)}</span>
            </div>

            <div className="v-stat-item">
              <div className="v-icon-title">
                <Flame size={14} />
                <span>{t.moves}</span>
              </div>
              <span className="v-val font-mono">{moves}</span>
            </div>
          </div>

          <div className="v-divider"></div>

          <div className="v-stat-row">
            <div className="v-stat-item">
              <div className="v-icon-title">
                <CheckCircle2 size={14} />
                <span>{t.accuracy}</span>
              </div>
              <span className="v-val font-mono">{accuracy}%</span>
            </div>

            <div className="v-stat-item">
              <div className="v-icon-title">
                <Award size={14} />
                <span>{t.level}</span>
              </div>
              <span className="v-val">{getLevelLabel()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="victory-actions">
          <button className="v-btn primary-v-btn" onClick={onPlayAgain}>
            <RotateCcw size={16} />
            <span>{t.playAgain}</span>
          </button>
          <button className="v-btn secondary-v-btn" onClick={onChangeDifficulty}>
            <span>{t.changeDiff}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
