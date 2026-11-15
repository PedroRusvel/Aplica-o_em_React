import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './componentes/Layout';
import { EventoProvider } from './contexto/EventoContext';
import { ProgramacaoProvider } from './contexto/ProgramacaoContext';
import { Cadastro } from './paginas/Cadastro';
import { DetalheAtividade } from './paginas/DetalheAtividade';
import { Inicio } from './paginas/Inicio';
import { MinhaAgenda } from './paginas/MinhaAgenda';
import { NaoEncontrada } from './paginas/NaoEncontrada';
import { Organizador } from './paginas/Organizador';
import { Palestrantes } from './paginas/Palestrantes';
import { PerfilPalestrante } from './paginas/PerfilPalestrante';
import { Programacao } from './paginas/Programacao';

export default function App() {
  return (
    <HashRouter>
      {/* A ordem importa: o EventoProvider usa a programação, então fica dentro do ProgramacaoProvider. */}
      <ProgramacaoProvider>
        <EventoProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="programacao" element={<Programacao />} />
              <Route path="atividades/:id" element={<DetalheAtividade />} />
              <Route path="palestrantes" element={<Palestrantes />} />
              <Route path="palestrantes/:id" element={<PerfilPalestrante />} />
              <Route path="cadastro" element={<Cadastro />} />
              <Route path="minha-agenda" element={<MinhaAgenda />} />
              <Route path="organizador" element={<Organizador />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
          </Routes>
        </EventoProvider>
      </ProgramacaoProvider>
    </HashRouter>
  );
}
