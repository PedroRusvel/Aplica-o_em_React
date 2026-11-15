import { Link } from 'react-router-dom';
import { BarraProgresso } from '../componentes/BarraProgresso';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { Selo } from '../componentes/Selo';
import { useEvento } from '../contexto/EventoContext';
import { atividadeMaisProcurada, calcularOcupacao, totaisDoEvento } from '../dominio/painel';
import { formatarDataCurta, formatarIntervalo } from '../dominio/tempo';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

export function Organizador() {
  useTituloDaPagina('Painel do organizador');
  const { participantes, inscricoes } = useEvento();

  return (
    <>
      <h1>Painel do organizador</h1>
      <ComProgramacao>
        {(p) => {
          const totais = totaisDoEvento(participantes, inscricoes);
          const procurada = atividadeMaisProcurada(p.atividades, inscricoes);
          const ordenadas = [...p.atividades].sort(
            (a, b) => a.data.localeCompare(b.data) || a.inicio.localeCompare(b.inicio),
          );

          return (
            <>
              <div className="totais">
                <div className="total">
                  <strong>{totais.participantes}</strong>
                  <span>participantes cadastrados</span>
                </div>
                <div className="total">
                  <strong>{totais.confirmadas}</strong>
                  <span>inscrições confirmadas</span>
                </div>
                <div className="total">
                  <strong>{procurada ? procurada.total : 0}</strong>
                  <span>
                    {procurada ? (
                      <>
                        na mais procurada: <Link to={`/atividades/${procurada.atividade.id}`}>{procurada.atividade.titulo}</Link>
                      </>
                    ) : (
                      'Ainda não há inscrições'
                    )}
                  </span>
                </div>
              </div>

              <h2>Ocupação por atividade</h2>
              <ul className="ocupacoes">
                {ordenadas.map((a) => {
                  const o = calcularOcupacao(a, inscricoes);
                  return (
                    <li key={a.id} className="ocupacao">
                      <div className="ocupacao-topo">
                        <Link to={`/atividades/${a.id}`}>{a.titulo}</Link>
                        {o.lotada && <Selo variante="perigo">Lotada</Selo>}
                      </div>
                      <p className="cartao-info">
                        {formatarDataCurta(a.data)}, {formatarIntervalo(a)}
                      </p>
                      <BarraProgresso percentual={o.percentual} rotulo={`Ocupação de ${a.titulo}`} />
                      <p className="cartao-info">
                        {o.percentual}% · {o.confirmados} de {o.capacidade} vagas · lista de espera: {o.espera}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          );
        }}
      </ComProgramacao>
    </>
  );
}
