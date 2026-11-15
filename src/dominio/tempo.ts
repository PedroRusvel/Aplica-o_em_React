import type { Atividade } from '../tipos';

type Intervalo = Pick<Atividade, 'inicio' | 'fim'>;

/** '19:30' vira 1170 (minutos desde a meia-noite). Comparar horários como texto é frágil; como número, não. */
export function paraMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export function duracaoEmMinutos(intervalo: Intervalo): number {
  return paraMinutos(intervalo.fim) - paraMinutos(intervalo.inicio);
}

/** 180 vira '3h00'. */
export function formatarDuracao(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h${String(m).padStart(2, '0')}`;
}

/** '19:30' vira '19h30'. */
export function formatarHora(hora: string): string {
  return hora.replace(':', 'h');
}

/** Devolve '19h00 às 20h00'. */
export function formatarIntervalo(intervalo: Intervalo): string {
  return `${formatarHora(intervalo.inicio)} às ${formatarHora(intervalo.fim)}`;
}

/** '2026-12-01' vira '01/12/2026'. Sem usar Date, para não ter surpresa de fuso horário. */
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** '2026-12-01' vira '01/12'. */
export function formatarDataCurta(data: string): string {
  return formatarData(data).slice(0, 5);
}
