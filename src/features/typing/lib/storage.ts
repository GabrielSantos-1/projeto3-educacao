import type { TypingResult } from "../types";
import { getCurrentStudent } from "../../auth/lib/student";

const BASE_KEY = "p3_typing_history_v1";

function keyForStudent() {
  const student = getCurrentStudent();
  return `${BASE_KEY}:${student ?? "guest"}`;
}

export function loadHistory(): TypingResult[] {
  try {
    const raw = localStorage.getItem(keyForStudent());
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
  localStorage.setItem(keyForStudent(), JSON.stringify(trimmed));
}

export function clearHistory() {
  localStorage.removeItem(keyForStudent());
}
