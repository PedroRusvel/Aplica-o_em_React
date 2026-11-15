# Guia de estudo para a apresentação

Cada integrante precisa saber explicar qualquer arquivo. Leia nesta ordem: do que não depende de nada para o que depende de tudo.

## 1. Ordem de leitura

1. `src/tipos/index.ts` – o vocabulário do projeto: Atividade, Participante, Inscricao.
2. `src/dominio/tempo.ts` – converte horário em minutos. É a base de conflito e de carga horária.
3. `src/dominio/inscricoes.ts` – o coração do sistema (B2, B3, B4, B5).
4. `src/dominio/certificado.ts`, `painel.ts`, `cadastro.ts`, `busca.ts` – as outras regras.
5. `src/dominio/*.test.ts` – cada teste é um cenário do enunciado.
6. `src/servicos/` – `programacaoService` (fetch) e `armazenamento` (localStorage).
7. `src/contexto/` – estado compartilhado entre telas.
8. `src/componentes/` e `src/paginas/` – a interface.
9. `src/App.tsx` – as rotas e a ordem dos Providers.

## 2. As ideias que mais caem

**Função pura.** Mesma entrada, mesma saída, sem efeito colateral. `inscrever` não altera a lista recebida: devolve outra. Por isso o teste é só chamar e comparar.

**Por que a hora entra como parâmetro?** `inscrever(..., agoraISO)` não chama `new Date()`. O contexto chama e repassa. Assim o teste controla a hora e a regra não muda conforme o dia em que roda.

**Conflito de horário (B2).** Dois intervalos se sobrepõem quando `inicioA < fimB` e `inicioB < fimA`. Com `<` (e não `<=`), quem termina às 20h00 não conflita com quem começa às 20h00. Os horários viram minutos antes da comparação.

**Lista de espera (B4).** `cancelarInscricao` faz as duas mudanças juntas: remove quem cancelou e promove o primeiro da fila (ordenada por `criadaEm`). A posição de cada pessoa não é guardada: é calculada pela ordem, então "subir uma posição" acontece sozinho.

**Por que dois contextos?** Um cuida do que vem da rede (programação), outro do que pertence ao usuário (inscrições). Cada um muda por um motivo diferente.

**`useEffect` com dependência.** Em `ProgramacaoContext`, o efeito depende de `tentativa`. O botão "Tentar de novo" aumenta o número e o efeito roda de novo. A função de limpeza (`controlador.abort()`) cancela a requisição se a tela sair.

**localStorage defensivo.** `carregarEstado` usa `try/catch`, confere o formato com funções `ehParticipante` e `ehInscricao` e, se algo estiver errado, devolve o estado vazio.

**Formulário controlado.** Cada `input` tem `value` e `onChange` ligados a um estado. O erro é mostrado ao lado do campo e o foco vai ao primeiro campo inválido via `ref`.

**União discriminada.** `ResultadoInscricao` é `{ ok: true, ... } | { ok: false, erro }`. O TypeScript só deixa ler `erro` depois de checar `ok`.

**Render prop.** `ComProgramacao` recebe uma função como filho e só a chama quando os dados chegaram.

## 3. Roteiro de demonstração (cenários do enunciado)

1. Abra o site. Em **Cadastro**, clique em *Cadastrar participantes de teste*. Escolha **Ana** no seletor.
2. B01: em Programação, abra *Abertura* e clique em Inscrever-se. Restam 2 vagas.
3. B02: tente o *Minicurso de React*. Aparece o conflito.
4. B03: inscreva-se na *Oficina de Git*. Funciona.
5. B04: troque para Bruno e Carla e inscreva os dois na Abertura. Fica Lotada.
6. B05: troque para Davi e depois Elisa e tente a Abertura. Entram na espera (1 e 2).
7. B06: com Bruno, cancele a Abertura. Davi vira confirmado e Elisa sobe para a posição 1.
8. B07 e B08: em Minha agenda, Ana mostra "Faltam 1h00" e Carla "Faltam 3h00".
9. B09 e B10: com Ana, inscreva-se em Python e Docker (Certificado liberado) e tente Segurança web (limite de 2 minicursos).
10. B11: com Elisa, tente o React. Recusado por conflito.
11. B12: em Organizador, a Abertura aparece com 100% e Lotada, e a mais procurada tem 4.
12. B13: em Cadastro, use o e-mail da Ana. Recusado.
13. B14: apague a chave `semana-tecnologia-2026:estado` em Application > Local Storage e recarregue. Abre vazio, sem tela branca.
14. RC07: nas ferramentas do navegador, marque *Offline*, recarregue e mostre o erro com "Tentar de novo".

## 4. Alterações pequenas que o professor pode pedir

| Pedido | Onde mexer |
| --- | --- |
| Mudar o limite de minicursos para 3 | `LIMITE_MINICURSOS` em `dominio/inscricoes.ts` (e ajustar o teste B10) |
| Certificado com 6 horas | `MINUTOS_PARA_CERTIFICADO` em `dominio/certificado.ts` |
| Matrícula de 8 dígitos exatos | `REGEX_MATRICULA` em `dominio/cadastro.ts` |
| "Poucas vagas" passar a ser até 3 | `LIMITE_POUCAS_VAGAS` em `paginas/Inicio.tsx` |
| Tirar a espera artificial | `ESPERA_ARTIFICIAL_MS` em `servicos/programacaoService.ts` |
| Nova atividade | adicionar um objeto em `public/dados/programacao.json` |
| Novo filtro (por sala) | `FiltrosProgramacao` e `filtrarAtividades` em `dominio/busca.ts` e um `select` em `paginas/Programacao.tsx` |

## 5. Para fazer antes de entregar

- Preencher a tabela de integrantes e colocar o link e as capturas de tela no README.
- Cada integrante fazer pelo menos um commit com mensagem clara (o professor confere o histórico).
- Publicar na Vercel ou Netlify e recarregar cada rota no link publicado.
- Passar pelo checklist do Anexo D.
- Se quiserem um diferencial: modo escuro, exportar o painel em CSV ou testes de componente.
