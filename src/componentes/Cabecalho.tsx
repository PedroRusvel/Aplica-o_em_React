import { Link, NavLink } from 'react-router-dom';
import { SeletorParticipante } from './SeletorParticipante';

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/programacao', rotulo: 'Programação' },
  { para: '/palestrantes', rotulo: 'Palestrantes' },
  { para: '/minha-agenda', rotulo: 'Minha agenda' },
  { para: '/organizador', rotulo: 'Organizador' },
  { para: '/cadastro', rotulo: 'Cadastro' },
];

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-topo">
        <Link to="/" className="marca">
          Semana de Tecnologia <span>2026</span>
        </Link>
        <SeletorParticipante />
      </div>
      <nav aria-label="Navegação principal">
        <ul className="menu">
          {LINKS.map((l) => (
            <li key={l.para}>
              <NavLink to={l.para} end={l.para === '/'}>
                {l.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
