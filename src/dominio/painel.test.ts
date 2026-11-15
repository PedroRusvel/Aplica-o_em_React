import { describe, expect, it } from 'vitest';
import { cargaHorariaEmMinutos, statusDoCertificado } from './certificado';
import { ATIVIDADES_TESTE as ATIV, inscricaoPronta } from './fixtures';
import { atividadeMaisProcurada, calcularOcupacao } from './painel';

describe('B6 - certificado', () => {
  it('B07: 3h00 de carga horária faltam 1h00', () => {
    const inscricoes = [
      inscricaoPronta('ana', 'abertura', 'confirmada', 1),
      inscricaoPronta('ana', 'git', 'confirmada', 2),
    ];
    const minutos = cargaHorariaEmMinutos(inscricoes, 'ana', ATIV);
    expect(minutos).toBe(180);
    expect(statusDoCertificado(minutos).texto).toBe('Faltam 1h00 para o certificado');
  });

  it('B08: 1h00 de carga horária faltam 3h00', () => {
    const minutos = cargaHorariaEmMinutos([inscricaoPronta('carla', 'abertura', 'confirmada', 1)], 'carla', ATIV);
    expect(statusDoCertificado(minutos).texto).toBe('Faltam 3h00 para o certificado');
  });

  it('B09: 8h00 de carga horária libera o certificado', () => {
    const inscricoes = [
      inscricaoPronta('ana', 'abertura', 'confirmada', 1),
      inscricaoPronta('ana', 'git', 'confirmada', 2),
      inscricaoPronta('ana', 'python', 'confirmada', 3),
      inscricaoPronta('ana', 'docker', 'confirmada', 4),
    ];
    const minutos = cargaHorariaEmMinutos(inscricoes, 'ana', ATIV);
    expect(minutos).toBe(480);
    expect(statusDoCertificado(minutos)).toEqual({ liberado: true, texto: 'Certificado liberado' });
  });

  it('lista de espera não conta para a carga horária', () => {
    const minutos = cargaHorariaEmMinutos([inscricaoPronta('elisa', 'abertura', 'espera', 1)], 'elisa', ATIV);
    expect(minutos).toBe(0);
  });
});

describe('B7 - painel do organizador', () => {
  const inscricoes = [
    inscricaoPronta('ana', 'abertura', 'confirmada', 1),
    inscricaoPronta('carla', 'abertura', 'confirmada', 2),
    inscricaoPronta('davi', 'abertura', 'confirmada', 3),
    inscricaoPronta('elisa', 'abertura', 'espera', 4),
    inscricaoPronta('ana', 'git', 'confirmada', 5),
  ];

  it('B12: abertura com 100%, lotada e 1 na espera', () => {
    const abertura = ATIV[0];
    expect(calcularOcupacao(abertura, inscricoes)).toEqual({
      confirmados: 3,
      espera: 1,
      capacidade: 3,
      percentual: 100,
      lotada: true,
    });
  });

  it('arredonda o percentual para o inteiro', () => {
    const git = ATIV[2]; // 1 de 20 = 5%
    expect(calcularOcupacao(git, inscricoes).percentual).toBe(5);
  });

  it('B12: a mais procurada conta confirmados mais espera', () => {
    const r = atividadeMaisProcurada(ATIV, inscricoes);
    expect(r?.atividade.id).toBe('abertura');
    expect(r?.total).toBe(4);
  });

  it('sem inscrições não existe atividade mais procurada', () => {
    expect(atividadeMaisProcurada(ATIV, [])).toBeNull();
  });
});
