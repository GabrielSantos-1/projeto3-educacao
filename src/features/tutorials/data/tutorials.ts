import type { Tutorial } from "../types/tutorials";

export const tutorials: Tutorial[] = [
  {
    id: "criar-email",
    title: "Criar e-mail",
    category: "Internet",
    description: "Criar uma conta de e-mail e configurar o básico com segurança.",
    steps: [
      { id: "s1", text: "Acesse o site do provedor (Gmail/Outlook) no navegador." },
      { id: "s2", text: "Clique em Criar conta e preencha nome, usuário e senha." },
      { id: "s3", text: "Crie uma senha forte (frase + números) e evite reutilizar." },
      { id: "s4", text: "Ative 2FA (verificação em duas etapas) se estiver disponível." },
      { id: "s5", text: "Faça login, saia e entre novamente para confirmar." },
    ],
  },
  {
    id: "enviar-email-anexo",
    title: "Enviar e-mail com anexo",
    category: "E-mail",
    description: "Enviar mensagem e anexar arquivo com revisão antes do envio.",
    steps: [
      { id: "s1", text: "Clique em 'Escrever' / 'Novo e-mail'." },
      { id: "s2", text: "Digite destinatário e um assunto objetivo." },
      { id: "s3", text: "Escreva a mensagem (curta e clara)." },
      { id: "s4", text: "Clique no clipe e selecione o arquivo para anexar." },
      { id: "s5", text: "Revise destinatário + anexo e clique em 'Enviar'." },
    ],
  },
  {
    id: "baixar-app-playstore",
    title: "Baixar app na Play Store",
    category: "Celular",
    description: "Instalar app com critérios para evitar apps falsos e permissões abusivas.",
    steps: [
      { id: "s1", text: "Abra a Play Store e pesquise pelo nome do app." },
      { id: "s2", text: "Confira o desenvolvedor (empresa oficial) e a nota." },
      { id: "s3", text: "Leia comentários recentes e observe número de downloads." },
      { id: "s4", text: "Verifique permissões e desconfie de pedidos exagerados." },
      { id: "s5", text: "Instale, abra e revise as configurações do app." },
    ],
  },
  {
    id: "doc-word",
    title: "Criar documento no Word",
    category: "Word",
    description: "Criar documento simples, formatar e salvar corretamente.",
    steps: [
      { id: "s1", text: "Abra o Word e selecione 'Documento em branco'." },
      { id: "s2", text: "Digite um título e um parágrafo." },
      { id: "s3", text: "Ajuste fonte e tamanho para leitura confortável." },
      { id: "s4", text: "Salve como .docx em uma pasta fácil de localizar." },
      { id: "s5", text: "Feche e reabra o arquivo para confirmar o salvamento." },
    ],
  },
  {
    id: "planilha-excel",
    title: "Planilha simples no Excel",
    category: "Excel",
    description: "Criar uma planilha de gastos simples com soma e formatação.",
    steps: [
      { id: "s1", text: "Abra o Excel e crie uma planilha nova." },
      { id: "s2", text: "Crie colunas: Item | Valor | Data." },
      { id: "s3", text: "Digite valores e formate a coluna como moeda." },
      { id: "s4", text: "Use SOMA para totalizar (ex: =SOMA(B2:B10))." },
      { id: "s5", text: "Salve com um nome e data (ex: gastos-2026-01.xlsx)." },
    ],
  },
  {
    id: "internet-navegacao-01",
    title: "Navegação na Internet (Básico)",
    description: "Aprenda a usar o navegador com segurança: abas, pesquisa, downloads e sites confiáveis.",
    category: "Internet",
    steps: [
      { id: "s1", text: "Abra o navegador (Chrome, Firefox, Edge)." },
      { id: "s2", text: "Use a barra de endereços para fazer pesquisas em sites (exemplo: google , ou como usar o notebook , youtube para acessar videos etc)." },
      { id: "s3", text: "Abra novas abas para visitar múltiplos sites." },
      { id: "s4", text: "Baixe arquivos apenas de sites confiáveis." },
      { id: "s5", text: "Feche abas que não estiver usando para melhorar a performance." },
    ],
  },
];