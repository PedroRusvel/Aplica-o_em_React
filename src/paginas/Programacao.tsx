import { useState } from 'react';
import { AbasDias } from '../componentes/AbasDias';
import { CartaoAtividade } from '../componentes/CartaoAtividade';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { useEvento } from '../contexto/EventoContext';
import { filtrarAtividades, nomeDoPalestrante } from '../dominio/busca';
import { posicaoNaEspera, vagasRestantes } from '../dominio/inscricoes';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';
import type { TipoAtividade } from '../tipos';

export function Programacao() {
  useTituloDaPagina('Programação');
  const { inscricoes, participanteAtual, situacaoDoParticipante } = useEvento();
  const [diaEscolhido, setDiaEscolhido] = useState<string | null>(null);
  const [trilha, setTrilha] = useState('');
  const [tipo, setTipo] = useState<TipoAtividade | ''>('');
  const [busca, setBusca] = useState('');

  return (
    <>
      <h1>Programação</h1>
      <ComProgramacao>
        {(p) => {
          const dias = [...new Set(p.atividades.map((a) => a.data))].sort();
          const dia = diaEscolhido ?? dias[0];
          const lista = filtrarAtividades(p.atividades, p.palestrantes, { data: dia, trilha, tipo, busca });

          return (
            <>
              <AbasDias dias={dias} diaAtual={dia} onEscolher={setDiaEscolhido} />

              <div className="filtros">
                <div className="campo">
                  <label htmlFor="filtro-busca">Buscar por título ou palestrante</label>
                  <input id="filtro-busca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>
                <div className="campo">
                  <label htmlFor="filtro-trilha">Trilha</label>
                  <select id="filtro-trilha" value={trilha} onChange={(e) => setTrilha(e.target.value)}>
                    <option value="">Todas</option>
                    {p.trilhas.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="filtro-tipo">Tipo</label>
                  <select id="filtro-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoAtividade | '')}>
                    <option value="">Todos</option>
                    <option value="palestra">Palestra</option>
                    <option value="minicurso">Minicurso</option>
                    <option value="oficina">Oficina</option>
                  </select>
                </div>
              </div>

              {lista.length === 0 ? (
                <p className="estado">Nenhuma atividade encontrada neste dia com esses filtros. Limpe a busca ou troque a trilha.</p>
              ) : (
                <div className="grade">
                  {lista.map((a) => (
                    <CartaoAtividade
                      key={a.id}
                      atividade={a}
                      nomePalestrante={nomeDoPalestrante(p.palestrantes, a.palestranteId)}
                      vagas={vagasRestantes(a, inscricoes)}
                      situacao={situacaoDoParticipante(a.id)}
                      posicaoEspera={participanteAtual ? posicaoNaEspera(inscricoes, participanteAtual.id, a.id) : null}
                    />
                  ))}
                </div>
              )}
            </>
          );
        }}
      </ComProgramacao>
    </>
  );
}
