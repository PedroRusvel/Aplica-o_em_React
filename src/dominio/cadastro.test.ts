import { describe, expect, it } from 'vitest';
import { validarParticipante } from './cadastro';
import type { Participante } from '../tipos';

const ana: Participante = {
  id: 'ana',
  nome: 'Ana Souza',
  email: 'ana@exemplo.com',
  matricula: '2026001',
  curso: 'ADS',
};

const novo = { nome: 'Bruno Lima', email: 'bruno@exemplo.com', matricula: '2026002', curso: 'ADS' };

describe('B1 - cadastro', () => {
  it('aceita dados válidos', () => {
    expect(validarParticipante(novo, [ana])).toEqual({});
  });

  it('B13: recusa e-mail já cadastrado, sem diferenciar maiúsculas', () => {
    const erros = validarParticipante({ ...novo, email: 'ANA@exemplo.com' }, [ana]);
    expect(erros.email).toBe('E-mail já cadastrado');
  });

  it('recusa matrícula repetida', () => {
    expect(validarParticipante({ ...novo, matricula: '2026001' }, [ana]).matricula).toBe('Matrícula já cadastrada');
  });

  it('recusa nome curto, e-mail inválido e matrícula fora de 6 a 10 dígitos', () => {
    const erros = validarParticipante({ nome: 'Al', email: 'sem-arroba', matricula: '12ab', curso: '' }, []);
    expect(Object.keys(erros).sort()).toEqual(['curso', 'email', 'matricula', 'nome']);
  });
});
