import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { buscarProgramacao } from '../servicos/programacaoService';
import type { Programacao, StatusRede } from '../tipos';

interface ProgramacaoContextoValor {
  status: StatusRede;
  programacao: Programacao | null;
  mensagemErro: string;
  recarregar: () => void;
}

const ProgramacaoContext = createContext<ProgramacaoContextoValor | null>(null);

export function ProgramacaoProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusRede>('carregando');
  const [programacao, setProgramacao] = useState<Programacao | null>(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  // RC06: este efeito roda de novo sempre que "tentativa" muda (botão "Tentar de novo").
  useEffect(() => {
    const controlador = new AbortController();

    buscarProgramacao(controlador.signal)
      .then((dados) => {
        setProgramacao(dados);
        setStatus('pronto');
      })
      .catch((erro: unknown) => {
        if (controlador.signal.aborted) return; // a tela foi desmontada: ignora
        setMensagemErro(erro instanceof Error ? erro.message : 'Falha ao carregar a programação.');
        setStatus('erro');
      });

    return () => controlador.abort();
  }, [tentativa]);

  function recarregar() {
    setStatus('carregando');
    setTentativa((t) => t + 1);
  }

  return (
    <ProgramacaoContext.Provider value={{ status, programacao, mensagemErro, recarregar }}>
      {children}
    </ProgramacaoContext.Provider>
  );
}

export function useProgramacao(): ProgramacaoContextoValor {
  const valor = useContext(ProgramacaoContext);
  if (!valor) throw new Error('useProgramacao precisa estar dentro de <ProgramacaoProvider>');
  return valor;
}
