import type { Difficulty } from "../types";

const EASY = [
  "o rato roeu a roupa do rei de roma",
  "hoje eu vou aprender a digitar melhor",
  "digitar com calma e com precisao",
  "estou digitando melhor agora",
  "estou pronto para o proximo nivel"
  
];

const MEDIUM = [
  "aprender a digitar exige pratica e consistencia todos os dias",
  "teclas, espacos e pontuacao fazem parte do treino",
  "o objetivo e reduzir erros e aumentar a velocidade"
];

const HARD = [
  "seguranca digital comeca com habitos: senhas fortes, 2fa e atencao a links suspeitos",
  "um bom texto para treino tem acentos, virgulas, e diferentes comprimentos de palavras",
  "pratique sem pressa, meca resultados e ajuste o foco onde erra mais"
];

export function pickText(difficulty: Difficulty): string {
  const pool = difficulty === "easy" ? EASY : difficulty === "medium" ? MEDIUM : HARD;
  return pool[Math.floor(Math.random() * pool.length)];
}
