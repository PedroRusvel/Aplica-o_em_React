import { describe, expect, it } from 'vitest';
import { filtrarAtividades, normalizar } from './busca';
import { ATIVIDADES_TESTE } from './fixtures';

const palestrantes = [{ id: 'x', nome: 'Helena Duarte', cargo: '', miniBio: '' }];
const base = { data: '2026-12-01', trilha: '', tipo: '' as const, busca: '' };

describe('busca', () => {
  it('normaliza acentos e maiúsculas', () => {
    expect(normalizar('  Ética ')).toBe('etica');
  });

  it('filtra por dia e ordena por horário', () => {
    const ids = filtrarAtividades(ATIVIDADES_TESTE, palestrantes, base).map((a) => a.id);
    expect(ids).toEqual(['abertura', 'react', 'git']);
  });

  it('filtra por tipo e pelo nome do palestrante, sem acento', () => {
    expect(filtrarAtividades(ATIVIDADES_TESTE, palestrantes, { ...base, tipo: 'oficina' }).map((a) => a.id)).toEqual(['git']);
    expect(filtrarAtividades(ATIVIDADES_TESTE, palestrantes, { ...base, busca: 'HELENA' })).toHaveLength(3);
    expect(filtrarAtividades(ATIVIDADES_TESTE, palestrantes, { ...base, busca: 'agronegocio' }).map((a) => a.id)).toEqual(['abertura']);
  });
});
