import { Outlet } from 'react-router-dom';
import { Cabecalho } from './Cabecalho';
import { Rodape } from './Rodape';

export function Layout() {
  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <Rodape />
    </>
  );
}
