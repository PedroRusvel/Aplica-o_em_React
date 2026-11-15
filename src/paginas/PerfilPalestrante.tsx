import { Link, useParams } from 'react-router-dom';
import { Avatar } from '../componentes/Avatar';
import { CartaoAtividade } from '../componentes/CartaoAtividade';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { useEvento } from '../contexto/EventoContext';
import { useProgramacao } from '../contexto/ProgramacaoContext';
import { vagasRestantes } from '../dominio/inscricoes';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

export function PerfilPalestrante() {
  const { id } = useParams<{ id: string }>();
  const { programacao } = useProgramacao();
  const { inscricoes, situacaoDoParticipante } = useEvento();
  const pessoa = programacao?.palestrantes.find((p) => p.id === id);
  useTituloDaPagina(pessoa?.nome ?? 'Palestrante');

  return (
    <ComProgramacao>
      {(p) => {
        if (!pessoa) {
          return (
            <>
              <h1>Palestrante não encontrado</h1>
              <Link className="botao" to="/palestrantes">
                Ver todos os palestrantes
              </Link>
            </>
          );
        }
        const atividades = p.atividades.filter((a) => a.palestranteId === pessoa.id);
        return (
          <>
            <div className="perfil">
              <Avatar nome={pessoa.nome} />
              <div>
                <h1>{pessoa.nome}</h1>
                <p className="cartao-info">{pessoa.cargo}</p>
              </div>
            </div>
            <p>{pessoa.miniBio}</p>
            <h2>Atividades de {pessoa.nome.split(' ')[0]}</h2>
            <div className="grade">
              {atividades.map((a) => (
                <CartaoAtividade
                  key={a.id}
                  atividade={a}
                  nomePalestrante={pessoa.nome}
                  vagas={vagasRestantes(a, inscricoes)}
                  situacao={situacaoDoParticipante(a.id)}
                />
              ))}
            </div>
          </>
        );
      }}
    </ComProgramacao>
  );
}
