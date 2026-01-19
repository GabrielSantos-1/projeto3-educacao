import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tutorials } from "../../features/tutorials/data/tutorials";
import { calcPercent } from "../../features/tutorials/lib/progress";
import {
  getCompletedSteps,
  loadProgress,
  toggleStep,
  type TutorialProgressMap,
} from "../../features/tutorials/lib/storage";

export default function TutorialDetailRoute() {
  // ✅ pega o param certo conforme o router: "tutoriais/:tutorialId"
  const { tutorialId } = useParams();

  const tutorial = useMemo(() => {
    if (!tutorialId) return undefined;
    return tutorials.find((t) => t.id === tutorialId);
  }, [tutorialId]);

  const [progressMap, setProgressMap] = useState<TutorialProgressMap>(() =>
    loadProgress()
  );

  if (!tutorial) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <p>Tutorial não encontrado.</p>
        <Link to="/tutoriais">Voltar</Link>
      </div>
    );
  }

  const completed = getCompletedSteps(progressMap, tutorial.id);
  const done = completed.size;
  const total = tutorial.steps.length;
  const pct = calcPercent(done, total);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ✅ volta certo */}
      <Link to="/tutoriais">← Voltar</Link>

      <h1 style={{ fontSize: 20, marginBottom: 4 }}>{tutorial.title}</h1>
      <div style={{ opacity: 0.8, marginBottom: 10 }}>{tutorial.category}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 10, background: "#eee", borderRadius: 999 }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: "#bbb",
              borderRadius: 999,
            }}
          />
        </div>
        <div style={{ fontWeight: 900 }}>{pct}%</div>
      </div>

      <p style={{ marginTop: 12 }}>{tutorial.description}</p>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
        {tutorial.steps.map((s) => {
          const checked = completed.has(s.id);
          return (
            <label
              key={s.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "8px 0",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setProgressMap(toggleStep(tutorial.id, s.id))}
              />
              <span>{s.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
