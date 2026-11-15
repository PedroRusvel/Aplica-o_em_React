// Contrato do domínio: todos os outros arquivos dependem destes tipos.

export type TipoAtividade = 'palestra' | 'minicurso' | 'oficina';

export interface Atividade {
  id: string;
  titulo: string;
  tipo: TipoAtividade;
  trilha: string;
  data: string; // 'AAAA-MM-DD'
  inicio: string; // 'HH:MM'
  fim: string; // 'HH:MM'
  sala: string;
  capacidade: number;
  palestranteId: string;
  descricao: string;
}

export interface Palestrante {
  id: string;
  nome: string;
  cargo: string;
  miniBio: string;
}

export interface Programacao {
  trilhas: string[];
  palestrantes: Palestrante[];
  atividades: Atividade[];
}

export interface Participante {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  curso: string;
}

export type DadosParticipante = Omit<Participante, 'id'>;
export type CampoParticipante = keyof DadosParticipante;
export type ErrosParticipante = Partial<Record<CampoParticipante, string>>;

export type SituacaoInscricao = 'confirmada' | 'espera';

export interface Inscricao {
  participanteId: string;
  atividadeId: string;
  situacao: SituacaoInscricao;
  criadaEm: string; // data e hora ISO; define a ordem da lista de espera
}

// União discriminada: o campo "ok" diz qual das duas formas o resultado tem.
export type ResultadoInscricao =
  | { ok: true; inscricoes: Inscricao[]; situacao: SituacaoInscricao }
  | { ok: false; erro: string };

export type StatusRede = 'carregando' | 'erro' | 'pronto';

export interface EstadoSalvo {
  participantes: Participante[];
  inscricoes: Inscricao[];
  participanteAtualId: string | null;
}
