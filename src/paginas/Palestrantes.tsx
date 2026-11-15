import { Link } from 'react-router-dom';
import { Avatar } from '../componentes/Avatar';
import { ComProgramacao } from '../componentes/ComProgramacao';
import { useTituloDaPagina } from '../hooks/useTituloDaPagina';

export function Palestrantes() {
  useTituloDaPagina('Palestrantes');
  return (
    <>
      <h1>Palestrantes</h1>
      <ComProgramacao>
        {(p) => (
          <div className="grade">
            {p.palestrantes.map((pessoa) => (
              <article className="cartao cartao-pessoa" key={pessoa.id}>
                <Avatar nome={pessoa.nome} />
                <div>
                  <h2>
                    <Link to={`/palestrantes/${pessoa.id}`}>{pessoa.nome}</Link>
                  </h2>
                  <p className="cartao-info">{pessoa.cargo}</p>
                  <p>{pessoa.miniBio}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </ComProgramacao>
    </>
  );
}
