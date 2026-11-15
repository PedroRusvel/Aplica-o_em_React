interface BarraProgressoProps {
  percentual: number;
  rotulo: string;
}

export function BarraProgresso({ percentual, rotulo }: BarraProgressoProps) {
  const valor = Math.min(100, Math.max(0, percentual));
  return (
    <div
      className="barra"
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={valor}
    >
      <div className={`barra-preenchida${valor >= 100 ? ' cheia' : ''}`} style={{ width: `${valor}%` }} />
    </div>
  );
}
