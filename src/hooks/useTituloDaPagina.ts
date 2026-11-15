import { useEffect } from 'react';

/** Atualiza o título da aba do navegador. O efeito roda de novo quando o título muda. */
export function useTituloDaPagina(titulo: string): void {
  useEffect(() => {
    document.title = `${titulo} · Semana de Tecnologia 2026`;
  }, [titulo]);
}
