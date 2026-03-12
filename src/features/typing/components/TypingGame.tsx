/* eslint-disable react-hooks/purity */
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Difficulty, GameState, TypingResult } from "../types";
import { calcAccuracy, calcWpm, countCorrectChars } from "../lib/metrics";
import { pickText } from "../lib/texts";
import { clearHistory, loadHistory, saveResult } from "../lib/storage";

const LEVEL_GOAL = 10;

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

  if (typed.length > target.length) {
    err += typed.length - target.length;
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
  const timerRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  const [elapsed, setElapsed] = useState<number>(0);
  const [history, setHistory] = useState<TypingResult[]>(() => loadHistory());

  const [levelProgress, setLevelProgress] = useState<number>(0);
  const [autoLevelEnabled, setAutoLevelEnabled] = useState<boolean>(true);

  const [sessionTypedChars, setSessionTypedChars] = useState<number>(0);
  const [sessionCorrectChars, setSessionCorrectChars] = useState<number>(0);
  const [sessionErrors, setSessionErrors] = useState<number>(0);

  const { typedChars, correctChars, errors } = useMemo(() => {
    const typed = input;
    const targetText = target;

    const typedLen = typed.length;
    const correctLen = countCorrectChars(typed, targetText);

    const len = Math.min(typedLen, targetText.length);
    let err = 0;

    for (let i = 0; i < len; i++) {
      if (typed[i] !== targetText[i]) err++;
    }

    if (typedLen > targetText.length) {
      err += typedLen - targetText.length;
    }

    return {
      typedChars: typedLen,
      correctChars: correctLen,
      errors: err,
    };
  }, [input, target]);

  function stopTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function focusInputSoon() {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function getNextPhrase(currentDifficulty: Difficulty, currentTarget: string) {
    let next = pickText(currentDifficulty);

    if (next === currentTarget) {
      for (let i = 0; i < 10; i++) {
        const candidate = pickText(currentDifficulty);
        if (candidate !== currentTarget) {
          next = candidate;
          break;
        }
      }
    }

    return next;
  }

  function goToNextPhrase(nextDifficulty?: Difficulty) {
    const difficultyToUse = nextDifficulty ?? difficulty;
    const nextTarget = getNextPhrase(difficultyToUse, target);

    setTarget(nextTarget);
    setInput("");
    focusInputSoon();
  }

  function startGame() {
    stopTimer();
    hasFinishedRef.current = false;

    setTarget(pickText(difficulty));
    setInput("");
    setElapsed(0);
    setLevelProgress(0);
    setSessionTypedChars(0);
    setSessionCorrectChars(0);
    setSessionErrors(0);
    setState("running");
    startTsRef.current = Date.now();

    focusInputSoon();

    timerRef.current = window.setInterval(() => {
      const startTs = startTsRef.current ?? Date.now();
      const e = Math.floor((Date.now() - startTs) / 1000);

      setElapsed(e);

      if (e >= durationSec) {
        finishGame(e);
      }
    }, 200);
  }

  function handlePhraseComplete(value: string) {
    const phraseTypedLen = value.length;
    const phraseCorrectLen = countCorrectChars(value, target);
    const phraseErrors = computeErrors(value, target);
    const finalAccuracy = calcAccuracy(phraseCorrectLen, phraseTypedLen);
    const isCorrect = value === target && finalAccuracy >= 90;

    setSessionTypedChars((prev) => prev + phraseTypedLen);
    setSessionCorrectChars((prev) => prev + phraseCorrectLen);
    setSessionErrors((prev) => prev + phraseErrors);

    if (!isCorrect) {
      setInput("");
      focusInputSoon();
      return;
    }

    const nextProgress = levelProgress + 1;

    if (!autoLevelEnabled) {
      setLevelProgress(nextProgress);
      goToNextPhrase();
      return;
    }

    if (difficulty === "easy" && nextProgress >= LEVEL_GOAL) {
      setDifficulty("medium");
      setLevelProgress(0);
      setTarget(getNextPhrase("medium", target));
      setInput("");
      alert("Parabéns! Você avançou para o nível médio.");
      focusInputSoon();
      return;
    }

    if (difficulty === "medium" && nextProgress >= LEVEL_GOAL) {
      setDifficulty("hard");
      setLevelProgress(0);
      setTarget(getNextPhrase("hard", target));
      setInput("");
      alert("Parabéns! Você avançou para o nível difícil.");
      focusInputSoon();
      return;
    }

    if (difficulty === "hard") {
      const cappedProgress = Math.min(nextProgress, LEVEL_GOAL);
      setLevelProgress(cappedProgress);
      goToNextPhrase();
      return;
    }

    setLevelProgress(nextProgress);
    goToNextPhrase();
  }

  function finishGame(finalElapsed?: number, finalInput?: string) {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    stopTimer();

    const e = typeof finalElapsed === "number" ? finalElapsed : elapsed;

    let finalTypedTotal = sessionTypedChars;
    let finalCorrectTotal = sessionCorrectChars;
    let finalErrorsTotal = sessionErrors;

    if (finalInput !== undefined || input.length > 0) {
      const partialTyped = finalInput ?? input;
      finalTypedTotal += partialTyped.length;
      finalCorrectTotal += countCorrectChars(partialTyped, target);
      finalErrorsTotal += computeErrors(partialTyped, target);
    }

    const result: TypingResult = {
      id: uid(),
      dateIso: new Date().toISOString(),
      difficulty,
      durationSec,
      typedChars: finalTypedTotal,
      correctChars: finalCorrectTotal,
      errors: finalErrorsTotal,
      wpm: calcWpm(finalCorrectTotal, Math.max(e, 1)),
      accuracy: calcAccuracy(finalCorrectTotal, finalTypedTotal),
    };

    saveResult(result);
    setHistory(loadHistory());
    setState("finished");
  }

  function reset() {
    stopTimer();
    hasFinishedRef.current = false;

    setState("idle");
    setInput("");
    setElapsed(0);
    setLevelProgress(0);
    setSessionTypedChars(0);
    setSessionCorrectChars(0);
    setSessionErrors(0);
    setTarget(pickText(difficulty));
  }

  useEffect(() => {
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (state === "idle" || state === "finished") {
      setTarget(pickText(difficulty));
      setInput("");
      setElapsed(0);
    }
  }, [difficulty, state]);

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

  const displayTypedChars = sessionTypedChars + typedChars;
  const displayCorrectChars = sessionCorrectChars + correctChars;
  const displayErrors = sessionErrors + errors;

  const displayAccuracy = useMemo(() => {
    return calcAccuracy(displayCorrectChars, displayTypedChars);
  }, [displayCorrectChars, displayTypedChars]);

  const displayWpm = useMemo(() => {
    return calcWpm(displayCorrectChars, Math.max(elapsed, 1));
  }, [displayCorrectChars, elapsed]);

  const difficultyLabel =
    difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : "Difícil";

  const progressPercent = Math.min((levelProgress / LEVEL_GOAL) * 100, 100);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Mini Jogo de Digitação</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <label>
          Dificuldade:{" "}
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as Difficulty);
              setLevelProgress(0);
              setSessionTypedChars(0);
              setSessionCorrectChars(0);
              setSessionErrors(0);
              setInput("");
              setElapsed(0);
            }}
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
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>Nível atual: {difficultyLabel}</span>
            <span>
              {levelProgress} / {LEVEL_GOAL}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: 14,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label={`Progressão: ${levelProgress} de ${LEVEL_GOAL}`}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #22c55e, #3b82f6)",
                transition: "width 0.25s ease",
              }}
            />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={autoLevelEnabled}
            onChange={(e) => setAutoLevelEnabled(e.target.checked)}
            disabled={state === "running"}
          />
          Subir nível automaticamente
        </label>
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
          let value = e.target.value.replace(/\r?\n/g, "");

          if (value.length > target.length) {
            value = value.slice(0, target.length);
          }

          setInput(value);

          if (state === "running" && value.length === target.length) {
            handlePhraseComplete(value);
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
          <strong>WPM:</strong> {format2(displayWpm)}
        </div>
        <div>
          <strong>Precisão:</strong> {format2(displayAccuracy)}%
        </div>
        <div>
          <strong>Erros:</strong> {displayErrors}
        </div>
        <div>
          <strong>Corretos:</strong> {displayCorrectChars}
        </div>
        <div>
          <strong>Digitados:</strong> {displayTypedChars}
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
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                  Dificuldade
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>
                  WPM
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>
                  Precisão
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>
                  Erros
                </th>
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