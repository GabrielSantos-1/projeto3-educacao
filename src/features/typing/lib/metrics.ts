export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calcAccuracy(correctChars: number, typedChars: number): number {
  if (typedChars <= 0) return 0;
  return clamp((correctChars / typedChars) * 100, 0, 100);
}

// Convenção comum: 1 palavra = 5 caracteres
export function calcWpm(correctChars: number, elapsedSec: number): number {
  const minutes = elapsedSec / 60;
  if (minutes <= 0) return 0;
  return (correctChars / 5) / minutes;
}
