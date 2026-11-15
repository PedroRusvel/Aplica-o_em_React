import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { validarParticipante } from '../dominio/cadastro';
import { buscarInscricao, cancelarInscricao, inscrever as inscreverNoDominio } from '../dominio/inscricoes';
import { carregarEstado, salvarEstado } from '../servicos/armazenamento';
import type {
  DadosParticipante,
  ErrosParticipante,
  EstadoSalvo,
  Inscricao,
  Participante,
  ResultadoInscricao,
  SituacaoInscricao,
} from '../tipos';
import { useProgramacao } from './ProgramacaoContext';

type ResultadoCadastro = { ok: true; participante: Participante } | { ok: false; erros: ErrosParticipante };

interface EventoContextoValor {
  participantes: Participante[];
  inscricoes: Inscricao[];
  participanteAtual: Participante | null;
  cadastrarParticipante: (dados: DadosParticipante) => ResultadoCadastro;
  selecionarParticipante: (id: string | null) => void;
  inscrever: (atividadeId: string) => ResultadoInscricao;
  cancelar: (atividadeId: string) => void;
  situacaoDoParticipante: (atividadeId: string) => SituacaoInscricao | null;
}

const EventoContext = createContext<EventoContextoValor | null>(null);

export function EventoProvider({ children }: { children: ReactNode }) {
  const { programacao } = useProgramacao();
  const atividades = programacao?.atividades ?? [];

  // Lazy init: a função só roda na primeira renderização e lê o localStorage de forma defensiva.
  const [estado, setEstado] = useState<EstadoSalvo>(carregarEstado);

  // RC09: toda vez que o estado muda, grava no localStorage.
  useEffect(() => {
    salvarEstado(estado);
  }, [estado]);

  const participanteAtual = estado.participantes.find((p) => p.id === estado.participanteAtualId) ?? null;

  function cadastrarParticipante(dados: DadosParticipante): ResultadoCadastro {
    const erros = validarParticipante(dados, estado.participantes);
    if (Object.keys(erros).length > 0) return { ok: false, erros };

    const participante: Participante = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      matricula: dados.matricula.trim(),
      curso: dados.curso.trim(),
    };
    // Forma funcional (e => ...) para funcionar mesmo se for chamada várias vezes seguidas.
    setEstado((e) => ({
      ...e,
      participantes: [...e.participantes, participante],
      participanteAtualId: participante.id,
    }));
    return { ok: true, participante };
  }

  function selecionarParticipante(id: string | null) {
    setEstado((e) => ({ ...e, participanteAtualId: id }));
  }

  function inscrever(atividadeId: string): ResultadoInscricao {
    if (!participanteAtual) {
      return { ok: false, erro: 'Selecione um participante antes de se inscrever.' };
    }
    const resultado = inscreverNoDominio(
      estado.inscricoes,
      participanteAtual.id,
      atividadeId,
      atividades,
      new Date().toISOString(), // a data de agora entra aqui, no contexto, e não dentro das regras
    );
    if (resultado.ok) setEstado((e) => ({ ...e, inscricoes: resultado.inscricoes }));
    return resultado;
  }

  function cancelar(atividadeId: string) {
    if (!participanteAtual) return;
    const novas = cancelarInscricao(estado.inscricoes, participanteAtual.id, atividadeId, atividades);
    setEstado((e) => ({ ...e, inscricoes: novas }));
  }

  function situacaoDoParticipante(atividadeId: string): SituacaoInscricao | null {
    if (!participanteAtual) return null;
    return buscarInscricao(estado.inscricoes, participanteAtual.id, atividadeId)?.situacao ?? null;
  }

  return (
    <EventoContext.Provider
      value={{
        participantes: estado.participantes,
        inscricoes: estado.inscricoes,
        participanteAtual,
        cadastrarParticipante,
        selecionarParticipante,
        inscrever,
        cancelar,
        situacaoDoParticipante,
      }}
    >
      {children}
    </EventoContext.Provider>
  );
}

export function useEvento(): EventoContextoValor {
  const valor = useContext(EventoContext);
  if (!valor) throw new Error('useEvento precisa estar dentro de <EventoProvider>');
  return valor;
}
