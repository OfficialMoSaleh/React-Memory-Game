import { useState, useEffect } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

const myCards = [
  { src: "/img/typescript.png", matched: false },
  { src: "/img/swift.png", matched: false },
  { src: "/img/github.png", matched: false },
  { src: "/img/c++.png", matched: false },
  { src: "/img/angularjs.png", matched: false },
  { src: "/img/javascript.png", matched: false },
  { src: "/img/paython.png", matched: false },
  { src: "/img/visual-studio-code.png", matched: false },
  { src: "/img/ruby.png", matched: false },
  { src: "/img/java.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(0);
  const [first, setFirstChoice] = useState(null);
  const [second, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // shuffle cards
  const shuffle = () => {
    const shuffled = [...myCards, ...myCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffled);
    setFlipped(0);
  };

  // handle a card click choice
  const handleChoice = (card) => {
    first ? setSecondChoice(card) : setFirstChoice(card);
  };

  // compare choices of the 2 selected cards
  useEffect(() => {
    if (first && second) {
      setDisabled(true);
      if (first.src === second.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === first.src ? { ...card, matched: true } : card
          )
        );
        // resetTurn()
        setTimeout(resetTurn, 500);
      } else {
        // resetTurn()
        setTimeout(resetTurn, 500);
      }
    }
  }, [first, second]);

  // reset choices and increase number of turns
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setFlipped((prevFlip) => prevFlip + 1);
    setDisabled(false);
  };

  // Start the game automatically
  useEffect(() => {
    shuffle();
  }, []);

  return (
    <div className="App">

      <div className="head">
      <h1>Mind Match</h1>
      <button onClick={shuffle}>New Game</button>
      </div>

      <div className="card___grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === first || card === second || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>
        <strong>
          Wrong Tries: <span className="no___turns">{flipped}</span>
        </strong>
      </p>
    </div>
  );
}

export default App;
