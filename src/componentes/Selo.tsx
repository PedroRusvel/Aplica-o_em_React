import type { ReactNode } from 'react';

interface SeloProps {
  variante?: 'neutro' | 'ok' | 'aviso' | 'perigo';
  children: ReactNode;
}

export function Selo({ variante = 'neutro', children }: SeloProps) {
  return <span className={`selo selo-${variante}`}>{children}</span>;
}
