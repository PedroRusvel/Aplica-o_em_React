import type { Programacao } from '../tipos';

// Espera artificial: o arquivo local chega rápido demais e o "Carregando..." nunca apareceria.
// Para entregar a versão final sem espera, coloque 0.
const ESPERA_ARTIFICIAL_MS = 500;

export async function buscarProgramacao(sinal?: AbortSignal): Promise<Programacao> {
  await new Promise((resolver) => setTimeout(resolver, ESPERA_ARTIFICIAL_MS));

  const resposta = await fetch(`${import.meta.env.BASE_URL}dados/programacao.json`, { signal: sinal });
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar a programação (erro ${resposta.status}).`);
  }

  const dados: unknown = await resposta.json();
  if (!ehProgramacao(dados)) {
    throw new Error('O arquivo da programação está em um formato inesperado.');
  }
  return dados;
}

function ehProgramacao(dados: unknown): dados is Programacao {
  if (typeof dados !== 'object' || dados === null) return false;
  const o = dados as Record<string, unknown>;
  return Array.isArray(o.trilhas) && Array.isArray(o.palestrantes) && Array.isArray(o.atividades);
}
