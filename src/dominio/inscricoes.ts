import type { Atividade, Inscricao, ResultadoInscricao } from '../tipos';
import { formatarIntervalo, paraMinutos } from './tempo';

export const LIMITE_MINICURSOS = 2;

/** B2: duas atividades conflitam no mesmo dia quando inicioA < fimB e inicioB < fimA. */
export function haConflito(a: Atividade, b: Atividade): boolean {
  if (a.id === b.id || a.data !== b.data) return false;
  return paraMinutos(a.inicio) < paraMinutos(b.fim) && paraMinutos(b.inicio) < paraMinutos(a.fim);
}

export function confirmadosDaAtividade(inscricoes: Inscricao[], atividadeId: string): number {
  return inscricoes.filter((i) => i.atividadeId === atividadeId && i.situacao === 'confirmada').length;
}

export function esperaDaAtividade(inscricoes: Inscricao[], atividadeId: string): number {
  return inscricoes.filter((i) => i.atividadeId === atividadeId && i.situacao === 'espera').length;
}

/** B3: vagas restantes = capacidade menos confirmados. */
export function vagasRestantes(atividade: Atividade, inscricoes: Inscricao[]): number {
  return Math.max(0, atividade.capacidade - confirmadosDaAtividade(inscricoes, atividade.id));
}

export function inscricoesDoParticipante(inscricoes: Inscricao[], participanteId: string): Inscricao[] {
  return inscricoes.filter((i) => i.participanteId === participanteId);
}

export function buscarInscricao(
  inscricoes: Inscricao[],
  participanteId: string,
  atividadeId: string,
): Inscricao | undefined {
  return inscricoes.find((i) => i.participanteId === participanteId && i.atividadeId === atividadeId);
}

/** B2: confirmadas e lista de espera contam para o conflito. */
export function encontrarConflito(
  alvo: Atividade,
  inscricoes: Inscricao[],
  participanteId: string,
  atividades: Atividade[],
): Atividade | undefined {
  for (const inscricao of inscricoesDoParticipante(inscricoes, participanteId)) {
    const outra = atividades.find((a) => a.id === inscricao.atividadeId);
    if (outra && haConflito(alvo, outra)) return outra;
  }
  return undefined;
}

/** B5: minicursos confirmados e em espera entram na conta. */
export function contarMinicursos(
  inscricoes: Inscricao[],
  participanteId: string,
  atividades: Atividade[],
): number {
  return inscricoesDoParticipante(inscricoes, participanteId).filter((i) => {
    const atividade = atividades.find((a) => a.id === i.atividadeId);
    return atividade?.tipo === 'minicurso';
  }).length;
}

/**
 * Tenta inscrever. Não altera a lista recebida: devolve uma lista nova ou o motivo da recusa.
 * "agoraISO" vem de fora para a função continuar pura (e testável).
 */
export function inscrever(
  inscricoes: Inscricao[],
  participanteId: string,
  atividadeId: string,
  atividades: Atividade[],
  agoraISO: string,
): ResultadoInscricao {
  const atividade = atividades.find((a) => a.id === atividadeId);
  if (!atividade) return { ok: false, erro: 'Atividade não encontrada.' };

  if (buscarInscricao(inscricoes, participanteId, atividadeId)) {
    return { ok: false, erro: 'Você já está inscrito nesta atividade.' };
  }

  const conflito = encontrarConflito(atividade, inscricoes, participanteId, atividades);
  if (conflito) {
    return {
      ok: false,
      erro: `Conflito de horário com "${conflito.titulo}" (${formatarIntervalo(conflito)})`,
    };
  }

  if (
    atividade.tipo === 'minicurso' &&
    contarMinicursos(inscricoes, participanteId, atividades) >= LIMITE_MINICURSOS
  ) {
    return { ok: false, erro: `Limite de ${LIMITE_MINICURSOS} minicursos por participante` };
  }

  const situacao = vagasRestantes(atividade, inscricoes) > 0 ? 'confirmada' : 'espera';
  const nova: Inscricao = { participanteId, atividadeId, situacao, criadaEm: agoraISO };
  return { ok: true, inscricoes: [...inscricoes, nova], situacao };
}

function filaDeEspera(inscricoes: Inscricao[], atividadeId: string): Inscricao[] {
  return inscricoes
    .filter((i) => i.atividadeId === atividadeId && i.situacao === 'espera')
    .sort((a, b) => a.criadaEm.localeCompare(b.criadaEm));
}

/** B4: posição na fila (1, 2, 3...) ou null se a pessoa não está na espera. */
export function posicaoNaEspera(
  inscricoes: Inscricao[],
  participanteId: string,
  atividadeId: string,
): number | null {
  const indice = filaDeEspera(inscricoes, atividadeId).findIndex((i) => i.participanteId === participanteId);
  return indice === -1 ? null : indice + 1;
}

/**
 * B4: cancela a inscrição e, se ela era confirmada, promove o primeiro da fila.
 * As duas mudanças acontecem numa função só, então a lista nunca fica "pela metade".
 */
export function cancelarInscricao(
  inscricoes: Inscricao[],
  participanteId: string,
  atividadeId: string,
  atividades: Atividade[],
): Inscricao[] {
  const alvo = buscarInscricao(inscricoes, participanteId, atividadeId);
  if (!alvo) return inscricoes;

  const restantes = inscricoes.filter((i) => i !== alvo);
  if (alvo.situacao === 'espera') return restantes; // sair da fila não libera vaga

  const atividade = atividades.find((a) => a.id === atividadeId);
  const primeiro = filaDeEspera(restantes, atividadeId)[0];
  if (!atividade || !primeiro || vagasRestantes(atividade, restantes) === 0) return restantes;

  return restantes.map((i) => (i === primeiro ? { ...i, situacao: 'confirmada' as const } : i));
}
