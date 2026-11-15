import type { EstadoSalvo, Inscricao, Participante } from '../tipos';

const CHAVE = 'semana-tecnologia-2026:estado';

export const ESTADO_VAZIO: EstadoSalvo = { participantes: [], inscricoes: [], participanteAtualId: null };

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function ehParticipante(valor: unknown): valor is Participante {
  return (
    ehObjeto(valor) &&
    typeof valor.id === 'string' &&
    typeof valor.nome === 'string' &&
    typeof valor.email === 'string' &&
    typeof valor.matricula === 'string' &&
    typeof valor.curso === 'string'
  );
}

function ehInscricao(valor: unknown): valor is Inscricao {
  return (
    ehObjeto(valor) &&
    typeof valor.participanteId === 'string' &&
    typeof valor.atividadeId === 'string' &&
    (valor.situacao === 'confirmada' || valor.situacao === 'espera') &&
    typeof valor.criadaEm === 'string'
  );
}

function comoLista(valor: unknown): unknown[] {
  return Array.isArray(valor) ? valor : [];
}

/**
 * Leitura defensiva (RC09): se a chave não existe, o JSON está quebrado ou tem o formato errado,
 * devolve o estado vazio em vez de lançar erro. Itens inválidos são descartados.
 */
export function carregarEstado(): EstadoSalvo {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto === null) return ESTADO_VAZIO;

    const dados: unknown = JSON.parse(bruto);
    if (!ehObjeto(dados)) return ESTADO_VAZIO;

    const participantes = comoLista(dados.participantes).filter(ehParticipante);
    const inscricoes = comoLista(dados.inscricoes).filter(ehInscricao);
    const atualExiste = participantes.some((p) => p.id === dados.participanteAtualId);
    const participanteAtualId = atualExiste && typeof dados.participanteAtualId === 'string' ? dados.participanteAtualId : null;

    return { participantes, inscricoes, participanteAtualId };
  } catch {
    return ESTADO_VAZIO;
  }
}

export function salvarEstado(estado: EstadoSalvo): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // Armazenamento cheio ou bloqueado: a aplicação continua funcionando sem salvar.
  }
}
