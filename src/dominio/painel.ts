import type { Atividade, Inscricao, Participante } from '../tipos';
import { confirmadosDaAtividade, esperaDaAtividade } from './inscricoes';

export interface Ocupacao {
  confirmados: number;
  espera: number;
  capacidade: number;
  percentual: number;
  lotada: boolean;
}

/** B7: percentual = confirmados / capacidade, arredondado para o inteiro. */
export function calcularOcupacao(atividade: Atividade, inscricoes: Inscricao[]): Ocupacao {
  const confirmados = confirmadosDaAtividade(inscricoes, atividade.id);
  return {
    confirmados,
    espera: esperaDaAtividade(inscricoes, atividade.id),
    capacidade: atividade.capacidade,
    percentual: Math.round((confirmados * 100) / atividade.capacidade),
    lotada: confirmados >= atividade.capacidade,
  };
}

/** B7: mais procurada = maior número de confirmados + espera. Em empate, vale a primeira da programação. */
export function atividadeMaisProcurada(
  atividades: Atividade[],
  inscricoes: Inscricao[],
): { atividade: Atividade; total: number } | null {
  let melhor: { atividade: Atividade; total: number } | null = null;
  for (const atividade of atividades) {
    const total = inscricoes.filter((i) => i.atividadeId === atividade.id).length;
    if (total > 0 && (melhor === null || total > melhor.total)) melhor = { atividade, total };
  }
  return melhor;
}

export function totaisDoEvento(participantes: Participante[], inscricoes: Inscricao[]) {
  return {
    participantes: participantes.length,
    confirmadas: inscricoes.filter((i) => i.situacao === 'confirmada').length,
  };
}
