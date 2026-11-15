import { describe, expect, it } from 'vitest';
import { duracaoEmMinutos, formatarData, formatarDuracao, formatarIntervalo, paraMinutos } from './tempo';

describe('tempo', () => {
  it('converte horário em minutos desde a meia-noite', () => {
    expect(paraMinutos('19:30')).toBe(1170);
    expect(paraMinutos('00:00')).toBe(0);
  });

  it('calcula a duração de uma atividade', () => {
    expect(duracaoEmMinutos({ inicio: '19:00', fim: '22:00' })).toBe(180);
  });

  it('formata duração como 3h00 e 1h30', () => {
    expect(formatarDuracao(180)).toBe('3h00');
    expect(formatarDuracao(90)).toBe('1h30');
  });

  it('formata intervalo e data', () => {
    expect(formatarIntervalo({ inicio: '19:00', fim: '20:00' })).toBe('19h00 às 20h00');
    expect(formatarData('2026-12-01')).toBe('01/12/2026');
  });
});
