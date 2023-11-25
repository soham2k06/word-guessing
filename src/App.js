import { useState, useEffect } from "react";

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

const validateWord = async (word) => {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${word}&max=1`
    );

    const data = await response.json();

    return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
  } catch (error) {
    console.error("Error checking word:", error);
  }
};

const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function App() {
  const [randomWord, setRandomWord] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempts, setAttempts] = useState(6);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [fullCorLetters, setFullCorLetters] = useState([]);
  const [halfCorLetters, setHalfCorLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);

  const [isGuessedCorrect, setIsGuessedCorrect] = useState(false);
  const isLost = attempts === 0;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    // Check if the input is empty or contains only alphabets
    if (inputValue === "" || /^[a-zA-Z]+$/.test(inputValue)) {
      setCurrentGuess(inputValue.toUpperCase());
    }
  };

  const makeGuess = async (e) => {
    e.preventDefault();
    if (currentGuess.length === 5 && attempts > 0) {
      try {
        setIsLoading(true);
        const isValid = await validateWord(currentGuess);
        setIsLoading(false);
        if (isValid) {
          const updatedGuesses = [...guesses, currentGuess];
          setGuesses(updatedGuesses);
          setAttempts(attempts - 1);
          setCurrentGuess("");
          setError("");
        } else {
          setCurrentGuess("");
          setError(`Word '${currentGuess}' is not vaild!`);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setError("Entered Guess should contain exact 5 letters!");
    }
    setIsGuessedCorrect(currentGuess === randomWord);
  };

  const renderGuessedWord = (guess) => {
    const maxAttempts = 6;
    const allEnteredLetters = Array(maxAttempts)
      .fill("")
      .map((_, index) => (index < guess.length ? guess[index] : ""));

    return Array(5)
      .fill("")
      .map((_, i) => {
        const isHalfCorrect = randomWord && randomWord.includes(guess[i]);
        const isFullCorrect = randomWord && randomWord[i] === guess[i];
        const isWrong =
          randomWord && !isFullCorrect && !isHalfCorrect && guess.length > 0;

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
      });
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
    <div className="main">
      {randomWord ? (
        <div className="app">
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
          {isLost || isGuessedCorrect || (
            <div>
              <form onSubmit={makeGuess} className="input-container">
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
                  {isLoading && <div className="loader btn-loader"></div>}
                  <span>Make Guess</span>
                </button>
              </form>
              {!!error && <div className="error">{error}</div>}
            </div>
          )}
          {isLost && (
            <div className="result result-lose">
              <p>Game over! The word was: {randomWord}</p>
              <button onClick={() => window.location.reload()}>New Game</button>
            </div>
          )}
          {isGuessedCorrect && (
            <div className="result result-win">
              <p>Congratulations! You guessed the word!</p>
              <button onClick={() => window.location.reload()}>New Game</button>
            </div>
          )}
        </div>
      ) : (
        <div className="full-page">
          <div className="loader" />
        </div>
      )}

      <footer className="footer">
        <p className="footer-text">Made with ❤️ by Soham Bhikadiya</p>
      </footer>
    </div>
  );
}

export default App;
