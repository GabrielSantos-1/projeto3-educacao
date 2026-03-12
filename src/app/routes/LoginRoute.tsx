import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getCurrentStudent, setCurrentStudent } from "../../features/auth/lib/student";

export default function LoginRoute() {
  const navigate = useNavigate();
  const currentStudent = getCurrentStudent();
  const [nick, setNick] = useState("");

  if (currentStudent) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = nick.trim();

    if (value.length < 2) {
      alert("Digite um nome ou apelido com pelo menos 2 caracteres.");
      return;
    }

    setCurrentStudent(value);
    navigate("/", { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-badge" aria-hidden="true">
          P3
        </div>

        <header className="auth-header">
          <h1 id="login-title" className="auth-title">
            Bem-vindo ao Projeto 3
          </h1>
          <p className="auth-subtitle">
            Plataforma educacional para iniciantes com tutoriais passo a passo e treino de digitação.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="nick" className="auth-label">
            Nome do aluno
          </label>

          <input
            id="nick"
            type="text"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="Ex.: gabriel"
            autoFocus
            className="auth-input"
            autoComplete="nickname"
          />

          <button type="submit" className="auth-button">
            Entrar
          </button>
        </form>

        <p className="auth-help">
          Seu progresso será salvo neste computador para continuar de onde parou.
        </p>
      </section>
    </main>
  );
}