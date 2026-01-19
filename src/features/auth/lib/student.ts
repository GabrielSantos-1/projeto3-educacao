const CURRENT_KEY = "p3_current_student";

export function normalizeNick(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export function setCurrentStudent(nick: string) {
  localStorage.setItem(CURRENT_KEY, nick);
}

export function getCurrentStudent(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

export function clearCurrentStudent() {
  localStorage.removeItem(CURRENT_KEY);
}
