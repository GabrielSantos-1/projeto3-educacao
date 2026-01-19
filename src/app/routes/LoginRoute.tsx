import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeNick, setCurrentStudent } from "../../features/auth/lib/student";

export default function LoginRoute() {
  const [nick, setNick] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleEnter(e: React.FormEvent) {
    e.preventDefault();
    const clean = normalizeNick(nick);

    if (!clean || clean.length < 2) {
      setErr("Digite um apelido válido (mínimo 2 caracteres).");
      return;
    }

    setCurrentStudent(clean);
    navigate("/", { replace: true });
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>Entrar</h1>
      <p style={{ opacity: 0.85, marginTop: 0 }}>
        Digite seu apelido para salvar seu progresso neste computador.
      </p>

      <form onSubmit={handleEnter} style={{ display: "grid", gap: 10 }}>
        <input
          value={nick}
          onChange={(e) => {
            setNick(e.target.value);
            setErr(null);
          }}
          placeholder="Ex: gabriel"
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        {err && <div style={{ color: "crimson", fontSize: 14 }}>{err}</div>}

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
