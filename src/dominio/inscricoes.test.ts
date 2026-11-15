import { describe, expect, it } from 'vitest';
import type { Inscricao } from '../tipos';
import { ATIVIDADES_TESTE as ATIV, inscricaoPronta } from './fixtures';
import {
  cancelarInscricao,
  haConflito,
  inscrever,
  posicaoNaEspera,
  vagasRestantes,
} from './inscricoes';

const busca = (id: string) => {
  const a = ATIV.find((x) => x.id === id);
  if (!a) throw new Error(`atividade ${id} não existe`);
  return a;
};

/** Inscreve e falha o teste se a inscrição for recusada. */
function inscreverOk(lista: Inscricao[], pessoa: string, atividade: string, segundo: number): Inscricao[] {
  const r = inscrever(lista, pessoa, atividade, ATIV, `2026-11-09T10:00:${String(segundo).padStart(2, '0')}.000Z`);
  if (!r.ok) throw new Error(r.erro);
  return r.inscricoes;
}

describe('B2 - choque de horário', () => {
  it('atividades que se sobrepõem no mesmo dia conflitam', () => {
    expect(haConflito(busca('abertura'), busca('react'))).toBe(true);
  });

  it('atividade que termina às 20h00 não conflita com a que começa às 20h00', () => {
    expect(haConflito(busca('abertura'), busca('git'))).toBe(false);
  });

  it('dias diferentes nunca conflitam', () => {
    expect(haConflito(busca('react'), busca('python'))).toBe(false);
  });
});

describe('inscrever', () => {
  it('B01: com vaga, a inscrição entra como confirmada', () => {
    const lista = inscreverOk([], 'ana', 'abertura', 1);
    expect(lista[0].situacao).toBe('confirmada');
    expect(vagasRestantes(busca('abertura'), lista)).toBe(2);
  });

  it('B02: recusa por conflito e informa a atividade e o horário', () => {
    const lista = inscreverOk([], 'ana', 'abertura', 1);
    const r = inscrever(lista, 'ana', 'react', ATIV, '2026-11-09T10:00:02.000Z');
    expect(r).toEqual({
      ok: false,
      erro: 'Conflito de horário com "Abertura: IA no agronegócio" (19h00 às 20h00)',
    });
  });

  it('B03: começar exatamente quando outra termina é permitido', () => {
    const lista = inscreverOk(inscreverOk([], 'ana', 'abertura', 1), 'ana', 'git', 2);
    expect(lista).toHaveLength(2);
  });

  it('B05: sem vaga, entra na lista de espera na ordem de chegada', () => {
    let lista = inscreverOk([], 'ana', 'abertura', 1);
    lista = inscreverOk(lista, 'bruno', 'abertura', 2);
    lista = inscreverOk(lista, 'carla', 'abertura', 3);
    expect(vagasRestantes(busca('abertura'), lista)).toBe(0);
    lista = inscreverOk(lista, 'davi', 'abertura', 4);
    lista = inscreverOk(lista, 'elisa', 'abertura', 5);
    expect(posicaoNaEspera(lista, 'davi', 'abertura')).toBe(1);
    expect(posicaoNaEspera(lista, 'elisa', 'abertura')).toBe(2);
  });

  it('B10: o terceiro minicurso é recusado pelo limite, mesmo sem conflito de horário', () => {
    let lista = inscreverOk([], 'ana', 'python', 1);
    lista = inscreverOk(lista, 'ana', 'docker', 2);
    const r = inscrever(lista, 'ana', 'seguranca', ATIV, '2026-11-09T10:00:03.000Z');
    expect(r).toEqual({ ok: false, erro: 'Limite de 2 minicursos por participante' });
  });

  it('B11: a lista de espera também conta para o conflito', () => {
    const lista = [
      inscricaoPronta('bruno', 'abertura', 'confirmada', 1),
      inscricaoPronta('elisa', 'abertura', 'espera', 2),
    ];
    const r = inscrever(lista, 'elisa', 'react', ATIV, '2026-11-09T10:00:03.000Z');
    expect(r.ok).toBe(false);
  });

  it('recusa inscrição repetida na mesma atividade', () => {
    const lista = inscreverOk([], 'ana', 'abertura', 1);
    expect(inscrever(lista, 'ana', 'abertura', ATIV, '2026-11-09T10:00:02.000Z').ok).toBe(false);
  });
});

describe('B4 - cancelar e promover a lista de espera', () => {
  const cheia = [
    inscricaoPronta('ana', 'abertura', 'confirmada', 1),
    inscricaoPronta('bruno', 'abertura', 'confirmada', 2),
    inscricaoPronta('carla', 'abertura', 'confirmada', 3),
    inscricaoPronta('davi', 'abertura', 'espera', 4),
    inscricaoPronta('elisa', 'abertura', 'espera', 5),
  ];

  it('B06: ao cancelar uma confirmada, o primeiro da fila é promovido e os outros sobem', () => {
    const nova = cancelarInscricao(cheia, 'bruno', 'abertura', ATIV);
    expect(nova.find((i) => i.participanteId === 'bruno')).toBeUndefined();
    expect(nova.find((i) => i.participanteId === 'davi')?.situacao).toBe('confirmada');
    expect(posicaoNaEspera(nova, 'elisa', 'abertura')).toBe(1);
  });

  it('sair da lista de espera não promove ninguém', () => {
    const nova = cancelarInscricao(cheia, 'davi', 'abertura', ATIV);
    expect(posicaoNaEspera(nova, 'elisa', 'abertura')).toBe(1);
    expect(vagasRestantes(busca('abertura'), nova)).toBe(0);
  });

  it('não altera a lista original', () => {
    cancelarInscricao(cheia, 'bruno', 'abertura', ATIV);
    expect(cheia).toHaveLength(5);
  });
});
