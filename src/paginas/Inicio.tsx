import { Link } from 'react-router-dom';
import { CartaoAtividade } from '../componentes/CartaoAtividade';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { Selo } from '../componentes/Selo';
import { useEvento } from '../contexto/EventoContext';
import { nomeDoPalestrante } from '../dominio/busca';
import { vagasRestantes } from '../dominio/inscricoes';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

const LIMITE_POUCAS_VAGAS = 5;

export function Inicio() {
  useTituloDaPagina('Início');
  const { inscricoes, situacaoDoParticipante } = useEvento();

  return (
    <>
      <section className="hero">
        <p className="hero-datas">1, 2 e 3 de dezembro de 2026 · 19h00 às 22h30</p>
        <h1>Semana de Tecnologia 2026</h1>
        <p className="hero-texto">
          Três noites de palestras, minicursos e oficinas no Unibalsas. Monte sua agenda, garanta sua vaga e
          acumule 4 horas para o certificado.
        </p>
        <div className="hero-acoes">
          <Link className="botao botao-claro" to="/programacao">
            Ver a programação
          </Link>
          <Link className="botao botao-contorno" to="/cadastro">
            Fazer cadastro
          </Link>
        </div>
      </section>

      <ComProgramacao>
        {(p) => {
          const poucas = p.atividades
            .map((a) => ({ atividade: a, vagas: vagasRestantes(a, inscricoes) }))
            .filter((x) => x.vagas <= LIMITE_POUCAS_VAGAS)
            .sort((a, b) => a.vagas - b.vagas)
            .slice(0, 4);

          return (
            <>
              <section aria-labelledby="titulo-trilhas">
                <h2 id="titulo-trilhas">Trilhas</h2>
                <ul className="lista-selos">
                  {p.trilhas.map((t) => (
                    <li key={t}>
                      <Selo variante="ok">{t}</Selo>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="titulo-vagas">
                <h2 id="titulo-vagas">Últimas vagas</h2>
                {poucas.length === 0 ? (
                  <p className="estado">Nenhuma atividade está com poucas vagas agora.</p>
                ) : (
                  <div className="grade">
                    {poucas.map(({ atividade, vagas }) => (
                      <CartaoAtividade
                        key={atividade.id}
                        atividade={atividade}
                        nomePalestrante={nomeDoPalestrante(p.palestrantes, atividade.palestranteId)}
                        vagas={vagas}
                        situacao={situacaoDoParticipante(atividade.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          );
        }}
      </ComProgramacao>
    </>
  );
}
