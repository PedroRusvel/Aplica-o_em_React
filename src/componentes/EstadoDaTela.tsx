import type { ReactNode } from 'react';
import type { StatusRede } from '../tipos';

interface EstadoDaTelaProps {
  status: StatusRede;
  mensagemErro: string;
  onTentarDeNovo: () => void;
  vazio: boolean;
  mensagemVazia: string;
  children: ReactNode;
}

/** RC07: decide o que mostrar enquanto os dados de rede estão carregando, falharam ou vieram vazios. */
export function EstadoDaTela({ status, mensagemErro, onTentarDeNovo, vazio, mensagemVazia, children }: EstadoDaTelaProps) {
  if (status === 'carregando') {
    return (
      <p className="estado" role="status">
        <span className="girando" aria-hidden="true" /> Carregando a programação…
      </p>
    );
  }
  if (status === 'erro') {
    return (
      <div className="estado estado-erro" role="alert">
        <p>{mensagemErro}</p>
        <button type="button" className="botao" onClick={onTentarDeNovo}>
          Tentar de novo
        </button>
      </div>
    );
  }
  if (vazio) return <p className="estado">{mensagemVazia}</p>;
  return <>{children}</>;
}
