import { Link } from 'react-router-dom';
import { formatarDataCurta, formatarIntervalo } from '../dominio/tempo';
import type { Atividade, SituacaoInscricao } from '../tipos';
import { Selo } from './Selo';

interface CartaoAtividadeProps {
  atividade: Atividade;
  nomePalestrante: string;
  vagas: number;
  situacao: SituacaoInscricao | null;
  posicaoEspera?: number | null;
}

const NOME_DO_TIPO = { palestra: 'Palestra', minicurso: 'Minicurso', oficina: 'Oficina' } as const;

/** Usado na programação, no início, no perfil do palestrante e na agenda. */
export function CartaoAtividade({ atividade, nomePalestrante, vagas, situacao, posicaoEspera }: CartaoAtividadeProps) {
  return (
    <article className="cartao">
      <div className="cartao-selos">
        <Selo>{NOME_DO_TIPO[atividade.tipo]}</Selo>
        <Selo>{atividade.trilha}</Selo>
        {situacao === 'confirmada' && <Selo variante="ok">Inscrição confirmada</Selo>}
        {situacao === 'espera' && (
          <Selo variante="aviso">Na lista de espera{posicaoEspera ? ` (posição ${posicaoEspera})` : ''}</Selo>
        )}
      </div>
      <h3>
        <Link to={`/atividades/${atividade.id}`}>{atividade.titulo}</Link>
      </h3>
      <p className="cartao-info">
        {formatarDataCurta(atividade.data)}, {formatarIntervalo(atividade)} · {atividade.sala}
      </p>
      <p className="cartao-info">{nomePalestrante}</p>
      <p className={vagas === 0 ? 'vagas vagas-zero' : 'vagas'}>
        {vagas === 0 ? 'Lotada' : `${vagas} ${vagas === 1 ? 'vaga restante' : 'vagas restantes'}`}
      </p>
    </article>
  );
}
