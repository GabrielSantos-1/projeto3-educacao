const CURRENT_KEY = "p3_current_student";

export function normalizeNick(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export function setCurrentStudent(nick: string) {
  const normalized = normalizeNick(nick);

  // ✅ não salva vazio
  if (!normalized) return;

  localStorage.setItem(CURRENT_KEY, normalized);
}

export function getCurrentStudent(): string | null {
  const raw = localStorage.getItem(CURRENT_KEY);

  // ✅ se estiver vazio, trata como null
  if (!raw) return null;

  const normalized = normalizeNick(raw);
  return normalized ? normalized : null;
}

export function clearCurrentStudent() {
  localStorage.removeItem(CURRENT_KEY);
}
