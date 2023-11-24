import React, { useState, useEffect } from "react";

const getRandomWord = async () => {
  try {
    const response = await fetch(
      "https://random-word-api.vercel.app/api?words=1&length=5"
    );
    const data = await response.json();
    return data[0].toUpperCase();
  } catch (error) {
    console.error("Error fetching word:", error);
    return "";
  }
};

const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function App() {
  const [randomWord, setRandomWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempts, setAttempts] = useState(6);

  const [fullCorLetters, setFullCorLetters] = useState([]);
  const [halfCorLetters, setHalfCorLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);

  const isGuessed = randomWord === currentGuess;
  const isLost = attempts === 0;

  const handleInputChange = (event) => {
    if (!/^[a-zA-Z]+$/.test(event.target.value)) return;
    setCurrentGuess(event.target.value.toUpperCase());
  };

  const makeGuess = () => {
    if (currentGuess.length === 5 && attempts > 0) {
      const updatedGuesses = [...guesses, currentGuess];
      setGuesses(updatedGuesses);
      setAttempts(attempts - 1);
      setCurrentGuess("");
    }
  };

  const renderGuessedWord = (guess) => {
    const maxAttempts = 6;
    const allEnteredLetters = Array(maxAttempts)
      .fill("")
      .map((_, index) => (index < guess.length ? guess[index] : ""));

    return (
      <>
        {Array(5)
          .fill("")
          .map((_, i) => {
            const isHalfCorrect = randomWord && randomWord.includes(guess[i]);
            const isFullCorrect = randomWord && randomWord[i] === guess[i];
            const isWrong =
              randomWord &&
              !isFullCorrect &&
              !isHalfCorrect &&
              guess.length > 0;

            let className = "";
            if (isFullCorrect) {
              className = "word-exact";
            } else if (isHalfCorrect) {
              className = "word-half";
            } else if (isWrong) {
              className = "word-wrong";
            }

            return (
              <div key={i} className={`word-block ${className}`}>
                {allEnteredLetters[i]}
              </div>
            );
          })}
      </>
    );
  };

  useEffect(() => {
    const startNewGame = async () => {
      const word = await getRandomWord();
      setRandomWord(word);
      setGuesses([]);
      setCurrentGuess("");
      setAttempts(6);
    };

    startNewGame();
  }, []);

  useEffect(() => {
    const updateLetters = () => {
      const fullyCorrect = [];
      const halfCorrect = [];
      const wrong = [];

      guesses.forEach((guess) => {
        for (let i = 0; i < guess.length; i++) {
          const isHalfCorrect = randomWord && randomWord.includes(guess[i]);
          const isFullCorrect = randomWord && randomWord[i] === guess[i];
          console.log(isHalfCorrect, randomWord, guess[i]);
          if (isFullCorrect) {
            fullyCorrect.push(guess[i]);
          } else if (isHalfCorrect) {
            halfCorrect.push(guess[i]);
          } else {
            wrong.push(guess[i]);
          }
        }
      });

      setFullCorLetters(fullyCorrect);
      setHalfCorLetters(halfCorrect);
      setWrongLetters(wrong);
    };

    updateLetters();
  }, [guesses, randomWord]);

  return (
    <div className="app">
      {randomWord ? (
        <>
          <h2 className="title">🤔 Guess the Word!</h2>
          <div className="blocks">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="blocks-row">
                {renderGuessedWord(guesses[index] || "")}
              </div>
            ))}
          </div>
          <div className="keyboard">
            {rows.map((row, i) => (
              <div key={i} className="keys-row">
                {row.split("").map((letter, index) => {
                  let className = "";
                  if (halfCorLetters.includes(letter))
                    className = "key-half-correct";
                  if (fullCorLetters.includes(letter))
                    className = "key-full-correct";
                  if (wrongLetters.includes(letter))
                    className = "key-full-wrong";
                  return (
                    <div className={`key ${className}`} key={index}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {isLost || isGuessed || (
            <div className="input-container">
              <input
                type="text"
                maxLength="5"
                placeholder="Enter a 5-letter word"
                value={currentGuess}
                onChange={handleInputChange}
                disabled={attempts === 0}
                className="word-input"
              />
              <button
                onClick={makeGuess}
                disabled={attempts === 0}
                className="btn-guess"
              >
                Make Guess
              </button>
            </div>
          )}
          {isLost && (
            <div className="result result-lose">
              <p>Game over! The word was: {randomWord}</p>
              <button onClick={() => window.location.reload()}>New Game</button>
            </div>
          )}
          {isGuessed && (
            <div className="result result-win">
              <p>Congratulations! You guessed the word!</p>
              <button onClick={() => window.location.reload()}>New Game</button>
            </div>
          )}
        </>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
}

export default App;
