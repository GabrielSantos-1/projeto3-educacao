# Projeto 3 — Plataforma Educacional para Iniciantes (Tutoriais + Jogo de Digitação)

Aplicação web desenvolvida com foco em **iniciantes** (incluindo idosos), oferecendo uma experiência simples, direta e acessível para aprender informática básica por meio de:

- ✅ **Tutoriais passo a passo** com progresso salvo
- ✅ **Mini jogo de digitação** com métricas (WPM, precisão, erros) e histórico
- ✅ **Login por apelido (sem senha)** para salvar o progresso de cada aluno no mesmo computador

> MVP sem backend: os dados ficam salvos no **navegador** via `localStorage`.

---

## ✅ Objetivo do projeto

Criar uma plataforma educacional leve, intuitiva e escalável, capaz de:

- Ensinar habilidades digitais essenciais (Word, internet, celular, etc.)
- Acompanhar o progresso do aluno com **salvamento automático**
- Permitir uso em **laboratórios/escolas**, com vários alunos no mesmo PC
- Evoluir futuramente para módulos maiores (Segurança Digital, Compras Online, Videoconferência)

---

## 🚀 O que já foi implementado (até agora)

### ✅ Etapa 1 — Estrutura do projeto (base sólida)
- Projeto criado com **Vite + React + TypeScript**
- Organização modular por `features`
- Rotas principais separadas e limpas
- Estilo simples e responsivo (base pronta para evoluir)

---

### ✅ Etapa 2 — Sistema de rotas (React Router)
Rotas ativas no projeto:
- `/login` → tela inicial (apelido)
- `/` → Home
- `/tutoriais` → lista de tutoriais
- `/tutoriais/:tutorialId` → detalhes do tutorial + checklist
- `/jogo` → mini jogo de digitação

---

### ✅ Etapa 3 — Login por apelido (sem senha)
Implementado um login simples para salvar tudo separado por aluno:

✅ Funciona assim:
1. O aluno digita um **apelido**
2. O sistema registra como aluno atual
3. Todo progresso e histórico ficam ligados ao apelido

📌 Isso permite múltiplos alunos no mesmo computador sem misturar dados.

---

### ✅ Etapa 4 — Sistema de progresso dos tutoriais
- Cada tutorial possui passos (`steps`)
- O aluno marca os passos concluídos
- O progresso é calculado automaticamente
- Progresso salvo no `localStorage`

✅ Home mostra:
- total de passos concluídos
- total de passos disponíveis
- barra de progresso (%)

---

### ✅ Etapa 5 — Mini Jogo de Digitação (Typing Game)
Funcionalidades implementadas:
- seleção de dificuldade (`easy / medium / hard`)
- seleção de duração (30s / 60s / 90s)
- destaque do texto digitado vs texto alvo
- métricas em tempo real:
  - **WPM**
  - **Precisão**
  - Erros
  - Corretos
  - Digitados
- histórico com os **últimos 50 resultados**
- botão para limpar histórico

✅ Correção importante aplicada:
- **Precisão = 100%** quando o texto digitado fica **idêntico ao texto alvo**
- controle de input para evitar quebra de linha e caracteres extras

---

## 🧠 Persistência (como os dados são salvos)

O projeto salva dados no navegador via `localStorage`.

📌 Isso significa:
- Não precisa login real nem servidor
- Funciona offline
- Porém, se limpar dados do navegador, pode apagar o progresso

### Chaves principais (exemplo)
- Aluno atual:
  - `p3_current_student`

- Progresso dos tutoriais (por aluno):
  - `p3_tutorial_progress_v1:<apelido>`

- Histórico do jogo (por aluno):
  - `p3_typing_history_v1:<apelido>`

---

## 🧱 Tecnologias usadas

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **localStorage**

---

## 📁 Estrutura do projeto (resumo)

src/
├─ app/
│ ├─ layout/ # Layout com navegação
│ └─ routes/ # Rotas (login, home, tutoriais, jogo)
│
├─ features/
│ ├─ auth/ # aluno atual (apelido)
│ ├─ tutorials/ # dados + progresso
│ └─ typing/ # jogo (textos, métricas, histórico)
│
├─ assets/
├─ App.tsx
├─ main.tsx
└─ index.css


---

## ✅ Como rodar localmente

### Pré-requisitos
- Node.js 18+ recomendado
- npm

### Instalação
```bash
npm install


Rodar em modo desenvolvimento
npm run dev


Acesse no navegador:

http://localhost:5173/login

📦 Build de produção
npm run build
npm run preview

⚠️ Limitações atuais do MVP

Não existe autenticação real (qualquer um pode usar qualquer apelido)

Dados ficam só no navegador

Sem sincronização em nuvem

Se limpar cache/dados, pode perder progresso

✅ Isso é intencional no MVP: foco total em simplicidade + funcionalidade local.

🛣️ Planos futuros (evolução do projeto)
Próximas melhorias (curto prazo)

Tela “últimos apelidos usados” (seleção rápida)

Botão “trocar aluno”

Filtro por categoria nos tutoriais (Celular, Internet, Word, etc.)

Botão “Continuar” indo para o primeiro passo não concluído

Melhorias no jogo (médio prazo)

Ranking local por aluno

Medalhas/conquistas (ex: 100% precisão 5x)

Modo treino infinito (sem tempo)

Textos maiores e por nível

Evolução para plataforma completa (longo prazo)

Módulo: Segurança Digital

golpes e phishing

senhas fortes

cuidados com Pix e links

Módulo: Compras/Pagamentos Online

Módulo: Videoconferência

Exportar/importar progresso (JSON)

Persistência em nuvem (Firebase ou API própria)

📌 Autor

Gabriel Santos
