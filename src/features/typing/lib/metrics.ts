export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calcAccuracy(correctChars: number, typedChars: number): number {
  if (typedChars <= 0) return 0;

  // ✅ se tudo digitado está correto, é 100%
  if (correctChars === typedChars) return 100;

  return clamp((correctChars / typedChars) * 100, 0, 100);
}


// Convenção comum: 1 palavra = 5 caracteres
export function calcWpm(correctChars: number, elapsedSec: number): number {
  const minutes = elapsedSec / 60;
  if (minutes <= 0) return 0;
  return (correctChars / 5) / minutes;
}
export function countCorrectChars(typed: string, target: string): number {
  const len = Math.min(typed.length, target.length);
  let correct = 0;

  for (let i = 0; i < len; i++) {
    if (typed[i] === target[i]) correct++;
  }

  return correct;
}
