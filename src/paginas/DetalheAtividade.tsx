import { Link, useParams } from 'react-router-dom';
import { BarraProgresso } from '../componentes/BarraProgresso';
import { BotaoInscricao } from '../componentes/BotaoInscricao';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { Selo } from '../componentes/Selo';
import { useProgramacao } from '../contexto/ProgramacaoContext';
import { useEvento } from '../contexto/EventoContext';
import { nomeDoPalestrante } from '../dominio/busca';
import { calcularOcupacao } from '../dominio/painel';
import { formatarData, formatarDuracao, duracaoEmMinutos, formatarIntervalo } from '../dominio/tempo';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

const NOME_DO_TIPO = { palestra: 'Palestra', minicurso: 'Minicurso', oficina: 'Oficina' } as const;

export function DetalheAtividade() {
  const { id } = useParams<{ id: string }>(); // parâmetro de rota (RC03)
  const { programacao } = useProgramacao();
  const { inscricoes } = useEvento();
  const atividade = programacao?.atividades.find((a) => a.id === id);
  useTituloDaPagina(atividade?.titulo ?? 'Atividade');

  return (
    <ComProgramacao>
      {(p) => {
        if (!atividade) {
          return (
            <>
              <h1>Atividade não encontrada</h1>
              <p>Não existe uma atividade com o código “{id}”.</p>
              <Link className="botao" to="/programacao">
                Voltar para a programação
              </Link>
            </>
          );
        }
        const ocupacao = calcularOcupacao(atividade, inscricoes);
        const vagas = atividade.capacidade - ocupacao.confirmados;

        return (
          <article>
            <p>
              <Link to="/programacao">Programação</Link> / {atividade.titulo}
            </p>
            <h1>{atividade.titulo}</h1>
            <div className="cartao-selos">
              <Selo>{NOME_DO_TIPO[atividade.tipo]}</Selo>
              <Selo>{atividade.trilha}</Selo>
            </div>
            <p>{atividade.descricao}</p>

            <dl className="detalhes">
              <div>
                <dt>Data</dt>
                <dd>{formatarData(atividade.data)}</dd>
              </div>
              <div>
                <dt>Horário</dt>
                <dd>
                  {formatarIntervalo(atividade)} ({formatarDuracao(duracaoEmMinutos(atividade))})
                </dd>
              </div>
              <div>
                <dt>Sala</dt>
                <dd>{atividade.sala}</dd>
              </div>
              <div>
                <dt>Palestrante</dt>
                <dd>
                  <Link to={`/palestrantes/${atividade.palestranteId}`}>
                    {nomeDoPalestrante(p.palestrantes, atividade.palestranteId)}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Vagas</dt>
                <dd>
                  {ocupacao.lotada ? 'Lotada' : `${vagas} de ${atividade.capacidade} restantes`}
                  {ocupacao.espera > 0 && ` · ${ocupacao.espera} na lista de espera`}
                </dd>
              </div>
            </dl>

            <BarraProgresso percentual={ocupacao.percentual} rotulo={`Ocupação de ${atividade.titulo}`} />
            <div className="espaco">
              <BotaoInscricao atividade={atividade} />
            </div>
          </article>
        );
      }}
    </ComProgramacao>
  );
}
