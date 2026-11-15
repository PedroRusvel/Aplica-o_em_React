import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvento } from '../contexto/EventoContext';
import { posicaoNaEspera, vagasRestantes } from '../dominio/inscricoes';
import type { Atividade } from '../tipos';

interface BotaoInscricaoProps {
  atividade: Atividade;
}

interface Aviso {
  tipo: 'ok' | 'erro';
  texto: string;
}

/** O botão muda conforme a situação: Inscrever-se, Entrar na lista de espera, Cancelar inscrição ou Sair da lista. */
export function BotaoInscricao({ atividade }: BotaoInscricaoProps) {
  const { participanteAtual, inscricoes, inscrever, cancelar, situacaoDoParticipante } = useEvento();
  const [aviso, setAviso] = useState<Aviso | null>(null);

  if (!participanteAtual) {
    return (
      <div>
        <Link className="botao" to="/cadastro">
          Cadastre-se para se inscrever
        </Link>
        <p className="ajuda">Já tem cadastro? Escolha o participante no topo da página.</p>
      </div>
    );
  }

  const situacao = situacaoDoParticipante(atividade.id);
  const lotada = vagasRestantes(atividade, inscricoes) === 0;

  function aoInscrever() {
    const resultado = inscrever(atividade.id);
    if (!resultado.ok) {
      setAviso({ tipo: 'erro', texto: resultado.erro });
    } else if (resultado.situacao === 'confirmada') {
      setAviso({ tipo: 'ok', texto: 'Inscrição confirmada!' });
    } else {
      const posicao = posicaoNaEspera(resultado.inscricoes, participanteAtual!.id, atividade.id);
      setAviso({ tipo: 'ok', texto: `Atividade lotada. Você entrou na lista de espera na posição ${posicao}.` });
    }
  }

  function aoCancelar() {
    cancelar(atividade.id);
    setAviso({ tipo: 'ok', texto: situacao === 'espera' ? 'Você saiu da lista de espera.' : 'Inscrição cancelada.' });
  }

  const rotulo =
    situacao === 'confirmada'
      ? 'Cancelar inscrição'
      : situacao === 'espera'
        ? 'Sair da lista de espera'
        : lotada
          ? 'Entrar na lista de espera'
          : 'Inscrever-se';

  return (
    <div>
      <button
        type="button"
        className={situacao ? 'botao botao-secundario' : 'botao'}
        onClick={situacao ? aoCancelar : aoInscrever}
      >
        {rotulo}
      </button>
      {aviso && (
        <p className={aviso.tipo === 'ok' ? 'aviso aviso-ok' : 'aviso aviso-erro'} role={aviso.tipo === 'ok' ? 'status' : 'alert'}>
          {aviso.texto}
        </p>
      )}
    </div>
  );
}
