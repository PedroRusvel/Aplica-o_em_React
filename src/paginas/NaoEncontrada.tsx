import { Link } from 'react-router-dom';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

export function NaoEncontrada() {
  useTituloDaPagina('Página não encontrada');
  return (
    <>
      <h1>Página não encontrada</h1>
      <p>O endereço que você abriu não existe nesta aplicação.</p>
      <Link className="botao" to="/">
        Voltar para o início
      </Link>
    </>
  );
}
