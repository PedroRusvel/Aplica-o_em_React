# Semana de Tecnologia 2026

Sistema de inscrições do evento: programação, agenda pessoal, vagas, lista de espera e painel do organizador.

**Aplicação publicada:** _colar o link aqui_
**Tema:** B – Semana de Tecnologia 2026

## Equipe

| Integrante | Responsável por |
| --- | --- |
| Pedro Rusvel | Regras de negócio e testes (`src/dominio`), serviços e contextos (`src/servicos`, `src/contexto`), publicação |
| Kelry Silva | Telas e componentes (`src/paginas`, `src/componentes`), formulário de cadastro, estilos (`index.css`) e README |

Curso: Análise e Desenvolvimento de Sistemas (ADS) · Disciplina: Programação para Web · Professor: Marcos David Souza Ramos · Centro Universitário Unibalsas

## Como rodar

```bash
npm install
npm run dev     # abre em http://localhost:5173
npm test        # 32 testes das regras de negócio
npm run build   # confere os tipos e gera a pasta dist
```

## Telas

| Rota | Tela |
| --- | --- |
| `/#/` | Início |
| `/#/programacao` | Programação, com abas por dia e filtros |
| `/#/atividades/:id` | Detalhe da atividade e botão de inscrição |
| `/#/palestrantes` e `/#/palestrantes/:id` | Palestrantes e perfil |
| `/#/cadastro` | Cadastro de participante |
| `/#/minha-agenda` | Agenda, fila de espera e certificado |
| `/#/organizador` | Painel de ocupação |
| qualquer outra | Página de "não encontrado" |

_Incluir aqui uma captura de tela de cada rota._

## Regras de negócio

| Regra | Arquivo |
| --- | --- |
| B1 Cadastro (nome, e-mail, matrícula, unicidade) | `src/dominio/cadastro.ts` |
| B2 Choque de horário | `src/dominio/inscricoes.ts` (`haConflito`, `encontrarConflito`) |
| B3 Vagas e lista de espera | `src/dominio/inscricoes.ts` (`vagasRestantes`, `inscrever`) |
| B4 Promoção da lista de espera | `src/dominio/inscricoes.ts` (`cancelarInscricao`, `posicaoNaEspera`) |
| B5 Limite de 2 minicursos | `src/dominio/inscricoes.ts` (`contarMinicursos`) |
| B6 Certificado (4 horas) | `src/dominio/certificado.ts` |
| B7 Painel do organizador | `src/dominio/painel.ts` |
| Horários em minutos | `src/dominio/tempo.ts` |
| Filtros e busca | `src/dominio/busca.ts` |

Todas são funções puras, sem React e sem `localStorage`, testadas em `src/dominio/*.test.ts`.

## Decisões técnicas

- **Dois contextos.** `ProgramacaoContext` busca o JSON (carregando, erro, pronto). `EventoContext` guarda participantes, inscrições e o participante atual, e grava tudo no `localStorage`. O segundo usa o primeiro, por isso fica dentro dele no `App.tsx`.
- **Regras fora dos componentes.** O contexto só chama as funções de `src/dominio` e guarda o resultado. A data de "agora" entra como parâmetro, o que mantém as funções testáveis.
- **`ComProgramacao`.** Componente que recebe uma função como filho e cuida dos três estados de rede, para as páginas não repetirem esse código.
- **Leitura defensiva.** `carregarEstado` valida o formato do que está salvo e descarta itens inválidos. Com o `localStorage` apagado ou corrompido, a aplicação abre vazia.
- **HashRouter.** Funciona ao recarregar qualquer rota em qualquer hospedagem, sem configuração.
- **Espera artificial de 500 ms** em `programacaoService.ts`, para o estado "Carregando" aparecer durante o desenvolvimento.
- **Sem bibliotecas extras** além de `react-router-dom` e `vitest`.

## Publicação

Vercel ou Netlify: importar o repositório do GitHub, comando de build `npm run build`, pasta de saída `dist`. Como o `vite.config.ts` usa `base: './'`, o mesmo build também funciona no GitHub Pages.

## Créditos

Não há API externa: a programação vem de `public/dados/programacao.json`. Os palestrantes e as atividades são fictícios.
