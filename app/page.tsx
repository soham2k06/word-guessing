"use client";

import RulesDialog from "@/components/rules-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getRandomWord, validateWord } from "@/lib/utils";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function HomePage() {
  const [randomWord, setRandomWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempts, setAttempts] = useState(6);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [fullCorLetters, setFullCorLetters] = useState<string[]>([]);
  const [halfCorLetters, setHalfCorLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);

  const [isGuessedCorrect, setIsGuessedCorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isLost = attempts === 0;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;

    // Check if the input is empty or contains only alphabets
    if (inputValue === "" || /^[a-zA-Z]*$/.test(inputValue))
      setCurrentGuess(inputValue);
  }

  async function handleGuess(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsedGuess = currentGuess.toUpperCase().trim();

    if (parsedGuess.length === 5 && attempts > 0) {
      try {
        setIsLoading(true);
        const isValid = await validateWord(parsedGuess);
        setIsLoading(false);
        if (isValid) {
          const updatedGuesses = [...guesses, parsedGuess];
          setGuesses(updatedGuesses);
          setAttempts(attempts - 1);
          setError("");
        } else {
          setError(`Word '${parsedGuess}' is not valid!`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCurrentGuess("");
      }
    } else {
      setError("Entered Guess should contain exactly 5 letters!");
    }

    setIsGuessedCorrect(parsedGuess === randomWord);

    setTimeout(() => inputRef.current?.focus(), 1);
  }

  function renderGuessedWord(guess: string) {
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

        let className = "bg-muted";
        if (isFullCorrect) className = "bg-green-500 text-green-50";
        else if (isHalfCorrect) className = "bg-yellow-600 text-yellow-50";
        else if (isWrong) className = "bg-red-500 text-red-50";

        return (
          <div
            key={i}
            className={`flex aspect-square h-full w-full items-center justify-center rounded-md text-2xl font-bold uppercase transition-colors sm:size-16 ${className}`}
          >
            {allEnteredLetters[i]}
          </div>
        );
      });
  }

  async function handleStartNewGame() {
    const word = await getRandomWord();
    setRandomWord(word);
    setGuesses([]);
    setCurrentGuess("");
    setAttempts(6);
  }

  function handleRestart() {
    setRandomWord("");
    setGuesses([]);
    setCurrentGuess("");
    setAttempts(6);
    setIsGuessedCorrect(false);
    setError("");

    handleStartNewGame();
  }

  useEffect(() => {
    handleStartNewGame();
  }, []);

  useEffect(() => {
    const updateLetters = () => {
      const fullyCorrect: string[] = [];
      const halfCorrect: string[] = [];
      const wrong: string[] = [];

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
    <div className="flex min-h-svh flex-col items-center pb-10 sm:justify-center">
      <RulesDialog />
      {randomWord ? (
        <div className="p-2 max-sm:w-full sm:pb-12">
          <h1 className="mb-2 text-center text-xl font-semibold max-sm:sr-only sm:mb-6 sm:text-4xl">
            🤔 Guess the Word!
          </h1>

          {/* Blocks */}
          <div className="mx-auto w-fit rounded-md bg-[#1d1b08] p-4 max-sm:mt-2 max-sm:w-8/12">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex gap-2 border-b border-muted-foreground/25 py-3 first:pt-0 last:border-0 last:pb-0"
              >
                {renderGuessedWord(guesses[index] || "")}
              </div>
            ))}
          </div>

          {/* Keyboard */}
          <div className="mt-6 flex flex-col gap-1">
            {rows.map((row, i) => (
              <div key={i} className="flex justify-center gap-1">
                {row.split("").map((letter, index) => {
                  const isHalfCorrect = halfCorLetters.includes(letter);
                  const isFullCorrect = fullCorLetters.includes(letter);
                  const isWrong = wrongLetters.includes(letter);

                  return (
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground transition-colors",
                        {
                          "border-yellow-600 bg-yellow-600 text-yellow-50":
                            isHalfCorrect,
                          "border-green-500 bg-green-500 text-green-50":
                            isFullCorrect,
                          "border-red-500 bg-red-500 text-red-50": isWrong,
                        },
                      )}
                      key={index}
                      onClick={() => {
                        handleInputChange({
                          target: { value: currentGuess + letter },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {!isLost && !isGuessedCorrect && (
            <div className="mt-6">
              <form
                onSubmit={handleGuess}
                className="flex justify-center gap-3"
              >
                <Input
                  autoFocus
                  ref={inputRef}
                  placeholder="Enter a 5-letter word"
                  value={currentGuess}
                  onChange={handleInputChange}
                  disabled={attempts === 0 || isLoading}
                />
                <Button type="submit" disabled={isLoading || attempts === 0}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  <span>{isLoading ? "Guessing..." : "Make Guess"}</span>
                </Button>
              </form>
              {!!error && (
                <div className="mt-1 text-sm text-red-500">{error}</div>
              )}
            </div>
          )}

          {/* Feedbacks */}
          {isLost && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <p>Game over! The word was: {randomWord}</p>
              <Button onClick={handleRestart} size="icon">
                <RefreshCcw />
              </Button>
            </div>
          )}
          {isGuessedCorrect && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="text-green-500">
                Congratulations! You guessed the word!
              </p>
              <Button onClick={handleRestart} size="icon">
                <RefreshCcw />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-svh items-center justify-center">
          <Loader2 className="size-12 animate-spin" />
        </div>
      )}

      <footer className="fixed bottom-0 flex h-10 w-full items-center justify-center bg-[#1d1b08] text-sm text-yellow-50">
        <p>
          Made with ❤️ by{" "}
          <a target="_blank" href="https://sohamb.tech" className="underline">
            Soham Bhikadiya
          </a>
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
