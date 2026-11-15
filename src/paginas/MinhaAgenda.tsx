import { Link } from 'react-router-dom';
import { BarraProgresso } from '../componentes/BarraProgresso';
import { CartaoAtividade } from '../componentes/CartaoAtividade';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { useEvento } from '../contexto/EventoContext';
import { nomeDoPalestrante } from '../dominio/busca';
import { cargaHorariaEmMinutos, MINUTOS_PARA_CERTIFICADO, statusDoCertificado } from '../dominio/certificado';
import { inscricoesDoParticipante, posicaoNaEspera, vagasRestantes } from '../dominio/inscricoes';
import { formatarData, formatarDuracao } from '../dominio/tempo';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

export function MinhaAgenda() {
  useTituloDaPagina('Minha agenda');
  const { participanteAtual, inscricoes } = useEvento();

  if (!participanteAtual) {
    return (
      <>
        <h1>Minha agenda</h1>
        <p className="estado">
          Nenhum participante selecionado. Escolha um no topo da página ou <Link to="/cadastro">faça seu cadastro</Link>.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Agenda de {participanteAtual.nome}</h1>
      <ComProgramacao>
        {(p) => {
          const minhas = inscricoesDoParticipante(inscricoes, participanteAtual.id);
          const atividades = minhas
            .map((i) => p.atividades.find((a) => a.id === i.atividadeId))
            .filter((a): a is NonNullable<typeof a> => a !== undefined)
            .sort((a, b) => a.data.localeCompare(b.data) || a.inicio.localeCompare(b.inicio));

          const minutos = cargaHorariaEmMinutos(inscricoes, participanteAtual.id, p.atividades);
          const certificado = statusDoCertificado(minutos);
          const dias = [...new Set(atividades.map((a) => a.data))];

          return (
            <>
              <section className="caixa" aria-labelledby="titulo-carga">
                <h2 id="titulo-carga">Carga horária confirmada: {formatarDuracao(minutos)}</h2>
                <BarraProgresso
                  percentual={Math.round((minutos * 100) / MINUTOS_PARA_CERTIFICADO)}
                  rotulo="Progresso para o certificado"
                />
                <p className={certificado.liberado ? 'aviso aviso-ok' : 'aviso'}>{certificado.texto}</p>
              </section>

              {atividades.length === 0 ? (
                <p className="estado">
                  Você ainda não tem inscrições. <Link to="/programacao">Veja a programação</Link> e escolha suas atividades.
                </p>
              ) : (
                dias.map((dia) => (
                  <section key={dia} aria-label={`Atividades de ${formatarData(dia)}`}>
                    <h2>{formatarData(dia)}</h2>
                    <div className="grade">
                      {atividades
                        .filter((a) => a.data === dia)
                        .map((a) => (
                          <CartaoAtividade
                            key={a.id}
                            atividade={a}
                            nomePalestrante={nomeDoPalestrante(p.palestrantes, a.palestranteId)}
                            vagas={vagasRestantes(a, inscricoes)}
                            situacao={minhas.find((i) => i.atividadeId === a.id)?.situacao ?? null}
                            posicaoEspera={posicaoNaEspera(inscricoes, participanteAtual.id, a.id)}
                          />
                        ))}
                    </div>
                  </section>
                ))
              )}
            </>
          );
        }}
      </ComProgramacao>
    </>
  );
}
