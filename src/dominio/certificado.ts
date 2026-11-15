import type { Atividade, Inscricao } from '../tipos';
import { duracaoEmMinutos, formatarDuracao } from './tempo';

export const MINUTOS_PARA_CERTIFICADO = 4 * 60;

/** B6: soma da duração das atividades confirmadas. Lista de espera não conta. */
export function cargaHorariaEmMinutos(
  inscricoes: Inscricao[],
  participanteId: string,
  atividades: Atividade[],
): number {
  return inscricoes
    .filter((i) => i.participanteId === participanteId && i.situacao === 'confirmada')
    .reduce((total, i) => {
      const atividade = atividades.find((a) => a.id === i.atividadeId);
      return atividade ? total + duracaoEmMinutos(atividade) : total;
    }, 0);
}

export function statusDoCertificado(minutos: number): { liberado: boolean; texto: string } {
  if (minutos >= MINUTOS_PARA_CERTIFICADO) return { liberado: true, texto: 'Certificado liberado' };
  const falta = formatarDuracao(MINUTOS_PARA_CERTIFICADO - minutos);
  return { liberado: false, texto: `Faltam ${falta} para o certificado` };
}
