import type { Atividade, Palestrante, TipoAtividade } from '../tipos';

export interface FiltrosProgramacao {
  data: string;
  trilha: string; // '' = todas
  tipo: TipoAtividade | ''; // '' = todos
  busca: string;
}

/** Tira acentos e maiúsculas: "Ética" e "etica" passam a ser iguais. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** Filtra por dia, trilha, tipo e busca (título ou nome do palestrante), em ordem de horário. */
export function filtrarAtividades(
  atividades: Atividade[],
  palestrantes: Palestrante[],
  filtros: FiltrosProgramacao,
): Atividade[] {
  const termo = normalizar(filtros.busca);
  return atividades
    .filter((a) => a.data === filtros.data)
    .filter((a) => filtros.trilha === '' || a.trilha === filtros.trilha)
    .filter((a) => filtros.tipo === '' || a.tipo === filtros.tipo)
    .filter((a) => {
      if (termo === '') return true;
      const nomePalestrante = palestrantes.find((p) => p.id === a.palestranteId)?.nome ?? '';
      return normalizar(a.titulo).includes(termo) || normalizar(nomePalestrante).includes(termo);
    })
    .sort((a, b) => a.inicio.localeCompare(b.inicio) || a.titulo.localeCompare(b.titulo));
}

export function nomeDoPalestrante(palestrantes: Palestrante[], id: string): string {
  return palestrantes.find((p) => p.id === id)?.nome ?? 'Palestrante a definir';
}
