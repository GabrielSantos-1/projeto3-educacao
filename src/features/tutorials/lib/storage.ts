import { getCurrentStudent } from "../../auth/lib/student";

const BASE_KEY = "p3_tutorial_progress_v1";

function keyForStudent() {
  const student = getCurrentStudent();
  return `${BASE_KEY}:${student ?? "guest"}`;
}

export type TutorialProgressMap = Record<string, string[]>;

export function loadProgress(): TutorialProgressMap {
  try {
    const raw = localStorage.getItem(keyForStudent());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as TutorialProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(map: TutorialProgressMap) {
  localStorage.setItem(keyForStudent(), JSON.stringify(map));
}

export function toggleStep(tutorialId: string, stepId: string) {
  const map = loadProgress();
  const current = new Set(map[tutorialId] ?? []);

  if (current.has(stepId)) current.delete(stepId);
  else current.add(stepId);

  map[tutorialId] = Array.from(current);
  saveProgress(map);
  return map;
}

export function getCompletedSteps(map: TutorialProgressMap, tutorialId: string): Set<string> {
  return new Set(map[tutorialId] ?? []);
}
