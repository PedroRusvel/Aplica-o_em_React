import type { ChangeEvent } from 'react';

interface CampoProps {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  erro?: string;
  tipo?: 'text' | 'email';
  ajuda?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'email';
  refCampo?: (elemento: HTMLInputElement | null) => void;
}

/** Campo de formulário: label sempre ligado ao input e mensagem de erro ao lado (abaixo) do campo. */
export function Campo({
  id,
  rotulo,
  valor,
  onChange,
  erro,
  tipo = 'text',
  ajuda,
  autoComplete,
  inputMode,
  refCampo,
}: CampoProps) {
  const idErro = `${id}-erro`;
  const idAjuda = `${id}-ajuda`;
  const descricao = [ajuda ? idAjuda : '', erro ? idErro : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        ref={refCampo}
        type={tipo}
        value={valor}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {ajuda && (
        <small id={idAjuda} className="ajuda">
          {ajuda}
        </small>
      )}
      {erro && (
        <small id={idErro} className="erro-campo">
          {erro}
        </small>
      )}
    </div>
  );
}
