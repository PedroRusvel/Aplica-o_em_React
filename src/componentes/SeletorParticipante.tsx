import { useEvento } from '../contexto/EventoContext';

/** Faz o papel do login: escolhe quem está usando o sistema neste momento. */
export function SeletorParticipante() {
  const { participantes, participanteAtual, selecionarParticipante } = useEvento();
  return (
    <div className="seletor">
      <label htmlFor="participante-atual">Participante atual</label>
      <select
        id="participante-atual"
        value={participanteAtual?.id ?? ''}
        onChange={(e) => selecionarParticipante(e.target.value === '' ? null : e.target.value)}
      >
        <option value="">Nenhum selecionado</option>
        {participantes.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
