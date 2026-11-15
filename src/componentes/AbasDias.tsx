import { formatarData } from '../dominio/tempo';

interface AbasDiasProps {
  dias: string[];
  diaAtual: string;
  onEscolher: (dia: string) => void;
}

export function AbasDias({ dias, diaAtual, onEscolher }: AbasDiasProps) {
  return (
    <div className="abas" role="group" aria-label="Dias do evento">
      {dias.map((dia) => (
        <button
          key={dia}
          type="button"
          className="aba"
          aria-pressed={dia === diaAtual}
          onClick={() => onEscolher(dia)}
        >
          {formatarData(dia)}
        </button>
      ))}
    </div>
  );
}
