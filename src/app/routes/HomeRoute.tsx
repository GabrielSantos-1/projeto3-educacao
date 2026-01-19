import { Link, useNavigate } from "react-router-dom";
import { tutorials } from "../../features/tutorials/data/tutorials";
import { loadProgress } from "../../features/tutorials/lib/storage";
import { calcPercent } from "../../features/tutorials/lib/progress";

import { clearCurrentStudent, getCurrentStudent } from "../../features/auth/lib/student";

function sumProgress() {
  const progress = loadProgress();
  let totalSteps = 0;
  let doneSteps = 0;

  for (const t of tutorials) {
    const done = (progress[t.id] ?? []).length;
    totalSteps += t.steps.length;
    doneSteps += done;
  }

  const pct = calcPercent(doneSteps, totalSteps);
  return { totalSteps, doneSteps, pct };
}

export default function HomeRoute() {
  const nav = useNavigate();
  const student = getCurrentStudent();
  const { totalSteps, doneSteps, pct } = sumProgress();

  return (
    <div className="grid" style={{ gap: 16 }}>
      <section className="card" style={{ padding: 18 }}>
        {/* ✅ Aluno atual + Trocar aluno */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <div style={{ opacity: 0.85 }}>
            Aluno: <strong>{student ?? "—"}</strong>
          </div>

          <button
            className="btn"
            onClick={() => {
              clearCurrentStudent();
              nav("/login", { replace: true });
            }}
          >
            🔁 Trocar aluno
          </button>
        </div>

        <h1 className="h1">Plataforma Educacional para Iniciantes</h1>
        <p className="p">
          Tutoriais passo a passo + mini jogo de digitação. Tudo com botões grandes e progresso salvo no computador
          (localStorage).
        </p>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <Link to="/tutoriais" className="btn primary" aria-label="Abrir tutoriais">
            📘 Abrir Tutoriais
          </Link>
          <Link to="/jogo" className="btn" aria-label="Abrir jogo de digitação">
            ⌨️ Abrir Jogo
          </Link>
        </div>
      </section>

      <section className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>Seu progresso</h2>
            <p className="p" style={{ marginTop: 6 }}>
              Você concluiu <strong>{doneSteps}</strong> de <strong>{totalSteps}</strong> passos.
            </p>
          </div>
          <div className="kpi" aria-label="Indicadores">
            <span>
              <strong>{pct}%</strong> completo
            </span>
          </div>
        </div>

        <div className="progressbar" style={{ marginTop: 12 }} aria-label={`Progresso: ${pct}%`}>
          <div style={{ width: `${pct}%` }} />
        </div>

        <div style={{ marginTop: 14, color: "rgba(255,255,255,0.72)" }}>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Use “Tutoriais” para aprender por etapas (marcando o que concluiu).</li>
            <li>Use o “Jogo” para treinar digitação com feedback rápido.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
