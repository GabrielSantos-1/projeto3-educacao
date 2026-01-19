import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-badge" aria-hidden="true">P3</div>
            <div className="brand-text">
              <div className="brand-title">Projeto 3</div>
              <div className="brand-subtitle">Plataforma Educacional</div>
            </div>
          </div>

          <nav className="nav-pills" aria-label="Navegação principal">
            <NavLink to="/" end className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>
              Home
            </NavLink>
            <NavLink to="/tutoriais" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>
              Tutoriais
            </NavLink>
            <NavLink to="/jogo" className={({ isActive }) => `pill ${isActive ? "active" : ""}`}>
              Jogo
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <span>MVP: React + TS + Vite • Progresso em localStorage</span>
      </footer>
    </div>
  );
}

