import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campo } from '../componentes/Campo';
import { useEvento } from '../contexto/EventoContext';
import { PARTICIPANTES_TESTE } from '../dados/participantesTeste';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';
import type { CampoParticipante, DadosParticipante, ErrosParticipante } from '../tipos';

const ORDEM_DOS_CAMPOS: CampoParticipante[] = ['nome', 'email', 'matricula', 'curso'];
const VAZIO: DadosParticipante = { nome: '', email: '', matricula: '', curso: '' };

export function Cadastro() {
  useTituloDaPagina('Cadastro');
  const navegar = useNavigate();
  const { cadastrarParticipante } = useEvento();
  const [dados, setDados] = useState<DadosParticipante>(VAZIO);
  const [erros, setErros] = useState<ErrosParticipante>({});
  const [mensagem, setMensagem] = useState('');
  // Guarda os <input> para podermos mandar o foco ao primeiro campo inválido (RC08).
  const campos = useRef<Record<CampoParticipante, HTMLInputElement | null>>({
    nome: null,
    email: null,
    matricula: null,
    curso: null,
  });

  function alterar(campo: CampoParticipante, valor: string) {
    setDados((d) => ({ ...d, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined })); // apaga o erro assim que a pessoa corrige
  }

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const resultado = cadastrarParticipante(dados);
    if (!resultado.ok) {
      setErros(resultado.erros);
      const primeiro = ORDEM_DOS_CAMPOS.find((c) => resultado.erros[c]);
      if (primeiro) campos.current[primeiro]?.focus();
      return;
    }
    navegar('/programacao');
  }

  function cadastrarExemplos() {
    for (const participante of PARTICIPANTES_TESTE) cadastrarParticipante(participante);
    setMensagem('Participantes de teste cadastrados. Use o seletor no topo para trocar de pessoa.');
  }

  return (
    <>
      <h1>Cadastro de participante</h1>
      <form onSubmit={aoEnviar} noValidate className="formulario">
        <Campo
          id="nome"
          rotulo="Nome completo"
          valor={dados.nome}
          onChange={(v) => alterar('nome', v)}
          erro={erros.nome}
          autoComplete="name"
          refCampo={(el) => {
            campos.current.nome = el;
          }}
        />
        <Campo
          id="email"
          rotulo="E-mail"
          tipo="email"
          valor={dados.email}
          onChange={(v) => alterar('email', v)}
          erro={erros.email}
          autoComplete="email"
          refCampo={(el) => {
            campos.current.email = el;
          }}
        />
        <Campo
          id="matricula"
          rotulo="Matrícula"
          ajuda="De 6 a 10 dígitos"
          inputMode="numeric"
          valor={dados.matricula}
          onChange={(v) => alterar('matricula', v)}
          erro={erros.matricula}
          refCampo={(el) => {
            campos.current.matricula = el;
          }}
        />
        <Campo
          id="curso"
          rotulo="Curso"
          valor={dados.curso}
          onChange={(v) => alterar('curso', v)}
          erro={erros.curso}
          refCampo={(el) => {
            campos.current.curso = el;
          }}
        />
        <button type="submit" className="botao">
          Cadastrar participante
        </button>
      </form>

      <section className="caixa">
        <h2>Para demonstração</h2>
        <p>Cadastra Ana, Bruno, Carla, Davi e Elisa de uma vez, como nos cenários do enunciado.</p>
        <button type="button" className="botao botao-secundario" onClick={cadastrarExemplos}>
          Cadastrar participantes de teste
        </button>
        {mensagem && (
          <p className="aviso aviso-ok" role="status">
            {mensagem}
          </p>
        )}
      </section>
    </>
  );
}
