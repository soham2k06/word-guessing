import { Info } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function RulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="fixed right-2 top-2 sm:right-4 sm:top-4"
        >
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rules</DialogTitle>
          <DialogDescription>How to play the game</DialogDescription>
        </DialogHeader>

        <ol className="h-full list-decimal space-y-2 overflow-y-auto pl-6">
          <li>
            <strong>Objective:</strong> Guess the hidden word in six tries or
            fewer.
          </li>
          <li>
            <strong>Gameplay:</strong>
            <ul className="list-disc pl-6">
              <li>
                Each guess must be a valid word with the correct number of
                letters.
              </li>
              <li>
                After each guess, the color of the tiles will change to show how
                close your guess was to the hidden word.
              </li>
            </ul>
          </li>
          <li>
            <strong>Tile Colors:</strong>
            <ul className="list-disc pl-6">
              <li>
                <span className="font-semibold text-green-500">Green</span> -
                The letter is in the word and in the correct position.
              </li>
              <li>
                <span className="font-semibold text-yellow-500">Yellow</span> -
                The letter is in the word but in the wrong position.
              </li>
              <li>
                <span className="font-semibold text-red-500">Red</span> - The
                letter is not in the word at all.
              </li>
            </ul>
          </li>
          <li>
            <strong>Hints and Strategy:</strong>
            <ul className="list-disc pl-6">
              <li>
                Use logic and deduction based on previous guesses to refine your
                next attempt.
              </li>
              <li>
                Pay close attention to the tile colors to narrow down the
                possibilities.
              </li>
            </ul>
          </li>
          <li>
            <strong>Winning:</strong> Successfully guess the hidden word before
            running out of attempts. A perfect game is achieved by guessing the
            word in fewer attempts.
          </li>
          <li>
            <strong>Losing:</strong> If you fail to guess the word in six tries,
            the game ends, and the hidden word is revealed.
          </li>
          <li>
            <strong>Daily Challenge:</strong> A new word is available to solve
            each day, adding to the excitement and anticipation!
          </li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}

export default RulesDialog;
