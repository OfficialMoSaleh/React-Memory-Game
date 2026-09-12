import './SingleCard.css';
import { Sparkles } from 'lucide-react';

const SingleCard = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled && !flipped && !card.matched) {
      handleChoice(card);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`card-container ${flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={card.matched ? -1 : 0}
      role="button"
      aria-label={flipped ? `Card ${card.name || 'revealed'}` : 'Hidden Card'}
    >
      <div className="card-inner">
        {/* Front Face (Revealed Card) */}
        <div className="card-face card-front">
          <div className="card-img-wrapper">
            <img src={card.src} alt={card.name || 'Card Front'} />
          </div>
          {card.matched && (
            <div className="match-badge">
              <Sparkles size={16} />
            </div>
          )}
        </div>

        {/* Back Face (Hidden Card) */}
        <div className="card-face card-back">
          <div className="card-back-pattern">
            <div className="card-back-icon">
              <span className="question-mark">?</span>
            </div>
            <div className="card-glow-orb"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
