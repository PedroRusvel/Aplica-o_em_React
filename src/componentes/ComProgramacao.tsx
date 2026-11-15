import type { ReactNode } from 'react';
import { useProgramacao } from '../contexto/ProgramacaoContext';
import type { Programacao } from '../tipos';
import { EstadoDaTela } from './EstadoDaTela';

interface ComProgramacaoProps {
  children: (programacao: Programacao) => ReactNode;
}

/**
 * Envolve cada página que precisa da programação. Cuida dos três estados (carregando, erro, vazio)
 * e só chama "children" quando os dados já chegaram. Assim nenhuma página precisa repetir esse código.
 */
export function ComProgramacao({ children }: ComProgramacaoProps) {
  const { status, programacao, mensagemErro, recarregar } = useProgramacao();
  return (
    <EstadoDaTela
      status={status}
      mensagemErro={mensagemErro}
      onTentarDeNovo={recarregar}
      vazio={programacao !== null && programacao.atividades.length === 0}
      mensagemVazia="A programação ainda não foi publicada. Volte em breve."
    >
      {programacao && children(programacao)}
    </EstadoDaTela>
  );
}
