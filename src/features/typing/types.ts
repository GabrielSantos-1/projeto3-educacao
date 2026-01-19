export type Difficulty = "easy" | "medium" | "hard";

export type TypingResult = {
  id: string;
  dateIso: string;
  difficulty: Difficulty;
  durationSec: number;
  typedChars: number;
  correctChars: number;
  errors: number;
  wpm: number;
  accuracy: number; // 0..100
};

export type GameState = "idle" | "running" | "finished";
