import { Link } from "react-router-dom";
import { tutorials } from "../../features/tutorials/data/tutorials";
import { loadProgress } from "../../features/tutorials/lib/storage";
import { calcPercent } from "../../features/tutorials/lib/progress";
import type { Tutorial } from "../../features/tutorials/types/tutorials";

// Se seu TutorialDetailRoute usa outra rota, ajuste aqui:
function detailPath(tutorialId: string) {
  return `/tutoriais/${tutorialId}`;
}

// Detecta o primeiro passo não concluído.
// Funciona mesmo se progress[t.id] for number[] (índices) ou string[] (ids/keys).
function firstIncompleteIndex(t: Tutorial, doneList: (string | number)[]) {
  const doneSet = new Set(doneList ?? []);
  for (let i = 0; i < t.steps.length; i++) {
    // tenta bater índice e também "i" como string (robustez)
    if (!doneSet.has(i) && !doneSet.has(String(i))) return i;
  }
  return t.steps.length; // tudo concluído
}

export default function TutorialsRoute() {
  const progress = loadProgress();

  // categorias (fallback: "Geral")
  const categories = Array.from(
    new Set(
      tutorials.map((t: Tutorial) => (t.category?.trim() ? t.category.trim() : "Geral"))
    )
  ).sort((a, b) => a.localeCompare(b));

  // filtro simples sem estado global (padrão: "Todas")
  const params = new URLSearchParams(window.location.search);
  const selected = params.get("cat") ?? "Todas";

  const filtered = tutorials.filter((t: Tutorial) => {
    const cat = t.category?.trim() ? t.category.trim() : "Geral";
    return selected === "Todas" ? true : cat === selected;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 6 }}>Tutoriais</h1>
          <p style={{ opacity: 0.85, marginTop: 0 }}>
            Marque os passos concluídos. O progresso fica salvo localmente.
          </p>
        </div>

        {/* Filtro por categoria via querystring (não quebra nada e não exige estado global) */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="cat" style={{ opacity: 0.85 }}>Categoria:</label>
          <select
            id="cat"
            defaultValue={selected}
            onChange={(e) => {
              const cat = e.target.value;
              const p = new URLSearchParams(window.location.search);
              if (cat === "Todas") p.delete("cat");
              else p.set("cat", cat);
              window.location.search = p.toString();
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #444",
              background: "#151515",
              color: "#fff",
              outline: "none",
            }}
          >
            <option value="Todas">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {filtered.map((t: Tutorial) => {
          const doneList = progress[t.id] ?? [];
          const done = doneList.length;
          const total = t.steps.length;
          const pct = calcPercent(done, total);

          const nextIdx = firstIncompleteIndex(t, doneList);
          const finished = done >= total;

          // Continua no primeiro passo não concluído (passa step por querystring).
          // Se seu TutorialDetailRoute não usa step, ele simplesmente ignora.
          const continueHref =
            nextIdx >= total
              ? detailPath(t.id)
              : `${detailPath(t.id)}?step=${nextIdx}`;

          const category = t.category?.trim() ? t.category.trim() : "Geral";

          return (
            <div
              key={t.id}
              style={{
                border: "1px solid #333",
                borderRadius: 12,
                padding: 14,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 16 }}>{t.title}</h2>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid #444",
                        opacity: 0.9,
                      }}
                    >
                      {category}
                    </span>
                  </div>

                  {t.description ? (
                    <p style={{ margin: "8px 0 0", opacity: 0.85 }}>
                      {t.description}
                    </p>
                  ) : null}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <Link
                    to={detailPath(t.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #555",
                      textDecoration: "none",
                      color: "#fff",
                      opacity: 0.95,
                    }}
                  >
                    Abrir
                  </Link>

                  <Link
                    to={continueHref}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #6ea8ff",
                      textDecoration: "none",
                      color: "#6ea8ff",
                      fontWeight: 600,
                    }}
                  >
                    {finished ? "Revisar" : "Continuar"}
                  </Link>
                </div>
              </div>

              {/* Barra de progresso */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.85, fontSize: 13 }}>
                  <span>
                    {done}/{total} passos
                    {!finished ? ` • próximo: passo ${nextIdx + 1}` : " • concluído"}
                  </span>
                  <span>{pct}%</span>
                </div>

                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "#222",
                    border: "1px solid #333",
                    overflow: "hidden",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: finished ? "#3ddc97" : "#6ea8ff",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 ? (
          <div style={{ opacity: 0.8, border: "1px dashed #444", borderRadius: 12, padding: 14 }}>
            Nenhum tutorial nessa categoria.
          </div>
        ) : null}
      </div>
    </div>
  );
}
