// Dados fixos usados só nos testes: as seis atividades do cenário de aceitação do enunciado.
import type { Atividade, Inscricao, Participante } from '../tipos';

function atividade(
  id: string,
  titulo: string,
  tipo: Atividade['tipo'],
  data: string,
  inicio: string,
  fim: string,
  capacidade: number,
): Atividade {
  return { id, titulo, tipo, trilha: 'Teste', data, inicio, fim, sala: 'Sala', capacidade, palestranteId: 'x', descricao: '' };
}

export const ATIVIDADES_TESTE: Atividade[] = [
  atividade('abertura', 'Abertura: IA no agronegócio', 'palestra', '2026-12-01', '19:00', '20:00', 3),
  atividade('react', 'Minicurso de React', 'minicurso', '2026-12-01', '19:30', '21:30', 20),
  atividade('git', 'Oficina de Git e GitHub', 'oficina', '2026-12-01', '20:00', '22:00', 20),
  atividade('python', 'Minicurso de Python para dados', 'minicurso', '2026-12-02', '19:00', '22:00', 20),
  atividade('docker', 'Minicurso de Docker', 'minicurso', '2026-12-03', '19:00', '21:00', 20),
  atividade('seguranca', 'Minicurso de segurança web', 'minicurso', '2026-12-03', '21:00', '22:00', 20),
];

function participante(id: string, nome: string): Participante {
  return { id, nome, email: `${id}@exemplo.com`, matricula: `20260000${id.length}${id.charCodeAt(0)}`, curso: 'ADS' };
}

export const PARTICIPANTES_TESTE: Participante[] = [
  participante('ana', 'Ana'),
  participante('bruno', 'Bruno'),
  participante('carla', 'Carla'),
  participante('davi', 'Davi'),
  participante('elisa', 'Elisa'),
];

/** Cria uma inscrição pronta, com a hora indicada (ordem da fila). */
export function inscricaoPronta(
  participanteId: string,
  atividadeId: string,
  situacao: Inscricao['situacao'],
  segundo: number,
): Inscricao {
  return {
    participanteId,
    atividadeId,
    situacao,
    criadaEm: `2026-11-09T10:00:${String(segundo).padStart(2, '0')}.000Z`,
  };
}
