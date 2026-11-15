import type { DadosParticipante, ErrosParticipante, Participante } from '../tipos';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_MATRICULA = /^\d{6,10}$/;

/** B1: devolve um objeto com uma mensagem por campo inválido. Objeto vazio = tudo certo. */
export function validarParticipante(
  dados: DadosParticipante,
  existentes: Participante[],
): ErrosParticipante {
  const erros: ErrosParticipante = {};
  const nome = dados.nome.trim();
  const email = dados.email.trim().toLowerCase();
  const matricula = dados.matricula.trim();

  if (nome.length < 3) erros.nome = 'Informe o nome com pelo menos 3 caracteres';

  if (!REGEX_EMAIL.test(email)) erros.email = 'Informe um e-mail válido';
  else if (existentes.some((p) => p.email.toLowerCase() === email)) erros.email = 'E-mail já cadastrado';

  if (!REGEX_MATRICULA.test(matricula)) erros.matricula = 'A matrícula deve ter de 6 a 10 dígitos';
  else if (existentes.some((p) => p.matricula === matricula)) erros.matricula = 'Matrícula já cadastrada';

  if (dados.curso.trim() === '') erros.curso = 'Informe o curso';

  return erros;
}
