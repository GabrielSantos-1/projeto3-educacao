import type { TypingResult } from "../types";

const KEY = "p3_typing_history_v1";

export function loadHistory(): TypingResult[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TypingResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: TypingResult) {
  const history = loadHistory();
  history.unshift(result);
  // mantém tamanho controlado (evita infinito)
  const trimmed = history.slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
