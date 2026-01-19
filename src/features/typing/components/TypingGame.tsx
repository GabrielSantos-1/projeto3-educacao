/* eslint-disable react-hooks/purity */
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Difficulty, GameState, TypingResult } from "../types";
import { calcAccuracy, calcWpm, countCorrectChars } from "../lib/metrics";
import { pickText } from "../lib/texts";
import { clearHistory, loadHistory, saveResult } from "../lib/storage";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function format2(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function computeErrors(typed: string, target: string) {
  const len = Math.min(typed.length, target.length);
  let err = 0;
  for (let i = 0; i < len; i++) {
    if (typed[i] !== target[i]) err++;
  }
  return err;
}

export default function TypingGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [durationSec, setDurationSec] = useState<number>(60);

  const [state, setState] = useState<GameState>("idle");
  const [target, setTarget] = useState<string>(() => pickText("easy"));
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [elapsed, setElapsed] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);

  // ✅ história como state pra atualizar quando salvar/limpar
  const [history, setHistory] = useState(() => loadHistory());

  // ✅ métricas corretas (caractere por caractere)
  const { typedChars, correctChars, errors } = useMemo(() => {
  const typed = input;
  const targetText = target;

  const typedLen = typed.length;
  const correctLen = countCorrectChars(typed, targetText);

  // erros = chars digitados que NÃO batem com o alvo (posição a posição)
  const len = Math.min(typedLen, targetText.length);
  let err = 0;

  for (let i = 0; i < len; i++) {
    if (typed[i] !== targetText[i]) err++;
  }

  // se digitou além do tamanho do alvo, isso conta como erro também
  if (typedLen > targetText.length) {
    err += typedLen - targetText.length;
  }

  return {
    typedChars: typedLen,
    correctChars: correctLen,
    errors: err,
  };
}, [input, target]);

const accuracy = useMemo(() => {
  if (input.length === target.length && input === target) return 100;
  return calcAccuracy(correctChars, typedChars);
}, [input, target, correctChars, typedChars])

  const wpm = useMemo(
    () => calcWpm(correctChars, Math.max(elapsed, 1)),
    [correctChars, elapsed]
  );

  function stopTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startGame() {
    stopTimer();
    setTarget(pickText(difficulty));
    setInput("");
    setElapsed(0);
    setState("running");
    setTimeout(() => inputRef.current?.focus(), 0);
    startTsRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const startTs = startTsRef.current ?? Date.now();
      const e = Math.floor((Date.now() - startTs) / 1000);
      setElapsed(e);

      if (e >= durationSec) finishGame(e);
    }, 200);
  }

  // ✅ robusto: permite finalizar usando o texto mais recente (evita salvar 1 char a menos)
  function finishGame(finalElapsed?: number, finalInput?: string) {
    stopTimer();
    const e = typeof finalElapsed === "number" ? finalElapsed : elapsed;

    const typed = finalInput ?? input;
    const typedLen = typed.length;
    const correctLen = countCorrectChars(typed, target);
    const err = computeErrors(typed, target);

    const result: TypingResult = {
      id: uid(),
      dateIso: new Date().toISOString(),
      difficulty,
      durationSec,
      typedChars: typedLen,
      correctChars: correctLen,
      errors: err,
      wpm: calcWpm(correctLen, Math.max(e, 1)),
      accuracy: calcAccuracy(correctLen, typedLen),
    };

    saveResult(result);
    setHistory(loadHistory());
    setState("finished");
  }

  function reset() {
    stopTimer();
    setState("idle");
    setInput("");
    setElapsed(0);
    setTarget(pickText(difficulty));
  }

  useEffect(() => {
    return () => stopTimer();
  }, []);

  // ✅ render do alvo com realce
  const renderedTarget = useMemo(() => {
    const spans: ReactNode[] = [];





    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      const typedCh = input[i];

      let cls = "";
      if (typedCh === undefined) cls = "opacity-70";
      else if (typedCh === ch) cls = "font-semibold";
      else cls = "underline";

      spans.push(
        <span key={i} className={cls}>
          {ch}
        </span>
      );
    }

    return spans;
  }, [target, input]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Mini Jogo de Digitação</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <label>
          Dificuldade:{" "}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={state === "running"}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </label>

        <label>
          Duração:{" "}
          <select
            value={durationSec}
            onChange={(e) => setDurationSec(Number(e.target.value))}
            disabled={state === "running"}
          >
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={90}>90s</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

          {state !== "running" ? (
            <button onClick={startGame}>Iniciar</button>
          ) : (
            <button onClick={() => finishGame()}>Finalizar</button>
          )}
          <button onClick={reset} disabled={state === "running"}>
            Reset
          </button>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <strong>Tempo:</strong> {Math.min(elapsed, durationSec)}s / {durationSec}s
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 12,
          lineHeight: 1.8,
          fontSize: 18,
          userSelect: "none",
          marginBottom: 12,
        }}
        aria-label="Texto para digitar"
      >
        {renderedTarget}
      </div>

      <textarea
  value={input}
  onChange={(e) => {
    // remove ENTER / quebra de linha
    let value = e.target.value.replace(/\r?\n/g, "");

    // trava no tamanho do target (impede 1 char a mais)
    if (value.length > target.length) {
      value = value.slice(0, target.length);
    }

    setInput(value);

    // finaliza exatamente no tamanho correto
    if (state === "running" && value.length === target.length) {
      finishGame(undefined, value);
    }
  }}
  disabled={state !== "running"}
  rows={3}
  style={{ width: "100%", fontSize: 16, padding: 10 }}
  placeholder={state === "running" ? "Digite aqui..." : "Clique em Iniciar para começar"}
  ref={inputRef}
/>


      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <div>
          <strong>WPM:</strong> {format2(wpm)}
        </div>
        <div>
          <strong>Precisão:</strong> {format2(accuracy)}%
        </div>
        <div>
          <strong>Erros:</strong> {errors}
        </div>
        <div>
          <strong>Corretos:</strong> {correctChars}
        </div>
        <div>
          <strong>Digitados:</strong> {typedChars}
        </div>
      </div>

      <hr style={{ margin: "18px 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Histórico (últimos 50)</h2>
        <button
          onClick={() => {
            clearHistory();
            setHistory([]);
            reset();
          }}
        >
          Limpar
        </button>
      </div>

      {history.length === 0 ? (
        <p style={{ opacity: 0.8 }}>Sem resultados ainda. Faça uma rodada para salvar no histórico.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Data</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Dificuldade</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>WPM</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Precisão</th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Erros</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                    {new Date(r.dateIso).toLocaleString()}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.difficulty}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                    {format2(r.wpm)}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                    {format2(r.accuracy)}%
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>
                    {r.errors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
